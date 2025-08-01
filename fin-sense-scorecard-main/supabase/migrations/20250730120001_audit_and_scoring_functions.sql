-- Audit Trail and Credit Scoring Functions
-- This migration creates comprehensive audit logging and modular credit score calculation

-- Enhanced audit logging function
CREATE OR REPLACE FUNCTION public.log_audit_event(
  p_user_id UUID,
  p_action audit_action,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id UUID DEFAULT NULL,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_session_id TEXT DEFAULT NULL,
  p_success BOOLEAN DEFAULT TRUE,
  p_error_message TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  audit_id UUID;
BEGIN
  INSERT INTO public.audit_logs (
    user_id, action, resource_type, resource_id, old_values, new_values,
    ip_address, user_agent, session_id, success, error_message
  ) VALUES (
    p_user_id, p_action, p_resource_type, p_resource_id, p_old_values, p_new_values,
    p_ip_address, p_user_agent, p_session_id, p_success, p_error_message
  ) RETURNING id INTO audit_id;
  
  RETURN audit_id;
END;
$$;

-- Rate limiting function for security
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier TEXT,
  p_action_type TEXT,
  p_max_attempts INTEGER DEFAULT 5,
  p_window_minutes INTEGER DEFAULT 15
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_attempts INTEGER;
  window_start TIMESTAMPTZ;
  is_blocked BOOLEAN DEFAULT FALSE;
BEGIN
  window_start := NOW() - (p_window_minutes || ' minutes')::INTERVAL;
  
  -- Check if currently blocked
  SELECT blocked_until > NOW() INTO is_blocked
  FROM public.rate_limiting
  WHERE identifier = p_identifier AND action_type = p_action_type;
  
  IF is_blocked THEN
    RETURN FALSE;
  END IF;
  
  -- Get current attempts in window
  SELECT attempt_count INTO current_attempts
  FROM public.rate_limiting
  WHERE identifier = p_identifier 
    AND action_type = p_action_type
    AND first_attempt > window_start;
  
  -- Insert or update rate limiting record
  INSERT INTO public.rate_limiting (identifier, action_type, attempt_count, first_attempt, last_attempt)
  VALUES (p_identifier, p_action_type, 1, NOW(), NOW())
  ON CONFLICT (identifier, action_type)
  DO UPDATE SET
    attempt_count = CASE 
      WHEN rate_limiting.first_attempt > window_start THEN rate_limiting.attempt_count + 1
      ELSE 1
    END,
    first_attempt = CASE
      WHEN rate_limiting.first_attempt > window_start THEN rate_limiting.first_attempt
      ELSE NOW()
    END,
    last_attempt = NOW(),
    blocked_until = CASE
      WHEN (CASE 
        WHEN rate_limiting.first_attempt > window_start THEN rate_limiting.attempt_count + 1
        ELSE 1
      END) >= p_max_attempts THEN NOW() + (p_window_minutes || ' minutes')::INTERVAL
      ELSE NULL
    END;
  
  -- Return whether request is allowed
  SELECT attempt_count < p_max_attempts INTO current_attempts
  FROM public.rate_limiting
  WHERE identifier = p_identifier AND action_type = p_action_type;
  
  RETURN COALESCE(current_attempts, TRUE);
END;
$$;

-- Modular credit score calculation function
CREATE OR REPLACE FUNCTION public.calculate_credit_score(
  p_user_id UUID,
  p_calculated_by UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_payment_history_score INTEGER DEFAULT 0;
  v_credit_utilization_score INTEGER DEFAULT 0;
  v_credit_history_length_score INTEGER DEFAULT 0;
  v_credit_mix_score INTEGER DEFAULT 0;
  v_new_credit_score INTEGER DEFAULT 0;
  v_income_factor DECIMAL(5,2) DEFAULT 1.0;
  v_total_score INTEGER;
  v_score_id UUID;
  v_payment_history_weight DECIMAL(5,2);
  v_credit_utilization_weight DECIMAL(5,2);
  v_credit_history_weight DECIMAL(5,2);
  v_credit_mix_weight DECIMAL(5,2);
  v_new_credit_weight DECIMAL(5,2);
  
  -- Financial data variables
  v_total_income DECIMAL(15,2) DEFAULT 0;
  v_total_expenses DECIMAL(15,2) DEFAULT 0;
  v_total_assets DECIMAL(15,2) DEFAULT 0;
  v_total_liabilities DECIMAL(15,2) DEFAULT 0;
BEGIN
  -- Get factor weights
  SELECT weight INTO v_payment_history_weight FROM public.credit_score_factors WHERE factor_name = 'payment_history' AND is_active = TRUE;
  SELECT weight INTO v_credit_utilization_weight FROM public.credit_score_factors WHERE factor_name = 'credit_utilization' AND is_active = TRUE;
  SELECT weight INTO v_credit_history_weight FROM public.credit_score_factors WHERE factor_name = 'credit_history_length' AND is_active = TRUE;
  SELECT weight INTO v_credit_mix_weight FROM public.credit_score_factors WHERE factor_name = 'credit_mix' AND is_active = TRUE;
  SELECT weight INTO v_new_credit_weight FROM public.credit_score_factors WHERE factor_name = 'new_credit' AND is_active = TRUE;
  
  -- Calculate financial totals from last 12 months
  SELECT 
    COALESCE(SUM(CASE WHEN report_type = 'income' THEN amount ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN report_type = 'expense' THEN amount ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN report_type = 'asset' THEN amount ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN report_type = 'liability' THEN amount ELSE 0 END), 0)
  INTO v_total_income, v_total_expenses, v_total_assets, v_total_liabilities
  FROM public.financial_reports
  WHERE user_id = p_user_id AND verified = TRUE
    AND date_recorded >= NOW() - INTERVAL '12 months';
  
  -- Calculate payment history score (35% weight)
  IF v_total_income > 0 THEN
    v_payment_history_score := LEAST(
      ROUND((v_total_income - v_total_expenses) / v_total_income * v_payment_history_weight),
      v_payment_history_weight::INTEGER
    );
  END IF;
  
  -- Calculate credit utilization score (30% weight)
  IF v_total_assets > 0 THEN
    v_credit_utilization_score := LEAST(
      ROUND((1 - (v_total_liabilities / v_total_assets)) * v_credit_utilization_weight),
      v_credit_utilization_weight::INTEGER
    );
  ELSE
    v_credit_utilization_score := ROUND(v_credit_utilization_weight * 0.5);
  END IF;
  
  -- Calculate credit history length score (15% weight)
  SELECT EXTRACT(YEAR FROM AGE(NOW(), MIN(created_at))) INTO v_credit_history_length_score
  FROM public.financial_reports
  WHERE user_id = p_user_id;
  
  v_credit_history_length_score := LEAST(
    ROUND(COALESCE(v_credit_history_length_score, 0) * 2),
    v_credit_history_weight::INTEGER
  );
  
  -- Calculate credit mix score (10% weight)
  SELECT COUNT(DISTINCT report_type) INTO v_credit_mix_score
  FROM public.financial_reports
  WHERE user_id = p_user_id AND verified = TRUE;
  
  v_credit_mix_score := LEAST(
    ROUND(v_credit_mix_score * 2),
    v_credit_mix_weight::INTEGER
  );
  
  -- Calculate new credit score (10% weight)
  SELECT COUNT(*) INTO v_new_credit_score
  FROM public.financial_reports
  WHERE user_id = p_user_id 
    AND created_at >= NOW() - INTERVAL '3 months';
  
  v_new_credit_score := LEAST(
    GREATEST(v_new_credit_weight::INTEGER - v_new_credit_score, 0),
    v_new_credit_weight::INTEGER
  );
  
  -- Calculate income factor
  IF v_total_income > 0 THEN
    v_income_factor := LEAST(v_total_income / 50000.0, 2.0);
  END IF;
  
  -- Calculate total score (base 300, max 850)
  v_total_score := 300 + ROUND(
    (v_payment_history_score + v_credit_utilization_score + 
     v_credit_history_length_score + v_credit_mix_score + v_new_credit_score) * 
    v_income_factor * 5.5
  );
  
  -- Ensure score is within valid range
  v_total_score := GREATEST(300, LEAST(850, v_total_score));
  
  -- Insert new credit score record
  INSERT INTO public.credit_scores (
    user_id, score, status, payment_history_score, credit_utilization_score,
    credit_history_length_score, credit_mix_score, new_credit_score,
    income_factor, calculated_by
  ) VALUES (
    p_user_id, v_total_score, 'calculated', v_payment_history_score,
    v_credit_utilization_score, v_credit_history_length_score,
    v_credit_mix_score, v_new_credit_score, v_income_factor, p_calculated_by
  ) RETURNING id INTO v_score_id;
  
  -- Log the calculation
  PERFORM public.log_audit_event(
    p_user_id, 'score_calculation', 'credit_scores', v_score_id,
    NULL, jsonb_build_object('score', v_total_score, 'status', 'calculated'),
    NULL, NULL, NULL, TRUE, NULL
  );
  
  RETURN v_score_id;
END;
$$;

-- Function to validate financial data input
CREATE OR REPLACE FUNCTION public.validate_financial_data(
  p_amount DECIMAL(15,2),
  p_report_type financial_data_type,
  p_date_recorded DATE
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  -- Amount validation
  IF p_amount IS NULL OR p_amount < 0 THEN
    RETURN FALSE;
  END IF;
  
  -- Date validation (not in future, not older than 10 years)
  IF p_date_recorded IS NULL 
     OR p_date_recorded > CURRENT_DATE 
     OR p_date_recorded < CURRENT_DATE - INTERVAL '10 years' THEN
    RETURN FALSE;
  END IF;
  
  -- Type-specific validation
  CASE p_report_type
    WHEN 'income' THEN
      IF p_amount > 10000000 THEN -- Max 10M income
        RETURN FALSE;
      END IF;
    WHEN 'expense' THEN
      IF p_amount > 10000000 THEN -- Max 10M expense
        RETURN FALSE;
      END IF;
    WHEN 'asset' THEN
      IF p_amount > 100000000 THEN -- Max 100M assets
        RETURN FALSE;
      END IF;
    WHEN 'liability' THEN
      IF p_amount > 100000000 THEN -- Max 100M liabilities
        RETURN FALSE;
      END IF;
    ELSE
      RETURN TRUE;
  END CASE;
  
  RETURN TRUE;
END;
$$;

-- Trigger function for audit logging on financial reports
CREATE OR REPLACE FUNCTION public.audit_financial_reports()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_audit_event(
      NEW.user_id, 'data_update', 'financial_reports', NEW.id,
      NULL, to_jsonb(NEW), NULL, NULL, NULL, TRUE, NULL
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM public.log_audit_event(
      NEW.user_id, 'data_update', 'financial_reports', NEW.id,
      to_jsonb(OLD), to_jsonb(NEW), NULL, NULL, NULL, TRUE, NULL
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.log_audit_event(
      OLD.user_id, 'data_update', 'financial_reports', OLD.id,
      to_jsonb(OLD), NULL, NULL, NULL, NULL, TRUE, NULL
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Create audit triggers
CREATE TRIGGER audit_financial_reports_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.financial_reports
  FOR EACH ROW EXECUTE FUNCTION public.audit_financial_reports();

-- Enhanced user session management
CREATE OR REPLACE FUNCTION public.create_user_session(
  p_user_id UUID,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_session_token TEXT;
  v_session_id UUID;
BEGIN
  -- Generate secure session token
  v_session_token := encode(gen_random_bytes(32), 'base64');
  
  -- Insert session record
  INSERT INTO public.user_sessions (
    user_id, session_token, ip_address, user_agent
  ) VALUES (
    p_user_id, v_session_token, p_ip_address, p_user_agent
  ) RETURNING id INTO v_session_id;
  
  -- Log login event
  PERFORM public.log_audit_event(
    p_user_id, 'login', 'user_sessions', v_session_id,
    NULL, jsonb_build_object('ip_address', p_ip_address, 'user_agent', p_user_agent),
    p_ip_address, p_user_agent, v_session_token, TRUE, NULL
  );
  
  RETURN v_session_token;
END;
$$;

-- Function to end user session
CREATE OR REPLACE FUNCTION public.end_user_session(
  p_session_token TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_session_id UUID;
BEGIN
  -- Get session info and mark as inactive
  UPDATE public.user_sessions 
  SET is_active = FALSE, logout_time = NOW()
  WHERE session_token = p_session_token AND is_active = TRUE
  RETURNING user_id, id INTO v_user_id, v_session_id;
  
  IF v_user_id IS NOT NULL THEN
    -- Log logout event
    PERFORM public.log_audit_event(
      v_user_id, 'logout', 'user_sessions', v_session_id,
      NULL, jsonb_build_object('logout_time', NOW()),
      NULL, NULL, p_session_token, TRUE, NULL
    );
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$;

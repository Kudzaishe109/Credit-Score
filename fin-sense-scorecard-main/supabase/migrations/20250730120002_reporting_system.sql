-- Comprehensive Reporting System for Credit Score Application
-- This migration creates tables and functions for generating and managing reports

-- Create report types enum
CREATE TYPE public.report_type AS ENUM (
  'credit_score_summary',
  'financial_overview', 
  'payment_history',
  'audit_trail',
  'user_activity',
  'bank_portfolio',
  'system_analytics'
);

CREATE TYPE public.report_format AS ENUM ('json', 'csv', 'pdf');
CREATE TYPE public.report_status AS ENUM ('pending', 'generating', 'completed', 'failed', 'expired');

-- Create reports table
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_type report_type NOT NULL,
  report_format report_format NOT NULL DEFAULT 'json',
  status report_status NOT NULL DEFAULT 'pending',
  title VARCHAR(255) NOT NULL,
  description TEXT,
  parameters JSONB, -- Store report parameters like date ranges, filters
  generated_data JSONB, -- Store the actual report data
  file_url TEXT, -- URL to downloadable file if applicable
  file_size_bytes BIGINT,
  generated_by UUID REFERENCES auth.users(id),
  date_from DATE,
  date_to DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  download_count INTEGER DEFAULT 0,
  last_downloaded_at TIMESTAMPTZ
);

-- Create report_templates table for predefined report configurations
CREATE TABLE public.report_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  report_type report_type NOT NULL,
  description TEXT,
  default_parameters JSONB,
  sql_query TEXT, -- Optional custom SQL for complex reports
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reports
CREATE POLICY "Users can view own reports" 
ON public.reports FOR SELECT 
USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE id = auth.uid() AND role IN ('admin', 'bank_official')
  )
);

CREATE POLICY "Users can create own reports" 
ON public.reports FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports" 
ON public.reports FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for report templates
CREATE POLICY "Everyone can view active report templates" 
ON public.report_templates FOR SELECT 
USING (is_active = TRUE);

CREATE POLICY "Admins can manage report templates" 
ON public.report_templates FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Function to generate credit score summary report
CREATE OR REPLACE FUNCTION public.generate_credit_score_report(
  p_user_id UUID,
  p_date_from DATE DEFAULT NULL,
  p_date_to DATE DEFAULT NULL,
  p_format report_format DEFAULT 'json'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_report_id UUID;
  v_report_data JSONB;
  v_date_from DATE;
  v_date_to DATE;
  v_current_score INTEGER;
  v_score_history JSONB;
  v_financial_summary JSONB;
BEGIN
  -- Set default date range if not provided
  v_date_from := COALESCE(p_date_from, CURRENT_DATE - INTERVAL '12 months');
  v_date_to := COALESCE(p_date_to, CURRENT_DATE);
  
  -- Get current credit score
  SELECT score INTO v_current_score
  FROM public.credit_scores
  WHERE user_id = p_user_id
  ORDER BY calculation_date DESC
  LIMIT 1;
  
  -- Get score history
  SELECT jsonb_agg(
    jsonb_build_object(
      'score', score,
      'calculation_date', calculation_date,
      'status', status,
      'payment_history_score', payment_history_score,
      'credit_utilization_score', credit_utilization_score,
      'credit_history_length_score', credit_history_length_score,
      'credit_mix_score', credit_mix_score,
      'new_credit_score', new_credit_score,
      'income_factor', income_factor
    ) ORDER BY calculation_date
  ) INTO v_score_history
  FROM public.credit_scores
  WHERE user_id = p_user_id
    AND calculation_date BETWEEN v_date_from AND v_date_to;
  
  -- Get financial summary
  SELECT jsonb_build_object(
    'total_income', COALESCE(SUM(CASE WHEN report_type = 'income' THEN amount ELSE 0 END), 0),
    'total_expenses', COALESCE(SUM(CASE WHEN report_type = 'expense' THEN amount ELSE 0 END), 0),
    'total_assets', COALESCE(SUM(CASE WHEN report_type = 'asset' THEN amount ELSE 0 END), 0),
    'total_liabilities', COALESCE(SUM(CASE WHEN report_type = 'liability' THEN amount ELSE 0 END), 0),
    'net_worth', COALESCE(SUM(CASE WHEN report_type = 'asset' THEN amount ELSE 0 END), 0) - 
                 COALESCE(SUM(CASE WHEN report_type = 'liability' THEN amount ELSE 0 END), 0),
    'monthly_cash_flow', COALESCE(SUM(CASE WHEN report_type = 'income' THEN amount ELSE 0 END), 0) - 
                        COALESCE(SUM(CASE WHEN report_type = 'expense' THEN amount ELSE 0 END), 0)
  ) INTO v_financial_summary
  FROM public.financial_reports
  WHERE user_id = p_user_id
    AND date_recorded BETWEEN v_date_from AND v_date_to
    AND verified = TRUE;
  
  -- Build complete report data
  v_report_data := jsonb_build_object(
    'report_period', jsonb_build_object(
      'from', v_date_from,
      'to', v_date_to
    ),
    'current_credit_score', v_current_score,
    'score_history', COALESCE(v_score_history, '[]'::jsonb),
    'financial_summary', v_financial_summary,
    'generated_at', NOW()
  );
  
  -- Insert report record
  INSERT INTO public.reports (
    user_id, report_type, report_format, title, description,
    parameters, generated_data, date_from, date_to, status, generated_by
  ) VALUES (
    p_user_id, 'credit_score_summary', p_format,
    'Credit Score Summary Report',
    'Comprehensive credit score analysis for the specified period',
    jsonb_build_object('date_from', v_date_from, 'date_to', v_date_to),
    v_report_data, v_date_from, v_date_to, 'completed', auth.uid()
  ) RETURNING id INTO v_report_id;
  
  -- Log report generation
  PERFORM public.log_audit_event(
    p_user_id, 'data_update', 'reports', v_report_id,
    NULL, jsonb_build_object('report_type', 'credit_score_summary', 'status', 'completed'),
    NULL, NULL, NULL, TRUE, NULL
  );
  
  RETURN v_report_id;
END;
$$;

-- Function to generate financial overview report
CREATE OR REPLACE FUNCTION public.generate_financial_overview_report(
  p_user_id UUID,
  p_date_from DATE DEFAULT NULL,
  p_date_to DATE DEFAULT NULL,
  p_format report_format DEFAULT 'json'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_report_id UUID;
  v_report_data JSONB;
  v_date_from DATE;
  v_date_to DATE;
  v_monthly_breakdown JSONB;
  v_category_breakdown JSONB;
BEGIN
  -- Set default date range
  v_date_from := COALESCE(p_date_from, CURRENT_DATE - INTERVAL '12 months');
  v_date_to := COALESCE(p_date_to, CURRENT_DATE);
  
  -- Get monthly breakdown
  SELECT jsonb_agg(
    jsonb_build_object(
      'month', TO_CHAR(date_recorded, 'YYYY-MM'),
      'income', COALESCE(SUM(CASE WHEN report_type = 'income' THEN amount ELSE 0 END), 0),
      'expenses', COALESCE(SUM(CASE WHEN report_type = 'expense' THEN amount ELSE 0 END), 0),
      'net', COALESCE(SUM(CASE WHEN report_type = 'income' THEN amount 
                                WHEN report_type = 'expense' THEN -amount 
                                ELSE 0 END), 0)
    ) ORDER BY TO_CHAR(date_recorded, 'YYYY-MM')
  ) INTO v_monthly_breakdown
  FROM public.financial_reports
  WHERE user_id = p_user_id
    AND date_recorded BETWEEN v_date_from AND v_date_to
    AND verified = TRUE
  GROUP BY TO_CHAR(date_recorded, 'YYYY-MM');
  
  -- Get category breakdown
  SELECT jsonb_agg(
    jsonb_build_object(
      'type', report_type,
      'total_amount', SUM(amount),
      'count', COUNT(*),
      'average', AVG(amount)
    )
  ) INTO v_category_breakdown
  FROM public.financial_reports
  WHERE user_id = p_user_id
    AND date_recorded BETWEEN v_date_from AND v_date_to
    AND verified = TRUE
  GROUP BY report_type;
  
  -- Build report data
  v_report_data := jsonb_build_object(
    'report_period', jsonb_build_object('from', v_date_from, 'to', v_date_to),
    'monthly_breakdown', COALESCE(v_monthly_breakdown, '[]'::jsonb),
    'category_breakdown', COALESCE(v_category_breakdown, '[]'::jsonb),
    'generated_at', NOW()
  );
  
  -- Insert report record
  INSERT INTO public.reports (
    user_id, report_type, report_format, title, description,
    parameters, generated_data, date_from, date_to, status, generated_by
  ) VALUES (
    p_user_id, 'financial_overview', p_format,
    'Financial Overview Report',
    'Detailed financial analysis and trends for the specified period',
    jsonb_build_object('date_from', v_date_from, 'date_to', v_date_to),
    v_report_data, v_date_from, v_date_to, 'completed', auth.uid()
  ) RETURNING id INTO v_report_id;
  
  RETURN v_report_id;
END;
$$;

-- Function to generate audit trail report
CREATE OR REPLACE FUNCTION public.generate_audit_trail_report(
  p_user_id UUID,
  p_date_from DATE DEFAULT NULL,
  p_date_to DATE DEFAULT NULL,
  p_format report_format DEFAULT 'json'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_report_id UUID;
  v_report_data JSONB;
  v_date_from DATE;
  v_date_to DATE;
  v_audit_events JSONB;
  v_activity_summary JSONB;
BEGIN
  -- Set default date range
  v_date_from := COALESCE(p_date_from, CURRENT_DATE - INTERVAL '3 months');
  v_date_to := COALESCE(p_date_to, CURRENT_DATE);
  
  -- Get audit events
  SELECT jsonb_agg(
    jsonb_build_object(
      'timestamp', timestamp,
      'action', action,
      'resource_type', resource_type,
      'resource_id', resource_id,
      'ip_address', ip_address,
      'success', success,
      'error_message', error_message
    ) ORDER BY timestamp DESC
  ) INTO v_audit_events
  FROM public.audit_logs
  WHERE user_id = p_user_id
    AND timestamp BETWEEN v_date_from::timestamptz AND (v_date_to + INTERVAL '1 day')::timestamptz;
  
  -- Get activity summary
  SELECT jsonb_build_object(
    'total_events', COUNT(*),
    'successful_events', COUNT(*) FILTER (WHERE success = TRUE),
    'failed_events', COUNT(*) FILTER (WHERE success = FALSE),
    'actions_breakdown', jsonb_object_agg(action, action_count)
  ) INTO v_activity_summary
  FROM (
    SELECT action, COUNT(*) as action_count
    FROM public.audit_logs
    WHERE user_id = p_user_id
      AND timestamp BETWEEN v_date_from::timestamptz AND (v_date_to + INTERVAL '1 day')::timestamptz
    GROUP BY action
  ) action_counts;
  
  -- Build report data
  v_report_data := jsonb_build_object(
    'report_period', jsonb_build_object('from', v_date_from, 'to', v_date_to),
    'activity_summary', COALESCE(v_activity_summary, '{}'::jsonb),
    'audit_events', COALESCE(v_audit_events, '[]'::jsonb),
    'generated_at', NOW()
  );
  
  -- Insert report record
  INSERT INTO public.reports (
    user_id, report_type, report_format, title, description,
    parameters, generated_data, date_from, date_to, status, generated_by
  ) VALUES (
    p_user_id, 'audit_trail', p_format,
    'Audit Trail Report',
    'Complete audit trail of user activities for the specified period',
    jsonb_build_object('date_from', v_date_from, 'date_to', v_date_to),
    v_report_data, v_date_from, v_date_to, 'completed', auth.uid()
  ) RETURNING id INTO v_report_id;
  
  RETURN v_report_id;
END;
$$;

-- Function to mark report as downloaded and increment counter
CREATE OR REPLACE FUNCTION public.mark_report_downloaded(
  p_report_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.reports
  SET download_count = download_count + 1,
      last_downloaded_at = NOW()
  WHERE id = p_report_id
    AND (user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE id = auth.uid() AND role IN ('admin', 'bank_official')
    ));
  
  RETURN FOUND;
END;
$$;

-- Function to clean up expired reports
CREATE OR REPLACE FUNCTION public.cleanup_expired_reports()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  DELETE FROM public.reports
  WHERE expires_at < NOW()
    AND status = 'completed';
  
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RETURN v_deleted_count;
END;
$$;

-- Insert default report templates
INSERT INTO public.report_templates (name, report_type, description, default_parameters) VALUES
('Monthly Credit Score Summary', 'credit_score_summary', 'Monthly overview of credit score and financial health', 
 '{"period": "1_month", "include_history": true}'),
('Quarterly Financial Overview', 'financial_overview', 'Quarterly financial performance and trends analysis',
 '{"period": "3_months", "include_breakdown": true}'),
('Annual Credit Report', 'credit_score_summary', 'Comprehensive annual credit score and financial report',
 '{"period": "12_months", "detailed": true}'),
('Recent Activity Audit', 'audit_trail', 'Recent user activity and system interactions',
 '{"period": "1_month", "include_failed": true}');

-- Create indexes for performance
CREATE INDEX idx_reports_user_id_date ON public.reports(user_id, date_from, date_to);
CREATE INDEX idx_reports_status ON public.reports(status);
CREATE INDEX idx_reports_type ON public.reports(report_type);
CREATE INDEX idx_reports_expires_at ON public.reports(expires_at);

-- Add updated_at trigger for report_templates
CREATE TRIGGER update_report_templates_updated_at 
  BEFORE UPDATE ON public.report_templates 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

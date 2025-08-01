-- Enhanced Credit Score System Database Schema
-- This migration creates a comprehensive credit scoring system with security, audit trails, and RBAC

-- Create additional enums for credit scoring
CREATE TYPE public.credit_score_status AS ENUM ('pending', 'calculated', 'manual_review', 'approved', 'rejected');
CREATE TYPE public.financial_data_type AS ENUM ('income', 'expense', 'asset', 'liability', 'payment_history');
CREATE TYPE public.audit_action AS ENUM ('login', 'logout', 'score_calculation', 'data_update', 'profile_update', 'admin_action');

-- Create credit_scores table
CREATE TABLE public.credit_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 300 AND score <= 850),
  status credit_score_status NOT NULL DEFAULT 'pending',
  calculation_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expiry_date TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '90 days'),
  payment_history_score INTEGER CHECK (payment_history_score >= 0 AND payment_history_score <= 35),
  credit_utilization_score INTEGER CHECK (credit_utilization_score >= 0 AND credit_utilization_score <= 30),
  credit_history_length_score INTEGER CHECK (credit_history_length_score >= 0 AND credit_history_length_score <= 15),
  credit_mix_score INTEGER CHECK (credit_mix_score >= 0 AND credit_mix_score <= 10),
  new_credit_score INTEGER CHECK (new_credit_score >= 0 AND new_credit_score <= 10),
  income_factor DECIMAL(5,2) DEFAULT 1.0,
  calculated_by UUID REFERENCES auth.users(id),
  reviewed_by UUID REFERENCES auth.users(id),
  review_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create financial_reports table
CREATE TABLE public.financial_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_type financial_data_type NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  description TEXT,
  date_recorded DATE NOT NULL,
  source_document TEXT,
  verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES auth.users(id),
  verification_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create audit_logs table for comprehensive tracking
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action audit_action NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  success BOOLEAN NOT NULL DEFAULT TRUE,
  error_message TEXT
);

-- Create credit_score_factors table for modular scoring
CREATE TABLE public.credit_score_factors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  factor_name VARCHAR(100) NOT NULL UNIQUE,
  weight DECIMAL(5,2) NOT NULL CHECK (weight >= 0 AND weight <= 100),
  description TEXT,
  calculation_formula TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_sessions table for session management and security
CREATE TABLE public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  ip_address INET,
  user_agent TEXT,
  login_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_activity TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  logout_time TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  failed_attempts INTEGER DEFAULT 0
);

-- Create rate_limiting table for security
CREATE TABLE public.rate_limiting (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL, -- IP address or user ID
  action_type TEXT NOT NULL,
  attempt_count INTEGER DEFAULT 1,
  first_attempt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_attempt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  blocked_until TIMESTAMPTZ,
  UNIQUE(identifier, action_type)
);

-- Insert default credit score factors
INSERT INTO public.credit_score_factors (factor_name, weight, description, calculation_formula) VALUES
('payment_history', 35.00, 'Payment history and on-time payments', 'payment_score = (on_time_payments / total_payments) * 35'),
('credit_utilization', 30.00, 'Credit utilization ratio', 'utilization_score = (1 - (used_credit / available_credit)) * 30'),
('credit_history_length', 15.00, 'Length of credit history', 'history_score = min(years_of_history * 2, 15)'),
('credit_mix', 10.00, 'Types of credit accounts', 'mix_score = account_diversity_factor * 10'),
('new_credit', 10.00, 'Recent credit inquiries and new accounts', 'new_credit_score = max(10 - (recent_inquiries * 2), 0)');

-- Enable Row Level Security on all tables
ALTER TABLE public.credit_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_score_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limiting ENABLE ROW LEVEL SECURITY;

-- RLS Policies for credit_scores
CREATE POLICY "Users can view own credit scores" 
ON public.credit_scores FOR SELECT 
USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE id = auth.uid() AND role IN ('admin', 'bank_official')
  )
);

CREATE POLICY "Bank officials can view scores from their bank users" 
ON public.credit_scores FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur1
    JOIN public.user_roles ur2 ON ur1.bank = ur2.bank
    WHERE ur1.id = auth.uid() AND ur1.role = 'bank_official'
    AND ur2.id = user_id
  )
);

CREATE POLICY "Admins and bank officials can insert credit scores" 
ON public.credit_scores FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE id = auth.uid() AND role IN ('admin', 'bank_official')
  )
);

CREATE POLICY "Admins and bank officials can update credit scores" 
ON public.credit_scores FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE id = auth.uid() AND role IN ('admin', 'bank_official')
  )
);

-- RLS Policies for financial_reports
CREATE POLICY "Users can view own financial reports" 
ON public.financial_reports FOR SELECT 
USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE id = auth.uid() AND role IN ('admin', 'bank_official')
  )
);

CREATE POLICY "Users can insert own financial reports" 
ON public.financial_reports FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own unverified financial reports" 
ON public.financial_reports FOR UPDATE 
USING (auth.uid() = user_id AND verified = FALSE);

CREATE POLICY "Bank officials can verify financial reports" 
ON public.financial_reports FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE id = auth.uid() AND role IN ('admin', 'bank_official')
  )
);

-- RLS Policies for audit_logs
CREATE POLICY "Users can view own audit logs" 
ON public.audit_logs FOR SELECT 
USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE id = auth.uid() AND role IN ('admin', 'bank_official')
  )
);

CREATE POLICY "System can insert audit logs" 
ON public.audit_logs FOR INSERT 
WITH CHECK (TRUE);

-- RLS Policies for credit_score_factors
CREATE POLICY "Everyone can view credit score factors" 
ON public.credit_score_factors FOR SELECT 
USING (TRUE);

CREATE POLICY "Only admins can modify credit score factors" 
ON public.credit_score_factors FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- RLS Policies for user_sessions
CREATE POLICY "Users can view own sessions" 
ON public.user_sessions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" 
ON public.user_sessions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" 
ON public.user_sessions FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for rate_limiting
CREATE POLICY "System can manage rate limiting" 
ON public.rate_limiting FOR ALL 
USING (TRUE);

-- Create indexes for performance
CREATE INDEX idx_credit_scores_user_id ON public.credit_scores(user_id);
CREATE INDEX idx_credit_scores_calculation_date ON public.credit_scores(calculation_date);
CREATE INDEX idx_credit_scores_status ON public.credit_scores(status);
CREATE INDEX idx_financial_reports_user_id ON public.financial_reports(user_id);
CREATE INDEX idx_financial_reports_date ON public.financial_reports(date_recorded);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON public.audit_logs(timestamp);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX idx_rate_limiting_identifier ON public.rate_limiting(identifier, action_type);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_credit_scores_updated_at 
  BEFORE UPDATE ON public.credit_scores 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_financial_reports_updated_at 
  BEFORE UPDATE ON public.financial_reports 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_credit_score_factors_updated_at 
  BEFORE UPDATE ON public.credit_score_factors 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Demo Accounts Setup for Scorly Credit System
-- This migration creates demo accounts for testing different user roles

-- Create demo accounts in auth.users table
-- Note: In production, these would be created through the signup process
-- For demo purposes, we'll create the user_roles entries directly

-- Demo System Admin Account
INSERT INTO public.user_roles (id, role, bank, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'admin'::app_role,
  NULL,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  bank = EXCLUDED.bank,
  updated_at = NOW();

-- Demo Bank Official Account (CBZ Bank)
INSERT INTO public.user_roles (id, role, bank, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000002'::uuid,
  'bank_official'::app_role,
  'CBZ BANK',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  bank = EXCLUDED.bank,
  updated_at = NOW();

-- Demo Bank Official Account (CABS)
INSERT INTO public.user_roles (id, role, bank, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000003'::uuid,
  'bank_official'::app_role,
  'CABS',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  bank = EXCLUDED.bank,
  updated_at = NOW();

-- Demo Regular User Account
INSERT INTO public.user_roles (id, role, bank, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000004'::uuid,
  'user'::app_role,
  NULL,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  bank = EXCLUDED.bank,
  updated_at = NOW();

-- Create sample credit scores for demo accounts
INSERT INTO public.credit_scores (
  user_id,
  score,
  score_date,
  payment_history_score,
  credit_utilization_score,
  credit_length_score,
  credit_mix_score,
  new_credit_score,
  created_at,
  updated_at
) VALUES 
-- System Admin (excellent credit)
(
  '00000000-0000-0000-0000-000000000001'::uuid,
  850,
  CURRENT_DATE,
  95,
  90,
  85,
  80,
  75,
  NOW(),
  NOW()
),
-- Bank Official CBZ (good credit)
(
  '00000000-0000-0000-0000-000000000002'::uuid,
  720,
  CURRENT_DATE,
  85,
  75,
  70,
  65,
  60,
  NOW(),
  NOW()
),
-- Bank Official CABS (fair credit)
(
  '00000000-0000-0000-0000-000000000003'::uuid,
  650,
  CURRENT_DATE,
  70,
  65,
  60,
  55,
  50,
  NOW(),
  NOW()
),
-- Regular User (building credit)
(
  '00000000-0000-0000-0000-000000000004'::uuid,
  580,
  CURRENT_DATE,
  60,
  55,
  45,
  40,
  35,
  NOW(),
  NOW()
) ON CONFLICT (user_id, score_date) DO UPDATE SET
  score = EXCLUDED.score,
  payment_history_score = EXCLUDED.payment_history_score,
  credit_utilization_score = EXCLUDED.credit_utilization_score,
  credit_length_score = EXCLUDED.credit_length_score,
  credit_mix_score = EXCLUDED.credit_mix_score,
  new_credit_score = EXCLUDED.new_credit_score,
  updated_at = NOW();

-- Create sample financial reports for demo accounts
INSERT INTO public.financial_reports (
  user_id,
  report_type,
  report_data,
  generated_at,
  created_at,
  updated_at
) VALUES
-- System Admin - Comprehensive Report
(
  '00000000-0000-0000-0000-000000000001'::uuid,
  'comprehensive'::report_type,
  jsonb_build_object(
    'credit_score', 850,
    'credit_grade', 'Excellent',
    'accounts', jsonb_build_array(
      jsonb_build_object('type', 'Credit Card', 'balance', 2500, 'limit', 15000, 'status', 'Current'),
      jsonb_build_object('type', 'Mortgage', 'balance', 185000, 'limit', 200000, 'status', 'Current'),
      jsonb_build_object('type', 'Auto Loan', 'balance', 12000, 'limit', 25000, 'status', 'Current')
    ),
    'payment_history', jsonb_build_object('on_time_payments', 98, 'late_payments', 1, 'missed_payments', 0),
    'recommendations', jsonb_build_array(
      'Continue excellent payment history',
      'Consider increasing credit limits',
      'Monitor credit utilization'
    )
  ),
  NOW(),
  NOW(),
  NOW()
),
-- Bank Official CBZ - Monthly Report
(
  '00000000-0000-0000-0000-000000000002'::uuid,
  'monthly'::report_type,
  jsonb_build_object(
    'credit_score', 720,
    'credit_grade', 'Good',
    'accounts', jsonb_build_array(
      jsonb_build_object('type', 'Credit Card', 'balance', 4500, 'limit', 8000, 'status', 'Current'),
      jsonb_build_object('type', 'Personal Loan', 'balance', 15000, 'limit', 20000, 'status', 'Current')
    ),
    'payment_history', jsonb_build_object('on_time_payments', 85, 'late_payments', 3, 'missed_payments', 0),
    'recommendations', jsonb_build_array(
      'Reduce credit card utilization',
      'Set up automatic payments',
      'Consider debt consolidation'
    )
  ),
  NOW(),
  NOW(),
  NOW()
),
-- Bank Official CABS - Credit Monitoring Report
(
  '00000000-0000-0000-0000-000000000003'::uuid,
  'credit_monitoring'::report_type,
  jsonb_build_object(
    'credit_score', 650,
    'credit_grade', 'Fair',
    'accounts', jsonb_build_array(
      jsonb_build_object('type', 'Credit Card', 'balance', 3200, 'limit', 4000, 'status', 'Current'),
      jsonb_build_object('type', 'Store Card', 'balance', 800, 'limit', 1000, 'status', '30 Days Late')
    ),
    'payment_history', jsonb_build_object('on_time_payments', 70, 'late_payments', 8, 'missed_payments', 1),
    'recommendations', jsonb_build_array(
      'Pay down high-utilization accounts',
      'Bring late accounts current',
      'Consider credit counseling'
    )
  ),
  NOW(),
  NOW(),
  NOW()
),
-- Regular User - Basic Report
(
  '00000000-0000-0000-0000-000000000004'::uuid,
  'basic'::report_type,
  jsonb_build_object(
    'credit_score', 580,
    'credit_grade', 'Poor',
    'accounts', jsonb_build_array(
      jsonb_build_object('type', 'Secured Credit Card', 'balance', 450, 'limit', 500, 'status', 'Current'),
      jsonb_build_object('type', 'Student Loan', 'balance', 8500, 'limit', 10000, 'status', 'Deferred')
    ),
    'payment_history', jsonb_build_object('on_time_payments', 60, 'late_payments', 12, 'missed_payments', 3),
    'recommendations', jsonb_build_array(
      'Make all payments on time',
      'Keep credit utilization low',
      'Consider becoming an authorized user'
    )
  ),
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (user_id, report_type, generated_at) DO UPDATE SET
  report_data = EXCLUDED.report_data,
  updated_at = NOW();

-- Create audit log entries for demo account creation
INSERT INTO public.audit_logs (
  user_id,
  action,
  table_name,
  record_id,
  old_values,
  new_values,
  created_at
) VALUES
(
  '00000000-0000-0000-0000-000000000001'::uuid,
  'INSERT'::audit_action,
  'user_roles',
  '00000000-0000-0000-0000-000000000001',
  '{}',
  jsonb_build_object('role', 'admin', 'bank', null),
  NOW()
),
(
  '00000000-0000-0000-0000-000000000002'::uuid,
  'INSERT'::audit_action,
  'user_roles',
  '00000000-0000-0000-0000-000000000002',
  '{}',
  jsonb_build_object('role', 'bank_official', 'bank', 'CBZ BANK'),
  NOW()
),
(
  '00000000-0000-0000-0000-000000000003'::uuid,
  'INSERT'::audit_action,
  'user_roles',
  '00000000-0000-0000-0000-000000000003',
  '{}',
  jsonb_build_object('role', 'bank_official', 'bank', 'CABS'),
  NOW()
),
(
  '00000000-0000-0000-0000-000000000004'::uuid,
  'INSERT'::audit_action,
  'user_roles',
  '00000000-0000-0000-0000-000000000004',
  '{}',
  jsonb_build_object('role', 'user', 'bank', null),
  NOW()
);

-- Add comments for documentation
COMMENT ON TABLE public.user_roles IS 'Demo accounts created for testing different user roles and permissions';

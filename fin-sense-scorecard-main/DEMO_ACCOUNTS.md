# Demo Accounts for Scorly Credit System

This document outlines the demo accounts available for testing different user roles and permissions in the Scorly credit health dashboard.

## Demo Account Credentials

### 1. System Administrator
- **Email**: `admin@scorly.io`
- **Role**: `admin`
- **Bank**: N/A (System-wide access)
- **Credit Score**: 850 (Excellent)
- **Access Level**: Full system access, can view all users and banks
- **Features**:
  - View system-wide analytics
  - Manage all user accounts
  - Access comprehensive reporting
  - System configuration settings

### 2. Bank Official - CBZ Bank
- **Email**: `manager@cbz.co.zw`
- **Role**: `bank_official`
- **Bank**: CBZ BANK
- **Credit Score**: 720 (Good)
- **Access Level**: Bank-specific data and customers
- **Features**:
  - View CBZ Bank customer data
  - Generate bank-specific reports
  - Monitor bank customer credit scores
  - Access bank analytics dashboard

### 3. Bank Official - CABS
- **Email**: `official@cabs.co.zw`
- **Role**: `bank_official`
- **Bank**: CABS
- **Credit Score**: 650 (Fair)
- **Access Level**: CABS-specific data and customers
- **Features**:
  - View CABS customer data
  - Generate CABS-specific reports
  - Monitor CABS customer credit scores
  - Access CABS analytics dashboard

### 4. Regular User
- **Email**: `user@gmail.com`
- **Role**: `user`
- **Bank**: N/A
- **Credit Score**: 580 (Poor - Building Credit)
- **Access Level**: Personal data only
- **Features**:
  - View personal credit score
  - Access personal credit report
  - Receive credit improvement recommendations
  - Basic dashboard functionality

## Account Setup Instructions

### For Development/Testing:

1. **Run the Migration**:
   ```bash
   # Apply the demo accounts migration
   supabase db reset
   # or
   supabase migration up
   ```

2. **Create Auth Users** (via Supabase Dashboard or API):
   - Go to Supabase Dashboard → Authentication → Users
   - Create users with the emails listed above
   - Use password: `DemoPass123!` for all accounts
   - The role assignment will happen automatically via the trigger function

3. **Verify Setup**:
   - Check that users appear in `auth.users` table
   - Verify roles are assigned in `user_roles` table
   - Confirm sample data exists in `credit_scores` and `financial_reports`

### For Production:

⚠️ **IMPORTANT**: These demo accounts should NOT be used in production environments. They are for development and testing purposes only.

## Sample Data Included

Each demo account includes:

- **Credit Score History**: Sample credit scores with component breakdowns
- **Financial Reports**: Various report types (basic, monthly, comprehensive, credit_monitoring)
- **Audit Logs**: Sample audit trail entries
- **Role-Based Data**: Appropriate data based on user role and permissions

## Testing Scenarios

### Role-Based Access Control (RBAC)
1. **Admin Access**: Login as admin@scorly.io to test system-wide access
2. **Bank Official Access**: Login as bank officials to test bank-specific data filtering
3. **User Access**: Login as regular user to test personal data access only

### Credit Score Features
1. **High Score User**: Test with admin account (850 score)
2. **Medium Score User**: Test with CBZ bank official (720 score)
3. **Low Score User**: Test with regular user (580 score)

### Reporting Features
1. **Comprehensive Reports**: Available for admin users
2. **Bank-Specific Reports**: Available for bank officials
3. **Personal Reports**: Available for all users

## Database Schema

The demo accounts utilize the following tables:
- `user_roles`: Role assignments and bank affiliations
- `credit_scores`: Sample credit score data
- `financial_reports`: Sample report data
- `audit_logs`: Sample audit trail entries

## Security Notes

- All demo accounts use predictable UUIDs for easy identification
- Passwords should be changed in production environments
- Demo data includes realistic but fictional financial information
- RLS policies ensure proper data access based on user roles

## Troubleshooting

### Common Issues:
1. **Users not appearing**: Check if migration ran successfully
2. **Role not assigned**: Verify trigger function is working
3. **Data not visible**: Check RLS policies are properly configured
4. **Login issues**: Ensure users are created in Supabase Auth

### Reset Demo Data:
```sql
-- Clear demo data
DELETE FROM audit_logs WHERE user_id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000004'
);

DELETE FROM financial_reports WHERE user_id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000004'
);

DELETE FROM credit_scores WHERE user_id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000004'
);

DELETE FROM user_roles WHERE id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000004'
);
```

## Support

For issues with demo accounts or testing scenarios, please refer to the main project documentation or contact the development team.

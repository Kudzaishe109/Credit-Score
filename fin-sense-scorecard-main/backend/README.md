# Scorly Backend

This folder contains all backend-related code and configurations for the Scorly Credit Health Dashboard.

## Structure

```
backend/
├── supabase/           # Supabase configuration and migrations
│   ├── migrations/     # Database migrations
│   ├── functions/      # Edge Functions
│   └── config.toml     # Supabase configuration
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks for backend integration
├── utils/              # Backend utility functions
└── services/           # API service functions
```

## Features

- **Database Schema**: Comprehensive PostgreSQL schema with RLS policies
- **Authentication**: Supabase Auth with role-based access control
- **Credit Scoring**: Modular credit score calculation system
- **Reporting**: Advanced reporting system with CSV/PDF export
- **Audit Trail**: Complete audit logging for compliance
- **Edge Functions**: Serverless functions for report generation and downloads

## Setup

1. Install Supabase CLI
2. Run migrations: `supabase db reset`
3. Deploy Edge Functions: `supabase functions deploy`
4. Configure environment variables

## Security

- Row Level Security (RLS) policies
- Role-based access control (RBAC)
- Audit trail for all operations
- Rate limiting protection
- Email verification required

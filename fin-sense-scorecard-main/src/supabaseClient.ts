import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types/database';

// Environment variables validation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch {
  throw new Error('Invalid VITE_SUPABASE_URL format');
}

// Enhanced Supabase client configuration
export const supabase: SupabaseClient<Database> = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Enable automatic token refresh
    autoRefreshToken: true,
    // Persist session in localStorage
    persistSession: true,
    // Detect session from URL on redirect
    detectSessionInUrl: true,
    // Enhanced security settings
    flowType: 'pkce',
    // Email confirmation settings
    debug: process.env.NODE_ENV === 'development',
    // Custom storage for session persistence
    storage: {
      getItem: (key: string) => {
        if (typeof window !== 'undefined') {
          return window.localStorage.getItem(key);
        }
        return null;
      },
      setItem: (key: string, value: string) => {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, value);
        }
      },
      removeItem: (key: string) => {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(key);
        }
      },
    },
  },
  global: {
    headers: {
      'X-Client-Info': 'fin-sense-scorecard@1.0.0',
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Auth helper functions
export const authHelpers = {
  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session?.user;
  },

  // Check if user email is confirmed
  isEmailConfirmed: async (): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    return !!user?.email_confirmed_at;
  },

  // Check if user is authenticated AND email confirmed
  isFullyAuthenticated: async (): Promise<boolean> => {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session?.user && !!session.user.email_confirmed_at;
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Get user role
  getUserRole: async () => {
    const user = await authHelpers.getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_roles')
      .select('id, role, bank')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  },

  // Sign out with cleanup
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Clear any cached data
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('supabase.auth.token');
    }
  },

  // Check if user has specific role
  hasRole: async (requiredRole: 'user' | 'bank_official' | 'admin'): Promise<boolean> => {
    try {
      const roleData = await authHelpers.getUserRole();
      return roleData?.role === requiredRole;
    } catch {
      return false;
    }
  },

  // Check if user has any of the specified roles
  hasAnyRole: async (roles: Array<'user' | 'bank_official' | 'admin'>): Promise<boolean> => {
    try {
      const roleData = await authHelpers.getUserRole();
      return roleData ? roles.includes(roleData.role) : false;
    } catch {
      return false;
    }
  },

  // Resend email confirmation
  resendConfirmation: async (email: string): Promise<void> => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`
      }
    });
    
    if (error) throw error;
  },

  // Confirm email with token (for email confirmation page)
  confirmEmail: async (token: string, type: 'signup' | 'recovery' = 'signup'): Promise<void> => {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: type
    });
    
    if (error) throw error;
  },

  // Sign up with email confirmation
  signUpWithConfirmation: async (email: string, password: string, metadata?: Record<string, any>) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/auth/confirm`
      }
    });

    if (error) throw error;
    return data;
  },
};

// Export types for better TypeScript support
export type { Database } from './types/database';

import { useState, useEffect, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, authHelpers } from '../supabaseClient';
import type { Database } from '../types/database';

type UserRole = Database['public']['Tables']['user_roles']['Row'];

interface AuthState {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  loading: boolean;
  error: AuthError | null;
  emailConfirmed: boolean;
  needsEmailConfirmation: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    userRole: null,
    loading: true,
    error: null,
    emailConfirmed: false,
    needsEmailConfirmation: false,
  });

  // Helper function to create auth state
  const createAuthState = (
    user: User | null,
    session: Session | null,
    userRole: UserRole | null = null,
    loading: boolean = false,
    error: AuthError | null = null
  ): AuthState => {
    const emailConfirmed = !!user?.email_confirmed_at;
    const needsEmailConfirmation = !!user && !emailConfirmed;
    
    return {
      user,
      session,
      userRole,
      loading,
      error,
      emailConfirmed,
      needsEmailConfirmation,
    };
  };

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (mounted) {
          if (session?.user) {
            // Get user role
            try {
              const roleData = await authHelpers.getUserRole();
              setAuthState(createAuthState(session.user, session, roleData));
            } catch (roleError) {
              console.warn('Failed to fetch user role:', roleError);
              setAuthState(createAuthState(session.user, session, null));
            }
          } else {
            setAuthState(createAuthState(null, null));
          }
        }
      } catch (error) {
        if (mounted) {
          setAuthState(createAuthState(null, null, null, false, error as AuthError));
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_IN' && session?.user) {
          try {
            const roleData = await authHelpers.getUserRole();
            setAuthState(createAuthState(session.user, session, roleData));
          } catch (roleError) {
            console.warn('Failed to fetch user role on sign in:', roleError);
            setAuthState(createAuthState(session.user, session, null));
          }
        } else if (event === 'SIGNED_OUT') {
          setAuthState(createAuthState(null, null));
        } else if (event === 'TOKEN_REFRESHED' && session) {
          setAuthState(prev => ({
            ...prev,
            session,
            error: null,
            emailConfirmed: !!session.user?.email_confirmed_at,
            needsEmailConfirmation: !!session.user && !session.user.email_confirmed_at,
          }));
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signIn = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Auth state will be updated by the listener
      return { user: data.user, session: data.session };
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error as AuthError,
      }));
      throw error;
    }
  }, []);

  // Sign up with email and password (with email confirmation)
  const signUp = useCallback(async (email: string, password: string, metadata?: Record<string, any>) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await authHelpers.signUpWithConfirmation(email, password, metadata);
      
      // User will need to confirm email before full access
      if (data.user && !data.session) {
        setAuthState(createAuthState(data.user, null, null, false, null));
      }
      
      return data;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error as AuthError,
        emailConfirmed: prev.emailConfirmed,
        needsEmailConfirmation: prev.needsEmailConfirmation,
      }));
      throw error;
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await authHelpers.signOut();
      // Auth state will be updated by the listener
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error as AuthError,
      }));
      throw error;
    }
  }, []);

  // Reset password
  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }, []);

  // Update password
  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }, []);

  // Refresh user role
  const refreshUserRole = useCallback(async () => {
    if (!authState.user) return null;

    try {
      const roleData = await authHelpers.getUserRole();
      setAuthState(prev => ({
        ...prev,
        userRole: roleData,
      }));
      return roleData;
    } catch (error) {
      console.error('Failed to refresh user role:', error);
      return null;
    }
  }, [authState.user]);

  // Check if user has specific role
  const hasRole = useCallback((role: 'user' | 'bank_official' | 'admin'): boolean => {
    return authState.userRole?.role === role;
  }, [authState.userRole]);

  // Check if user has any of the specified roles
  const hasAnyRole = useCallback((roles: Array<'user' | 'bank_official' | 'admin'>): boolean => {
    return authState.userRole ? roles.includes(authState.userRole.role) : false;
  }, [authState.userRole]);

  // Check if user is admin
  const isAdmin = useCallback((): boolean => {
    return hasRole('admin');
  }, [hasRole]);

  // Check if user is bank official
  const isBankOfficial = useCallback((): boolean => {
    return hasRole('bank_official');
  }, [hasRole]);

  // Check if user can access admin features
  const canAccessAdmin = useCallback((): boolean => {
    return hasAnyRole(['admin', 'bank_official']);
  }, [hasAnyRole]);

  // Resend email confirmation
  const resendConfirmation = useCallback(async (email: string) => {
    try {
      await authHelpers.resendConfirmation(email);
    } catch (error) {
      throw error;
    }
  }, []);

  // Confirm email with token
  const confirmEmail = useCallback(async (token: string) => {
    try {
      await authHelpers.confirmEmail(token);
      // Refresh auth state after confirmation
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const roleData = await authHelpers.getUserRole();
        setAuthState(createAuthState(session.user, session, roleData));
      }
    } catch (error) {
      throw error;
    }
  }, []);

  return {
    // State
    user: authState.user,
    session: authState.session,
    userRole: authState.userRole,
    loading: authState.loading,
    error: authState.error,
    isAuthenticated: !!authState.user,
    emailConfirmed: authState.emailConfirmed,
    needsEmailConfirmation: authState.needsEmailConfirmation,
    isFullyAuthenticated: authState.emailConfirmed && !!authState.user,

    // Actions
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshUserRole,
    resendConfirmation,
    confirmEmail,

    // Role checks
    hasRole,
    hasAnyRole,
    isAdmin,
    isBankOfficial,
    canAccessAdmin,
  };
};

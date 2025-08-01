import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
import { useToast } from '@/hooks/use-toast';

export interface UserRole {
  id: string;
  role: 'user' | 'bank_official' | 'admin';
  bank?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string, bank?: string) => Promise<{ user: User | null; error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isBankAdmin: boolean;
  userBank: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch user role from database
  const fetchUserRole = async (userId: string): Promise<UserRole | null> => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }

      return data as UserRole;
    } catch (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserRole(session.user.id).then(setUserRole);
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const role = await fetchUserRole(session.user.id);
        setUserRole(role);
      } else {
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, firstName: string, lastName: string, bank?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`,
            bank: bank || null,
          },
        },
      });

      if (error) {
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive",
        });
        return { user: null, error };
      }

      if (data.user && !data.session) {
        toast({
          title: "Check Your Email",
          description: "Please check your email for a confirmation link to complete your registration.",
        });
      } else if (data.user && data.session) {
        toast({
          title: "Account Created",
          description: "Your account has been created successfully!",
        });
      }

      return { user: data.user, error: null };
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Signup Failed",
        description: authError.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return { user: null, error: authError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return { user: null, error };
      }

      if (data.user) {
        // Determine user type based on email for welcome message
        let welcomeMessage = "Welcome back!";
        if (email.toLowerCase().endsWith('@scorly.io')) {
          welcomeMessage = "Welcome System Admin";
        } else if (email.toLowerCase().endsWith('.co.zw')) {
          const bankName = email.split('@')[1].replace('.co.zw', '').replace(/[-_]/g, ' ')
            .split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
          welcomeMessage = `Welcome Bank Admin - ${bankName}`;
        }

        toast({
          title: welcomeMessage,
          description: "Successfully logged in to your account",
        });
      }

      return { user: data.user, error: null };
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Login Failed",
        description: authError.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return { user: null, error: authError };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Logout Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out",
        });
      }
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Logout Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  // Computed properties based on user role
  const isAdmin = userRole?.role === 'admin';
  const isBankAdmin = userRole?.role === 'bank_official';
  const userBank = userRole?.bank || '';

  const value: AuthContextType = {
    user,
    session,
    userRole,
    loading,
    signUp,
    signIn,
    signOut,
    isAdmin,
    isBankAdmin,
    userBank,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isOfflineMode } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

export interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: 'tenant' | 'landlord' | 'admin';
  createdAt: string;
}

interface AuthContextType {
  user: User | DemoUser | null;
  session: Session | null;
  isLoading: boolean;
  isOffline: boolean;
  signIn: (demoUser: DemoUser) => void;
  signOut: () => Promise<void>;
  getUserRole: () => 'tenant' | 'landlord' | 'admin';
  getUserName: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_KEY = 'spacefindr_demo_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | DemoUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state
    const initAuth = async () => {
      try {
        if (isOfflineMode) {
          // Check for demo user in localStorage
          const storedUser = localStorage.getItem(DEMO_USER_KEY);
          if (storedUser) {
            const demoUser = JSON.parse(storedUser) as DemoUser;
            setUser(demoUser);
          }
        } else {
          // Get Supabase session
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          setSession(currentSession);
          setUser(currentSession?.user ?? null);

          // Listen for auth changes
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, newSession) => {
              setSession(newSession);
              setUser(newSession?.user ?? null);
            }
          );

          return () => subscription.unsubscribe();
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Listen for storage changes (demo mode - sync across tabs)
  useEffect(() => {
    if (!isOfflineMode) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === DEMO_USER_KEY) {
        if (e.newValue) {
          setUser(JSON.parse(e.newValue));
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const signIn = (demoUser: DemoUser) => {
    if (isOfflineMode) {
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
      setUser(demoUser);
    }
  };

  const signOut = async () => {
    try {
      if (isOfflineMode) {
        localStorage.removeItem(DEMO_USER_KEY);
        setUser(null);
      } else {
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const getUserRole = (): 'tenant' | 'landlord' | 'admin' => {
    if (!user) return 'tenant';

    if (isOfflineMode) {
      return (user as DemoUser).role || 'tenant';
    } else {
      return (user as User).user_metadata?.role || 'tenant';
    }
  };

  const getUserName = (): string => {
    if (!user) return '';

    if (isOfflineMode) {
      return (user as DemoUser).name || 'Benutzer';
    } else {
      return (user as User).user_metadata?.name || (user as User).email || 'Benutzer';
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isOffline: isOfflineMode,
    signIn,
    signOut,
    getUserRole,
    getUserName,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

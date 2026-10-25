import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { pb } from '@/services/pocketbase';
import { AuthService } from '@/services/auth.service';
import { User } from '@/types/models';

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithGoogle: (urlCallback?: (url: string) => void) => Promise<User>;
  signInWithPassword: (email: string, pass: string) => Promise<User>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(AuthService.getCurrentUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Synchronize state when authStore changes (sign in, sign out, token refresh)
  useEffect(() => {
    const unsubscribe = pb.authStore.onChange((token, model) => {
      setUser((model as unknown as User) || null);
    });

    // Check existing session validity on mount
    async function initSession() {
      try {
        if (pb.authStore.isValid) {
          const refreshed = await AuthService.refreshSession();
          setUser(refreshed);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    initSession();

    return () => {
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(async (urlCallback?: (url: string) => void) => {
    setIsLoading(true);
    try {
      const signedInUser = await AuthService.signInWithGoogle(urlCallback);
      setUser(signedInUser);
      return signedInUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signInWithPassword = useCallback(async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const signedInUser = await AuthService.signInWithPassword(email, pass);
      setUser(signedInUser);
      return signedInUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await AuthService.signOut();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const refreshed = await AuthService.refreshSession();
    setUser(refreshed);
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user && pb.authStore.isValid,
    isLoading,
    signInWithGoogle,
    signInWithPassword,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

import React, { createContext, useContext, useState } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';

export type UserRole = 'super_admin' | 'admin' | 'family' | 'caregiver' | 'doctor';

export interface AuthPrincipal {
  uid: string;
  email: string;
  role: UserRole;
  isDemo: boolean;
  fullName: string;
}

interface AuthContextValue {
  principal: AuthPrincipal | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<AuthPrincipal | null>;
  enterDemoWorkspace: (role: 'admin' | 'family' | 'caregiver' | 'doctor') => Promise<AuthPrincipal | null>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Strictly in-memory token storage (never localStorage or sessionStorage)
  const [token, setToken] = useState<string | null>(null);
  const [principal, setPrincipal] = useState<AuthPrincipal | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = async (): Promise<AuthPrincipal | null> => {
    setLoading(true);
    setError(null);
    try {
      const cred = await signInWithPopup(auth, googleAuthProvider);
      const idToken = await cred.user.getIdToken();
      const res = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Could not verify account.');
      }
      const data = await res.json();
      setToken(idToken);
      setPrincipal(data.principal);
      return data.principal;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Google Sign-In did not complete.';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const enterDemoWorkspace = async (
    role: 'admin' | 'family' | 'caregiver' | 'doctor'
  ): Promise<AuthPrincipal | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/demo/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        throw new Error('Failed to start demonstration session.');
      }
      const data = await res.json();
      const syncRes = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: { Authorization: `Bearer ${data.token}` },
      });
      if (!syncRes.ok) {
        throw new Error('Failed to verify demonstration session.');
      }
      const syncData = await syncRes.json();
      setToken(data.token);
      setPrincipal(syncData.principal);
      return syncData.principal;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Demo login failed.';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (principal && !principal.isDemo) {
      await signOut(auth).catch(() => {});
    }
    setToken(null);
    setPrincipal(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        principal,
        token,
        loading,
        error,
        signInWithGoogle,
        enterDemoWorkspace,
        logout,
        clearError: () => setError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

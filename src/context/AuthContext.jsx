// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  subscribeToAuthChanges,
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
} from '../services/firebase/auth';
import { isFirebaseConfigured } from '../services/firebase/config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((firebaseUser) => {
      setUser(firebaseUser);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      initializing,
      isFirebaseConfigured,
      authError,
      clearAuthError: () => setAuthError(null),
      signIn: async (email, password) => {
        setAuthError(null);
        try {
          await signInWithEmail({ email, password });
        } catch (err) {
          setAuthError(err.message);
          throw err;
        }
      },
      signUp: async (email, password, username) => {
        setAuthError(null);
        try {
          await signUpWithEmail({ email, password, username });
        } catch (err) {
          setAuthError(err.message);
          throw err;
        }
      },
      signOut: async () => {
        try {
          await signOutUser();
        } catch (err) {
          setAuthError(err.message);
        }
      },
    }),
    [user, initializing, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

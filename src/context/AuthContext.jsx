import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  subscribeToAuthChanges,
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
} from '../services/firebase/auth';
import { isFirebaseConfigured } from '../services/firebase/config';

const AuthContext = createContext(null);
const DEMO_KEY = 'lilshot.demoUser';

function readDemo() {
  try {
    return JSON.parse(localStorage.getItem(DEMO_KEY) || 'null');
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setUser(readDemo());
      setInitializing(false);
      return;
    }
    const unsub = subscribeToAuthChanges((firebaseUser) => {
      setUser(firebaseUser);
      setInitializing(false);
    });
    return unsub;
  }, []);

  const setDemo = (next) => {
    setUser(next);
    if (next) localStorage.setItem(DEMO_KEY, JSON.stringify(next));
    else localStorage.removeItem(DEMO_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      initializing,
      isFirebaseConfigured,
      authError,
      clearAuthError: () => setAuthError(null),

      enterAsGuest: () =>
        setDemo({
          uid: 'demo-local',
          email: 'guest@lilshot.app',
          displayName: 'Guest',
        }),

      signIn: async (email, password) => {
        setAuthError(null);
        if (!isFirebaseConfigured) {
          setDemo({
            uid: 'demo-local',
            email,
            displayName: email.split('@')[0] || 'Guest',
          });
          return;
        }
        try {
          await signInWithEmail({ email, password });
        } catch (err) {
          setAuthError(err.message);
          throw err;
        }
      },

      signUp: async (email, password, username) => {
        setAuthError(null);
        if (!isFirebaseConfigured) {
          setDemo({
            uid: 'demo-local',
            email,
            displayName: username || email.split('@')[0] || 'Guest',
          });
          return;
        }
        try {
          await signUpWithEmail({ email, password, username });
        } catch (err) {
          setAuthError(err.message);
          throw err;
        }
      },

      signOut: async () => {
        if (!isFirebaseConfigured) {
          setDemo(null);
          return;
        }
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
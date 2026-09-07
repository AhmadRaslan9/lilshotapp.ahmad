import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { createUserProfile, subscribeToProfile, updateUserProfile } from '../services/firebase/profiles';

const ProfileContext = createContext(null);
export function ProfileProvider({ children }) {
  const { user, isFirebaseConfigured } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(Boolean(user));
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    setError(null);
    if (!user || !isFirebaseConfigured || user.uid === 'demo-local') {
      setProfile(user ? { uid: user.uid, displayName: user.displayName, username: 'guest', accountType: 'user', privacy: 'public', plan: 'free' } : null);
      setLoading(false); return undefined;
    }
    setLoading(true);
    return subscribeToProfile(user.uid, (value) => { setProfile(value); setLoading(false); }, (value) => { setError(value); setLoading(false); });
  }, [user, isFirebaseConfigured, attempt]);
  const value = useMemo(() => ({ profile, loading, error, retry: () => setAttempt((n) => n + 1), createProfile: (input) => createUserProfile(user, input), updateProfile: (changes) => updateUserProfile(user.uid, changes) }), [profile, loading, error, user]);
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}
export function useProfile() { const value = useContext(ProfileContext); if (!value) throw new Error('ProfileProvider is missing'); return value; }

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { blockProfile, subscribeToBlockedBy, subscribeToBlocks, unblockProfile } from '../services/firebase/blocking';

const BlockingContext = createContext(null);

export function BlockingProvider({ children }) {
  const { user, isFirebaseConfigured } = useAuth();
  const [blockedProfiles, setBlockedProfiles] = useState([]);
  const [blockedByIds, setBlockedByIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!user?.uid || !isFirebaseConfigured || user.uid === 'demo-local') {
      setBlockedProfiles([]); setBlockedByIds([]); setLoading(false); return undefined;
    }
    setLoading(true);
    let blocksReady = false; let blockedByReady = false;
    const ready = () => { if (blocksReady && blockedByReady) setLoading(false); };
    const stopBlocks = subscribeToBlocks(user.uid, (value) => { setBlockedProfiles(value); blocksReady = true; setError(null); ready(); }, (value) => { setError(value); blocksReady = true; ready(); });
    const stopBlockedBy = subscribeToBlockedBy(user.uid, (value) => { setBlockedByIds(value); blockedByReady = true; setError(null); ready(); }, (value) => { setError(value); blockedByReady = true; ready(); });
    return () => { stopBlocks(); stopBlockedBy(); };
  }, [isFirebaseConfigured, user?.uid]);
  const blockedIds = useMemo(() => new Set(blockedProfiles.map((profile) => profile.uid)), [blockedProfiles]);
  const blockedBySet = useMemo(() => new Set(blockedByIds), [blockedByIds]);
  const excludedIds = useMemo(() => new Set([...blockedIds, ...blockedBySet]), [blockedIds, blockedBySet]);
  const value = useMemo(() => ({
    blockedProfiles, blockedIds, blockedByIds: blockedBySet, excludedIds, loading, error,
    block: (profile) => blockProfile(user?.uid, profile),
    unblock: (uid) => unblockProfile(user?.uid, uid),
  }), [blockedProfiles, blockedIds, blockedBySet, excludedIds, loading, error, user?.uid]);
  return <BlockingContext.Provider value={value}>{children}</BlockingContext.Provider>;
}

export function useBlocking() {
  const value = useContext(BlockingContext);
  if (!value) throw new Error('useBlocking must be used inside BlockingProvider');
  return value;
}

import { collection, doc, limit, onSnapshot, query, where } from 'firebase/firestore';
import { db } from './config';
import { toPublicCafe } from './cafeModel';

export function subscribeToActiveCafes(next, error, excludedIds = new Set()) {
  const activeCafes = query(
    collection(db, 'users'),
    where('accountType', '==', 'cafe'),
    where('accountStatus', '==', 'active'),
    where('privacy', '==', 'public'),
    limit(100),
  );
  const detailUnsubs = new Map();
  let profiles = new Map();
  const details = new Map();
  const emit = () => next([...profiles.values()].map((profile) => toPublicCafe(profile, details.get(profile.uid))).sort((a, b) => a.name.localeCompare(b.name, 'ar')));
  const usersUnsub = onSnapshot(activeCafes, (snapshot) => {
    profiles = new Map(snapshot.docs.filter((item) => !excludedIds.has(item.id)).map((item) => {
      const profile = { id: item.id, ...item.data() };
      return [profile.uid || item.id, profile];
    }));
    for (const [uid, unsubscribe] of detailUnsubs) {
      if (!profiles.has(uid)) { unsubscribe(); detailUnsubs.delete(uid); details.delete(uid); }
    }
    for (const uid of profiles.keys()) {
      if (detailUnsubs.has(uid)) continue;
      detailUnsubs.set(uid, onSnapshot(doc(db, 'cafes', uid), (snapshot) => {
        details.set(uid, snapshot.exists() ? snapshot.data() : null); emit();
      }, error));
    }
    emit();
  }, error);
  return () => { usersUnsub(); detailUnsubs.forEach((unsubscribe) => unsubscribe()); detailUnsubs.clear(); };
}

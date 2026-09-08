import { collection, limit, onSnapshot, query, where } from 'firebase/firestore';
import { db } from './config';
import { toPublicProfile } from './publicProfileModel';

export function subscribeToPublicProfiles(next, error) {
  const profilesQuery = query(
    collection(db, 'users'),
    where('accountStatus', '==', 'active'),
    limit(100),
  );
  return onSnapshot(profilesQuery, (snapshot) => next(snapshot.docs
    .map((item) => toPublicProfile(item.id, item.data()))
    .sort((a, b) => a.displayName.localeCompare(b.displayName, 'ar'))), error);
}

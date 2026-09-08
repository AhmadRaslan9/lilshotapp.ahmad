import { collection, doc, getDoc, onSnapshot, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from './config';
import { canFollowProfile } from './relationshipModel';

const codedError = (code) => Object.assign(new Error(code), { code });

export function subscribeToFollowState(actorUid, targetUid, next, error) {
  if (!actorUid || !targetUid || actorUid === targetUid) {
    next(false);
    return () => {};
  }
  return onSnapshot(doc(db, 'users', actorUid, 'following', targetUid), (snap) => next(snap.exists()), error);
}

export function subscribeToFollowersCount(targetUid, next, error) {
  if (!targetUid) { next(0); return () => {}; }
  return onSnapshot(collection(db, 'users', targetUid, 'followers'), (snap) => next(snap.size), error);
}

export function subscribeToFollowingCount(actorUid, next, error) {
  if (!actorUid) { next(0); return () => {}; }
  return onSnapshot(collection(db, 'users', actorUid, 'following'), (snap) => next(snap.size), error);
}

export async function followProfile(actorUid, targetUid) {
  if (!actorUid || !targetUid || actorUid === targetUid) throw codedError('relationship/invalid-target');
  const targetSnap = await getDoc(doc(db, 'users', targetUid));
  const target = targetSnap.exists() ? { uid: targetSnap.id, ...targetSnap.data() } : null;
  if (!canFollowProfile(actorUid, target)) throw codedError('relationship/invalid-target');
  const data = { followerUid: actorUid, targetUid, createdAt: serverTimestamp() };
  const batch = writeBatch(db);
  batch.set(doc(db, 'users', targetUid, 'followers', actorUid), data);
  batch.set(doc(db, 'users', actorUid, 'following', targetUid), data);
  await batch.commit();
}

export async function unfollowProfile(actorUid, targetUid) {
  if (!actorUid || !targetUid || actorUid === targetUid) throw codedError('relationship/invalid-target');
  const batch = writeBatch(db);
  batch.delete(doc(db, 'users', targetUid, 'followers', actorUid));
  batch.delete(doc(db, 'users', actorUid, 'following', targetUid));
  await batch.commit();
}

import { collection, doc, getDoc, onSnapshot, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from './config';
import { canFollowProfile, canRequestFollowProfile } from './relationshipModel';

const codedError = (code) => Object.assign(new Error(code), { code });

export function subscribeToFollowState(actorUid, targetUid, next, error) {
  if (!actorUid || !targetUid || actorUid === targetUid) {
    next(false);
    return () => {};
  }
  return onSnapshot(doc(db, 'users', actorUid, 'following', targetUid), (snap) => next(snap.exists()), error);
}

export function subscribeToFollowRequestState(actorUid, targetUid, next, error) {
  if (!actorUid || !targetUid || actorUid === targetUid) {
    next(false);
    return () => {};
  }
  return onSnapshot(doc(db, 'users', targetUid, 'followRequests', actorUid), (snap) => next(snap.exists()), error);
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
  const notificationRef = doc(db, 'users', targetUid, 'notifications', `follow_${actorUid}`);
  const [targetSnap, actorSnap, notificationSnap] = await Promise.all([
    getDoc(doc(db, 'users', targetUid)),
    getDoc(doc(db, 'users', actorUid)),
    getDoc(notificationRef),
  ]);
  const target = targetSnap.exists() ? { uid: targetSnap.id, ...targetSnap.data() } : null;
  if (!canFollowProfile(actorUid, target)) throw codedError('relationship/invalid-target');
  if (!actorSnap.exists()) throw codedError('relationship/invalid-actor');
  const actor = actorSnap.data();
  const data = { followerUid: actorUid, targetUid, createdAt: serverTimestamp() };
  const batch = writeBatch(db);
  batch.set(doc(db, 'users', targetUid, 'followers', actorUid), data);
  batch.set(doc(db, 'users', actorUid, 'following', targetUid), data);
  if (!notificationSnap.exists()) batch.set(notificationRef, {
    type: 'follow', actorUid, actorName: actor.displayName, actorUsername: actor.usernameLower,
    targetUid, postId: '', read: false, createdAt: serverTimestamp(), readAt: null,
  });
  await batch.commit();
}

export async function requestFollowProfile(actorUid, targetUid) {
  if (!actorUid || !targetUid || actorUid === targetUid) throw codedError('relationship/invalid-target');
  const requestRef = doc(db, 'users', targetUid, 'followRequests', actorUid);
  const notificationRef = doc(db, 'users', targetUid, 'notifications', `follow_request_${actorUid}`);
  const [targetSnap, actorSnap, requestSnap, notificationSnap] = await Promise.all([
    getDoc(doc(db, 'users', targetUid)),
    getDoc(doc(db, 'users', actorUid)),
    getDoc(requestRef),
    getDoc(notificationRef),
  ]);
  const target = targetSnap.exists() ? { uid: targetSnap.id, ...targetSnap.data() } : null;
  if (!canRequestFollowProfile(actorUid, target)) throw codedError('relationship/invalid-target');
  if (!actorSnap.exists()) throw codedError('relationship/invalid-actor');
  if (requestSnap.exists()) throw codedError('relationship/request-exists');
  const actor = actorSnap.data();
  const batch = writeBatch(db);
  batch.set(requestRef, { requesterUid: actorUid, targetUid, createdAt: serverTimestamp() });
  if (!notificationSnap.exists()) batch.set(notificationRef, {
    type: 'follow_request', actorUid, actorName: actor.displayName, actorUsername: actor.usernameLower,
    targetUid, postId: '', read: false, createdAt: serverTimestamp(), readAt: null,
  });
  await batch.commit();
}

export async function cancelFollowRequest(actorUid, targetUid) {
  if (!actorUid || !targetUid || actorUid === targetUid) throw codedError('relationship/invalid-target');
  const batch = writeBatch(db);
  batch.delete(doc(db, 'users', targetUid, 'followRequests', actorUid));
  batch.delete(doc(db, 'users', targetUid, 'notifications', `follow_request_${actorUid}`));
  await batch.commit();
}

export async function acceptFollowRequest(targetUid, requesterUid) {
  if (!targetUid || !requesterUid || targetUid === requesterUid) throw codedError('relationship/invalid-target');
  const requestRef = doc(db, 'users', targetUid, 'followRequests', requesterUid);
  const [requestSnap, targetSnap] = await Promise.all([getDoc(requestRef), getDoc(doc(db, 'users', targetUid))]);
  if (!requestSnap.exists()) throw codedError('relationship/request-missing');
  if (!targetSnap.exists()) throw codedError('relationship/invalid-target');
  const target = targetSnap.data();
  const relationship = { followerUid: requesterUid, targetUid, createdAt: serverTimestamp() };
  const acceptedNotification = doc(collection(db, 'users', requesterUid, 'notifications'));
  const batch = writeBatch(db);
  batch.set(doc(db, 'users', targetUid, 'followers', requesterUid), relationship);
  batch.set(doc(db, 'users', requesterUid, 'following', targetUid), relationship);
  batch.delete(requestRef);
  batch.delete(doc(db, 'users', targetUid, 'notifications', `follow_request_${requesterUid}`));
  batch.set(acceptedNotification, {
    type: 'follow_accepted', actorUid: targetUid, actorName: target.displayName,
    actorUsername: target.usernameLower, targetUid: requesterUid, postId: '',
    read: false, createdAt: serverTimestamp(), readAt: null,
  });
  await batch.commit();
}

export async function rejectFollowRequest(targetUid, requesterUid) {
  if (!targetUid || !requesterUid || targetUid === requesterUid) throw codedError('relationship/invalid-target');
  const batch = writeBatch(db);
  batch.delete(doc(db, 'users', targetUid, 'followRequests', requesterUid));
  batch.delete(doc(db, 'users', targetUid, 'notifications', `follow_request_${requesterUid}`));
  await batch.commit();
}

export async function unfollowProfile(actorUid, targetUid) {
  if (!actorUid || !targetUid || actorUid === targetUid) throw codedError('relationship/invalid-target');
  const notificationRef = doc(db, 'users', targetUid, 'notifications', `follow_${actorUid}`);
  const notificationSnap = await getDoc(notificationRef);
  const batch = writeBatch(db);
  batch.delete(doc(db, 'users', targetUid, 'followers', actorUid));
  batch.delete(doc(db, 'users', actorUid, 'following', targetUid));
  if (notificationSnap.exists()) batch.delete(notificationRef);
  await batch.commit();
}

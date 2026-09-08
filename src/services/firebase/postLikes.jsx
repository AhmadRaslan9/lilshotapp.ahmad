import { doc, getDoc, increment, onSnapshot, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from './config';

const codedError = (code) => Object.assign(new Error(code), { code });

export function subscribeToPostLike(postId, userUid, next, error) {
  if (!postId || !userUid || userUid === 'demo-local') { next(false); return () => {}; }
  return onSnapshot(doc(db, 'posts', postId, 'likes', userUid), (snap) => next(snap.exists()), error);
}

export async function likePost(postId, userUid) {
  if (!postId || !userUid || userUid === 'demo-local') throw codedError('like/not-authenticated');
  const postSnap = await getDoc(doc(db, 'posts', postId));
  if (!postSnap.exists()) throw codedError('like/post-missing');
  const post = postSnap.data();
  const notificationRef = doc(db, 'users', post.authorUid, 'notifications', `like_${postId}_${userUid}`);
  const [actorSnap, notificationSnap] = await Promise.all([getDoc(doc(db, 'users', userUid)), getDoc(notificationRef)]);
  if (!actorSnap.exists()) throw codedError('like/actor-missing');
  const actor = actorSnap.data();
  const batch = writeBatch(db);
  batch.set(doc(db, 'posts', postId, 'likes', userUid), { postId, userUid, createdAt: serverTimestamp() });
  batch.update(doc(db, 'posts', postId), { likesCount: increment(1), updatedAt: serverTimestamp() });
  if (post.authorUid !== userUid && !notificationSnap.exists()) batch.set(notificationRef, {
    type: 'like', actorUid: userUid, actorName: actor.displayName, actorUsername: actor.usernameLower,
    targetUid: post.authorUid, postId, read: false, createdAt: serverTimestamp(), readAt: null,
  });
  await batch.commit();
}

export async function unlikePost(postId, userUid) {
  if (!postId || !userUid || userUid === 'demo-local') throw codedError('like/not-authenticated');
  const postSnap = await getDoc(doc(db, 'posts', postId));
  if (!postSnap.exists()) throw codedError('like/post-missing');
  const post = postSnap.data();
  const notificationRef = doc(db, 'users', post.authorUid, 'notifications', `like_${postId}_${userUid}`);
  const notificationSnap = post.authorUid === userUid ? null : await getDoc(notificationRef);
  const batch = writeBatch(db);
  batch.delete(doc(db, 'posts', postId, 'likes', userUid));
  batch.update(doc(db, 'posts', postId), { likesCount: increment(-1), updatedAt: serverTimestamp() });
  if (notificationSnap?.exists()) batch.delete(notificationRef);
  await batch.commit();
}

export function likeErrorMessage(error) {
  if (error?.code === 'permission-denied') return 'لم تسمح قواعد Firebase بتحديث الإعجاب.';
  return 'تعذّر تحديث الإعجاب. تحقق من الاتصال وجرّب مجددًا.';
}

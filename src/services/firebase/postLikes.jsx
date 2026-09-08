import { doc, increment, onSnapshot, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from './config';

const codedError = (code) => Object.assign(new Error(code), { code });

export function subscribeToPostLike(postId, userUid, next, error) {
  if (!postId || !userUid || userUid === 'demo-local') { next(false); return () => {}; }
  return onSnapshot(doc(db, 'posts', postId, 'likes', userUid), (snap) => next(snap.exists()), error);
}

export async function likePost(postId, userUid) {
  if (!postId || !userUid || userUid === 'demo-local') throw codedError('like/not-authenticated');
  const batch = writeBatch(db);
  batch.set(doc(db, 'posts', postId, 'likes', userUid), { postId, userUid, createdAt: serverTimestamp() });
  batch.update(doc(db, 'posts', postId), { likesCount: increment(1), updatedAt: serverTimestamp() });
  await batch.commit();
}

export async function unlikePost(postId, userUid) {
  if (!postId || !userUid || userUid === 'demo-local') throw codedError('like/not-authenticated');
  const batch = writeBatch(db);
  batch.delete(doc(db, 'posts', postId, 'likes', userUid));
  batch.update(doc(db, 'posts', postId), { likesCount: increment(-1), updatedAt: serverTimestamp() });
  await batch.commit();
}

export function likeErrorMessage(error) {
  if (error?.code === 'permission-denied') return 'لم تسمح قواعد Firebase بتحديث الإعجاب.';
  return 'تعذّر تحديث الإعجاب. تحقق من الاتصال وجرّب مجددًا.';
}

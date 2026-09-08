import { addDoc, collection, deleteDoc, doc, limit, onSnapshot, query, serverTimestamp, where } from 'firebase/firestore';
import { db } from './config';
import { canPublishPermanentPost, normalizePostInput, toFeedPost, validatePostInput } from './postModel';

const codedError = (code) => Object.assign(new Error(code), { code });

export async function createPost(profile, input) {
  const error = validatePostInput(input);
  if (error) throw codedError(error);
  if (!canPublishPermanentPost(profile)) throw codedError('post/not-eligible');
  const post = normalizePostInput(input);
  return addDoc(collection(db, 'posts'), {
    authorUid: profile.uid,
    authorName: profile.displayName,
    authorUsername: profile.usernameLower,
    authorPhotoURL: profile.photoURL || '',
    authorVerified: Boolean(profile.verified),
    authorType: profile.accountType,
    imageURL: post.imageURL,
    caption: post.caption,
    locationName: post.locationName,
    visibility: 'public',
    status: 'published',
    likesCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export function subscribeToPublicPosts(next, error) {
  const postsQuery = query(collection(db, 'posts'), where('status', '==', 'published'), where('visibility', '==', 'public'), limit(50));
  return onSnapshot(postsQuery, (snap) => next(snap.docs.map((item) => toFeedPost(item.id, item.data())).filter((item) => item.image).sort((a, b) => b.createdAtMs - a.createdAtMs).slice(0, 30)), error);
}

export function subscribeToUserPosts(uid, next, error) {
  if (!uid) { next([]); return () => {}; }
  const postsQuery = query(collection(db, 'posts'), where('authorUid', '==', uid), limit(50));
  return onSnapshot(postsQuery, (snap) => next(snap.docs.map((item) => toFeedPost(item.id, item.data())).sort((a, b) => b.createdAtMs - a.createdAtMs).slice(0, 30)), error);
}

export const deletePost = (postId) => deleteDoc(doc(db, 'posts', postId));

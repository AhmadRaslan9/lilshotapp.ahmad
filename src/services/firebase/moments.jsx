import { addDoc, collection, deleteDoc, doc, limit, onSnapshot, query, serverTimestamp, Timestamp, where } from 'firebase/firestore';
import { db } from './config';
import { activeMoments, canPublishMoment, momentDurationHours, normalizeMomentInput, toMomentCard, validateMomentInput } from './momentModel';

const codedError = (code) => Object.assign(new Error(code), { code });

export async function createMoment(profile, input) {
  const validationError = validateMomentInput(input);
  if (validationError) throw codedError(validationError);
  if (!canPublishMoment(profile)) throw codedError('moment/not-eligible');
  const value = normalizeMomentInput(input);
  const durationHours = momentDurationHours(profile);
  return addDoc(collection(db, 'moments'), {
    authorUid: profile.uid,
    authorName: profile.displayName,
    authorUsername: profile.usernameLower || profile.username,
    authorPhotoURL: profile.photoURL || '',
    authorVerified: Boolean(profile.verified),
    authorType: profile.accountType,
    imageURL: value.imageURL,
    caption: value.caption,
    locationName: value.locationName,
    visibility: profile.privacy === 'private' ? 'followers' : 'public',
    status: 'active',
    durationHours,
    expiresAt: Timestamp.fromMillis(Date.now() + durationHours * 60 * 60 * 1000),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

const mapSnapshot = (snapshot) => activeMoments(snapshot.docs
  .map((item) => toMomentCard(item.id, item.data()))
  .filter((item) => item.image)
  .sort((a, b) => b.createdAtMs - a.createdAtMs));

export function subscribeToPublicMoments(next, error) {
  const momentsQuery = query(collection(db, 'moments'), where('status', '==', 'active'), where('visibility', '==', 'public'), limit(100));
  return onSnapshot(momentsQuery, (snapshot) => next(mapSnapshot(snapshot).slice(0, 50)), error);
}

export function subscribeToOwnMoments(uid, next, error) {
  if (!uid) { next([]); return () => {}; }
  const momentsQuery = query(collection(db, 'moments'), where('authorUid', '==', uid), limit(50));
  return onSnapshot(momentsQuery, (snapshot) => next(mapSnapshot(snapshot).slice(0, 30)), error);
}

export function subscribeToVisibleUserMoments(uid, visibility, next, error) {
  if (!uid) { next([]); return () => {}; }
  const momentsQuery = query(collection(db, 'moments'), where('authorUid', '==', uid), where('status', '==', 'active'), where('visibility', '==', visibility === 'followers' ? 'followers' : 'public'), limit(50));
  return onSnapshot(momentsQuery, (snapshot) => next(mapSnapshot(snapshot).slice(0, 30)), error);
}

export const deleteMoment = (momentId) => deleteDoc(doc(db, 'moments', momentId));

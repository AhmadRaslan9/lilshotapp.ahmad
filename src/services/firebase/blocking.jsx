import { collection, doc, onSnapshot, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from './config';
import { toBlockedProfile } from './blockingModel';

const codedError = (code) => Object.assign(new Error(code), { code });

export function subscribeToBlocks(uid, next, error) {
  if (!uid) { next([]); return () => {}; }
  return onSnapshot(collection(db, 'users', uid, 'blocks'), (snapshot) => {
    next(snapshot.docs.map((item) => toBlockedProfile(item.id, item.data())));
  }, error);
}

export function subscribeToBlockedBy(uid, next, error) {
  if (!uid) { next([]); return () => {}; }
  return onSnapshot(collection(db, 'users', uid, 'blockedBy'), (snapshot) => {
    next(snapshot.docs.map((item) => item.data().blockerUid || item.id));
  }, error);
}

export async function blockProfile(blockerUid, profile) {
  const blockedUid = profile?.uid || profile?.id;
  if (!blockerUid || !blockedUid || blockerUid === blockedUid) throw codedError('blocking/invalid-target');
  const data = {
    blockerUid,
    blockedUid,
    blockedName: profile.displayName || profile.name || 'حساب LilShot',
    blockedUsername: profile.usernameLower || profile.username || profile.handle || '',
    blockedPhotoURL: profile.photoURL || profile.logoURL || '',
    blockedType: profile.accountType === 'cafe' || profile.type === 'cafe' ? 'cafe' : 'user',
    createdAt: serverTimestamp(),
  };
  const batch = writeBatch(db);
  batch.set(doc(db, 'users', blockerUid, 'blocks', blockedUid), data);
  batch.set(doc(db, 'users', blockedUid, 'blockedBy', blockerUid), data);

  // Remove follows and pending requests in both directions in the same atomic write.
  batch.delete(doc(db, 'users', blockerUid, 'following', blockedUid));
  batch.delete(doc(db, 'users', blockedUid, 'followers', blockerUid));
  batch.delete(doc(db, 'users', blockedUid, 'following', blockerUid));
  batch.delete(doc(db, 'users', blockerUid, 'followers', blockedUid));
  batch.delete(doc(db, 'users', blockedUid, 'followRequests', blockerUid));
  batch.delete(doc(db, 'users', blockerUid, 'followRequests', blockedUid));
  await batch.commit();
}

export async function unblockProfile(blockerUid, blockedUid) {
  if (!blockerUid || !blockedUid || blockerUid === blockedUid) throw codedError('blocking/invalid-target');
  const batch = writeBatch(db);
  batch.delete(doc(db, 'users', blockerUid, 'blocks', blockedUid));
  batch.delete(doc(db, 'users', blockedUid, 'blockedBy', blockerUid));
  await batch.commit();
}

export function blockingErrorMessage(error) {
  if (error?.code === 'permission-denied') return 'تعذّر تنفيذ الحظر. تأكد من نشر قواعد Firestore الجديدة.';
  if (error?.code === 'blocking/invalid-target') return 'لا يمكن حظر هذا الحساب.';
  return 'تعذّر تحديث قائمة الحظر. تحقق من الاتصال وجرّب مجددًا.';
}

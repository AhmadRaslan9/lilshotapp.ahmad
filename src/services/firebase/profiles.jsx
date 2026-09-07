import { doc, onSnapshot, runTransaction, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from './config';
import { normalizeUsername, validateProfileInput } from './profileModel';

const codedError = (code) => Object.assign(new Error(code), { code });

export const subscribeToProfile = (uid, next, error) => onSnapshot(doc(db, 'users', uid), (snap) => next(snap.exists() ? { id: snap.id, ...snap.data() } : null), error);

export async function createUserProfile(user, input) {
  const validationError = validateProfileInput(input);
  if (validationError) throw codedError(validationError);
  const username = normalizeUsername(input.username);
  const userRef = doc(db, 'users', user.uid);
  const usernameRef = doc(db, 'usernames', username);
  await runTransaction(db, async (transaction) => {
    const profileSnap = await transaction.get(userRef);
    const usernameSnap = await transaction.get(usernameRef);
    if (profileSnap.exists()) throw codedError('profile/already-exists');
    if (usernameSnap.exists()) throw codedError('profile/username-taken');
    const cafe = input.accountType === 'cafe';
    transaction.set(usernameRef, { ownerUid: user.uid, createdAt: serverTimestamp() });
    transaction.set(userRef, {
      uid: user.uid, displayName: input.displayName.trim(), username, usernameLower: username,
      accountType: input.accountType, privacy: input.privacy, role: 'user',
      plan: cafe ? 'cafe_pending' : 'free', accountStatus: cafe ? 'pending_subscription' : 'active',
      verified: false, points: 0, followersCount: 0, followingCount: 0,
      postsCount: 0, momentsCount: 0, bio: cafe ? 'مقهى جديد على LilShot' : 'كل كوب، حكاية جديدة.',
      photoURL: user.photoURL || '', createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
    });
  });
}

export async function updateUserProfile(uid, changes) {
  const safe = Object.fromEntries(Object.entries(changes).filter(([key]) => ['displayName', 'bio', 'privacy'].includes(key)));
  if (safe.displayName) safe.displayName = safe.displayName.trim();
  await updateDoc(doc(db, 'users', uid), { ...safe, updatedAt: serverTimestamp() });
}

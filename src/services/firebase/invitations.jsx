import { collection, doc, getDocs, onSnapshot, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from './config';
import { createInviteCode, INVITE_LIMIT } from './invitationModel';

const invitesRef = (uid) => collection(db, 'users', uid, 'invites');
export function subscribeToInvites(uid, next, error) {
  return onSnapshot(invitesRef(uid), (snapshot) => next(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })).sort((a, b) => a.slot - b.slot)), error);
}
export async function ensureAccountInvites(uid) {
  const existing = await getDocs(invitesRef(uid));
  const existingSlots = new Set(existing.docs.map((item) => item.id));
  const batch = writeBatch(db);
  for (let slot = 1; slot <= INVITE_LIMIT; slot += 1) {
    if (existingSlots.has(String(slot))) continue;
    batch.set(doc(db, 'users', uid, 'invites', String(slot)), {
      ownerUid: uid, slot, code: createInviteCode(uid, slot), status: 'active', usedByUid: '', createdAt: serverTimestamp(), usedAt: null,
    }, { merge: false });
  }
  await batch.commit();
}

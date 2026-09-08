import { doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './config';
import { normalizeStoreDetails, validateStoreDetails } from './storeModel';

const codedError = (code) => Object.assign(new Error(code), { code });
const storeRef = (cafeUid) => doc(db, 'cafes', cafeUid);

export function subscribeToStoreDetails(cafeUid, next, error) {
  return onSnapshot(storeRef(cafeUid), (snapshot) => next(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null), error);
}

export async function saveStoreDetails(cafeUid, input) {
  const validationError = validateStoreDetails(input);
  if (validationError) throw codedError(validationError);
  const details = normalizeStoreDetails(input);
  const ref = storeRef(cafeUid);
  const snapshot = await getDoc(ref);
  if (snapshot.exists()) {
    await updateDoc(ref, { ...details, ownerUid: cafeUid, updatedAt: serverTimestamp() });
  } else {
    await setDoc(ref, { ...details, ownerUid: cafeUid, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  }
}

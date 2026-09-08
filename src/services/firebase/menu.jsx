import { addDoc, collection, deleteDoc, doc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from './config';
import { normalizeMenuItem, validateMenuItem } from './menuModel';

const codedError = (code) => Object.assign(new Error(code), { code });
const menuCollection = (cafeUid) => collection(db, 'cafes', cafeUid, 'menuItems');

export function subscribeToCafeMenu(cafeUid, next, error) {
  return onSnapshot(menuCollection(cafeUid), (snapshot) => {
    const items = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    items.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0) || String(a.name).localeCompare(String(b.name), 'ar'));
    next(items);
  }, error);
}

export async function createMenuItem(cafeUid, input) {
  const validationError = validateMenuItem(input);
  if (validationError) throw codedError(validationError);
  const item = normalizeMenuItem(input);
  return addDoc(menuCollection(cafeUid), {
    ...item,
    ownerUid: cafeUid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateMenuItem(cafeUid, itemId, input) {
  const validationError = validateMenuItem(input);
  if (validationError) throw codedError(validationError);
  const item = normalizeMenuItem(input);
  return updateDoc(doc(db, 'cafes', cafeUid, 'menuItems', itemId), {
    ...item,
    ownerUid: cafeUid,
    updatedAt: serverTimestamp(),
  });
}

export const removeMenuItem = (cafeUid, itemId) => deleteDoc(doc(db, 'cafes', cafeUid, 'menuItems', itemId));

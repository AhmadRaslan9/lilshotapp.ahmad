// src/services/firebase/firestore.js
//
// دوال جاهزة لقراءة/كتابة بيانات المتجر والمفضلة من Firestore.
// بنية المجموعات (Collections) المقترحة:
//
//   tours/{tourId}         -> { title, subtitle, price, duration, tag, image }
//   products/{productId}   -> { title, category, price, rating, image }
//   users/{uid}             -> { name, email, avatarUrl }
//   users/{uid}/favorites/{itemId} -> { type: 'tour' | 'product', addedAt }
//
// إلى حين ربط المشروع الفعلي بمفاتيح Firebase، تُستخدم البيانات
// التجريبية في src/data كمصدر احتياطي (انظر useTours / useProducts).

import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';

export { isFirebaseConfigured };

export async function fetchTours() {
  if (!isFirebaseConfigured || !db) return null; // null = استخدم البيانات المحلية
  const snapshot = await getDocs(collection(db, 'tours'));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function fetchProducts() {
  if (!isFirebaseConfigured || !db) return null;
  const snapshot = await getDocs(collection(db, 'products'));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/** يشترك بقائمة مفضلة المستخدم مباشرة (real-time). */
export function subscribeToFavorites(uid, callback) {
  if (!isFirebaseConfigured || !db || !uid) return () => {};
  const ref = collection(db, 'users', uid, 'favorites');
  return onSnapshot(ref, (snapshot) => {
    callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function addFavorite(uid, item) {
  if (!isFirebaseConfigured || !db || !uid) return;
  const ref = doc(db, 'users', uid, 'favorites', item.id);
  await setDoc(ref, {
    type: item.type,
    title: item.title,
    price: item.price,
    image: item.image,
    addedAt: serverTimestamp(),
  });
}

export async function removeFavorite(uid, itemId) {
  if (!isFirebaseConfigured || !db || !uid) return;
  const ref = doc(db, 'users', uid, 'favorites', itemId);
  await deleteDoc(ref);
}

export async function saveUserProfile(uid, profile) {
  if (!isFirebaseConfigured || !db || !uid) return;
  const ref = doc(db, 'users', uid);
  await setDoc(ref, profile, { merge: true });
}

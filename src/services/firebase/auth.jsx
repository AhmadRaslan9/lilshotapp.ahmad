// src/services/firebase/auth.js
//
// طبقة رفيعة فوق Firebase Auth حتى لا تتعامل الشاشات مع SDK مباشرة.
// كل دالة تُرجع بيانات واضحة أو تُطلق Error برسالة مفهومة يمكن عرضها
// للمستخدم كما هي.

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './config';

function assertConfigured() {
  if (!isFirebaseConfigured || !auth) {
    throw new Error(
      'لم يتم ربط Firebase بعد. أضف مفاتيح المشروع في ملف .env (راجع .env.example).'
    );
  }
}

/** يشترك بتغيّرات حالة المستخدم (تسجيل دخول/خروج). يُرجع دالة إلغاء الاشتراك. */
export function subscribeToAuthChanges(callback) {
  if (!isFirebaseConfigured || !auth) {
    // بدون Firebase: اعتبر المستخدم غير مسجل دخول دائماً
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export async function signUpWithEmail({ email, password, username }) {
  assertConfigured();
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (username) {
    await updateProfile(credential.user, { displayName: username });
  }
  return credential.user;
}

export async function signInWithEmail({ email, password }) {
  assertConfigured();
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function signOutUser() {
  assertConfigured();
  await signOut(auth);
}

export async function resetPassword(email) {
  assertConfigured();
  await sendPasswordResetEmail(auth, email);
}

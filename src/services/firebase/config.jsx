// src/services/firebase/config.js
//
// تهيئة Firebase للتطبيق. القيم تُقرأ من متغيرات البيئة العامة الخاصة
// بـ Expo (كل متغير يبدأ بـ EXPO_PUBLIC_ يتم تضمينه تلقائياً في الحزمة
// عند البناء - لا حاجة لأي مكتبة إضافية مثل react-native-dotenv).
//
// خطوات الربط الفعلي:
// 1) أنشئ مشروع Firebase من console.firebase.google.com
// 2) فعّل Authentication (Email/Password) و Firestore Database
// 3) انسخ ملف .env.example إلى .env واملأ القيم من إعدادات المشروع
//
// ملاحظة: هذا المشروع يعمل كتطبيق ويب (عبر Vite + react-native-web)،
// لذلك نستخدم آلية التخزين الخاصة بالمتصفح (browserLocalPersistence)
// بدل getReactNativePersistence الخاصة بتطبيقات الموبايل الأصلية.
//
// إلى أن يتم تعبئة القيم، تبقى دوال auth.js و firestore.js تعمل بوضع
// آمن (تُطلق خطأً واضحاً) بدل تعطيل التطبيق بالكامل عند التشغيل بدون Firebase.

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  browserLocalPersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let app;
let auth;
let db;

if (isFirebaseConfigured) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);

  try {
    auth = initializeAuth(app, {
      persistence: browserLocalPersistence,
    });
  } catch (e) {
    // initializeAuth تُطلق خطأً إذا استُدعيت أكثر من مرة (Fast Refresh)
    auth = getAuth(app);
  }

  db = getFirestore(app);
} else {
  // eslint-disable-next-line no-console
  console.warn(
    '[firebase] لم يتم ضبط متغيرات البيئة بعد — راجع .env.example. ' +
      'التطبيق سيعمل ببيانات تجريبية محلية إلى حين الربط.'
  );
}

export { app, auth, db };
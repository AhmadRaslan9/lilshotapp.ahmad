// Current Vite/web entry uses browser persistence. Native persistence is a
// separate iOS setup task. Firebase initialization does not provision services.
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { resolveFirebaseConfig } from './clientConfig.js';

export const firebaseConfig = resolveFirebaseConfig({
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
});

// Means client configuration is present, not that a live connection was verified.
export const isFirebaseConfigured = true;

const app = getApps().some((entry) => entry.name === '[DEFAULT]')
  ? getApp()
  : initializeApp(firebaseConfig);

let auth;
try {
  auth = initializeAuth(app, { persistence: browserLocalPersistence });
} catch (error) {
  // Reuse Auth during hot reload; do not hide unrelated initialization errors.
  if (error.code !== 'auth/already-initialized') throw error;
  auth = getAuth(app);
}

const db = getFirestore(app);
const storage = getStorage(app);

// Realtime Database and Analytics are not started merely because config has IDs.
export { app, auth, db, storage };

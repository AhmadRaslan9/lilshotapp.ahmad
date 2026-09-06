// Public Firebase client identifiers supplied by the project owner.
// These identify the app; authorization is enforced by Firebase Security Rules.
export const defaultFirebaseConfig = Object.freeze({
  apiKey: "AIzaSyALpO1GGKFg1IOwm4sQ66XsH9qdYuLDdzU",
  authDomain: "lilshot-dbfe1.firebaseapp.com",
  databaseURL: "https://lilshot-dbfe1-default-rtdb.firebaseio.com",
  projectId: "lilshot-dbfe1",
  storageBucket: "lilshot-dbfe1.firebasestorage.app",
  messagingSenderId: "261941235464",
  appId: "1:261941235464:web:a74f36cc2418db1c8126bd",
  measurementId: "G-K0B9EJ7TEG",
});

const requiredKeys = [
  'apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId',
];

// Select a complete environment config, never mix credentials from two projects.
// Blank .env.example values leave the bundled configuration in use.
export function resolveFirebaseConfig(overrides = {}) {
  const provided = Object.fromEntries(
    Object.entries(overrides).filter(([, value]) => typeof value === 'string' && value.trim())
      .map(([key, value]) => [key, value.trim()])
  );
  if (!Object.keys(provided).length) return { ...defaultFirebaseConfig };
  const missing = requiredKeys.filter((key) => !provided[key]);
  if (missing.length) {
    throw new Error('Incomplete Firebase environment configuration: ' + missing.join(', '));
  }
  return provided;
}

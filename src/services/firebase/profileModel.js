export const normalizeUsername = (value = '') => value.trim().replace(/^@+/, '').toLowerCase();

export function validateProfileInput({ displayName, username, accountType, privacy }) {
  const normalized = normalizeUsername(username);
  if ((displayName?.trim().length || 0) < 2 || displayName.trim().length > 40) return 'profile/invalid-name';
  if (!/^[a-z0-9_][a-z0-9_.]{1,18}[a-z0-9_]$/.test(normalized) || normalized.includes('..')) return 'profile/invalid-username';
  if (!['user', 'cafe'].includes(accountType)) return 'profile/invalid-account-type';
  if (!['public', 'private'].includes(privacy)) return 'profile/invalid-privacy';
  return null;
}

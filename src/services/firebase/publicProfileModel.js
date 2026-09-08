export function toPublicProfile(id, data = {}) {
  return {
    uid: data.uid || id,
    displayName: String(data.displayName || 'مستخدم LilShot').trim(),
    username: String(data.usernameLower || data.username || '').trim(),
    bio: String(data.bio || '').trim(),
    photoURL: String(data.photoURL || '').trim(),
    accountType: data.accountType === 'cafe' ? 'cafe' : 'user',
    privacy: data.privacy,
    accountStatus: data.accountStatus,
    verified: data.verified === true,
  };
}

export function filterPublicProfiles(profiles, search = '') {
  const needle = search.trim().toLowerCase().replace(/^@/, '');
  if (!needle) return [];
  return profiles.filter((profile) => `${profile.displayName} ${profile.username}`.toLowerCase().includes(needle));
}

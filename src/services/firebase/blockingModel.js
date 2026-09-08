export function toBlockedProfile(id, data = {}) {
  return {
    uid: data.blockedUid || id,
    displayName: data.blockedName || 'حساب LilShot',
    username: data.blockedUsername || '',
    photoURL: data.blockedPhotoURL || '',
    accountType: data.blockedType === 'cafe' ? 'cafe' : 'user',
  };
}

export function withoutBlocked(items = [], excludedIds = new Set(), uidKey = 'uid') {
  return items.filter((item) => !excludedIds.has(item?.[uidKey]));
}

export function toPublicCafe(profile = {}, details = {}) {
  const username = String(profile.username || '').trim();
  return {
    id: profile.uid || profile.id,
    name: String(profile.displayName || 'مقهى LilShot').trim(),
    latin: username ? username.toUpperCase() : 'LILSHOT CAFE',
    city: details.city || 'الرياض',
    district: details.district || 'الحي غير محدد',
    address: details.address || '',
    mapsURL: details.mapsURL || '',
    hours: details.hours || {},
    category: details.category || 'مقهى',
    tag: details.category || (profile.verified ? 'مقهى موثّق' : 'مقهى LilShot'),
    rating: 'جديد',
    reviews: 0,
    followers: String(profile.followersCount || 0),
    image: details.coverURL || profile.photoURL || null,
    logoURL: details.logoURL || profile.photoURL || null,
    description: String(details.description || profile.bio || 'مقهى جديد على LilShot').trim(),
    verified: profile.verified === true,
    plan: profile.plan,
    isLive: true,
  };
}

export function filterPublicCafes(cafes, query = '', city = 'الكل', category = 'الكل') {
  const needle = query.trim().toLowerCase();
  return cafes.filter((cafe) => (city === 'الكل' || cafe.city === city)
    && (category === 'الكل' || cafe.category === category)
    && (!needle || `${cafe.name} ${cafe.latin} ${cafe.description} ${cafe.district} ${cafe.address}`.toLowerCase().includes(needle)));
}

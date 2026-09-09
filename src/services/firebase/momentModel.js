import { hasActiveSubscription } from './subscriptionModel.js';

export const emptyMoment = { imageURL: '', caption: '', locationName: '' };

export function momentDurationHours(profile) {
  return hasActiveSubscription(profile) && (profile?.plan === 'plus' || profile?.plan === 'cafe_pro') ? 24 : 8;
}

export function canPublishMoment(profile) {
  if (!profile || profile.accountStatus !== 'active' || !['public', 'private'].includes(profile.privacy)) return false;
  if (profile.accountType === 'cafe') return hasActiveSubscription(profile) && ['cafe_basic', 'cafe_pro'].includes(profile.plan);
  return profile.accountType === 'user';
}

export function normalizeMomentInput(input = {}) {
  return {
    imageURL: String(input.imageURL || '').trim(),
    caption: String(input.caption || '').trim(),
    locationName: String(input.locationName || '').trim(),
  };
}

export function validateMomentInput(input = {}) {
  const value = normalizeMomentInput(input);
  if (!value.imageURL.startsWith('https://') || value.imageURL.length > 1000) return 'moment/invalid-image-url';
  if (value.caption.length < 1 || value.caption.length > 220) return 'moment/invalid-caption';
  if (value.locationName.length > 100) return 'moment/invalid-location';
  return null;
}

export function toMomentCard(id, data = {}) {
  return {
    id,
    kind: 'moment',
    isLiveMoment: true,
    authorUid: data.authorUid || '',
    author: data.authorName || 'مستخدم LilShot',
    handle: data.authorUsername || 'lilshot',
    initial: Array.from(data.authorName || 'L')[0],
    verified: Boolean(data.authorVerified),
    image: data.imageURL || '',
    caption: data.caption || '',
    note: data.locationName || '',
    durationHours: data.durationHours === 24 ? 24 : 8,
    expiresAt: data.expiresAt?.toMillis?.() || Number(data.expiresAtMs) || 0,
    createdAtMs: data.createdAt?.toMillis?.() || 0,
  };
}

export function activeMoments(items, now = Date.now()) {
  return items.filter((item) => item.expiresAt > now);
}

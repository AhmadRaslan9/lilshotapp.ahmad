import { hasActiveSubscription } from './subscriptionModel.js';

export const emptyPost = { imageURL: '', caption: '', locationName: '' };

export function normalizePostInput(input = {}) {
  return {
    imageURL: String(input.imageURL || '').trim(),
    caption: String(input.caption || '').trim(),
    locationName: String(input.locationName || '').trim(),
  };
}

export function validatePostInput(input) {
  const post = normalizePostInput(input);
  if (!post.imageURL.startsWith('https://') || post.imageURL.length > 1000) return 'post/invalid-image-url';
  if (post.caption.length < 1 || post.caption.length > 500) return 'post/invalid-caption';
  if (post.locationName.length > 100) return 'post/invalid-location';
  return null;
}

export function canPublishPermanentPost(profile) {
  if (!profile || profile.accountStatus !== 'active' || !hasActiveSubscription(profile) || !['public', 'private'].includes(profile.privacy)) return false;
  if (profile.accountType === 'cafe') return ['cafe_basic', 'cafe_pro'].includes(profile.plan);
  return profile.plan === 'plus';
}

export function toFeedPost(id, data = {}) {
  const createdAtMs = data.createdAt?.toMillis?.() || 0;
  return {
    id,
    kind: 'post',
    isLive: true,
    authorUid: data.authorUid,
    author: data.authorName || 'مستخدم LilShot',
    handle: data.authorUsername || 'lilshot',
    initial: Array.from(data.authorName || 'L')[0],
    verified: Boolean(data.authorVerified),
    caption: data.caption || '',
    note: data.locationName || '',
    image: data.imageURL || '',
    likes: Math.max(0, Number(data.likesCount) || 0),
    createdAtMs,
  };
}

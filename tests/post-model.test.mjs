import assert from 'node:assert/strict';
import test from 'node:test';
import { canPublishPermanentPost, normalizePostInput, toFeedPost, validatePostInput } from '../src/services/firebase/postModel.js';

test('post input is trimmed and requires a secure image URL', () => {
  const value = normalizePostInput({ imageURL: ' https://example.com/coffee.jpg ', caption: ' صباح الخير ', locationName: ' عمّان ' });
  assert.deepEqual(value, { imageURL: 'https://example.com/coffee.jpg', caption: 'صباح الخير', locationName: 'عمّان' });
  assert.equal(validatePostInput(value), null);
  assert.equal(validatePostInput({ ...value, imageURL: 'http://example.com/a.jpg' }), 'post/invalid-image-url');
});

test('active Plus users and active cafes can publish public or follower-only posts', () => {
  assert.equal(canPublishPermanentPost({ accountStatus: 'active', privacy: 'public', accountType: 'user', plan: 'plus' }), true);
  assert.equal(canPublishPermanentPost({ accountStatus: 'active', privacy: 'public', accountType: 'cafe', plan: 'cafe_basic' }), true);
  assert.equal(canPublishPermanentPost({ accountStatus: 'active', privacy: 'public', accountType: 'user', plan: 'free' }), false);
  assert.equal(canPublishPermanentPost({ accountStatus: 'active', privacy: 'private', accountType: 'user', plan: 'plus' }), true);
});

test('Firestore post maps safely to a feed card', () => {
  const post = toFeedPost('post-1', { authorUid: 'u1', authorName: 'أحمد', authorUsername: 'ahmad', imageURL: 'https://example.com/a.jpg', caption: 'لقطتي', likesCount: 7, createdAt: { toMillis: () => 123 } });
  assert.equal(post.id, 'post-1');
  assert.equal(post.kind, 'post');
  assert.equal(post.isLive, true);
  assert.equal(post.createdAtMs, 123);
  assert.equal(post.likes, 7);
  assert.equal(toFeedPost('post-2', { likesCount: -3 }).likes, 0);
});

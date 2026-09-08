import assert from 'node:assert/strict';
import test from 'node:test';
import { activeMoments, canPublishMoment, momentDurationHours, normalizeMomentInput, toMomentCard, validateMomentInput } from '../src/services/firebase/momentModel.js';

test('moment duration is 8 hours normally and 24 hours for Plus', () => {
  assert.equal(momentDurationHours({ plan: 'free' }), 8);
  assert.equal(momentDurationHours({ plan: 'plus' }), 24);
  assert.equal(momentDurationHours({ plan: 'cafe_pro' }), 24);
});

test('active users and subscribed cafes can publish moments', () => {
  assert.equal(canPublishMoment({ accountStatus: 'active', privacy: 'private', accountType: 'user', plan: 'free' }), true);
  assert.equal(canPublishMoment({ accountStatus: 'active', privacy: 'public', accountType: 'cafe', plan: 'cafe_basic' }), true);
  assert.equal(canPublishMoment({ accountStatus: 'pending_subscription', privacy: 'public', accountType: 'cafe', plan: 'cafe_pending' }), false);
});

test('moment input is normalized and validated', () => {
  const value = normalizeMomentInput({ imageURL: ' https://example.com/a.jpg ', caption: ' قهوتي ', locationName: ' عمّان ' });
  assert.deepEqual(value, { imageURL: 'https://example.com/a.jpg', caption: 'قهوتي', locationName: 'عمّان' });
  assert.equal(validateMomentInput(value), null);
  assert.equal(validateMomentInput({ ...value, imageURL: 'http://example.com/a.jpg' }), 'moment/invalid-image-url');
});

test('expired moments disappear and Firestore values map safely', () => {
  const card = toMomentCard('m1', { authorName: 'أحمد', durationHours: 24, imageURL: 'https://example.com/a.jpg', expiresAt: { toMillis: () => 1001 } });
  assert.equal(card.kind, 'moment');
  assert.equal(card.durationHours, 24);
  assert.deepEqual(activeMoments([card], 1000).map((item) => item.id), ['m1']);
  assert.deepEqual(activeMoments([card], 1001), []);
});

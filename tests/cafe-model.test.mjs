import assert from 'node:assert/strict';
import test from 'node:test';
import { filterPublicCafes, toPublicCafe } from '../src/services/firebase/cafeModel.js';

test('active profile is mapped to a public cafe card without private auth data', () => {
  const cafe = toPublicCafe({ uid: 'cafe-1', displayName: 'رواق', username: 'riwaq', bio: 'قهوة مختصة', verified: true, followersCount: 7, plan: 'cafe_pro', email: 'private@example.com' });
  assert.equal(cafe.id, 'cafe-1');
  assert.equal(cafe.name, 'رواق');
  assert.equal(cafe.verified, true);
  assert.equal(cafe.followers, '7');
  assert.equal('email' in cafe, false);
});

test('public cafe search matches Arabic name and Latin username', () => {
  const cafes = [toPublicCafe({ uid: '1', displayName: 'رواق', username: 'riwaq' }, { city: 'الرياض', category: 'قهوة مختصة' }), toPublicCafe({ uid: '2', displayName: 'نواة', username: 'nawa' }, { city: 'جدة', category: 'مقهى' })];
  assert.deepEqual(filterPublicCafes(cafes, 'RIWAQ').map((cafe) => cafe.id), ['1']);
  assert.deepEqual(filterPublicCafes(cafes, 'نواة').map((cafe) => cafe.id), ['2']);
  assert.deepEqual(filterPublicCafes(cafes, '', 'جدة', 'مقهى').map((cafe) => cafe.id), ['2']);
});

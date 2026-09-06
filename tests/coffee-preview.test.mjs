import test from 'node:test';
import assert from 'node:assert/strict';
import { visibleShots, filterCafes, remainingLabel } from '../src/data/coffeePreview.js';

test('a moment disappears at its expiry boundary; permanent demo posts remain', () => {
  const shots = [
    { id: 'expired', kind: 'moment', expiresAt: 999 },
    { id: 'boundary', kind: 'moment', expiresAt: 1000 },
    { id: 'live', kind: 'moment', expiresAt: 1001 },
    { id: 'post', kind: 'post' },
  ];
  assert.deepEqual(visibleShots(shots, 'all', null, 1000).map(s => s.id), ['live', 'post']);
  assert.equal(shots.length, 4);
});

test('author and content filters combine without bringing expired moments back', () => {
  const shots = [
    { id: 'a', handle: 'lina', kind: 'post' },
    { id: 'b', handle: 'omar', kind: 'post' },
    { id: 'c', handle: 'lina', kind: 'moment', expiresAt: 10 },
  ];
  assert.deepEqual(visibleShots(shots, 'post', 'lina', 20).map(s => s.id), ['a']);
  assert.deepEqual(visibleShots(shots, 'moment', 'lina', 20), []);
});

test('café search respects city, category, Arabic district and Latin names', () => {
  const cafes = [
    { id: 1, name: 'رِواق', latin: 'RIWAQ COFFEE', city: 'الرياض', district: 'حطين', tag: 'قهوة مختصة' },
    { id: 2, name: 'ظل', latin: 'DHILL', city: 'جدة', district: 'الروضة', tag: 'جلسات خارجية' },
  ];
  assert.deepEqual(filterCafes(cafes, 'الرياض', 'الكل', ' riwaq ').map(c => c.id), [1]);
  assert.equal(filterCafes(cafes, 'الرياض', 'قهوة مختصة', 'حطين').length, 1);
  assert.equal(filterCafes(cafes, 'الرياض', 'جلسات خارجية', '').length, 0);
  assert.equal(filterCafes(cafes, 'الخبر', 'الكل', '').length, 0);
});

test('remaining time is nonnegative and changes to minutes before the final hour', () => {
  assert.equal(remainingLabel(0, 1), 'باقي 0 د');
  assert.equal(remainingLabel(59 * 60000, 0), 'باقي 59 د');
  assert.equal(remainingLabel(60 * 60000, 0), 'باقي 1 س');
});

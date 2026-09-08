import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { toBlockedProfile, withoutBlocked } from '../src/services/firebase/blockingModel.js';

test('blocked profile stores only the identity needed by settings', () => {
  const profile = toBlockedProfile('fallback', {
    blockedUid: 'u2', blockedName: 'ليان', blockedUsername: 'layan',
    blockedPhotoURL: 'https://example.com/photo.jpg', blockedType: 'cafe', secret: 'hidden',
  });
  assert.deepEqual(profile, {
    uid: 'u2', displayName: 'ليان', username: 'layan',
    photoURL: 'https://example.com/photo.jpg', accountType: 'cafe',
  });
  assert.equal('secret' in profile, false);
});

test('blocked and blocking accounts can be removed from any public list', () => {
  const items = [{ authorUid: 'u1' }, { authorUid: 'u2' }, { authorUid: 'u3' }];
  assert.deepEqual(withoutBlocked(items, new Set(['u2', 'u3']), 'authorUid'), [{ authorUid: 'u1' }]);
});

test('Firestore rules protect both block mirrors and content access', () => {
  const rules = readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8');
  assert.match(rules, /match \/users\/\{blockerUid\}\/blocks\/\{blockedUid\}/);
  assert.match(rules, /match \/users\/\{blockedUid\}\/blockedBy\/\{blockerUid\}/);
  assert.match(rules, /!blockedBetween\(request\.auth\.uid, data\.authorUid\)/);
  assert.match(rules, /!blockedBetween\(followerUid, targetUid\)/);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import { filterPublicProfiles, toPublicProfile } from '../src/services/firebase/publicProfileModel.js';

test('public profile mapping exposes only fields needed by discovery', () => {
  const profile = toPublicProfile('u1', { uid: 'u1', displayName: ' أحمد ', usernameLower: 'ahmad', bio: 'قهوة', accountType: 'user', privacy: 'public', accountStatus: 'active', verified: true, role: 'admin', points: 999 });
  assert.equal(profile.displayName, 'أحمد');
  assert.equal(profile.username, 'ahmad');
  assert.equal(profile.verified, true);
  assert.equal('role' in profile, false);
  assert.equal('points' in profile, false);
});

test('search stays empty until typing, then matches display name or username', () => {
  const profiles = [
    { uid: '1', displayName: 'أحمد', username: 'ahmad.coffee', bio: 'قهوة مختصة' },
    { uid: '2', displayName: 'ليان', username: 'layan', bio: 'لحظات صباحية' },
  ];
  assert.deepEqual(filterPublicProfiles(profiles, ''), []);
  assert.deepEqual(filterPublicProfiles(profiles, '@ahmad').map((item) => item.uid), ['1']);
  assert.deepEqual(filterPublicProfiles(profiles, 'ليان').map((item) => item.uid), ['2']);
  assert.deepEqual(filterPublicProfiles(profiles, 'صباحية'), []);
});

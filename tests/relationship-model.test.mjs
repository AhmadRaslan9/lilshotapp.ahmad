import assert from 'node:assert/strict';
import test from 'node:test';
import { canFollowProfile, canRequestFollowProfile, relationshipErrorMessage } from '../src/services/firebase/relationshipModel.js';

test('a signed-in user can follow another active public profile', () => {
  assert.equal(canFollowProfile('user-a', { uid: 'cafe-b', privacy: 'public', accountStatus: 'active' }), true);
});

test('self, private and stopped profiles cannot be followed', () => {
  assert.equal(canFollowProfile('same', { uid: 'same', privacy: 'public', accountStatus: 'active' }), false);
  assert.equal(canFollowProfile('user-a', { uid: 'cafe-b', privacy: 'private', accountStatus: 'active' }), false);
  assert.equal(canFollowProfile('user-a', { uid: 'cafe-b', privacy: 'public', accountStatus: 'banned' }), false);
});

test('only an active private profile receives a follow request', () => {
  assert.equal(canRequestFollowProfile('user-a', { uid: 'user-b', privacy: 'private', accountStatus: 'active' }), true);
  assert.equal(canRequestFollowProfile('user-a', { uid: 'user-b', privacy: 'public', accountStatus: 'active' }), false);
  assert.equal(canRequestFollowProfile('same', { uid: 'same', privacy: 'private', accountStatus: 'active' }), false);
});

test('relationship failures have a safe Arabic message', () => {
  assert.equal(relationshipErrorMessage({ code: 'permission-denied' }), 'لا يمكن متابعة هذا الحساب الآن.');
  assert.match(relationshipErrorMessage({ code: 'unavailable' }), /الاتصال/);
});

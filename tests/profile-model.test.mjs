import assert from 'node:assert/strict';
import { normalizeUsername, validateProfileInput } from '../src/services/firebase/profileModel.js';

assert.equal(normalizeUsername(' @Coffee.Lover '), 'coffee.lover');
assert.equal(validateProfileInput({ displayName: 'أحمد', username: 'coffee_lover', accountType: 'user', privacy: 'public' }), null);
assert.equal(validateProfileInput({ displayName: 'أحمد', username: 'bad..name', accountType: 'user', privacy: 'public' }), 'profile/invalid-username');
assert.equal(validateProfileInput({ displayName: 'أحمد', username: 'cafe_sa', accountType: 'cafe', privacy: 'private' }), null);
console.log('profile model tests passed');

import assert from 'node:assert/strict';
import test from 'node:test';
import { hasActiveSubscription, subscriptionDaysLeft } from '../src/services/firebase/subscriptionModel.js';
test('legacy subscriptions remain active until an expiry is assigned', () => assert.equal(hasActiveSubscription({}), true));
test('dated subscriptions stop at the expiry boundary', () => {
  const profile = { subscriptionEndsAt: { seconds: 2 } };
  assert.equal(hasActiveSubscription(profile, 1999), true);
  assert.equal(hasActiveSubscription(profile, 2000), false);
  assert.equal(subscriptionDaysLeft({ subscriptionEndsAt: { seconds: 86400 } }, 0), 1);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import { notificationIcon, notificationText, toNotification } from '../src/services/firebase/notificationModel.js';

test('follow and like notifications have clear Arabic copy and icons', () => {
  assert.equal(notificationText({ type: 'follow', actorName: 'ليان' }), 'ليان بدأ بمتابعتك');
  assert.equal(notificationText({ type: 'like', actorName: 'أحمد' }), 'أحمد أعجب بمنشورك');
  assert.equal(notificationIcon('follow'), 'person-add');
  assert.equal(notificationIcon('like'), 'heart');
});

test('Firestore notification maps without exposing unknown fields', () => {
  const item = toNotification('n1', { type: 'like', actorUid: 'u1', actorName: 'أحمد', actorUsername: 'ahmad', targetUid: 'u2', postId: 'p1', read: false, secret: 'ignored', createdAt: { toMillis: () => 456 } });
  assert.equal(item.id, 'n1');
  assert.equal(item.createdAtMs, 456);
  assert.equal(item.read, false);
  assert.equal('secret' in item, false);
});

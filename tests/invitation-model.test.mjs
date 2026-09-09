import assert from 'node:assert/strict';
import test from 'node:test';
import { createInviteCode, INVITE_LIMIT, normalizeInviteCode } from '../src/services/firebase/invitationModel.js';
test('each account is limited to three invitation slots', () => assert.equal(INVITE_LIMIT, 3));
test('invite codes are shareable and normalize safely', () => {
  const code = createInviteCode('abc123', 2, () => 0);
  assert.match(code, /^LIL2-[A-Z0-9]{6}-ABC$/);
  assert.equal(normalizeInviteCode(' lil2-ab cd '), 'LIL2ABCD');
});

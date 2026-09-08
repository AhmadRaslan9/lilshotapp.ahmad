import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeReportInput, reportDocumentId, validateReportInput } from '../src/services/firebase/reportModel.js';

test('report document IDs are deterministic per reporter and target', () => {
  assert.equal(reportDocumentId('u1', 'post', 'p1'), 'u1_post_p1');
});

test('valid reports normalize and limit user text', () => {
  const value = normalizeReportInput({ targetType: 'post', targetId: 'p1', targetOwnerUid: 'u2', targetLabel: ' منشور ', targetPreview: ' صورة ', reason: 'spam', details: ` ${'a'.repeat(400)} ` });
  assert.equal(validateReportInput(value, 'u1'), null);
  assert.equal(value.targetLabel, 'منشور');
  assert.equal(value.details.length, 300);
});

test('a user cannot report their own content', () => {
  assert.equal(validateReportInput({ targetType: 'moment', targetId: 'm1', targetOwnerUid: 'u1', reason: 'spam' }, 'u1'), 'report/own-content');
});

test('target types and reasons are restricted', () => {
  assert.equal(validateReportInput({ targetType: 'video', targetId: 'x', targetOwnerUid: 'u2', reason: 'spam' }, 'u1'), 'report/invalid-target-type');
  assert.equal(validateReportInput({ targetType: 'post', targetId: 'x', targetOwnerUid: 'u2', reason: 'fake' }, 'u1'), 'report/invalid-reason');
});

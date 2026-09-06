import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultFirebaseConfig, resolveFirebaseConfig } from '../src/services/firebase/clientConfig.js';

test('fresh checkout and blank environment use the supplied LilShot project', () => {
  assert.equal(resolveFirebaseConfig().projectId, 'lilshot-dbfe1');
  assert.equal(resolveFirebaseConfig().storageBucket, 'lilshot-dbfe1.firebasestorage.app');
  assert.deepEqual(resolveFirebaseConfig({ apiKey: '', projectId: '  ', appId: undefined }), defaultFirebaseConfig);
});

test('partial overrides fail instead of mixing Firebase projects', () => {
  assert.throws(() => resolveFirebaseConfig({ projectId: 'other-project' }), /Incomplete Firebase/);
  assert.throws(() => resolveFirebaseConfig({ measurementId: 'other-analytics' }), /Incomplete Firebase/);
});

test('complete override excludes optional IDs belonging to the default project', () => {
  const other = {
    apiKey: ' test-key ', authDomain: 'test.example', projectId: 'test',
    storageBucket: 'test-bucket', messagingSenderId: '123', appId: 'test-app',
  };
  const config = resolveFirebaseConfig(other);
  assert.equal(config.apiKey, 'test-key');
  assert.equal(config.projectId, 'test');
  assert.equal(config.databaseURL, undefined);
  assert.equal(config.measurementId, undefined);
  assert.equal(other.apiKey, ' test-key ');
});

test('callers cannot mutate the bundled config through a resolved object', () => {
  const config = resolveFirebaseConfig();
  config.projectId = 'changed';
  assert.equal(resolveFirebaseConfig().projectId, 'lilshot-dbfe1');
});

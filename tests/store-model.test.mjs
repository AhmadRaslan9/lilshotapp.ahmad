import assert from 'node:assert/strict';
import test from 'node:test';
import { emptyStoreDetails, normalizeStoreDetails, validateStoreDetails } from '../src/services/firebase/storeModel.js';

const valid = {
  ...emptyStoreDetails,
  country: 'الأردن', city: 'عمّان', currency: 'JOD', district: 'اللويبدة', address: 'شارع الباعونية', category: 'قهوة مختصة',
  description: 'قهوة هادئة', mapsURL: 'https://maps.app.goo.gl/example', coverURL: '', logoURL: '',
  hours: { ...emptyStoreDetails.hours, saturday: '7:00 ص - 12:00 ص', friday: 'مغلق' },
};

test('store details normalize text and preserve the seven-day schedule', () => {
  const store = normalizeStoreDetails({ ...valid, district: '  حطين  ' });
  assert.equal(store.district, 'حطين');
  assert.equal(Object.keys(store.hours).length, 7);
  assert.equal(store.hours.friday, 'مغلق');
});

test('store details require an address and secure map URL', () => {
  assert.equal(validateStoreDetails(valid), null);
  assert.equal(validateStoreDetails({ ...valid, address: '' }), 'store/invalid-address');
  assert.equal(validateStoreDetails({ ...valid, mapsURL: 'http://example.com' }), 'store/invalid-map');
});

test('global store details require a country, city and ISO currency', () => {
  assert.equal(validateStoreDetails(valid), null);
  assert.equal(validateStoreDetails({ ...valid, country: '' }), 'store/invalid-country');
  assert.equal(validateStoreDetails({ ...valid, city: '' }), 'store/invalid-city');
  assert.equal(normalizeStoreDetails({ ...valid, currency: 'eur' }).currency, 'EUR');
});

test('contact and social fields are not included in normalized store data', () => {
  const store = normalizeStoreDetails({ ...valid, phone: '123', whatsapp: '123', instagram: 'test' });
  assert.equal('phone' in store, false);
  assert.equal('whatsapp' in store, false);
  assert.equal('instagram' in store, false);
});

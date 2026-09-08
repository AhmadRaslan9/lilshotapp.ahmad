import assert from 'node:assert/strict';
import test from 'node:test';
import { MENU_CATEGORIES, normalizeMenuItem, validateMenuItem } from '../src/services/firebase/menuModel.js';

const valid = { name: ' سبانش لاتيه ', description: 'حليب وقهوة', price: '18.50', category: 'قهوة ساخنة', available: true, imageURL: '' };

test('menu item normalization trims text and converts price', () => {
  const item = normalizeMenuItem(valid);
  assert.equal(item.name, 'سبانش لاتيه');
  assert.equal(item.price, 18.5);
  assert.equal(item.available, true);
});

test('valid menu item passes and invalid prices fail', () => {
  assert.equal(validateMenuItem(valid), null);
  assert.equal(validateMenuItem({ ...valid, price: '-1' }), 'menu/invalid-price');
  assert.equal(validateMenuItem({ ...valid, price: 'coffee' }), 'menu/invalid-price');
});

test('unknown category falls back safely during normalization', () => {
  assert.equal(normalizeMenuItem({ ...valid, category: 'unknown' }).category, MENU_CATEGORIES[0]);
});

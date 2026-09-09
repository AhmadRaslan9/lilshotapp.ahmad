export const STORE_CATEGORIES = ['قهوة مختصة', 'مقهى', 'حلويات', 'فطور', 'جلسات خارجية'];
export const STORE_DAYS = [
  ['saturday', 'السبت'], ['sunday', 'الأحد'], ['monday', 'الاثنين'], ['tuesday', 'الثلاثاء'],
  ['wednesday', 'الأربعاء'], ['thursday', 'الخميس'], ['friday', 'الجمعة'],
];

export const emptyStoreDetails = {
  country: '', city: '', currency: 'USD', district: '', address: '', mapsURL: '', category: 'مقهى', description: '', coverURL: '', logoURL: '',
  hours: Object.fromEntries(STORE_DAYS.map(([key]) => [key, '']))
};

export function normalizeStoreDetails(input = {}) {
  const hours = Object.fromEntries(STORE_DAYS.map(([key]) => [key, String(input.hours?.[key] || '').trim()]));
  return {
    country: String(input.country || '').trim(),
    city: String(input.city || '').trim(),
    currency: /^[A-Za-z]{3}$/.test(String(input.currency || 'USD').trim()) ? String(input.currency || 'USD').trim().toUpperCase() : 'USD',
    district: String(input.district || '').trim(),
    address: String(input.address || '').trim(),
    mapsURL: String(input.mapsURL || '').trim(),
    category: STORE_CATEGORIES.includes(input.category) ? input.category : emptyStoreDetails.category,
    description: String(input.description || '').trim(),
    coverURL: String(input.coverURL || '').trim(),
    logoURL: String(input.logoURL || '').trim(),
    hours,
  };
}

export function validateStoreDetails(input) {
  const store = normalizeStoreDetails(input);
  if (store.country.length < 2 || store.country.length > 60) return 'store/invalid-country';
  if (store.city.length < 2 || store.city.length > 80) return 'store/invalid-city';
  if (!/^[A-Z]{3}$/.test(store.currency)) return 'store/invalid-currency';
  if (store.district.length < 2 || store.district.length > 60) return 'store/invalid-district';
  if (store.address.length < 3 || store.address.length > 160) return 'store/invalid-address';
  if (store.description.length > 500) return 'store/invalid-description';
  if (store.mapsURL && !/^https:\/\//i.test(store.mapsURL)) return 'store/invalid-map';
  if (store.mapsURL.length > 1000 || store.coverURL.length > 1000 || store.logoURL.length > 1000) return 'store/invalid-url';
  if (Object.values(store.hours).some((value) => value.length > 40)) return 'store/invalid-hours';
  return null;
}

export function formatPrice(value, currency = 'USD') {
  const amount = Number(value || 0);
  const code = /^[A-Z]{3}$/.test(currency) ? currency : 'USD';
  try { return new Intl.NumberFormat(undefined, { style: 'currency', currency: code }).format(amount); }
  catch { return `${amount.toFixed(2)} ${code}`; }
}

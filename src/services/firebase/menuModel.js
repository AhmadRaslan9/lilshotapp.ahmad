export const MENU_CATEGORIES = ['قهوة ساخنة', 'قهوة باردة', 'حلويات', 'فطور', 'أخرى'];

export function normalizeMenuItem(input = {}) {
  const price = typeof input.price === 'number' ? input.price : Number(String(input.price || '').replace(',', '.'));
  return {
    name: String(input.name || '').trim(),
    description: String(input.description || '').trim(),
    price,
    category: MENU_CATEGORIES.includes(input.category) ? input.category : MENU_CATEGORIES[0],
    available: input.available !== false,
    imageURL: String(input.imageURL || '').trim(),
    sortOrder: Number.isInteger(input.sortOrder) ? input.sortOrder : 0,
  };
}

export function validateMenuItem(input) {
  const item = normalizeMenuItem(input);
  if (item.name.length < 2 || item.name.length > 60) return 'menu/invalid-name';
  if (item.description.length > 200) return 'menu/invalid-description';
  if (!Number.isFinite(item.price) || item.price < 0 || item.price > 10000) return 'menu/invalid-price';
  if (!MENU_CATEGORIES.includes(item.category)) return 'menu/invalid-category';
  if (item.imageURL.length > 1000) return 'menu/invalid-image';
  return null;
}

// Illustrative people and cafés, never production records or live location results.
const origin = Date.now();
export const coffeePhotos = {
  cup: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=85',
  table: 'https://images.unsplash.com/photo-1495474472287-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85',
  pour: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1000&q=85',
};
export const previewCafes = [
  { id: 'demo-riwaq', name: 'رِواق', latin: 'RIWAQ COFFEE', country: 'الأردن', city: 'عمّان', currency: 'JOD', district: 'اللويبدة', tag: 'قهوة مختصة', rating: '4.8', reviews: 124, followers: '1.2k', image: coffeePhotos.table, description: 'مساحة هادئة، ضوء طبيعي، وكوب يُحضّر على مهل.', menu: [{ name: 'فلات وايت', note: 'إسبريسو وحليب بقوام ناعم', price: 3.5 }, { name: 'قهوة مقطّرة', note: 'محصول اليوم · تحضير يدوي', price: 4.5 }] },
  { id: 'demo-dhill', name: 'Noir', latin: 'NOIR COFFEE', country: 'United Kingdom', city: 'London', currency: 'GBP', district: 'Soho', tag: 'جلسات خارجية', rating: '4.6', reviews: 86, followers: '842', image: coffeePhotos.cup, description: 'Coffee, people, and a quiet corner in the city.', menu: [{ name: 'Cappuccino', note: 'Espresso and silky milk', price: 4.2 }, { name: 'Iced latte', note: 'Cold and smooth', price: 4.8 }] },
  { id: 'demo-nawa', name: 'Nawa', latin: 'NAWA ROASTERS', country: 'Italy', city: 'Milan', currency: 'EUR', district: 'Brera', tag: 'قهوة مختصة', rating: '4.9', reviews: 208, followers: '2.1k', image: coffeePhotos.pour, description: 'From the crop to the cup, every detail has a story.', menu: [{ name: 'Espresso', note: 'Seasonal origin', price: 2.5 }, { name: 'Cold brew', note: 'Slow cold extraction', price: 5 }] },
];
export const previewShots = [
  { id: 'shot-lina', author: 'لينا', handle: 'lina.brews', initial: 'ل', cafeId: 'demo-riwaq', plus: true, kind: 'moment', durationHours: 24, expiresAt: origin + 6 * 3600000, caption: 'بعض اللحظات…\nيكفيها كوب قهوة.', note: 'صباح هادي، وقهوتي المفضّلة.', image: coffeePhotos.cup, likes: 28 },
  { id: 'shot-omar', author: 'عمر', handle: 'omar.shots', initial: 'ع', cafeId: 'demo-dhill', plus: false, kind: 'moment', durationHours: 8, expiresAt: origin + 3 * 3600000, caption: 'على مهل،\nكل شيء أحلى.', note: 'استراحة صغيرة من يوم طويل.', image: coffeePhotos.pour, likes: 16 },
  { id: 'post-noura', author: 'نورة', handle: 'noura.coffee', initial: 'ن', cafeId: 'demo-nawa', plus: true, kind: 'post', caption: 'مكان أرجع له\nكل مرة.', note: 'تفاصيل أحب أحتفظ فيها.', image: coffeePhotos.table, likes: 42 },
];
export function visibleShots(shots, filter, author, now) {
  return shots.filter(s => (s.kind === 'post' || s.expiresAt > now) &&
    (filter === 'all' || s.kind === filter) && (!author || s.handle === author));
}
export function filterCafes(cafes, city, category, query) {
  return cafes.filter(c => (city === 'الكل' || c.city === city) && (category === 'الكل' || c.tag === category) &&
    `${c.name} ${c.latin} ${c.country} ${c.city} ${c.district}`.toLowerCase().includes(query.trim().toLowerCase()));
}
export function remainingLabel(expiresAt, now) {
  const minutes = Math.max(0, Math.ceil((expiresAt - now) / 60000));
  return minutes >= 60 ? `باقي ${Math.ceil(minutes / 60)} س` : `باقي ${minutes} د`;
}

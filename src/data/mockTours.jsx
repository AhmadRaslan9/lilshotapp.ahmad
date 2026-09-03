// src/data/mockTours.js
//
// بيانات احتياطية تُستخدم عندما لا يكون Firestore مربوطاً بعد.
// نفس هذه الحقول بالضبط متوقّعة في مستند مجموعة `tours` على Firestore
// (انظر src/services/firebase/firestore.js).
export const MOCK_TOURS = [
  {
    id: '1',
    title: 'Tokyo & Kyoto',
    subtitle: 'Modern cities, historic temples, and culture',
    price: '$1500',
    duration: '/per 10 days',
    tag: 'Last minute tours',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1000',
  },
  {
    id: '2',
    title: 'Paris & Lyon',
    subtitle: 'Romantic streets, architecture, and fine dining',
    price: '$1800',
    duration: '/per 7 days',
    tag: 'Last minute tours',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000',
  },
];

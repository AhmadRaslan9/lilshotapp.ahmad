// src/data/mockProducts.js
//
// بيانات احتياطية لمنتجات المتجر — نفس الحقول متوقّعة في مستند
// مجموعة `products` على Firestore.
export const CATEGORIES = ['All', 'Coffee Beans', 'Equipment', 'Accessories'];

export const MOCK_PRODUCTS = [
  {
    id: '1',
    title: 'Espresso Blend',
    category: 'Coffee Beans',
    price: '$24.00',
    rating: '4.9',
    image: require('../../assets/Logolilshot1.png'),
  },
  {
    id: '2',
    title: 'Glass Cold Brewer',
    category: 'Equipment',
    price: '$45.50',
    rating: '4.8',
    image: require('../../assets/Logolilshot1.png'),
  },
  {
    id: '3',
    title: 'Ceramic Shot Cup',
    category: 'Accessories',
    price: '$18.00',
    rating: '4.7',
    image: require('../../assets/Logolilshot1.png'),
  },
  {
    id: '4',
    title: 'Dark Roast Pack',
    category: 'Coffee Beans',
    price: '$28.00',
    rating: '5.0',
    image: require('../../assets/Logolilshot1.png'),
  },
];

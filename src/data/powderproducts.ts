import img19 from '../assets/sample-images/Group 19.png';
import img22 from '../assets/sample-images/Group 22.png';
import img24 from '../assets/sample-images/Group 24.png';
import img25 from '../assets/sample-images/Group 25.png';
import type { Product } from '../types';

export const powderProducts: Product[] = [
  {
    id: 'oregano-001',
    name: 'Premium Oregano',
    price: 5.99,
    image: img19,
    description: 'Aromatic oregano perfect for pizzas and pastas.',
    category: 'Herbs',
  },
  {
    id: 'basil-002',
    name: 'Fresh Basil',
    price: 4.5,
    image: img22,
    description: 'Sweet basil leaves for delightful sauces.',
    category: 'Herbs',
  },
  {
    id: 'pepper-003',
    name: 'Black Peppercorns',
    price: 6.75,
    image: img24,
    description: 'Whole peppercorns for freshly ground flavor.',
    category: 'Spices',
  },
  {
    id: 'paprika-004',
    name: 'Smoked Paprika',
    price: 5.25,
    image: img25,
    description: 'Rich, smoky paprika for depth and color.',
    category: 'Spices',
  },
  {
    id: 'cumin-005',
    name: 'Ground Cumin',
    price: 3.99,
    image: img24,
    description: 'Earthy cumin perfect for curries and stews.',
    category: 'Spices',
  },
  {
    id: 'turmeric-006',
    name: 'Organic Turmeric',
    price: 4.75,
    image: img25,
    description: 'Golden turmeric with bright flavor and color.',
    category: 'Spices',
  },
];

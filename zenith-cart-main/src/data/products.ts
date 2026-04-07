import type { Product } from '@/types';

export const products: Product[] = [
  {
    id: '1', name: 'Wireless Noise-Cancelling Headphones', description: 'Premium over-ear headphones with active noise cancellation and 30-hour battery life.',
    price: 249.99, originalPrice: 349.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    category: 'Electronics', rating: 4.7, reviewCount: 2341, inStock: true,
  },
  {
    id: '2', name: 'Mechanical Keyboard RGB', description: 'Full-size mechanical keyboard with Cherry MX switches and per-key RGB lighting.',
    price: 129.99, originalPrice: 159.99, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop',
    category: 'Electronics', rating: 4.5, reviewCount: 1892, inStock: true,
  },
  {
    id: '3', name: 'Smart Watch Pro', description: 'Advanced fitness tracking, ECG monitoring, and GPS with 7-day battery.',
    price: 399.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    category: 'Electronics', rating: 4.8, reviewCount: 5621, inStock: true,
  },
  {
    id: '4', name: 'Ergonomic Office Chair', description: 'Adjustable lumbar support, breathable mesh back, and 4D armrests.',
    price: 549.00, originalPrice: 699.00, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=400&fit=crop',
    category: 'Furniture', rating: 4.6, reviewCount: 834, inStock: true,
  },
  {
    id: '5', name: 'Portable Bluetooth Speaker', description: 'Waterproof speaker with 360° sound and 20-hour playtime.',
    price: 79.99, originalPrice: 99.99, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
    category: 'Electronics', rating: 4.4, reviewCount: 3102, inStock: true,
  },
  {
    id: '6', name: 'Running Shoes Ultra', description: 'Lightweight cushioned running shoes with responsive foam technology.',
    price: 139.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    category: 'Fashion', rating: 4.3, reviewCount: 1456, inStock: true,
  },
  {
    id: '7', name: 'Coffee Maker Deluxe', description: '12-cup programmable coffee maker with built-in grinder and thermal carafe.',
    price: 189.99, originalPrice: 229.99, image: 'https://images.unsplash.com/photo-1517256064527-9d164d29e7a5?w=400&h=400&fit=crop',
    category: 'Home', rating: 4.5, reviewCount: 2089, inStock: true,
  },
  {
    id: '8', name: 'Backpack Travel Pro', description: 'Anti-theft laptop backpack with USB charging port and waterproof material.',
    price: 69.99, originalPrice: 89.99, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    category: 'Fashion', rating: 4.6, reviewCount: 4230, inStock: true,
  },
  {
    id: '9', name: 'Desk Lamp LED', description: 'Adjustable LED desk lamp with 5 color temperatures and touch controls.',
    price: 44.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400&h=400&fit=crop',
    category: 'Home', rating: 4.2, reviewCount: 678, inStock: false,
  },
  {
    id: '10', name: 'Wireless Mouse Ergonomic', description: 'Vertical ergonomic mouse with adjustable DPI and silent clicks.',
    price: 34.99, originalPrice: 49.99, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
    category: 'Electronics', rating: 4.4, reviewCount: 1523, inStock: true,
  },
  {
    id: '11', name: 'Yoga Mat Premium', description: 'Extra thick non-slip yoga mat with carrying strap.',
    price: 39.99, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop',
    category: 'Sports', rating: 4.7, reviewCount: 912, inStock: true,
  },
  {
    id: '12', name: 'Stainless Steel Water Bottle', description: 'Double-wall vacuum insulated bottle, keeps drinks cold 24h or hot 12h.',
    price: 24.99, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
    category: 'Sports', rating: 4.8, reviewCount: 6721, inStock: true,
  },
];

export const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Furniture', 'Sports'];

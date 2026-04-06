export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PRODUCTS: '/products',
  PRODUCT_DETAILS: '/products/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_DETAILS: '/orders/:id',
  ADDRESSES: '/addresses',
  FEEDBACK: '/feedback',
} as const;

export const API_ENDPOINTS = {
  AUTH: '/auth',
  CATEGORIES: '/categories',
  PRODUCTS: '/products',
  ADDRESSES: '/addresses',
  ORDERS: '/orders',
  PAYMENTS: '/payments',
  FEEDBACK: '/feedback',
  HEALTH: '/health',
} as const;

export const ORDER_STATUS_COLORS: Record<string, string> = {
  Pending: '#f59e0b',
  Shipped: '#3b82f6',
  Delivered: '#22c55e',
  Cancelled: '#ef4444',
};

export const PAYMENT_STATUS_COLORS: Record<string, string> = {
  Pending: '#f59e0b',
  Success: '#22c55e',
  Failed: '#ef4444',
};

export const PAYMENT_MODES = ['CashOnDelivery', 'UPI', 'NetBanking'] as const;

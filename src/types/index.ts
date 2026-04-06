export * from './auth.types';
export * from './product.types';
export * from './address.types';
export * from './order.types';
export * from './payment.types';
export * from './feedback.types';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface CartItem {
  product: import('./product.types').Product;
  quantity: number;
}

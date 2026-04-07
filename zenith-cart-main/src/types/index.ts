export type { User, AuthResponse, LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest } from './auth';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  vendorId?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

export type UserRole = 'customer' | 'vendor' | 'admin';

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: 'credit_card' | 'debit_card' | 'upi' | 'net_banking' | 'wallet';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
  last4?: string;
  cardBrand?: string;
}

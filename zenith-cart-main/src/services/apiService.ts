import apiClient from '@/lib/api-client';
import type { User } from '@/types/auth';

export interface Product {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  description: string;
  price: number;
  vendorId: number;
  averageRating?: number;
  reviewCount?: number;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export const productService = {
  getProducts: async (params?: { categoryId?: number; page?: number; pageSize?: number }) => {
    const response = await apiClient.get<{ success: boolean; message: string; data: PaginatedResponse<Product> }>(
      '/products',
      { params }
    );
    return response.data;
  },

  getProduct: async (id: number) => {
    const response = await apiClient.get<{ success: boolean; message: string; data: Product }>(`/products/${id}`);
    return response.data;
  },

  createProduct: async (data: Omit<Product, 'id' | 'vendorId' | 'createdAt' | 'categoryName' | 'averageRating' | 'reviewCount'>) => {
    const response = await apiClient.post<{ success: boolean; message: string; data: Product }>('/products', data);
    return response.data;
  },

  updateProduct: async (data: Partial<Product> & { id: number }) => {
    const response = await apiClient.put<{ success: boolean; message: string }>('/products', data);
    return response.data;
  },

  deleteProduct: async (id: number) => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/products/${id}`);
    return response.data;
  },
};

export interface Category {
  id: number;
  name: string;
  createdAt: string;
}

export const categoryService = {
  getCategories: async () => {
    const response = await apiClient.get<{ success: boolean; message: string; data: Category[] }>('/categories');
    return response.data;
  },
};

export interface Address {
  id: number;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  createdAt: string;
}

export const addressService = {
  getAddresses: async () => {
    const response = await apiClient.get<{ success: boolean; message: string; data: Address[] }>('/addresses');
    return response.data;
  },

  createAddress: async (data: Omit<Address, 'id' | 'createdAt'>) => {
    const response = await apiClient.post<{ success: boolean; message: string; data: Address }>('/addresses', data);
    return response.data;
  },

  updateAddress: async (id: number, data: Partial<Omit<Address, 'id' | 'createdAt'>>) => {
    const response = await apiClient.put<{ success: boolean; message: string }>(`/addresses/${id}`, data);
    return response.data;
  },

  deleteAddress: async (id: number) => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/addresses/${id}`);
    return response.data;
  },
};

export interface OrderItem {
  id: number;
  productId: number;
  itemCount: number;
  purchasePrice: number;
}

export interface Order {
  id: number;
  customerId: number;
  addressId: number;
  arrivingTime?: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

export const orderService = {
  getOrders: async (params?: { page?: number; pageSize?: number }) => {
    const response = await apiClient.get<{ success: boolean; message: string; data: PaginatedResponse<Order> }>(
      '/orders',
      { params }
    );
    return response.data;
  },

  getOrder: async (id: number) => {
    const response = await apiClient.get<{ success: boolean; message: string; data: Order }>(`/orders/${id}`);
    return response.data;
  },

  createOrder: async (data: { addressId: number; arrivingTime?: string; items: { productId: number; quantity: number }[] }) => {
    const response = await apiClient.post<{ success: boolean; message: string; data: Order }>('/orders', data);
    return response.data;
  },

  cancelOrder: async (id: number) => {
    const response = await apiClient.post<{ success: boolean; message: string }>(`/orders/${id}/cancel`);
    return response.data;
  },
};

export interface Payment {
  id: number;
  orderId: number;
  amount: number;
  paymentMode: 'CashOnDelivery' | 'UPI' | 'NetBanking';
  status: 'Pending' | 'Success' | 'Failed';
  transactionId?: string;
  paidAt?: string;
  createdAt: string;
}

export const paymentService = {
  getPayment: async (id: number) => {
    const response = await apiClient.get<{ success: boolean; message: string; data: Payment }>(`/payments/${id}`);
    return response.data;
  },

  getPaymentByOrder: async (orderId: number) => {
    const response = await apiClient.get<{ success: boolean; message: string; data: Payment }>(
      `/payments/order/${orderId}`
    );
    return response.data;
  },

  initiatePayment: async (data: { orderId: number; paymentMode: 'CashOnDelivery' | 'UPI' | 'NetBanking' }) => {
    const response = await apiClient.post<{ success: boolean; message: string; data: Payment }>('/payments', data);
    return response.data;
  },
};

export interface Feedback {
  id: number;
  productId: number;
  userId: number;
  userEmail: string;
  rating: number;
  review?: string;
  createdAt: string;
}

export const feedbackService = {
  getProductFeedback: async (productId: number, params?: { page?: number; pageSize?: number }) => {
    const response = await apiClient.get<{ success: boolean; message: string; data: PaginatedResponse<Feedback> }>(
      `/feedback/product/${productId}`,
      { params }
    );
    return response.data;
  },

  getProductRating: async (productId: number) => {
    const response = await apiClient.get<{ success: boolean; message: string; data: number }>(
      `/feedback/product/${productId}/rating`
    );
    return response.data;
  },

  submitFeedback: async (data: { productId: number; rating: number; review?: string }) => {
    const response = await apiClient.post<{ success: boolean; message: string; data: Feedback }>('/feedback', data);
    return response.data;
  },
};

export const healthService = {
  check: async () => {
    const response = await apiClient.get<{ success: boolean; message: string }>('/health');
    return response.data;
  },
};

export { apiClient };

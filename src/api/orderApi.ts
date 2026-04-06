import api from './axios';
import type { 
  ApiResponse, 
  Order, 
  OrderListResponse,
  CreateOrderRequest,
  UpdateOrderStatusRequest
} from '../types';

interface OrderFilters {
  page?: number;
  pageSize?: number;
}

export const orderApi = {
  getAll: async (filters?: OrderFilters): Promise<ApiResponse<OrderListResponse>> => {
    const response = await api.get<ApiResponse<OrderListResponse>>('/orders', { params: filters });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Order>> => {
    const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data;
  },

  create: async (data: CreateOrderRequest): Promise<ApiResponse<Order>> => {
    const response = await api.post<ApiResponse<Order>>('/orders', data);
    return response.data;
  },

  updateStatus: async (id: number, data: UpdateOrderStatusRequest): Promise<ApiResponse<Order>> => {
    const response = await api.patch<ApiResponse<Order>>(`/orders/${id}/status`, data);
    return response.data;
  },

  cancel: async (id: number): Promise<ApiResponse<Order>> => {
    const response = await api.post<ApiResponse<Order>>(`/orders/${id}/cancel`);
    return response.data;
  },
};

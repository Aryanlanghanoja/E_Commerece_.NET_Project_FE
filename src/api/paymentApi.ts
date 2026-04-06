import api from './axios';
import type { 
  ApiResponse, 
  Payment, 
  CreatePaymentRequest,
  UpdatePaymentStatusRequest 
} from '../types';

export const paymentApi = {
  getById: async (id: number): Promise<ApiResponse<Payment>> => {
    const response = await api.get<ApiResponse<Payment>>(`/payments/${id}`);
    return response.data;
  },

  getByOrderId: async (orderId: number): Promise<ApiResponse<Payment>> => {
    const response = await api.get<ApiResponse<Payment>>(`/payments/order/${orderId}`);
    return response.data;
  },

  create: async (data: CreatePaymentRequest): Promise<ApiResponse<Payment>> => {
    const response = await api.post<ApiResponse<Payment>>('/payments', data);
    return response.data;
  },

  updateStatus: async (id: number, data: UpdatePaymentStatusRequest): Promise<ApiResponse<Payment>> => {
    const response = await api.patch<ApiResponse<Payment>>(`/payments/${id}/status`, data, {
      params: { status: data.status, transactionId: data.transactionId },
    });
    return response.data;
  },
};

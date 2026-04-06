import api from './axios';
import type { 
  ApiResponse, 
  Address, 
  CreateAddressRequest, 
  UpdateAddressRequest 
} from '../types';

export const addressApi = {
  getAll: async (): Promise<ApiResponse<Address[]>> => {
    const response = await api.get<ApiResponse<Address[]>>('/addresses');
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Address>> => {
    const response = await api.get<ApiResponse<Address>>(`/addresses/${id}`);
    return response.data;
  },

  create: async (data: CreateAddressRequest): Promise<ApiResponse<Address>> => {
    const response = await api.post<ApiResponse<Address>>('/addresses', data);
    return response.data;
  },

  update: async (data: UpdateAddressRequest): Promise<ApiResponse<Address>> => {
    const response = await api.put<ApiResponse<Address>>(`/addresses/${data.id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/addresses/${id}`);
    return response.data;
  },
};

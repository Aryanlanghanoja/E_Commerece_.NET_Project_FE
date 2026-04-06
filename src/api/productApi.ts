import api from './axios';
import type { 
  ApiResponse, 
  Category, 
  Product, 
  ProductListResponse,
  CreateProductRequest,
  UpdateProductRequest 
} from '../types';

interface ProductFilters {
  categoryId?: number;
  page?: number;
  pageSize?: number;
}

export const categoryApi = {
  getAll: async (): Promise<ApiResponse<Category[]>> => {
    const response = await api.get<ApiResponse<Category[]>>('/categories');
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Category>> => {
    const response = await api.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data;
  },

  create: async (name: string): Promise<ApiResponse<Category>> => {
    const response = await api.post<ApiResponse<Category>>('/categories', { name });
    return response.data;
  },

  update: async (id: number, name: string): Promise<ApiResponse<Category>> => {
    const response = await api.put<ApiResponse<Category>>(`/categories/${id}`, { name });
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/categories/${id}`);
    return response.data;
  },
};

export const productApi = {
  getAll: async (filters?: ProductFilters): Promise<ApiResponse<ProductListResponse>> => {
    const response = await api.get<ApiResponse<ProductListResponse>>('/products', { params: filters });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Product>> => {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
  },

  create: async (data: CreateProductRequest): Promise<ApiResponse<Product>> => {
    const response = await api.post<ApiResponse<Product>>('/products', data);
    return response.data;
  },

  update: async (data: UpdateProductRequest): Promise<ApiResponse<Product>> => {
    const response = await api.put<ApiResponse<Product>>('/products', data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/products/${id}`);
    return response.data;
  },
};

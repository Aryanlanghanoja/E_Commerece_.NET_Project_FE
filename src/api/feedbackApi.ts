import api from './axios';
import type { 
  ApiResponse, 
  Feedback, 
  FeedbackListResponse,
  CreateFeedbackRequest 
} from '../types';

interface FeedbackFilters {
  page?: number;
  pageSize?: number;
}

export const feedbackApi = {
  getByProductId: async (productId: number, filters?: FeedbackFilters): Promise<ApiResponse<FeedbackListResponse>> => {
    const response = await api.get<ApiResponse<FeedbackListResponse>>(`/feedback/product/${productId}`, {
      params: filters,
    });
    return response.data;
  },

  getProductRating: async (productId: number): Promise<ApiResponse<number>> => {
    const response = await api.get<ApiResponse<number>>(`/feedback/product/${productId}/rating`);
    return response.data;
  },

  create: async (data: CreateFeedbackRequest): Promise<ApiResponse<Feedback>> => {
    const response = await api.post<ApiResponse<Feedback>>('/feedback', data);
    return response.data;
  },
};

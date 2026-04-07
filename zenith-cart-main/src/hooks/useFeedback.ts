import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feedbackService, type Feedback } from '@/services/apiService';

export const useProductFeedback = (productId: number, params?: { page?: number; pageSize?: number }) => {
  return useQuery({
    queryKey: ['feedback', 'product', productId, params],
    queryFn: () => feedbackService.getProductFeedback(productId, params),
    select: (data) => data.data,
    enabled: !!productId,
  });
};

export const useProductRating = (productId: number) => {
  return useQuery({
    queryKey: ['rating', 'product', productId],
    queryFn: () => feedbackService.getProductRating(productId),
    select: (data) => data.data,
    enabled: !!productId,
  });
};

export const useSubmitFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { productId: number; rating: number; review?: string }) =>
      feedbackService.submitFeedback(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      queryClient.invalidateQueries({ queryKey: ['rating'] });
    },
  });
};

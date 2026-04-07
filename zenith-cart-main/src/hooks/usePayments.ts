import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService, type Payment } from '@/services/apiService';

export const usePayments = () => {
  return useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      return null;
    },
    enabled: false,
  });
};

export const usePayment = (id: number) => {
  return useQuery({
    queryKey: ['payment', id],
    queryFn: () => paymentService.getPayment(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

export const usePaymentByOrder = (orderId: number) => {
  return useQuery({
    queryKey: ['payment', 'order', orderId],
    queryFn: () => paymentService.getPaymentByOrder(orderId),
    select: (data) => data.data,
    enabled: !!orderId,
  });
};

export const useInitiatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { orderId: number; paymentMode: 'CashOnDelivery' | 'UPI' | 'NetBanking' }) =>
      paymentService.initiatePayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
};

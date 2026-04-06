export type PaymentMode = 'CashOnDelivery' | 'UPI' | 'NetBanking';
export type PaymentStatus = 'Pending' | 'Success' | 'Failed';

export interface Payment {
  id: number;
  orderId: number;
  amount: number;
  paymentMode: PaymentMode;
  status: PaymentStatus;
  transactionId?: string;
  paidAt?: string;
  createdAt: string;
}

export interface CreatePaymentRequest {
  orderId: number;
  paymentMode: PaymentMode;
}

export interface UpdatePaymentStatusRequest {
  status: PaymentStatus;
  transactionId?: string;
}

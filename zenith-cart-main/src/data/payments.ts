import type { Payment } from '@/types';

export const payments: Payment[] = [
  { id: 'PAY-4501', orderId: 'ORD-7821', amount: 329.98, method: 'credit_card', status: 'completed', date: '2026-04-04', last4: '4242', cardBrand: 'Visa' },
  { id: 'PAY-4500', orderId: 'ORD-7820', amount: 79.99, method: 'debit_card', status: 'completed', date: '2026-04-03', last4: '8910', cardBrand: 'Mastercard' },
  { id: 'PAY-4499', orderId: 'ORD-7819', amount: 549.00, method: 'upi', status: 'pending', date: '2026-04-02' },
  { id: 'PAY-4498', orderId: 'ORD-7818', amount: 174.98, method: 'net_banking', status: 'completed', date: '2026-04-01' },
  { id: 'PAY-4497', orderId: 'ORD-7817', amount: 439.98, method: 'credit_card', status: 'failed', date: '2026-03-30', last4: '1234', cardBrand: 'Amex' },
  { id: 'PAY-4496', orderId: 'ORD-7816', amount: 24.99, method: 'wallet', status: 'completed', date: '2026-03-29' },
  { id: 'PAY-4495', orderId: 'ORD-7815', amount: 199.00, method: 'credit_card', status: 'refunded', date: '2026-03-27', last4: '5678', cardBrand: 'Visa' },
  { id: 'PAY-4494', orderId: 'ORD-7814', amount: 89.50, method: 'upi', status: 'completed', date: '2026-03-25' },
];

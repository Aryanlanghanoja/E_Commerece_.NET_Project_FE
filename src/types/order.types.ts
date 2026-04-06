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
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderListResponse {
  items: Order[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface CreateOrderRequest {
  addressId: number;
  arrivingTime?: string;
  items: { productId: number; quantity: number }[];
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

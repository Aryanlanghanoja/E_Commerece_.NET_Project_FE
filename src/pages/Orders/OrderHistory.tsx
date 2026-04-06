import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../../api';
import { Loading, Alert } from '../../components';
import { formatCurrency, formatDateTime, generateOrderId, ORDER_STATUS_COLORS } from '../../utils';
import type { Order } from '../../types';
import styles from './OrderHistory.module.css';

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await orderApi.getAll({ pageSize: 50 });
      if (response.success && response.data) {
        setOrders(response.data.items);
      }
    } catch {
      setError('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading text="Loading orders..." />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Orders</h1>

      {orders.length === 0 ? (
        <p className={styles.empty}>No orders yet</p>
      ) : (
        <div className={styles.orders}>
          {orders.map((order) => (
            <Link to={`/orders/${order.id}`} key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div>
                  <span className={styles.orderId}>{generateOrderId(order.id)}</span>
                  <span className={styles.orderDate}>{formatDateTime(order.createdAt)}</span>
                </div>
                <span
                  className={styles.status}
                  style={{ backgroundColor: ORDER_STATUS_COLORS[order.status] }}
                >
                  {order.status}
                </span>
              </div>
              <div className={styles.orderItems}>
                {order.items.slice(0, 3).map((item) => (
                  <span key={item.id} className={styles.itemCount}>
                    {item.itemCount}x Product #{item.productId}
                  </span>
                ))}
                {order.items.length > 3 && (
                  <span className={styles.moreItems}>+{order.items.length - 3} more</span>
                )}
              </div>
              <div className={styles.orderFooter}>
                <span className={styles.total}>{formatCurrency(order.totalAmount)}</span>
                <span className={styles.viewDetails}>View Details →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

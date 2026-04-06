import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../../api';
import { useAuth } from '../../context';
import { Loading, Alert } from '../../components';
import { formatCurrency, formatDate, maskEmail } from '../../utils';
import type { Order } from '../../types';
import styles from './Dashboard.module.css';

export function Dashboard() {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await orderApi.getAll({ pageSize: 5 });
      if (response.success && response.data) {
        setRecentOrders(response.data.items);
        const total = response.data.items.reduce((sum, order) => sum + order.totalAmount, 0);
        setTotalSpent(total);
      }
    } catch {
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading text="Loading dashboard..." />;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome back, {maskEmail(user?.email || '')}!</h1>

      {error && <Alert type="error" message={error} />}

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Orders</span>
          <span className={styles.statValue}>{recentOrders.length}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Spent</span>
          <span className={styles.statValue}>{formatCurrency(totalSpent)}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Account Status</span>
          <span className={styles.statValue}>{user?.isVerified ? 'Verified' : 'Pending'}</span>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Orders</h2>
          <Link to="/orders" className={styles.viewAll}>
            View All →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className={styles.empty}>No orders yet. Start shopping!</p>
        ) : (
          <div className={styles.orderList}>
            {recentOrders.map((order) => (
              <Link to={`/orders/${order.id}`} key={order.id} className={styles.orderItem}>
                <div className={styles.orderInfo}>
                  <span className={styles.orderId}>Order #{order.id}</span>
                  <span className={styles.orderDate}>{formatDate(order.createdAt)}</span>
                </div>
                <div className={styles.orderDetails}>
                  <span className={styles.orderItems}>
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </span>
                  <span className={styles.orderTotal}>{formatCurrency(order.totalAmount)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className={styles.quickLinks}>
        <Link to="/products" className={styles.quickLink}>
          <span className={styles.quickLinkIcon}>🛍️</span>
          <span>Shop Now</span>
        </Link>
        <Link to="/addresses" className={styles.quickLink}>
          <span className={styles.quickLinkIcon}>📍</span>
          <span>Manage Addresses</span>
        </Link>
        <Link to="/orders" className={styles.quickLink}>
          <span className={styles.quickLinkIcon}>📦</span>
          <span>Order History</span>
        </Link>
      </div>
    </div>
  );
}

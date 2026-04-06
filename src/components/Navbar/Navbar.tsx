import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useCart } from '../../context';
import styles from './Navbar.module.css';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          E-Commerce
        </Link>

        {isAuthenticated && (
          <>
            <div className={styles.links}>
              <Link to="/products" className={styles.link}>
                Products
              </Link>
              <Link to="/cart" className={styles.link}>
                Cart {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
              </Link>
              <Link to="/orders" className={styles.link}>
                Orders
              </Link>
              <Link to="/addresses" className={styles.link}>
                Addresses
              </Link>
            </div>

            <div className={styles.actions}>
              <span className={styles.user}>{user?.email}</span>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

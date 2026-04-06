import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context';
import { Button } from '../../components';
import { formatCurrency } from '../../utils';
import styles from './Cart.module.css';

export function Cart() {
  const { items, totalItems, totalAmount, removeItem, updateQuantity } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Shopping Cart</h1>
        <p className={styles.empty}>Your cart is empty</p>
        <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Shopping Cart ({totalItems} items)</h1>

      <div className={styles.cartLayout}>
        <div className={styles.items}>
          {items.map(({ product, quantity }) => (
            <div key={product.id} className={styles.item}>
              <div className={styles.itemImage}>
                <span>{product.categoryName}</span>
              </div>
              <div className={styles.itemDetails}>
                <h3 className={styles.itemName}>{product.name}</h3>
                <p className={styles.itemCategory}>{product.categoryName}</p>
                <p className={styles.itemPrice}>{formatCurrency(product.price)}</p>
              </div>
              <div className={styles.quantityControls}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                >
                  -
                </button>
                <span className={styles.quantity}>{quantity}</span>
                <button
                  className={styles.qtyBtn}
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                >
                  +
                </button>
              </div>
              <div className={styles.itemTotal}>
                <p className={styles.totalLabel}>Subtotal</p>
                <p className={styles.totalValue}>{formatCurrency(product.price * quantity)}</p>
              </div>
              <button className={styles.removeBtn} onClick={() => removeItem(product.id)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.total}`}>
            <span>Total</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
          <Button onClick={() => navigate('/checkout')}>Proceed to Checkout</Button>
        </div>
      </div>
    </div>
  );
}

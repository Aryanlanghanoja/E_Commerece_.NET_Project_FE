import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context';
import { addressApi, orderApi } from '../../api';
import { Button, Loading, Alert } from '../../components';
import { formatCurrency } from '../../utils';
import type { Address } from '../../types';
import styles from './Checkout.module.css';

export function Checkout() {
  const { items, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [arrivingTime, setArrivingTime] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const response = await addressApi.getAll();
      if (response.success && response.data) {
        setAddresses(response.data);
        if (response.data.length > 0) {
          setSelectedAddressId(response.data[0].id);
        }
      }
    } catch {
      setError('Failed to load addresses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAddressId) {
      setError('Please select a delivery address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      const response = await orderApi.create({
        addressId: selectedAddressId,
        arrivingTime: arrivingTime || undefined,
        items: orderItems,
      });

      if (response.success && response.data) {
        clearCart();
        navigate(`/orders/${response.data.id}`);
      }
    } catch {
      setError('Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loading text="Loading checkout..." />;
  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Checkout</h1>

      {error && <Alert type="error" message={error} />}

      <div className={styles.checkoutLayout}>
        <div className={styles.sections}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Delivery Address</h2>
            {addresses.length === 0 ? (
              <p className={styles.noAddress}>
                No addresses found. <a href="/addresses">Add an address</a>
              </p>
            ) : (
              <div className={styles.addresses}>
                {addresses.map((address) => (
                  <label
                    key={address.id}
                    className={`${styles.addressCard} ${selectedAddressId === address.id ? styles.selected : ''}`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddressId === address.id}
                      onChange={() => setSelectedAddressId(address.id)}
                      className={styles.addressRadio}
                    />
                    <div className={styles.addressContent}>
                      <p className={styles.addressLine}>{address.line1}</p>
                      <p className={styles.addressLine}>
                        {address.city}, {address.state} {address.pincode}
                      </p>
                      <p className={styles.addressLine}>{address.country}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Delivery Time (Optional)</h2>
            <input
              type="datetime-local"
              value={arrivingTime}
              onChange={(e) => setArrivingTime(e.target.value)}
              className={styles.datetimeInput}
            />
          </div>
        </div>

        <div className={styles.orderSummary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          <div className={styles.items}>
            {items.map(({ product, quantity }) => (
              <div key={product.id} className={styles.item}>
                <span className={styles.itemName}>{product.name}</span>
                <span className={styles.itemQty}>x{quantity}</span>
                <span className={styles.itemPrice}>{formatCurrency(product.price * quantity)}</span>
              </div>
            ))}
          </div>
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
          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={addresses.length === 0}
          >
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
}

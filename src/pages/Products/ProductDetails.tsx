import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productApi, feedbackApi } from '../../api';
import { useCart } from '../../context';
import { Loading, Alert, Button } from '../../components';
import { formatCurrency, formatDate } from '../../utils';
import type { Product, Feedback } from '../../types';
import styles from './ProductDetails.module.css';

export function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);

  const loadProduct = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await productApi.getById(parseInt(id));
      if (response.success && response.data) {
        setProduct(response.data);
      } else {
        setError('Product not found');
      }
    } catch {
      setError('Failed to load product');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const loadReviews = useCallback(async () => {
    if (!id) return;
    try {
      const response = await feedbackApi.getByProductId(parseInt(id), { pageSize: 5 });
      if (response.success && response.data) {
        setReviews(response.data.items);
      }
    } catch {
      console.error('Failed to load reviews');
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadProduct();
      loadReviews();
    }
  }, [id, loadProduct, loadReviews]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  if (isLoading) return <Loading text="Loading product..." />;
  if (error) return <Alert type="error" message={error} />;
  if (!product) return null;

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backBtn}>
        ← Back
      </button>

      <div className={styles.product}>
        <div className={styles.imagePlaceholder}>
          <span>{product.categoryName}</span>
        </div>
        <div className={styles.details}>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.category}>{product.categoryName}</p>
          
          <div className={styles.priceSection}>
            <span className={styles.price}>{formatCurrency(product.price)}</span>
            {product.averageRating && (
              <span className={styles.rating}>
                {'★'.repeat(Math.round(product.averageRating))}
                {'☆'.repeat(5 - Math.round(product.averageRating))}
                <span className={styles.reviewCount}>({product.reviewCount} reviews)</span>
              </span>
            )}
          </div>

          <p className={styles.description}>{product.description}</p>

          <Button onClick={handleAddToCart}>
            {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
          </Button>
        </div>
      </div>

      {reviews.length > 0 && (
        <div className={styles.reviews}>
          <h2 className={styles.reviewsTitle}>Customer Reviews</h2>
          {reviews.map((review) => (
            <div key={review.id} className={styles.review}>
              <div className={styles.reviewHeader}>
                <span className={styles.reviewerEmail}>{review.userEmail}</span>
                <span className={styles.reviewRating}>
                  {'★'.repeat(review.rating)}
                </span>
              </div>
              {review.review && <p className={styles.reviewText}>{review.review}</p>}
              <span className={styles.reviewDate}>{formatDate(review.createdAt)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

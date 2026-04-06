import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { formatCurrency } from '../../utils';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/products/${product.id}`} className={styles.card}>
      <div className={styles.imagePlaceholder}>
        <span>{product.categoryName}</span>
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.category}>{product.categoryName}</p>
        <div className={styles.footer}>
          <span className={styles.price}>{formatCurrency(product.price)}</span>
          {product.averageRating && (
            <span className={styles.rating}>
              {'★'.repeat(Math.round(product.averageRating))}
              {'☆'.repeat(5 - Math.round(product.averageRating))}
              <span className={styles.reviewCount}>({product.reviewCount})</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

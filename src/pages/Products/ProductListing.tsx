import { useState, useEffect, useCallback } from 'react';
import { productApi, categoryApi } from '../../api';
import { ProductCard, Loading, Alert } from '../../components';
import type { Product, Category } from '../../types';
import styles from './ProductListing.module.css';

export function ProductListing() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoryApi.getAll();
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch {
        console.error('Failed to load categories');
      }
    };
    loadCategories();
  }, []);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await productApi.getAll({
        categoryId: selectedCategory || undefined,
        page,
        pageSize: 12,
      });
      if (response.success && response.data) {
        setProducts(response.data.items);
        setTotalPages(response.data.totalPages);
      }
    } catch {
      setError('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, page]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Products</h1>

      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${!selectedCategory ? styles.active : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`${styles.filterBtn} ${selectedCategory === category.id ? styles.active : ''}`}
            onClick={() => {
              setSelectedCategory(category.id);
              setPage(1);
            }}
          >
            {category.name}
          </button>
        ))}
      </div>

      {error && <Alert type="error" message={error} />}

      {isLoading ? (
        <Loading text="Loading products..." />
      ) : products.length === 0 ? (
        <p className={styles.empty}>No products found</p>
      ) : (
        <>
          <div className={styles.grid}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <span className={styles.pageInfo}>
                Page {page} of {totalPages}
              </span>
              <button
                className={styles.pageBtn}
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

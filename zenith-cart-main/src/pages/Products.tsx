import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Star, ShoppingCart as CartIcon, Loader2 } from 'lucide-react';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { useCartStore } from '@/stores/cartStore';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import type { Product } from '@/services/apiService';

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Rating', value: 'rating' },
];

const Products = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [sort, setSort] = useState('featured');
  const [page, setPage] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const totalItems = useCartStore((s) => s.totalItems());

  const categoryId = category !== 'All' ? parseInt(category) : undefined;
  const { data: productsResponse, isLoading } = useProducts({ categoryId, page, pageSize: 12 });
  const { data: categories } = useCategories();

  const products = productsResponse?.items || [];
  
  const filtered = useMemo(() => {
    const result = products.filter((p: Product) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchSearch;
    });
    if (sort === 'price-asc') return [...result].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') return [...result].sort((a, b) => b.price - a.price);
    if (sort === 'rating') return [...result].sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    return result;
  }, [products, search, sort]);

  const handleAddToCart = (product: Product) => {
    const cartProduct = {
      id: product.id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      image: '/placeholder.png',
      category: product.categoryName,
      rating: product.averageRating || 0,
      reviewCount: product.reviewCount || 0,
      inStock: true,
      vendorId: product.vendorId.toString(),
    };
    addItem(cartProduct);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground text-sm">{filtered.length} products found</p>
        </div>
        {totalItems > 0 && (
          <Link
            to="/cart"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <CartIcon className="h-4 w-4" />
            Go to Cart ({totalItems})
          </Link>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 px-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="All">All Categories</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id.toString()}>{c.name}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-10 px-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {sortOptions.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="bg-card rounded-xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="relative aspect-square overflow-hidden bg-muted">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                  <span className="text-4xl text-muted-foreground/30">{product.name[0]}</span>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.categoryName}</p>
                <h3 className="font-semibold text-sm line-clamp-2 leading-snug">{product.name}</h3>
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                  <span className="text-xs font-medium">{product.averageRating?.toFixed(1) || 'N/A'}</span>
                  <span className="text-xs text-muted-foreground">({product.reviewCount || 0})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full mt-1 h-9 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && !isLoading && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No products found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {productsResponse && productsResponse.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={!productsResponse.hasPreviousPage}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {productsResponse.page} of {productsResponse.totalPages}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={!productsResponse.hasNextPage}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;

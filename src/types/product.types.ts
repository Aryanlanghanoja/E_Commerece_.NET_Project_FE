export interface Category {
  id: number;
  name: string;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  description?: string;
  price: number;
  vendorId: number;
  averageRating?: number;
  reviewCount?: number;
  createdAt: string;
}

export interface ProductListResponse {
  items: Product[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CreateProductRequest {
  name: string;
  categoryId: number;
  description?: string;
  price: number;
}

export interface UpdateProductRequest extends CreateProductRequest {
  id: number;
}

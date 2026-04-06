export interface Feedback {
  id: number;
  productId: number;
  userId: number;
  userEmail: string;
  rating: number;
  review?: string;
  createdAt: string;
}

export interface FeedbackListResponse {
  items: Feedback[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CreateFeedbackRequest {
  productId: number;
  rating: number;
  review?: string;
}

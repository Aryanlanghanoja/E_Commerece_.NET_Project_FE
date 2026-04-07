import { useState } from 'react';
import { Star, Send, MessageSquare, Loader2 } from 'lucide-react';
import { useProductFeedback, useSubmitFeedback } from '@/hooks/useFeedback';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const StarRating = ({ rating, onChange, size = 'md' }: { rating: number; onChange?: (r: number) => void; size?: 'sm' | 'md' }) => {
  const [hover, setHover] = useState(0);
  const sizeClass = size === 'sm' ? 'h-4 w-4' : 'h-6 w-6';

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHover(star)}
          onMouseLeave={() => onChange && setHover(0)}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}
          disabled={!onChange}
        >
          <Star
            className={`${sizeClass} transition-colors ${
              star <= (hover || rating)
                ? 'fill-primary text-primary'
                : 'text-muted-foreground/30'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const Feedback = () => {
  const [productId, setProductId] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const { data: feedbackData, isLoading: feedbackLoading } = useProductFeedback(
    productId ? parseInt(productId) : 0,
    { pageSize: 20 }
  );
  const submitFeedback = useSubmitFeedback();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || rating === 0) {
      toast.error('Please provide a product ID and rating');
      return;
    }

    try {
      await submitFeedback.mutateAsync({
        productId: parseInt(productId),
        rating,
        review: comment,
      });
      setSubmitted(true);
      setRating(0);
      setComment('');
      toast.success('Feedback submitted successfully!');
      setTimeout(() => {
        setSubmitted(false);
        setProductId('');
      }, 3000);
    } catch {
      toast.error('Failed to submit feedback');
    }
  };

  const reviews = feedbackData?.items || [];
  const avgRating = reviews.length > 0 
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Feedback</h1>
        <p className="text-muted-foreground text-sm">Share your experience and read reviews</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4 sticky top-20">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Write a Review
            </h2>

            {submitted ? (
              <div className="text-center py-8">
                <div className="h-12 w-12 rounded-full bg-success/10 text-success mx-auto flex items-center justify-center mb-3">
                  <Star className="h-6 w-6 fill-current" />
                </div>
                <p className="font-semibold">Thank you!</p>
                <p className="text-sm text-muted-foreground">Your feedback has been submitted.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Product ID</Label>
                  <Input
                    type="number"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    placeholder="Enter product ID"
                    min="1"
                  />
                </div>
                <div>
                  <Label>Your Rating</Label>
                  <StarRating rating={rating} onChange={setRating} />
                  {rating === 0 && (
                    <p className="text-xs text-muted-foreground mt-1">Click a star to rate</p>
                  )}
                </div>
                <div>
                  <Label>Your Review</Label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder="Tell us about your experience..."
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!productId || rating === 0 || submitFeedback.isPending}
                  className="w-full bg-primary"
                >
                  {submitFeedback.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Review
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-6 mb-4">
              <Input
                type="number"
                placeholder="Enter product ID to view reviews..."
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="max-w-xs"
              />
              <Button 
                variant="outline" 
                onClick={() => setShowForm(!showForm)}
                disabled={!productId}
              >
                {showForm ? 'Hide Form' : 'Write Review'}
              </Button>
            </div>

            {showForm && (
              <form onSubmit={handleSubmit} className="mb-6 p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex items-center gap-3">
                  <Label>Rating:</Label>
                  <StarRating rating={rating} onChange={setRating} />
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="Write your review..."
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm resize-none"
                />
                <Button type="submit" size="sm" disabled={rating === 0 || submitFeedback.isPending}>
                  Submit
                </Button>
              </form>
            )}

            {feedbackLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : productId ? (
              reviews.length > 0 ? (
                <>
                  <div className="flex items-center gap-6 mb-6 p-4 bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <p className="text-3xl font-bold">{avgRating.toFixed(1)}</p>
                      <StarRating rating={Math.round(avgRating)} size="sm" />
                      <p className="text-xs text-muted-foreground mt-1">{reviews.length} reviews</p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = reviews.filter((r) => r.rating === star).length;
                        const pct = (count / reviews.length) * 100;
                        return (
                          <div key={star} className="flex items-center gap-2 text-sm">
                            <span className="w-3 text-muted-foreground">{star}</span>
                            <Star className="h-3 w-3 fill-primary text-primary" />
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="w-6 text-xs text-muted-foreground text-right">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-border pb-4 last:border-0">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-bold">
                              {review.userEmail[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-semibold">{review.userEmail}</p>
                              <StarRating rating={review.rating} size="sm" />
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {review.review && (
                          <p className="text-sm text-muted-foreground mt-2">{review.review}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No reviews found for this product.
                </div>
              )
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Enter a product ID to view reviews.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;

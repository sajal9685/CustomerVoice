import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import StarRating from './StarRating';

const ProductDetailModal = ({ 
  product, 
  currentUser, 
  onClose, 
  fetchProductReviews, 
  fetchAverageRating, 
  apiBase 
}) => {
  const [productReviews, setProductReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [newReview, setNewReview] = useState({ rating: 5, text: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
   const reviews = await fetchProductReviews(product.id);
setProductReviews(reviews);

const validRatings = reviews
  .map(r => Number(r.rating))
  .filter(r => !isNaN(r));

if (validRatings.length > 0) {
  const total = validRatings.reduce((sum, r) => sum + r, 0);
  const avg = total / validRatings.length;
  setAvgRating(avg);
} else {
  setAvgRating(0);
}

    };
    loadData();
  }, [product.id, fetchProductReviews, fetchAverageRating]);

  const submitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`${apiBase}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser.id,
          product_id: product.id,
          rating: newReview.rating,
          text: newReview.text
        })
      });

      if (response.ok) {
        const reviews = await fetchProductReviews(product.id);
        const rating = await fetchAverageRating(product.id);
        setProductReviews(reviews);
        setAvgRating(rating);
        setNewReview({ rating: 5, text: '' });
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
  <div className="relative bg-white rounded-xl w-full max-w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-hidden">
    {/* Close Button in top-right */}
    <button
      onClick={onClose}
      className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 z-10"
    >
      ×
    </button>

    {/* Scrollable content inside the modal */}
    <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-2rem)]">
      {/* Product header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{product.title}</h2>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">{product.description}</p>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <StarRating rating={Math.round(avgRating)} readonly />
          <span className="text-sm font-semibold">({avgRating.toFixed(1)})</span>
          <span className="text-gray-600 text-sm">{productReviews.length} reviews</span>
          <span className="text-lg font-bold text-green-600">${product.price}</span>
        </div>
      </div>

      {/* Two-column layout responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Review Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Add Your Review</h3>
          <form onSubmit={submitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating
              </label>
              <StarRating
                rating={newReview.rating}
                onRatingChange={(rating) =>
                  setNewReview((prev) => ({ ...prev, rating }))
                }
                size={24}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Text (Optional)
              </label>
              <textarea
                value={newReview.text}
                onChange={(e) =>
                  setNewReview((prev) => ({ ...prev, text: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                rows="4"
                placeholder="Share your thoughts about this product..."
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>

        {/* Review List */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
            {productReviews.map((review, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800 text-sm">
                    {review['concat (first_name, " ", last_name)']}
                  </span>
                  <StarRating rating={review.rating} readonly size={16} />
                </div>
                {review.text && (
                  <p className="text-gray-600 text-sm">{review.text}</p>
                )}
              </div>
            ))}
            {productReviews.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


  );
};

export default ProductDetailModal;
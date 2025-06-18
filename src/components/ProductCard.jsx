import React, { useState, useEffect } from 'react';
import { ShoppingBag, Eye, Edit, Trash2 } from 'lucide-react';
import StarRating from './StarRating';

const ProductCard = ({ 
  product, 
  onEdit, 
  onDelete, 
  onView, 
  fetchAverageRating, 
  fetchProductReviews 
}) => {
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

useEffect(() => {
  const loadProductData = async () => {
    const reviews = await fetchProductReviews(product.id);
    setReviewCount(reviews.length);

    const validRatings = reviews
      .map(r => Number(r.rating))
      .filter(rating => !isNaN(rating));

    if (validRatings.length > 0) {
      const total = validRatings.reduce((sum, r) => sum + r, 0);
      const avg = total / validRatings.length;
      setAvgRating(avg);
    } else {
      setAvgRating(0);
    }
  };

  loadProductData();
}, [product.id, fetchProductReviews]);



  return (
   <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
  <div className="h-40 sm:h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative overflow-hidden">
    {product.image ? (
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-full object-cover"
      />
    ) : (
      <ShoppingBag size={40} className="text-gray-400" />
    )}
    <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-bold text-green-600">
      Rs.{product.price}
    </div>
  </div>
  <div className="p-3 sm:p-4">
    <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-1 line-clamp-1">{product.title}</h3>
    <p className="text-gray-600 text-sm mb-2 sm:mb-3 line-clamp-2">{product.description}</p>

    <div className="flex items-center justify-between mb-2 sm:mb-3">
      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
        {product.category}
      </span>
      <div className="flex items-center space-x-1">
        <StarRating rating={Math.round(avgRating)} readonly size={14} />
        <span className="text-xs text-gray-600">({avgRating.toFixed(1)})</span>
      </div>
    </div>

    <div className="text-xs text-gray-500 mb-3">
      {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
    </div>

    <div className="flex space-x-2">
      <button
        onClick={() => onView(product)}
        className="flex-1 bg-blue-600 text-grey-100 px-3 py-2 rounded-lg hover:bg-blue-700 text-xs sm:text-sm font-medium flex items-center justify-center space-x-1"
      >
        <Eye size={14} />
        <span>View</span>
      </button>
      <button
        onClick={() => onEdit(product)}
        className="p-2 text-gray-600 hover:text-blue-600 border border-gray-200 rounded-lg hover:border-blue-300"
      >
        <Edit size={14} />
      </button>
      <button
        onClick={() => onDelete(product.id)}
        className="p-2 text-gray-600 hover:text-red-600 border border-gray-200 rounded-lg hover:border-red-300"
      >
        <Trash2 size={14} />
      </button>
    </div>
  </div>
</div>

  );
};

export default ProductCard;
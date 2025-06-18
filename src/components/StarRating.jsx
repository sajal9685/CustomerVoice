import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, onRatingChange, readonly = false, size = 20 }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`transition-colors ${
            star <= (hoverRating || rating)
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300'
          } ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
          onClick={() => !readonly && onRatingChange && onRatingChange(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
        />
      ))}
    </div>
  );
};

export default StarRating;
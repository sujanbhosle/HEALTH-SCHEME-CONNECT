
import React from 'react';
import type { Review } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface ReviewCardProps {
  review: Review;
}

const Stars: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const { t } = useLanguage();
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold mr-3">
                {review.user_id.charAt(0).toUpperCase()}
            </div>
            <div>
                <h4 className="font-semibold text-text-primary">{review.title}</h4>
                <p className="text-sm text-text-muted">by User {review.user_id}</p>
            </div>
        </div>
        <Stars rating={review.rating} />
      </div>
      <p className="text-text-secondary mt-3">{review.body}</p>
      {review.verified && (
        <span className="mt-3 inline-block text-xs font-semibold py-1 px-2 uppercase rounded-full text-green-600 dark:text-green-300 bg-green-200 dark:bg-green-900/50">
          {t('verifiedReview')}
        </span>
      )}
    </div>
  );
};

export default ReviewCard;

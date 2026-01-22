import { Review } from '@/types';

interface ReviewDisplayProps {
  review: Review;
  onDelete?: (id: number) => void;
}

const ReviewDisplay = ({ review, onDelete }: ReviewDisplayProps) => {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">★</span>);
      }
    }
    return stars;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center mb-2">
            {renderStars(review.rating)}
            <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
          </div>
          <p className="text-sm text-gray-500">
            {formatDate(review.created_at)}
          </p>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(review.id)}
            className="text-red-500 hover:text-red-700 transition-colors duration-200"
          >
            Delete
          </button>
        )}
      </div>
      
      <div className="prose max-w-none">
        <p className="text-gray-700 whitespace-pre-wrap">{review.content}</p>
      </div>

      {review.compared_products && Object.keys(review.compared_products).length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Compared Products:</h4>
          <div className="text-sm text-gray-600">
            {Object.entries(review.compared_products).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {String(value)}
              </div>
            ))}
          </div>
        </div>
      )}

      {review.error_message && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">
            <strong>Error:</strong> {review.error_message}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewDisplay;

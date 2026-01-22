'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import ReviewDisplay from '@/components/ReviewDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fetchProduct, fetchReviews, generateReview, deleteReview } from '@/lib/api';
import { Product, Review } from '@/types';

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingReview, setGeneratingReview] = useState(false);
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = await fetchProduct(productId);
        setProduct(productData);
        
        const reviewsData = await fetchReviews(productId);
        setReviews(reviewsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const handleGenerateReview = async () => {
    if (!product) return;
    
    setGeneratingReview(true);
    try {
      const newReview = await generateReview(product.id);
      setReviews([newReview, ...reviews]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate review');
    } finally {
      setGeneratingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    try {
      await deleteReview(reviewId);
      setReviews(reviews.filter((review: Review) => review.id !== reviewId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error || 'Product not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img
                src={product.image_url || 'https://via.placeholder.com/300x300'}
                alt={product.name}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="md:w-2/3 p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{product.brand}</p>
              <p className="text-gray-700 mb-4">{product.description}</p>
              <div className="flex items-center mb-4">
                <span className="text-2xl font-bold text-green-600">${product.price}</span>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">{product.category}</span>
              </div>
              
              {/* Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Specifications</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <span className="font-medium">{key}:</span> {String(value)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
            <button
              onClick={handleGenerateReview}
              disabled={generatingReview}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 transition-colors duration-200"
            >
              {generatingReview ? 'Generating...' : 'Generate AI Review'}
            </button>
          </div>

          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No reviews yet. Generate an AI-powered review to get started!
            </p>
          ) : (
            <div>
              {reviews.map((review) => (
                <ReviewDisplay
                  key={review.id}
                  review={review}
                  onDelete={handleDeleteReview}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

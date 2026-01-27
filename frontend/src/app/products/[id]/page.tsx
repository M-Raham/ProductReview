'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ReviewDisplay from '@/components/ReviewDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fetchProduct, fetchArticles, generateArticle, deleteArticle, updateProduct, deleteProduct } from '@/lib/api';
import { Product, Review } from '@/types';
import ReactMarkdown from 'react-markdown';
import { cleanMarkdown } from '@/utils/markdown';

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [articles, setArticles] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingArticle, setGeneratingArticle] = useState(false);
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = await fetchProduct(productId);
        setProduct(productData);
        
        const articlesData = await fetchArticles(productId);
        setArticles(articlesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const handleGenerateArticle = async () => {
    if (!product) return;
    
    setGeneratingArticle(true);
    try {
      const newArticle = await generateArticle(product.id);
      setArticles([newArticle, ...articles]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate article');
    } finally {
      setGeneratingArticle(false);
    }
  };

  const handleDeleteArticle = async (articleId: number) => {
    try {
      await deleteArticle(articleId);
      setArticles(articles.filter((article: Review) => article.id !== articleId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete article');
    }
  };

  const handleEditProduct = () => {
    router.push(`/products/${productId}/edit`);
  };

  const handleDeleteProduct = async () => {
    if (window.confirm('Are you sure you want to delete this product? This will also delete all associated articles.')) {
      try {
        await deleteProduct(productId);
        router.push('/');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete product');
      }
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
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                  <p className="text-lg text-gray-600">{product.brand}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleEditProduct}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors duration-200"
                  >
                    Edit Product
                  </button>
                  <button
                    onClick={handleDeleteProduct}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
                  >
                    Delete Product
                  </button>
                </div>
              </div>
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

        {/* Articles Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Articles</h2>
            <div className="space-x-3">
              <button
                onClick={handleGenerateArticle}
                disabled={generatingArticle}
                className="bg-purple-500 text-white px-6 py-2 rounded-md hover:bg-purple-600 disabled:bg-gray-400 transition-colors duration-200"
              >
                {generatingArticle ? 'Generating...' : 'Generate AI Article'}
              </button>
              <Link
                href="/articles"
                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors duration-200"
              >
                View All Articles
              </Link>
            </div>
          </div>

          {articles.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No articles yet. Generate an in-depth AI article to get started!
            </p>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <div key={article.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      <Link 
                        href={`/articles/${article.id}`}
                        className="hover:text-purple-600 transition-colors duration-200"
                      >
                        Article for {product?.name}
                      </Link>
                    </h3>
                    <span className="text-sm text-gray-500">
                      {new Date(article.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="prose max-w-none mb-3">
                    <div className="text-black">
                      <ReactMarkdown
                        components={{
                          p: ({children}) => <p className="text-black inline">{children}</p>,
                          strong: ({children}) => <strong className="font-bold text-black">{children}</strong>,
                        }}
                      >
                        {cleanMarkdown(article.content.length > 200 ? article.content.substring(0, 200) + '...' : article.content)}
                      </ReactMarkdown>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Link
                      href={`/articles/${article.id}`}
                      className="text-purple-600 hover:text-purple-800 font-medium text-sm"
                    >
                      Read Full Article →
                    </Link>
                    <button
                      onClick={() => handleDeleteArticle(article.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

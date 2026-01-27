'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchProducts } from '@/lib/api';
import { fetchArticles } from '@/lib/api';
import { Product, Review } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import ReactMarkdown from 'react-markdown';
import { cleanMarkdown } from '@/utils/markdown';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        // Get all products first
        const productsData = await fetchProducts();
        setProducts(productsData);
        
        // Get articles for each product
        const allArticles: Review[] = [];
        for (const product of productsData) {
          try {
            const productArticles = await fetchArticles(product.id);
            allArticles.push(...productArticles.map(article => ({
              ...article,
              productName: product.name
            })));
          } catch (err) {
            console.warn(`Failed to load articles for product ${product.id}:`, err);
          }
        }
        
        setArticles(allArticles.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load articles');
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Articles</h1>
              <p className="mt-2 text-gray-600">
                In-depth articles and reviews about the latest products
              </p>
            </div>
            <Link
              href="/"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles yet</h3>
              <p className="text-gray-600">Start by generating articles for products.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <time dateTime={article.created_at}>
                      {formatDate(article.created_at)}
                    </time>
                    <span className="mx-2">•</span>
                    <span>{(article as any).productName}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    <Link 
                      href={`/articles/${article.id}`}
                      className="hover:text-blue-600 transition-colors duration-200"
                    >
                      Article for {(article as any).productName}
                    </Link>
                  </h2>
                  <div className="prose prose-sm max-w-none mb-4">
                    <div className="text-black">
                      <ReactMarkdown
                        components={{
                          p: ({children}) => <p className="text-black inline">{children}</p>,
                          strong: ({children}) => <strong className="font-bold text-black">{children}</strong>,
                        }}
                      >
                        {cleanMarkdown(article.content.length > 150 ? article.content.substring(0, 150) + '...' : article.content)}
                      </ReactMarkdown>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/articles/${article.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Read More →
                    </Link>
                    {article.rating && (
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 text-sm text-gray-600">{article.rating}/5</span>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Review, Product } from '@/types';
import { cleanMarkdown } from '@/utils/markdown';

interface ArticleContentProps {
  article: Review;
  product: Product | null;
}

export default function ArticleContent({ article, product }: ArticleContentProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Article Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <nav className="mb-8">
            <Link 
              href="/articles" 
              className="text-blue-100 hover:text-white transition-colors duration-200"
            >
              ← Back to Articles
            </Link>
          </nav>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Article for {product?.name || 'Product'}
          </h1>
          
          <div className="flex items-center space-x-4 text-blue-100">
            <time dateTime={article.created_at}>
              {formatDate(article.created_at)}
            </time>
            <span>•</span>
            <span>By Product Review AI</span>
            {article.rating && (
              <>
                <span>•</span>
                <div className="flex items-center">
                  <span className="text-yellow-300">★</span>
                  <span className="ml-1">{article.rating}/5</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none text-black">
          <div className="text-black [&_*]:text-black [&_h1]:text-gray-900 [&_h2]:text-gray-900 [&_h3]:text-gray-900 [&_h4]:text-gray-900 [&_h5]:text-gray-900 [&_h6]:text-gray-900 [&_a]:text-blue-600 [&_a:hover]:text-blue-800 [&_strong]:text-black [&_em]:text-black [&_blockquote]:text-gray-700 [&_code]:text-black [&_pre]:text-black [&_ul]:text-black [&_ol]:text-black [&_li]:text-black [&_p]:text-black [&_span]:text-black [&_div]:text-black">
            <ReactMarkdown
              components={{
                h1: ({children}) => <h1 className="text-3xl font-bold text-gray-900 mb-4">{children}</h1>,
                h2: ({children}) => <h2 className="text-2xl font-bold text-gray-900 mb-3">{children}</h2>,
                h3: ({children}) => <h3 className="text-xl font-bold text-gray-900 mb-2">{children}</h3>,
                p: ({children}) => <p className="text-black mb-4 leading-relaxed">{children}</p>,
                ul: ({children}) => <ul className="list-disc list-inside text-black mb-4">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal list-inside text-black mb-4">{children}</ol>,
                li: ({children}) => <li className="text-black mb-1">{children}</li>,
                strong: ({children}) => <strong className="font-bold text-black">{children}</strong>,
                blockquote: ({children}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700 my-4">{children}</blockquote>,
              }}
            >
              {cleanMarkdown(article.content)}
            </ReactMarkdown>
          </div>
        </div>

        {/* Product CTA Section */}
        {product && (
          <div className="mt-16 bg-gray-50 rounded-lg p-8 border border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Interested in this product?
                </h3>
                <p className="text-gray-600 mb-4">
                  {product.name} - {product.description}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="font-medium">Brand: {product.brand}</span>
                  <span>•</span>
                  <span className="font-medium">Price: {product.price}</span>
                  <span>•</span>
                  <span className="font-medium">Category: {product.category}</span>
                </div>
              </div>
              <div className="flex flex-col space-y-3">
                <Link
                  href={`/products/${product.id}`}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 text-center"
                >
                  View Full Product Details
                </Link>
                <Link
                  href={`/products/${product.id}#articles`}
                  className="bg-white text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 text-center"
                >
                  Read More Articles
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

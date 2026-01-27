import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchArticleById } from '@/lib/api';
import { Product, Review } from '@/types';
import ArticleContent from '@/components/ArticleContent';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  try {
    const articleId = parseInt(params.slug);
    if (isNaN(articleId)) {
      return {
        title: 'Article Not Found',
        description: 'The requested article could not be found.',
      };
    }

    const { article, product } = await fetchArticleById(articleId);
    
    return {
      title: `Article for ${product.name}`,
      description: 'Comprehensive product review and analysis',
    };
  } catch (error) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    };
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const articleId = parseInt(params.slug);
  
  if (isNaN(articleId)) {
    notFound();
  }
  
  try {
    const { article, product } = await fetchArticleById(articleId);

    const jsonLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": `Article for ${product.name}`,
      "description": "Comprehensive product review and analysis",
      "datePublished": article.created_at,
      "dateModified": article.updated_at,
      "author": {
        "@type": "Organization",
        "name": "Product Review AI"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Product Review AI"
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${process.env.NEXT_PUBLIC_SITE_URL || ''}/articles/${article.id}`
      }
    });

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
        <ArticleContent article={article} product={product} />
      </>
    );
  } catch (error) {
    console.error('Error loading article:', error);
    notFound();
  }
}

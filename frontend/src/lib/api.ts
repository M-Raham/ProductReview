import { Product, Review, CreateProductData } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new ApiError(error || 'Something went wrong', response.status);
  }
  return response.json();
};

// Products API
export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_URL}/api/v1/products`);
  return handleResponse(response);
};

export const fetchProduct = async (id: number): Promise<Product> => {
  const response = await fetch(`${API_URL}/api/v1/products/${id}`);
  return handleResponse(response);
};

export const createProduct = async (data: CreateProductData): Promise<Product> => {
  const response = await fetch(`${API_URL}/api/v1/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const updateProduct = async (id: number, data: Partial<CreateProductData>): Promise<Product> => {
  const response = await fetch(`${API_URL}/api/v1/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const deleteProduct = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/api/v1/products/${id}`, {
    method: 'DELETE',
  });
  await handleResponse(response);
};

// Articles API (formerly Reviews)
export const fetchArticles = async (productId: number): Promise<Review[]> => {
  const response = await fetch(`${API_URL}/api/v1/products/${productId}/articles`);
  return handleResponse(response);
};

export const generateArticle = async (productId: number): Promise<Review> => {
  const response = await fetch(`${API_URL}/api/v1/articles/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ product_id: productId }),
  });
  return handleResponse(response);
};

export const deleteArticle = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/api/v1/articles/${id}`, {
    method: 'DELETE',
  });
  await handleResponse(response);
};

export const fetchArticleById = async (id: number): Promise<{ article: Review; product: Product }> => {
  console.log(`=== STARTING ARTICLE FETCH ===`);
  console.log(`Fetching article ${id}...`);
  
  try {
    // Get all products and find which one has this article
    console.log(`Step 1: Fetching all products from ${API_URL}/api/v1/products`);
    const productsResponse = await fetch(`${API_URL}/api/v1/products`);
    if (!productsResponse.ok) {
      throw new Error(`Failed to fetch products: ${productsResponse.status} ${productsResponse.statusText}`);
    }
    const products = await productsResponse.json();
    
    console.log(`Step 2: Found ${products.length} products`);
    console.log(`Products:`, products.map((p: any) => ({ id: p.id, name: p.name })));
    
    for (const product of products) {
      console.log(`\nStep 3: Checking articles for product ${product.id} (${product.name})`);
      try {
        // Use the same endpoint as fetchArticles
        const articlesResponse = await fetch(`${API_URL}/api/v1/products/${product.id}/articles`);
        if (!articlesResponse.ok) {
          console.log(`❌ Failed to fetch articles for product ${product.id}: ${articlesResponse.status}`);
          continue;
        }
        const articles = await articlesResponse.json();
        
        console.log(`✅ Product ${product.id} has ${articles.length} articles:`, articles.map((a: any) => ({ id: a.id, created: a.created_at })));
        
        // Check if any article matches the requested ID
        const article = articles.find((a: Review) => a.id === id);
        if (article) {
          console.log(`🎉 SUCCESS: Found article ${id} in product ${product.id} (${product.name})`);
          console.log(`Article details:`, { 
            id: article.id, 
            product_id: article.product_id, 
            created: article.created_at, 
            rating: article.rating,
            status: article.generation_status 
          });
          return { article, product };
        } else {
          console.log(`❌ Article ${id} not found in product ${product.id}. Available IDs:`, articles.map((a: any) => a.id));
        }
      } catch (error) {
        console.error(`❌ Error fetching articles for product ${product.id}:`, error);
        continue;
      }
    }
    
    console.log(`\n❌ FAILURE: Article ${id} not found in any product`);
    console.log(`This is strange because the database shows the article exists.`);
    console.log(`Possible causes:`);
    console.log(`1. API endpoint returning different data than database`);
    console.log(`2. Product ID mismatch in the search`);
    console.log(`3. API caching issue`);
    
    throw new Error(`Article ${id} not found in any of ${products.length} products (but it exists in database)`);
  } catch (error) {
    console.error(`❌ ERROR in fetchArticleById:`, error);
    throw error;
  }
};

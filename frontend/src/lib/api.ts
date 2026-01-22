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

// Reviews API
export const fetchReviews = async (productId: number): Promise<Review[]> => {
  const response = await fetch(`${API_URL}/api/v1/products/${productId}/reviews`);
  return handleResponse(response);
};

export const generateReview = async (productId: number): Promise<Review> => {
  const response = await fetch(`${API_URL}/api/v1/reviews/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ product_id: productId }),
  });
  return handleResponse(response);
};

export const deleteReview = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/api/v1/reviews/${id}`, {
    method: 'DELETE',
  });
  await handleResponse(response);
};

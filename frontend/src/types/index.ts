export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: string;
  brand: string;
  specifications: Record<string, any>;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  product_id: number;
  content: string;
  compared_products: Record<string, any>;
  rating: number;
  generation_status: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  category: string;
  price: string;
  brand: string;
  specifications: Record<string, any>;
  image_url: string;
}

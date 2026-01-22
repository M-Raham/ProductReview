# Product Review Backend API

This is a Rails 7 API-only backend for the Product Review application with AI-powered review generation.

## Features

- RESTful API for products and reviews
- PostgreSQL database
- OpenAI integration for AI-generated reviews
- CORS configuration for frontend integration
- Comprehensive seed data

## Requirements

- Ruby 3.2+
- Rails 7.2+
- PostgreSQL
- OpenAI API key

## Setup

1. Install dependencies:
   ```bash
   bundle install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your OpenAI API key
   ```

3. Create and setup the database:
   ```bash
   rails db:create
   rails db:migrate
   rails db:seed
   ```

4. Start the server:
   ```bash
   rails s -p 3001
   ```

## API Endpoints

### Products
- `GET /api/v1/products` - List all products
- `GET /api/v1/products/:id` - Get single product with reviews
- `POST /api/v1/products` - Create new product
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product

### Reviews
- `GET /api/v1/products/:product_id/reviews` - List product reviews
- `POST /api/v1/products/:product_id/reviews/generate` - Generate AI review
- `DELETE /api/v1/reviews/:id` - Delete review

## Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key
- `OPENAI_MODEL` - OpenAI model to use (default: gpt-3.5-turbo)

## Database Schema

### Products
- `name` (string, not null)
- `description` (text, not null)
- `category` (string)
- `price` (decimal, precision: 10, scale: 2)
- `brand` (string)
- `specifications` (jsonb, default: {})
- `image_url` (string)

### Reviews
- `product_id` (foreign key, not null)
- `content` (text, not null)
- `compared_products` (jsonb, default: [])
- `rating` (integer)
- `generation_status` (string, default: 'completed')
- `error_message` (text)

## AI Review Generation

The ReviewGeneratorService:
- Finds 3 similar products in the same category
- Builds a comprehensive prompt for OpenAI
- Generates 300-500 word professional reviews
- Compares with similar products when available
- Extracts and saves star ratings

## Development

To run the test suite:
```bash
rails test
```

To run in development mode:
```bash
rails s -e development -p 3001
```

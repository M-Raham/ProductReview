# Product Review System

A full-stack application with AI-powered product reviews, featuring a Rails 7 API backend and Next.js frontend.

## Overview

This system allows users to:
- Browse products with search and filtering
- View detailed product information
- Generate AI-powered reviews using OpenAI
- Create new products with automatic review generation
- Manage reviews with rating visualization

## Architecture

```
ProductReview/
├── backend/        # Rails 7 API with PostgreSQL
└── frontend/       # Next.js 14+ with TypeScript
```

## Features

### Backend (Rails 7 API)
- RESTful API for products and reviews
- PostgreSQL database with JSONB support
- OpenAI integration for AI-generated reviews
- CORS configuration for frontend
- Comprehensive seed data
- Professional review generation with product comparisons

### Frontend (Next.js 14+)
- Modern UI with TypeScript and Tailwind CSS
- Product browsing with search and category filtering
- Detailed product pages with specifications
- Real-time AI review generation
- Responsive design for all devices
- Loading states and error handling

## Tech Stack

### Backend
- **Framework**: Rails 7.2 (API-only)
- **Database**: PostgreSQL
- **AI**: OpenAI API (GPT-3.5-turbo)
- **Language**: Ruby 3.2+

### Frontend
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Native fetch API

## Quick Start

### Prerequisites
- Ruby 3.2+
- Rails 7.2+
- PostgreSQL
- Node.js 18+
- OpenAI API key

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   bundle install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Add your OpenAI API key to .env
   ```

4. Setup the database:
   ```bash
   rails db:create
   rails db:migrate
   rails db:seed
   ```

5. Start the server:
   ```bash
   rails s -p 3001
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## Usage

1. **Browse Products**: Visit the home page to see featured products or navigate to `/products` for all products.

2. **View Product Details**: Click on any product to see detailed information, specifications, and existing reviews.

3. **Generate AI Reviews**: On product detail pages, click "Generate AI Review" to create a comprehensive review that compares with similar products.

4. **Create Products**: Navigate to `/products/new` to add new products with optional automatic AI review generation.

5. **Search and Filter**: Use the search bar and category dropdown on the products page to find specific items.

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

## AI Review Generation

The system uses OpenAI's GPT-3.5-turbo to generate professional reviews that:

- Analyze product features and specifications
- Compare with similar products in the same category
- Provide pros and cons analysis
- Include specific examples and details
- Conclude with a 1-5 star rating

## Sample Data

The application includes 10+ sample products across categories:
- Electronics (iPhone, Samsung Galaxy, MacBook)
- Home & Kitchen (Ninja Foodi, Dyson Vacuum)
- Sports (Theragun, Peloton Bike, YETI Cooler)
- Books (Atomic Habits, Psychology of Money)

## Development

### Running Tests
```bash
# Backend
cd backend && rails test

# Frontend
cd frontend && npm test
```

### Code Quality
- Backend: RuboCop for Ruby styling
- Frontend: ESLint and TypeScript strict mode
- Both: Comprehensive error handling and validation

## Deployment

### Backend
- Configure production database
- Set environment variables
- Deploy to Rails-compatible hosting (Heroku, AWS, etc.)

### Frontend
- Build for production: `npm run build`
- Deploy to Vercel, Netlify, or similar platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or issues:
- Check the individual README files in `backend/` and `frontend/` directories
- Review the API documentation
- Open an issue on GitHub

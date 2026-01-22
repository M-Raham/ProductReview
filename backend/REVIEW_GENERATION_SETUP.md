# Background Review Generation Setup

This document explains how to set up and verify the automated background review generation system.

## Overview

The system consists of:
- **ReviewGeneratorService**: Handles AI-powered review generation using Groq API
- **GenerateReviewJob**: ActiveJob worker for async processing
- **Whenever Gem**: Cron job scheduling for automatic review generation
- **Scheduled Review Generator**: Logic to find products needing reviews

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
bundle install
```

### 2. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your actual API key
# Get your API key from: https://console.groq.com/keys
```

Add your Groq API key to `.env`:
```
GROQ_API_KEY=your_actual_groq_api_key_here
```

### 3. Database Setup

```bash
rails db:create
rails db:migrate
rails db:seed  # If you have seed data
```

### 4. Set Up Cron Jobs

```bash
# Generate the cron schedule
wheneverize .

# Update crontab with the schedule
whenever --update-crontab

# View current cron jobs
crontab -l
```

### 5. Start Background Job Processor

If using Sidekiq (recommended for production):
```bash
# Add to Gemfile:
# gem 'sidekiq'

# bundle install
# bundle exec sidekiq
```

If using the default async adapter (development only):
```bash
# Rails will process jobs inline in development
# No additional setup needed
```

## Verification Commands

### Rails Console Commands

Open Rails console to verify the system:
```bash
rails console
```

#### Check Products and Reviews
```ruby
# Check if products exist
Product.count
Product.first

# Check existing reviews
Review.count
Review.last
Review.last.product

# Check products without reviews
Product.left_joins(:reviews).where(reviews: { id: nil })
```

#### Manual Job Testing
```ruby
# Test direct execution (synchronous)
product_id = Product.first.id
result = GenerateReviewJob.perform_now(product_id)
puts result

# Test async execution
GenerateReviewJob.perform_later(product_id)

# Check job status (if using Sidekiq)
Sidekiq::Queue.new.size
```

#### Service Testing
```ruby
# Test the service directly
product = Product.first
service = ReviewGeneratorService.new(product)
result = service.call
puts result
```

### Log Monitoring

Check the logs for review generation activity:
```bash
# Rails logs
tail -f log/development.log

# Cron logs
tail -f log/cron.log
tail -f log/cron_error.log

# Sidekiq logs (if using Sidekiq)
tail -f log/sidekiq.log
```

### Database Queries for Verification

```ruby
# Check recent reviews
Review.where('created_at > ?', 1.hour.ago)

# Check failed review generations
Review.where(generation_status: 'failed')

# Check successful review generations
Review.where(generation_status: 'completed')

# Products with most reviews
Product.joins(:reviews).group('products.id').order('COUNT(reviews.id) DESC').limit(5)

# Products without any reviews
Product.left_joins(:reviews).where(reviews: { id: nil })
```

## Manual Testing

### Test Individual Product Review Generation

```ruby
# In Rails console
product = Product.find_or_create_by(
  name: "Test Product",
  description: "A test product for review generation",
  price: 99.99,
  category: "Electronics"
)

# Generate review synchronously
result = GenerateReviewJob.perform_now(product.id)

# Check the result
if result[:success]
  puts "Review generated: #{result[:review].content}"
  puts "Rating: #{result[:review].rating}"
else
  puts "Error: #{result[:error]}"
end
```

### Test Batch Review Generation

```ruby
# Test the scheduled logic manually
Rails.application.config.generate_scheduled_reviews.call
```

## Production Considerations

### 1. Job Queue Backend
Use Redis with Sidekiq for production:
```ruby
# Add to Gemfile
gem 'sidekiq'
gem 'redis'
```

Configure in `config/application.rb`:
```ruby
config.active_job.queue_adapter = :sidekiq
```

### 2. Environment Variables
Ensure production environment has:
```
RAILS_ENV=production
GROQ_API_KEY=your_production_api_key
REDIS_URL=redis://your-redis-server:6379/0
```

### 3. Monitoring
- Monitor job queue sizes
- Set up alerts for failed jobs
- Monitor API rate limits
- Check cron job execution logs

### 4. Rate Limiting
The scheduled generator processes only 5 products per run to avoid API rate limits. Adjust this in `config/initializers/scheduled_review_generator.rb` if needed.

## Troubleshooting

### Common Issues

1. **API Key Not Found**
   - Ensure `GROQ_API_KEY` is set in `.env`
   - Restart Rails console/server after changing `.env`

2. **Jobs Not Processing**
   - Check if background job processor is running
   - Verify job queue configuration

3. **Cron Jobs Not Running**
   - Check crontab: `crontab -l`
   - Check cron logs: `tail -f log/cron.log`

4. **Database Connection Issues**
   - Verify database is running
   - Check database configuration

### Debug Commands

```ruby
# Check job queue (Sidekiq)
Sidekiq::Queue.new
Sidekiq::RetrySet.new

# Check failed jobs
Sidekiq::DeadSet.new

# Manually retry failed jobs
Sidekiq::DeadSet.new.each { |job| job.retry }
```

## API Usage and Costs

The system uses the Groq API for AI review generation. Monitor usage:
- Each review generation consumes API tokens
- The scheduled job runs daily at 9 AM
- Maximum 5 reviews per day (configurable)

Consider implementing usage tracking if needed for cost management.

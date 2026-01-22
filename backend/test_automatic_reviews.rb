#!/usr/bin/env ruby

# Test script to verify automatic review generation is working
require_relative 'config/environment'

puts "🚀 Testing Automatic Review Generation System"
puts "=" * 50

# Check Redis connection
puts "📡 Checking Redis connection..."
begin
  Redis.new.ping
  puts "✅ Redis is connected"
rescue => e
  puts "❌ Redis connection failed: #{e.message}"
  exit 1
end

# Check Sidekiq
puts "🔄 Checking Sidekiq..."
begin
  Sidekiq::Queue.new.size
  puts "✅ Sidekiq is running"
rescue => e
  puts "❌ Sidekiq connection failed: #{e.message}"
  exit 1
end

# Check products
puts "📦 Checking products..."
product_count = Product.count
puts "📊 Found #{product_count} products"

if product_count == 0
  puts "⚠️  No products found. Creating a test product..."
  product = Product.create!(
    name: "Test Wireless Headphones",
    description: "Premium noise-cancelling headphones with 30-hour battery life and superior sound quality.",
    price: 299.99,
    category: "Electronics",
    brand: "AudioTech"
  )
  puts "✅ Created test product: #{product.name}"
end

# Check existing reviews
puts "📝 Checking existing reviews..."
review_count = Review.count
puts "📊 Found #{review_count} reviews"

# Test the scheduled function
puts "⏰ Testing scheduled review generation..."
begin
  result = Rails.application.config.generate_scheduled_reviews.call
  puts "✅ Scheduled function executed successfully"
rescue => e
  puts "❌ Scheduled function failed: #{e.message}"
  exit 1
end

# Check if jobs were enqueued
puts "📋 Checking job queue..."
queue_size = Sidekiq::Queue.new.size
puts "📊 #{queue_size} jobs in queue"

# Wait a moment and check results
puts "⏳ Waiting 5 seconds for jobs to process..."
sleep(5)

# Check results
new_review_count = Review.count
puts "📊 Review count after: #{new_review_count}"

if new_review_count > review_count
  puts "✅ SUCCESS: #{new_review_count - review_count} new reviews generated!"
  latest_review = Review.last
  puts "📝 Latest review: #{latest_review.content[0..100]}..."
  puts "⭐ Rating: #{latest_review.rating}"
  puts "📊 Status: #{latest_review.generation_status}"
else
  puts "⚠️  No new reviews generated yet (may need more time or products)"
end

puts "=" * 50
puts "🎯 System Status Summary:"
puts "- Redis: ✅ Connected"
puts "- Sidekiq: ✅ Running" 
puts "- Products: #{Product.count}"
puts "- Reviews: #{Review.count}"
puts "- Queue Size: #{Sidekiq::Queue.new.size}"
puts ""
puts "🔧 Next steps:"
puts "1. Set up Windows Task Scheduler: .\setup_windows_task_scheduler.ps1"
puts "2. Or run the test script continuously: ruby test_minute_scheduler.rb"
puts "3. Check logs: tail -f log/sidekiq.log"

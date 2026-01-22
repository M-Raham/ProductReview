#!/usr/bin/env ruby

# Test script to simulate every-minute review generation
# Run this with: ruby test_minute_scheduler.rb

require_relative 'config/environment'

puts "🚀 Starting minute-by-minute review generation test..."
puts "Press Ctrl+C to stop"

loop do
  puts "\n⏰ #{Time.current} - Running scheduled review generation..."
  
  begin
    result = Rails.application.config.generate_scheduled_reviews.call
    puts "✅ Scheduled task completed successfully"
  rescue => e
    puts "❌ Error in scheduled task: #{e.message}"
  end
  
  # Show current stats
  products_count = Product.count
  reviews_count = Review.count
  pending_products = Product.left_joins(:reviews).where(reviews: { id: nil }).count
  
  puts "📊 Stats: #{products_count} products, #{reviews_count} reviews, #{pending_products} products need reviews"
  
  # Wait for 60 seconds
  puts "⏳ Waiting 60 seconds..."
  sleep(60)
end

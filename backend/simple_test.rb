#!/usr/bin/env ruby

# Simple test to verify the system works
require_relative 'config/environment'

puts "🚀 Simple Test for Automatic Review Generation"
puts "=" * 50

# Create a test product
puts "📦 Creating test product..."
product = Product.find_or_create_by(
  name: "Test Wireless Headphones",
  description: "Premium noise-cancelling headphones with 30-hour battery life",
  price: 299.99,
  category: "Electronics",
  brand: "AudioTech"
)

puts "✅ Product created: #{product.name} (ID: #{product.id})"

# Test the service directly
puts "🤖 Testing ReviewGeneratorService..."
service = ReviewGeneratorService.new(product)
result = service.call

if result[:success]
  puts "✅ Service generated review successfully!"
  puts "📝 Review: #{result[:review].content[0..100]}..."
  puts "⭐ Rating: #{result[:review].rating}"
  puts "📊 Status: #{result[:review].generation_status}"
else
  puts "❌ Service failed: #{result[:error]}"
end

# Test the job
puts "\n🔄 Testing GenerateReviewJob..."
job_result = GenerateReviewJob.perform_now(product.id)

if job_result[:success]
  puts "✅ Job generated review successfully!"
else
  puts "❌ Job failed: #{job_result[:error]}"
end

# Check final state
puts "\n📊 Final State:"
puts "- Products: #{Product.count}"
puts "- Reviews: #{Review.count}"
puts "- Latest review: #{Review.last&.content&.[](0..50)}..."

puts "\n🎯 Test completed!"

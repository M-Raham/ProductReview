#!/usr/bin/env ruby

# Direct test without Sidekiq queue
require_relative 'config/environment'

puts "🚀 Direct Test (No Queue)"
puts "=" * 40

# Find products needing reviews
products_needing_reviews = Product.left_joins(:reviews)
  .where(reviews: { id: nil })
  .limit(2)

puts "Found #{products_needing_reviews.count} products needing reviews"

products_needing_reviews.each do |product|
  puts "\n📦 Processing: #{product.name}"
  
  # Generate review directly (no queue)
  result = ReviewGeneratorService.new(product).call
  
  if result[:success]
    puts "✅ Review generated!"
    puts "📝 #{result[:review].content[0..80]}..."
    puts "⭐ Rating: #{result[:review].rating}"
  else
    puts "❌ Failed: #{result[:error]}"
  end
end

puts "\n📊 Final Status:"
puts "- Products: #{Product.count}"
puts "- Reviews: #{Review.count}"
puts "- Products needing reviews: #{Product.left_joins(:reviews).where(reviews: { id: nil }).count}"

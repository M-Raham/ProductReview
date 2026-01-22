# Scheduled Review Generator Configuration
# This module handles the logic for generating reviews on a schedule

Rails.application.configure do
  config.after_initialize do
    # Method to be called by the cron job
    config.generate_scheduled_reviews = lambda do
      Rails.logger.info "Starting scheduled review generation at #{Time.current}"
      
      # Find products that don't have any reviews yet, or have very few reviews
      # Limit to a small batch to avoid overwhelming the API
      products_needing_reviews = Product.left_joins(:reviews)
        .group('products.id')
        .having('COUNT(reviews.id) < 1') # Products with no reviews
        .limit(5) # Process max 5 products per run
        .order('RANDOM()') # Random selection to distribute reviews
      
      if products_needing_reviews.any?
        Rails.logger.info "Found #{products_needing_reviews.count} products needing reviews"
        
        products_needing_reviews.each do |product|
          Rails.logger.info "Generating review for Product ##{product.id}: #{product.name}"
          
          # Generate review directly (bypass queue to avoid connection issues)
          result = ReviewGeneratorService.new(product).call
          
          if result[:success]
            Rails.logger.info "Successfully generated review for Product ##{product.id}: #{result[:review].id}"
          else
            Rails.logger.error "Failed to generate review for Product ##{product.id}: #{result[:error]}"
          end
        end
        
        Rails.logger.info "Processed #{products_needing_reviews.count} review generation requests"
      else
        Rails.logger.info "No products found needing reviews"
        
        # Alternative: Find products with old reviews (older than 30 days) and generate fresh ones
        old_reviews_products = Product.joins(:reviews)
          .where('reviews.created_at < ?', 30.days.ago)
          .where('reviews.generation_status = ?', 'completed')
          .distinct
          .limit(3)
          .order('RANDOM()')
        
        if old_reviews_products.any?
          Rails.logger.info "Found #{old_reviews_products.count} products with old reviews, generating fresh ones"
          
          old_reviews_products.each do |product|
            Rails.logger.info "Enqueueing fresh review generation for Product ##{product.id}: #{product.name}"
            GenerateReviewJob.perform_later(product.id)
          end
          
          Rails.logger.info "Enqueued #{old_reviews_products.count} fresh review generation jobs"
        end
      end
      
      Rails.logger.info "Completed scheduled review generation at #{Time.current}"
    end
  end
end

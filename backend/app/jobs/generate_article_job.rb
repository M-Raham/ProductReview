class GenerateArticleJob < ApplicationJob
  queue_as :default

  def perform(product_id)
    product = Product.find(product_id)
    
    result = ReviewGeneratorService.new(product).call
    
    if result[:success]
      Rails.logger.info "Successfully generated article for Product ##{product_id}: #{result[:review].id}"
    else
      Rails.logger.error "Failed to generate article for Product ##{product_id}: #{result[:error]}"
    end
    
    result
  rescue ActiveRecord::RecordNotFound => e
    Rails.logger.error "Product ##{product_id} not found: #{e.message}"
    { success: false, error: "Product not found" }
  rescue => e
    Rails.logger.error "Unexpected error in GenerateArticleJob for Product ##{product_id}: #{e.message}"
    { success: false, error: e.message }
  end
end

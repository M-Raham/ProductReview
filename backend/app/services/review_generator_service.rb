class ReviewGeneratorService
  def initialize(product)
    @product = product
  end

  def call
    begin
      similar_products = @product.similar_products(3)
      
      prompt = build_prompt(similar_products)
      
      client = OpenAI::Client.new(
        api_key: ENV["OPENAI_API_KEY"]
      )
      
      response = client.responses.create(
        model: ENV['OPENAI_MODEL'] || "gpt-3.5-turbo",
        input: prompt
      )
      
      content = response.output_text
      
      if content.blank?
        raise "OpenAI returned empty content"
      end
      
      rating = extract_rating(content)
      
      review = Review.create!(
        product: @product,
        content: content,
        compared_products: similar_products.map(&:id),
        rating: rating,
        generation_status: 'completed'
      )
      
      { success: true, review: review }
      
    rescue => e
      # Don't create a review if content is blank, just return error
      if e.message.include?("OpenAI returned empty content") || e.message.include?("content can't be blank")
        return { success: false, error: "Failed to generate review content: #{e.message}" }
      end
      
      # For other errors, create a failed review record
      review = Review.create!(
        product: @product,
        content: "Review generation failed. Error: #{e.message}",
        compared_products: [],
        rating: nil,
        generation_status: 'failed',
        error_message: e.message
      )
      
      { success: false, error: e.message, review: review }
    end
  end

  private

  def build_prompt(similar_products)
    prompt = "Please write a professional product review for the following product:\n\n"
    prompt += "Product Details:\n"
    prompt += "- Name: #{@product.name}\n"
    prompt += "- Brand: #{@product.brand}\n" if @product.brand.present?
    prompt += "- Category: #{@product.category}\n" if @product.category.present?
    prompt += "- Price: $#{'%.2f' % @product.price}\n" if @product.price.present?
    prompt += "- Description: #{@product.description}\n"
    
    if @product.specifications.present?
      prompt += "- Specifications: #{@product.specifications.to_json}\n"
    end
    
    if similar_products.any?
      prompt += "\nFor comparison, here are some similar products in the same category:\n"
      similar_products.each_with_index do |product, index|
        prompt += "\n#{index + 1}. #{product.name}"
        prompt += " by #{product.brand}" if product.brand.present?
        prompt += " - $#{'%.2f' % product.price}" if product.price.present?
        prompt += "\n   Description: #{product.description}"
      end
    end
    
    prompt += "\n\nPlease write a comprehensive 300-500 word review that:\n"
    prompt += "1. Provides an honest assessment of product's features and performance\n"
    prompt += "2. Compares it with similar products when relevant\n"
    prompt += "3. Discusses pros and cons\n"
    prompt += "4. Gives specific examples and details\n"
    prompt += "5. Concludes with an overall rating from 1-5 stars (please include this at the end)\n\n"
    prompt += "Please format as 'Rating: X/5 stars' at the very end."
    
    prompt
  end

  def extract_rating(content)
    return nil unless content.present?
    
    # Look for rating pattern at the end of the content
    if match = content.match(/Rating:\s*(\d+)\/5\s*stars?/i)
      match[1].to_i
    elsif match = content.match(/(\d+)\s*\/\s*5/i)
      match[1].to_i
    elsif match = content.match(/(\d+)\s*stars?/i)
      rating = match[1].to_i
      rating <= 5 ? rating : nil
    else
      nil
    end
  end
end

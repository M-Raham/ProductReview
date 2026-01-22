class ReviewGeneratorService
  def initialize(product)
    @product = product
  end

  def call
    begin
      similar_products = @product.similar_products(3)
      
      prompt = build_prompt(similar_products)
      
      response = call_groq_api(prompt)
      
      if response.blank?
        raise "Groq API returned empty content"
      end
      
      rating = extract_rating(response)
      
      review = Review.create!(
        product: @product,
        content: response,
        compared_products: similar_products.map(&:id),
        rating: rating,
        generation_status: 'completed'
      )
      
      { success: true, review: review }
      
    rescue => e
      # Don't create a review if content is blank, just return error
      if e.message.include?("Groq API returned empty content") || e.message.include?("content can't be blank")
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

  def call_groq_api(prompt)
    require "net/http"
    require "json"

    uri = URI("https://api.groq.com/openai/v1/chat/completions")

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    req = Net::HTTP::Post.new(uri)
    req["Authorization"] = "Bearer #{ENV['GROQ_API_KEY']}"
    req["Content-Type"] = "application/json"

    req.body = {
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "Generate professional product reviews." },
        { role: "user", content: prompt }
      ]
    }.to_json

    res = http.request(req)
    response_data = JSON.parse(res.body)
    
    if response_data["choices"] && response_data["choices"][0] && response_data["choices"][0]["message"]
      response_data["choices"][0]["message"]["content"]
    else
      raise "Invalid response format from Groq API: #{response_data}"
    end
  rescue JSON::ParserError => e
    raise "Failed to parse Groq API response: #{e.message}"
  rescue Net::HTTPError => e
    raise "HTTP error calling Groq API: #{e.message}"
  end

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
    
    prompt += "\n\nPlease write a concise 50-word SEO-friendly product review that:\n"
    prompt += "1. Is optimized for search engines with relevant keywords naturally integrated\n"
    prompt += "2. Includes the product name, brand, and category keywords throughout the review\n"
    prompt += "3. Incorporates comparison keywords when mentioning similar products\n"
    prompt += "4. Uses long-tail keywords related to product features and use cases\n"
    prompt += "5. Provides an honest assessment of product's features and performance\n"
    prompt += "6. Compares it with similar products using SEO-friendly comparison language\n"
    prompt += "7. Discusses pros and cons with keyword-rich descriptions\n"
    prompt += "8. Gives specific examples and details with relevant search terms\n"
    prompt += "9. Concludes with an overall rating from 1-5 stars (please include this at the end)\n\n"
    prompt += "SEO Guidelines:\n"
    prompt += "- Keep it concise at exactly 50 words\n"
    prompt += "- Use the product name naturally 1-2 times\n"
    prompt += "- Include brand and category keywords\n"
    prompt += "- Add comparison terms like 'alternative', 'vs', 'compared to'\n"
    prompt += "- Use feature-specific keywords that users would search for\n"
    prompt += "- Include benefit-oriented keywords\n"
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

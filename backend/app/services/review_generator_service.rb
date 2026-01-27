class ReviewGeneratorService
  def initialize(product)
    @product = product
  end

  def call
    begin
      similar_products = @product.similar_products(3)
      
      prompt = build_article_prompt(similar_products)
      
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
        { role: "system", content: "Generate professional SEO-optimized product articles with comprehensive analysis and proper HTML structure." },
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

  def build_article_prompt(similar_products)
    prompt = "Please write a comprehensive SEO-optimized article for the following product:\n\n"
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
    
    prompt += "\n\nPlease generate a comprehensive article that includes:\n"
    prompt += "1. An engaging, SEO-friendly title\n"
    prompt += "2. Well-structured content with proper headings (H1, H2, H3)\n"
    prompt += "3. In-depth product analysis and review\n"
    prompt += "4. Comparison with similar products\n"
    prompt += "5. Pros and cons section\n"
    prompt += "6. Buying guide and recommendations\n"
    prompt += "7. FAQ section\n"
    prompt += "8. Conclusion with final verdict\n\n"
    
    prompt += "SEO Requirements:\n"
    prompt += "- Use the product name naturally throughout the article\n"
    prompt += "- Include brand and category keywords\n"
    prompt += "- Use long-tail keywords related to product features\n"
    prompt += "- Include comparison keywords\n"
    prompt += "- Write in a conversational yet professional tone\n"
    prompt += "- Aim for 800-1200 words\n"
    prompt += "- Use proper HTML formatting with appropriate tags\n\n"
    
    prompt += "Please format the article with proper HTML structure including headings, paragraphs, lists, etc."
    prompt += "Make it comprehensive and valuable for readers considering this product."
    
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

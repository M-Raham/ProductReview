class Api::V1::ArticlesController < ApplicationController
  before_action :set_product, only: [:index, :generate]
  before_action :set_article, only: [:destroy]

  # GET /api/v1/products/:product_id/articles
  def index
    @articles = @product.reviews
    render json: @articles
  end

  # POST /api/v1/products/:product_id/articles/generate
  def generate
    if @product
      result = ReviewGeneratorService.new(@product).call
    else
      # Handle case when called without product_id
      product_id = params[:product_id] || params.dig(:article, :product_id)
      if product_id
        product = Product.find(product_id)
        result = ReviewGeneratorService.new(product).call
      else
        render json: { error: 'Product ID is required' }, status: :unprocessable_entity
        return
      end
    end
    
    if result[:success]
      render json: result[:review], status: :created
    else
      render json: { error: result[:error] }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/articles/:id
  def destroy
    @article.destroy
    render json: { message: 'Article deleted successfully' }
  end

  private

  def set_product
    if params[:product_id]
      @product = Product.find(params[:product_id])
    end
  end

  def set_article
    @article = Review.find(params[:id])
  end
end

class Product < ApplicationRecord
  has_many :reviews, dependent: :destroy
  
  validates :name, presence: true
  validates :description, presence: true
  validates :price, numericality: { greater_than_or_equal_to: 0 }
  
  def similar_products(limit = 3)
    Product.where(category: category)
           .where.not(id: id)
           .limit(limit)
  end
end

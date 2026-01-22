class Review < ApplicationRecord
  belongs_to :product
  
  validates :content, presence: true
  validates :rating, inclusion: { in: 1..5 }, allow_nil: true
  validates :generation_status, inclusion: { in: %w[pending completed failed] }
end

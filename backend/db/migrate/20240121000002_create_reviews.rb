class CreateReviews < ActiveRecord::Migration[7.2]
  def change
    create_table :reviews do |t|
      t.references :product, null: false, foreign_key: true
      t.text :content, null: false
      t.jsonb :compared_products, default: []
      t.integer :rating
      t.string :generation_status, default: 'completed'
      t.text :error_message
      t.timestamps
    end
  end
end

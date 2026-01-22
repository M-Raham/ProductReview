class CreateProducts < ActiveRecord::Migration[7.2]
  def change
    create_table :products do |t|
      t.string :name, null: false
      t.text :description, null: false
      t.string :category
      t.decimal :price, precision: 10, scale: 2
      t.string :brand
      t.jsonb :specifications, default: {}
      t.string :image_url
      t.timestamps
    end
  end
end

# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# Clear existing data
Product.destroy_all
Review.destroy_all

# Electronics
Product.create!([
  {
    name: "iPhone 15 Pro",
    brand: "Apple",
    category: "Electronics",
    price: 999.99,
    description: "The iPhone 15 Pro features a titanium design, A17 Pro chip, and advanced camera system with 5x telephoto zoom. Perfect for professionals who demand the best in mobile technology.",
    image_url: "https://example.com/iphone15pro.jpg",
    specifications: {
      "display" => "6.1-inch Super Retina XDR",
      "storage" => "128GB, 256GB, 512GB, 1TB",
      "camera" => "48MP Main, 12MP Ultra Wide, 12MP Telephoto",
      "battery" => "All-day battery life",
      "processor" => "A17 Pro chip"
    }
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    category: "Electronics",
    price: 1199.99,
    description: "The Galaxy S24 Ultra features a stunning 6.8-inch Dynamic AMOLED display, S Pen support, and revolutionary AI capabilities. Built for those who want the ultimate Android experience.",
    image_url: "https://example.com/galaxys24ultra.jpg",
    specifications: {
      "display" => "6.8-inch Dynamic AMOLED 2X",
      "storage" => "256GB, 512GB, 1TB, 2TB",
      "camera" => "200MP Main, 12MP Ultra Wide, 50MP Telephoto (5x), 10MP Telephoto (3x)",
      "battery" => "5000mAh",
      "processor" => "Snapdragon 8 Gen 3"
    }
  },
  {
    name: "MacBook Air M2",
    brand: "Apple",
    category: "Electronics",
    price: 1099.99,
    description: "Ultra-thin laptop with M2 chip, offering incredible performance and battery life in a portable design. Perfect for students and professionals on the go.",
    image_url: "https://example.com/macbookairm2.jpg",
    specifications: {
      "display" => "13.6-inch Liquid Retina",
      "storage" => "256GB, 512GB, 1TB, 2TB",
      "memory" => "8GB, 16GB, 24GB",
      "battery" => "Up to 18 hours",
      "processor" => "Apple M2 chip"
    }
  }
])

# Home & Kitchen
Product.create!([
  {
    name: "Ninja Foodi 9-in-1 Pressure Cooker",
    brand: "Ninja",
    category: "Home & Kitchen",
    price: 149.99,
    description: "Versatile multi-cooker that pressure cooks, air fries, steams, slow cooks, and more. Perfect for busy families who want delicious homemade meals with minimal effort.",
    image_url: "https://example.com/ninjafoodi.jpg",
    specifications: {
      "capacity" => "6.5 quarts",
      "functions" => "9 cooking functions",
      "pressure" => "High and low pressure settings",
      "temperature" => "105°F to 400°F",
      "safety" => "15 safety features"
    }
  },
  {
    name: "Dyson V15 Detect Vacuum",
    brand: "Dyson",
    category: "Home & Kitchen",
    price: 599.99,
    description: "Advanced cordless vacuum with laser dust detection and piezo sensor for scientific proof of a deep clean. Ideal for homes with pets and allergy sufferers.",
    image_url: "https://example.com/dysonv15.jpg",
    specifications: {
      "suction" => "230AW",
      "battery" => "Up to 60 minutes runtime",
      "filtration" => "Whole-machine HEPA filtration",
      "weight" => "5.7 lbs",
      "dustbin" => "0.76 liters"
    }
  },
  {
    name: "Instant Pot Duo 7-in-1",
    brand: "Instant Pot",
    category: "Home & Kitchen",
    price: 79.99,
    description: "Compact multi-cooker that combines 7 kitchen appliances in one. Great for small kitchens and those new to pressure cooking.",
    image_url: "https://example.com/instantpot.jpg",
    specifications: {
      "capacity" => "6 quarts",
      "functions" => "Pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker, warmer",
      "safety" => "10+ safety features",
      "presets" => "14 smart programs"
    }
  }
])

# Sports & Outdoors
Product.create!([
  {
    name: "Theragun Pro",
    brand: "Therabody",
    category: "Sports",
    price: 599.99,
    description: "Professional-grade percussive therapy device with deep muscle treatment. Essential for athletes and fitness enthusiasts serious about recovery.",
    image_url: "https://example.com/theragunpro.jpg",
    specifications: {
      "amplitude" => "16mm",
      "speed" => "1750-2400 PPM",
      "battery" => "150 minutes, swappable",
      "force" => "60 lbs of stall force",
      "attachments" => "6 attachments included"
    }
  },
  {
    name: "Peloton Bike+",
    brand: "Peloton",
    category: "Sports",
    price: 2495.00,
    description: "Premium indoor cycling bike with rotating HD touchscreen and automatic resistance adjustments. Transform your home fitness experience with live and on-demand classes.",
    image_url: "https://example.com/pelotonbike.jpg",
    specifications: {
      "screen" => "23.8\" HD touchscreen",
      "resistance" => "100 levels magnetic resistance",
      "weight" => "140 lbs",
      "connectivity" => "Bluetooth, WiFi, ANT+",
      "warranty" => "12-month limited warranty"
    }
  },
  {
    name: "YETI Tundra 45 Cooler",
    brand: "YETI",
    category: "Sports",
    price: 325.00,
    description: "Ultra-durable cooler with superior ice retention. Perfect for camping trips, tailgating, and outdoor adventures where reliability matters most.",
    image_url: "https://example.com/yeticooler.jpg",
    specifications: {
      "capacity" => "45 quarts (26 cans)",
      "ice_retention" => "3+ days",
      "dimensions" => "25.5\" × 16\" × 15.5\"",
      "weight" => "23 lbs empty",
      "construction" => "Rotomolded construction"
    }
  }
])

# Books
Product.create!([
  {
    name: "Atomic Habits",
    brand: "James Clear",
    category: "Books",
    price: 18.99,
    description: "Life-changing guide to building good habits and breaking bad ones using small, incremental changes. A must-read for anyone looking to improve their daily routines.",
    image_url: "https://example.com/atomichabits.jpg",
    specifications: {
      "pages" => "320",
      "publisher" => "Avery",
      "language" => "English",
      "format" => "Hardcover, Paperback, eBook, Audiobook",
      "isbn" => "978-0735211292"
    }
  },
  {
    name: "The Psychology of Money",
    brand: "Morgan Housel",
    category: "Books",
    price: 16.99,
    description: "Timeless lessons on wealth, greed, and happiness. Essential reading for understanding the relationship between money and human behavior.",
    image_url: "https://example.com/psychologymoney.jpg",
    specifications: {
      "pages" => "256",
      "publisher" => "Harriman House",
      "language" => "English",
      "format" => "Hardcover, Paperback, eBook, Audiobook",
      "isbn" => "978-0857197689"
    }
  }
])

puts "Created #{Product.count} products successfully!"

import { supabase } from '../config/supabase.js';
import dotenv from 'dotenv';

dotenv.config();

const categories = [
  // Menu Categories
  { name: 'Vegetarian', slug: 'veg', type: 'menu', description: 'Delicious vegetarian dishes', order: 1 },
  { name: 'Non-Vegetarian', slug: 'non-veg', type: 'menu', description: 'Premium non-vegetarian cuisine', order: 2 },
  { name: 'Kids Special', slug: 'kids', type: 'menu', description: 'Child-friendly meals', order: 3 },
  { name: 'Desserts', slug: 'dessert', type: 'menu', description: 'Sweet treats and desserts', order: 4 },
  { name: 'Beverages', slug: 'beverage', type: 'menu', description: 'Refreshing drinks', order: 5 },
  
  // Room Categories
  { name: 'Standard', slug: 'standard', type: 'room', description: 'Comfortable standard rooms', order: 1 },
  { name: 'Deluxe', slug: 'deluxe', type: 'room', description: 'Upgraded deluxe accommodations', order: 2 },
  { name: 'Suite', slug: 'suite', type: 'room', description: 'Luxurious suite experience', order: 3 },
  { name: 'Premium', slug: 'premium', type: 'room', description: 'Premium luxury rooms', order: 4 },
];

const menuItems = [
  { name: 'Paneer Tikka', description: 'Grilled cottage cheese with Indian spices', category: 'veg', price: 12.99, image: '/menu/paneer-tikka.jpg', is_best_selling: true, preparation_time: 20 },
  { name: 'Dal Makhani', description: 'Creamy black lentils cooked overnight', category: 'veg', price: 10.99, image: '/menu/dal-makhani.jpg', is_best_selling: true, preparation_time: 15 },
  { name: 'Veg Biryani', description: 'Fragrant basmati rice with mixed vegetables', category: 'veg', price: 14.99, image: '/menu/veg-biryani.jpg', is_best_selling: false, preparation_time: 25 },
  
  { name: 'Butter Chicken', description: 'Tender chicken in rich tomato cream sauce', category: 'non-veg', price: 16.99, image: '/menu/butter-chicken.jpg', is_best_selling: true, preparation_time: 25 },
  { name: 'Lamb Rogan Josh', description: 'Kashmiri-style lamb curry', category: 'non-veg', price: 18.99, image: '/menu/lamb-rogan-josh.jpg', is_best_selling: true, preparation_time: 30 },
  { name: 'Fish Tikka', description: 'Marinated fish grilled to perfection', category: 'non-veg', price: 15.99, image: '/menu/fish-tikka.jpg', is_best_selling: false, preparation_time: 20 },
  
  { name: 'Mini Pizza', description: 'Kid-sized pizza with cheese', category: 'kids', price: 8.99, image: '/menu/mini-pizza.jpg', is_best_selling: true, preparation_time: 15 },
  { name: 'Chicken Nuggets', description: 'Crispy chicken nuggets with fries', category: 'kids', price: 7.99, image: '/menu/chicken-nuggets.jpg', is_best_selling: false, preparation_time: 12 },
  { name: 'Mac & Cheese', description: 'Creamy macaroni and cheese', category: 'kids', price: 6.99, image: '/menu/mac-cheese.jpg', is_best_selling: false, preparation_time: 10 },
  
  { name: 'Gulab Jamun', description: 'Sweet milk dumplings in sugar syrup', category: 'dessert', price: 5.99, image: '/menu/gulab-jamun.jpg', is_best_selling: true, preparation_time: 5 },
  { name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with molten center', category: 'dessert', price: 7.99, image: '/menu/chocolate-lava.jpg', is_best_selling: true, preparation_time: 8 },
  
  { name: 'Mango Lassi', description: 'Traditional yogurt drink with mango', category: 'beverage', price: 4.99, image: '/menu/mango-lassi.jpg', is_best_selling: true, preparation_time: 3 },
  { name: 'Masala Chai', description: 'Spiced Indian tea', category: 'beverage', price: 3.99, image: '/menu/masala-chai.jpg', is_best_selling: false, preparation_time: 5 },
  { name: 'Fresh Lime Soda', description: 'Refreshing lime and soda drink', category: 'beverage', price: 3.49, image: '/menu/lime-soda.jpg', is_best_selling: false, preparation_time: 3 },
];

const rooms = [
  { name: 'Cozy Standard', description: 'Perfect for budget travelers', category: 'standard', price: 89.99, capacity: 2, amenities: ['Wi-Fi', 'TV', 'Air Conditioning'], images: ['/rooms/standard-1.jpg'] },
  { name: 'Classic Standard', description: 'Comfortable and affordable', category: 'standard', price: 99.99, capacity: 2, amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Fridge'], images: ['/rooms/standard-2.jpg'] },
  
  { name: 'Deluxe Garden View', description: 'Spacious room with garden view', category: 'deluxe', price: 149.99, capacity: 3, amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar', 'Balcony'], images: ['/rooms/deluxe-1.jpg'] },
  { name: 'Deluxe City View', description: 'Modern room with city skyline', category: 'deluxe', price: 159.99, capacity: 3, amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar', 'Work Desk'], images: ['/rooms/deluxe-2.jpg'] },
  
  { name: 'Executive Suite', description: 'Luxurious suite with living area', category: 'suite', price: 249.99, capacity: 4, amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar', 'Jacuzzi', 'Living Room'], images: ['/rooms/suite-1.jpg', '/rooms/suite-2.jpg'] },
  { name: 'Honeymoon Suite', description: 'Romantic suite for couples', category: 'suite', price: 279.99, capacity: 2, amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar', 'Jacuzzi', 'King Bed', 'Champagne'], images: ['/rooms/suite-3.jpg'] },
  
  { name: 'Presidential Suite', description: 'Ultimate luxury experience', category: 'premium', price: 499.99, capacity: 6, amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Full Bar', 'Jacuzzi', 'Private Terrace', 'Butler Service'], images: ['/rooms/premium-1.jpg', '/rooms/premium-2.jpg'] },
  { name: 'Penthouse Suite', description: 'Top-floor panoramic views', category: 'premium', price: 599.99, capacity: 8, amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Full Bar', 'Jacuzzi', 'Rooftop Access', '360° Views'], images: ['/rooms/premium-3.jpg'] },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting Supabase database seeding...\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await supabase.from('menu_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('rooms').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Seed categories
    console.log('📁 Seeding categories...');
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .insert(categories)
      .select();
    
    if (categoriesError) {
      console.error('❌ Error seeding categories:', categoriesError);
      throw categoriesError;
    }
    console.log(`✅ Seeded ${categoriesData?.length || 0} categories`);

    // Seed menu items
    console.log('🍽️  Seeding menu items...');
    const { data: menuData, error: menuError } = await supabase
      .from('menu_items')
      .insert(menuItems)
      .select();
    
    if (menuError) {
      console.error('❌ Error seeding menu items:', menuError);
      throw menuError;
    }
    console.log(`✅ Seeded ${menuData?.length || 0} menu items`);

    // Seed rooms
    console.log('🏨 Seeding rooms...');
    const { data: roomsData, error: roomsError } = await supabase
      .from('rooms')
      .insert(rooms)
      .select();
    
    if (roomsError) {
      console.error('❌ Error seeding rooms:', roomsError);
      throw roomsError;
    }
    console.log(`✅ Seeded ${roomsData?.length || 0} rooms`);

    console.log('\n✨ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

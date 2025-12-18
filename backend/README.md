# Orchid Hospitality Backend

Backend server for Orchid Hospitality using Express.js and MongoDB.

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
# or
bun install
```

### 2. Environment Configuration

The `.env` file is already configured with your MongoDB Atlas connection:

```env
MONGODB_URI=mongodb+srv://Aarjav:shamli09@orchidhotels.nsauf1z.mongodb.net/orchid_hospitality
DATABASE_NAME=orchid_hospitality
PORT=5000
NODE_ENV=development
```

### 3. Seed the Database

Run the seed script to populate your MongoDB database with menu items and rooms:

```bash
npm run seed
# or
bun run seed
```

This will create:
- **16 Menu Items** across categories: veg, non-veg, kids, dessert, beverage
- **8 Room Categories** across types: standard, deluxe, suite, premium
- All items include ratings, reviews, images, and availability status

### 4. Start the Server

```bash
npm run dev
# or
bun run dev
```

Server will run on `http://localhost:5000`

## API Endpoints

### Menu Items
- `GET /api/menu` - Get all menu items
- `GET /api/menu/category/:category` - Get items by category (veg, non-veg, kids, dessert, beverage)
- `GET /api/menu/best-selling/all` - Get best-selling items
- `GET /api/menu/:id` - Get specific menu item
- `POST /api/menu` - Create new menu item (admin)
- `PUT /api/menu/:id` - Update menu item (admin)
- `DELETE /api/menu/:id` - Delete menu item (admin)

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/category/:category` - Get rooms by category (standard, deluxe, suite, premium)
- `GET /api/rooms/:id` - Get specific room
- `POST /api/rooms` - Create new room (admin)
- `PUT /api/rooms/:id` - Update room (admin)
- `DELETE /api/rooms/:id` - Delete room (admin)

### Health Check
- `GET /api/health` - Server status

## Database Collections

### MenuItem Schema
```typescript
{
  name: String,
  description: String,
  price: Number,
  category: 'veg' | 'non-veg' | 'kids' | 'dessert' | 'beverage',
  isBestSelling: Boolean,
  image: String,
  availability: Boolean,
  rating: Number,
  reviews: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Room Schema
```typescript
{
  name: String,
  description: String,
  category: 'standard' | 'deluxe' | 'suite' | 'premium',
  price: Number,
  capacity: Number,
  amenities: [String],
  images: [String],
  availability: Boolean,
  rating: Number,
  reviews: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Data Included

### Food Categories
- **Veg**: Paneer Tikka, Vegetable Biryani, Dal Makhani, Chana Masala
- **Non-Veg**: Chicken Tikka Masala, Butter Chicken, Mutton Biryani, Fish Curry
- **Kids**: Chicken Nuggets, Mac and Cheese, Mini Pizza
- **Desserts**: Gulab Jamun, Chocolate Cake
- **Beverages**: Mango Lassi, Fresh Orange Juice

### Room Categories
- **Standard**: Single, Double rooms (₹2500-3500)
- **Deluxe**: Room, Twin rooms (₹5500-6500)
- **Suite**: Executive Suite, Junior Suite (₹8000-9500)
- **Premium**: Royal Suite, Presidential Suite (₹15000-20000)

## Next Steps

1. Update your React components to fetch from the API
2. Update your context providers to use API data
3. Add authentication middleware for admin routes
4. Configure CORS for your frontend origin

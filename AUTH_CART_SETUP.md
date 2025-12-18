# Authentication & Cart Setup Instructions

## 🎯 What This Adds

- **User Authentication** with username + email
- **Persistent Cart** - Cart items saved to database
- **Session Management** - Cart restored on login

## 📋 Setup Steps

### 1. Create Database Tables in Supabase

Go to your Supabase Dashboard → SQL Editor and run the SQL script:

**File:** `backend/src/scripts/createUserTables.sql`

This creates:
- `users` table (with username, email)
- `cart_items` table (linked to users)
- Row Level Security policies
- Indexes for performance

### 2. Test Authentication Flow

1. **Sign Up with Username**
   - Go to http://localhost:8080/auth
   - Click "Sign Up" tab
   - Enter username, email, password
   - Account created in Supabase Auth + users table

2. **Add Items to Cart**
   - Browse menu at http://localhost:8080/menu
   - Add items to cart
   - Items are saved to database automatically

3. **Logout & Login Again**
   - Click logout
   - Cart clears
   - Login again with same credentials
   - Cart is restored from database ✅

## 🔌 API Endpoints Added

### User Management
- `POST /api/users` - Create user profile
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/check/username/:username` - Check username availability
- `PUT /api/users/:id` - Update user profile

### Cart Management
- `GET /api/cart/:userId` - Get user's cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove cart item
- `DELETE /api/cart/user/:userId` - Clear entire cart

## 🔐 How It Works

### Sign Up Flow
1. User enters username, email, password
2. Frontend checks if username is available
3. Creates account in Supabase Auth
4. Creates user profile in `users` table
5. User is logged in automatically

### Cart Sync Flow
1. User adds item to cart
2. If logged in → Saved to database
3. If not logged in → Stored in memory only
4. On login → Cart loaded from database
5. On logout → Memory cart cleared

### Database Structure

```sql
users
├── id (UUID) - Links to Supabase auth.users
├── username (TEXT, UNIQUE)
├── email (TEXT, UNIQUE)
├── full_name (TEXT)
└── created_at, updated_at

cart_items
├── id (UUID)
├── user_id (UUID) - FK to users.id
├── item_type (menu/room/event)
├── item_id (UUID)
├── item_name (TEXT)
├── quantity (INTEGER)
├── price (DECIMAL)
└── image, category, timestamps
```

## ✅ Testing Checklist

- [ ] Run SQL script in Supabase
- [ ] Sign up with new username
- [ ] Check users table has new record
- [ ] Add items to cart
- [ ] Check cart_items table
- [ ] Logout
- [ ] Login again
- [ ] Verify cart restored
- [ ] Update quantity
- [ ] Remove item
- [ ] Clear cart

## 🐛 Troubleshooting

### Username already taken
- Check `users` table for existing usernames
- Try different username

### Cart not loading
- Check browser console for errors
- Verify backend is running on port 5050
- Check network tab for API calls

### Items not saving
- Ensure user is logged in
- Check RLS policies are created
- Verify backend routes are working

## 🔄 What Changed

### Frontend
- `Auth.tsx` - Added username field
- `AuthContext.tsx` - Updated signUp to accept username, create user profile
- `CartContext.tsx` - Added database sync for all cart operations

### Backend
- `userRoutes.ts` - User CRUD operations
- `cartRoutes.ts` - Cart CRUD operations  
- `index.ts` - Added new routes
- `createUserTables.sql` - Database schema

All cart operations now automatically sync to database when user is authenticated!

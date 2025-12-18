# Deployment Guide

## ✅ Project Structure

The application is now organized into separate frontend and backend folders:

```
orchid-hospitality/
├── frontend/          # React + Vite application
├── backend/           # Express + Supabase API
├── package.json       # Root package with convenience scripts
└── README_DEPLOYMENT.md
```

## ✅ Migration Complete: MongoDB → Supabase

Your application has been successfully migrated from MongoDB to Supabase!

## 📦 What Changed

### Removed
- ❌ MongoDB Atlas connection
- ❌ Mongoose ODM
- ❌ MongoDB models and database files

### Added
- ✅ Supabase PostgreSQL database
- ✅ 8 comprehensive tables with seed data
- ✅ Backend API using Supabase client
- ✅ Frontend Supabase integration
- ✅ Organized frontend/ and backend/ folder structure

## 🗄️ Database Tables

1. **categories** - 9 menu and room categories
2. **menu_items** - 20 food items across all categories
3. **rooms** - 12 rooms (standard, deluxe, suite, premium)
4. **event_plans** - 10 event packages
5. **orders** - Customer orders system
6. **order_items** - Order line items
7. **payments** - Payment transactions
8. **order_counter** - Order number generator

## 🚀 GitHub Setup & Push

### 1. Create a New GitHub Repository
```bash
# Go to https://github.com/new and create a new repository
# Copy the repository URL (e.g., https://github.com/yourusername/orchid-hospitality.git)
```

### 2. Add Remote and Push
```bash
cd "/Users/aarjavjain/Desktop/Screenshot/Projects /orchid-hospitality-main"

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push all changes
git push -u origin main
```

### Alternative: Push to Existing Repository
```bash
# If you already have a repository
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

## 🔐 Environment Variables

**IMPORTANT:** Before deploying, create `.env` files:

**Backend: `backend/.env`**
```env
# Supabase Configuration
SUPABASE_URL=https://oxqebhbscblkbfhljfdn.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94cWViaGJzY2Jsa2JmaGxqZmRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTA5OTgsImV4cCI6MjA4MTU2Njk5OH0.lEd6sRl291A_rSQiZDcQHDxTSOGv3GoLtoMT6xmvdVk

# Server Configuration
PORT=5050
NODE_ENV=development
```

**Frontend: `frontend/.env` (optional)**
```env
VITE_SUPABASE_URL=https://oxqebhbscblkbfhljfdn.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

⚠️ **Never commit `.env` files to GitHub!** (Already excluded in `.gitignore`)

## 🏃 Running the Application

### Quick Start (Recommended)

**Install all dependencies:**
```bash
npm run install:all
```

**Run both frontend and backend together:**
```bash
npm run dev
```

This will start:
- Backend API on http://localhost:5050
- Frontend on http://localhost:8080

### Individual Servers

**Backend only:**
```bash
npm run backend
# or
cd backend
PORT=5050 npm start
```

**Frontend only:**
```bash
npm run frontend
# or
cd frontend
npm run dev
```

### Building for Production

**Build everything:**
```bash
npm run build:all
```

**Build individually:**
```bash
npm run build:backend   # Compiles TypeScript
npm run build:frontend  # Builds React app
```

### Seed Database

```bash
npm run seed
# This will populate all 8 tables with sample data
```

## 📊 API Endpoints

All available at `http://localhost:5050/api/`:

- `GET /api/categories` - All categories
- `GET /api/categories/menu` - Menu categories only
- `GET /api/categories/rooms` - Room categories only
- `GET /api/menu` - All menu items
- `GET /api/menu/category/:category` - Menu by category
- `GET /api/menu/best-selling/all` - Best selling items
- `GET /api/rooms` - All rooms
- `GET /api/rooms/category/:category` - Rooms by category
- `GET /api/health` - Health check

## 🔧 Database Management

### View Data in Supabase
1. Go to: https://oxqebhbscblkbfhljfdn.supabase.co
2. Navigate to: **Table Editor**
3. View your tables and data

### Re-seed Database
```bash
cd server
npm run seed
```

### Run Custom SQL
Use the file `SUPABASE_SETUP.sql` in the Supabase SQL Editor to recreate tables.

## 🌐 Deployment Options

### Vercel (Recommended for Frontend)
```bash
npm install -g vercel
vercel
```

### Railway/Render (Backend)
1. Connect your GitHub repository
2. Set environment variables from `.env`
3. Deploy with build command: `cd server && npm run build`
4. Start command: `node server/dist/index.js`

## 📝 Notes

- Backend runs on port **5050**
- Frontend runs on port **8080**
- All MongoDB references removed
- Supabase handles all data operations
- RLS policies configured for public read access
- Ready for production deployment

## 🎉 Success!

Your application is now running on Supabase with a complete database and API! 

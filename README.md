# Orchid Hospitality - Restaurant Management System

A modern, full-stack web application for managing restaurant operations, room bookings, and event planning. Built with React, TypeScript, Express, and Supabase.

## 🚀 Quick Start

```bash
# Install all dependencies
npm run install:all

# Run both frontend and backend
npm run dev
```

Then open: **http://localhost:8080**

---

## 📁 Project Structure

```
orchid-hospitality/
├── frontend/              # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── integrations/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/               # Express + Supabase API
│   ├── src/
│   │   ├── config/
│   │   ├── routes/
│   │   └── scripts/
│   ├── package.json
│   └── .env              # Database credentials
│
├── package.json           # Root package with scripts
└── README_DEPLOYMENT.md   # Detailed deployment guide
```

---

## ✨ Features

### 🍽️ Menu Management
- Browse menu items by category (vegetarian, non-veg, kids, desserts, beverages)
- Filter and search functionality
- Best seller badges
- Real-time availability status

### 🏨 Room Bookings
- View rooms by category (standard, deluxe, suite, premium)
- Detailed amenities and pricing
- Capacity information
- Availability tracking

### 🎉 Event Planning
- Browse event packages (weddings, corporate, birthdays, social)
- Package details with inclusions
- Guest capacity and pricing

### 🛒 Shopping Cart & Orders
- Add/remove items
- Quantity management
- Order tracking system
- Payment integration ready

### 📱 Responsive Design
- Mobile-first approach
- Modern UI with Tailwind CSS + shadcn/ui
- Touch-friendly interface

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router
- **Forms**: React Hook Form + Zod
- **State**: React Context + TanStack Query
- **Database Client**: Supabase

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Port**: 5050

---

## 📦 Available Scripts

```bash
# Development
npm run dev              # Run both frontend and backend
npm run frontend         # Run frontend only
npm run backend          # Run backend only

# Installation
npm run install:all      # Install all dependencies

# Building
npm run build:all        # Build both projects
npm run build:frontend   # Build frontend
npm run build:backend    # Build backend

# Database
npm run seed             # Seed database with sample data
```

---

## 🌐 API Endpoints

Base URL: `http://localhost:5050/api/`

### Categories
- `GET /categories` - All categories
- `GET /categories/menu` - Menu categories
- `GET /categories/rooms` - Room categories

### Menu
- `GET /menu` - All menu items
- `GET /menu/:id` - Single item
- `GET /menu/category/:category` - By category
- `GET /menu/best-selling/all` - Best sellers

### Rooms
- `GET /rooms` - All rooms
- `GET /rooms/:id` - Single room
- `GET /rooms/category/:category` - By category

---

## 🗄️ Database

**8 Supabase Tables:**
1. **categories** - Menu and room categories
2. **menu_items** - Food and beverage items
3. **rooms** - Room inventory
4. **event_plans** - Event packages
5. **orders** - Customer orders
6. **order_items** - Order line items
7. **payments** - Payment transactions
8. **order_counter** - Order number generator

See [README_DEPLOYMENT.md](README_DEPLOYMENT.md) for detailed schema information.

---

## 🔐 Environment Variables

Create `backend/.env`:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=5050
NODE_ENV=development
```

⚠️ **Never commit .env files!** (Already in .gitignore)

---

## 📚 Documentation

- [README_DEPLOYMENT.md](README_DEPLOYMENT.md) - Complete deployment guide with environment setup, GitHub integration, and cloud deployment options

---

## 🚀 Deployment

### Live Frontend
- Netlify: https://orchidhotel.netlify.app/
- Uses Supabase directly from the browser; updates in Supabase tables (e.g., `menu_items`, `rooms`, `categories`) will be reflected on the frontend after a refresh.

### Backend
- Deploy the backend (Express + Supabase) only if you need the `/api` endpoints (see API Endpoints section) or server-side logic. The live Netlify build can run without the backend as long as Supabase credentials are configured.
- Recommended targets: Railway/Render/Fly.io with Node 18+, environment variables set, and CORS allowed for your Netlify domain.

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Render)
```bash
cd backend
npm run build
# Deploy with Node.js 18+
# Set environment variables
```

See detailed deployment instructions in [README_DEPLOYMENT.md](README_DEPLOYMENT.md).

---

## 🔧 Development Setup

1. **Prerequisites**
   - Node.js 18+
   - npm or bun
   - Supabase account

2. **Clone & Install**
   ```bash
   git clone <repo-url>
   cd orchid-hospitality
   npm run install:all
   ```

3. **Configure Environment**
   - Create `backend/.env` with Supabase credentials

4. **Seed Database**
   ```bash
   npm run seed
   ```

5. **Run Application**
   ```bash
   npm run dev
   ```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5050 is in use
lsof -i :5050

# Kill process if needed
kill -9 <PID>
```

### Frontend can't connect to backend
- Verify backend is running on port 5050
- Check Vite proxy configuration in `frontend/vite.config.ts`

### Database connection issues
- Verify Supabase credentials in `backend/.env`
- Check internet connection
- Verify Supabase project is active

---

## 📝 License

Private and Proprietary

---

## 👥 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## 📞 Support

For detailed setup help, see [README_DEPLOYMENT.md](README_DEPLOYMENT.md)

Built with ❤️ using React, Express, and Supabase

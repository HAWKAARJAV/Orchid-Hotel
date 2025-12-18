import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './config/supabase.js';
import menuRoutes from './routes/menuRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    // Test Supabase connection
    const { error } = await supabase.from('categories').select('count').limit(1);
    if (error) throw error;
    res.json({ status: 'Server and Supabase connection OK' });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: 'Supabase connection failed' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Supabase connected successfully`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

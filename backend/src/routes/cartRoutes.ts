import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();

// Get all cart items for a user
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cart items:', error);
      return res.status(400).json({ error: error.message });
    }

    res.json(data || []);
  } catch (error) {
    console.error('Error in GET /cart/:userId:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add item to cart
router.post('/', async (req: Request, res: Response) => {
  try {
    const { user_id, item_type, item_id, item_name, quantity, price, image, category } = req.body;

    if (!user_id || !item_type || !item_id || !item_name || !quantity || !price) {
      return res.status(400).json({ 
        error: 'Missing required fields: user_id, item_type, item_id, item_name, quantity, price' 
      });
    }

    // Check if item already exists in cart
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user_id)
      .eq('item_type', item_type)
      .eq('item_id', item_id)
      .single();

    if (existing) {
      // Update quantity if item exists
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      return res.json(data);
    }

    // Insert new item
    const { data, error } = await supabase
      .from('cart_items')
      .insert([{ user_id, item_type, item_id, item_name, quantity, price, image, category }])
      .select()
      .single();

    if (error) {
      console.error('Error adding to cart:', error);
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Error in POST /cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update cart item quantity
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error('Error in PUT /cart/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove item from cart
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error in DELETE /cart/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clear entire cart for a user
router.delete('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Error in DELETE /cart/user/:userId:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

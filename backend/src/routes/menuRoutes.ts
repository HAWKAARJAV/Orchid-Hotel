import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();

// Get all menu items
router.get('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('is_best_selling', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// Get menu items by category
router.get('/category/:category', async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('category', category)
      .order('is_best_selling', { ascending: false });
    
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// Get best-selling items
router.get('/best-selling/all', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('is_best_selling', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch best-selling items' });
  }
});

// Get menu item by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    if (!data) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu item' });
  }
});

// Create menu item (admin only)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .insert([req.body])
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create menu item' });
  }
});

// Update menu item (admin only)
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update menu item' });
  }
});

// Delete menu item (admin only)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', req.params.id);
    
    if (error) throw error;
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

export default router;

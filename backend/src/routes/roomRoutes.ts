import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();

// Get all rooms
router.get('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('price', { ascending: true });
    
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Get rooms by category
router.get('/category/:category', async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('category', category)
      .order('price', { ascending: true });
    
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Get room by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    if (!data) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch room' });
  }
});

// Create room (admin only)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .insert([req.body])
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create room' });
  }
});

// Update room (admin only)
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update room' });
  }
});

// Delete room (admin only)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', req.params.id);
    
    if (error) throw error;
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete room' });
  }
});

export default router;

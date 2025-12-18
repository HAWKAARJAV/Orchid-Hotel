import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();

// Create user profile (called after Supabase auth signup)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { id, username, email, full_name } = req.body;

    if (!id || !username || !email) {
      return res.status(400).json({ error: 'Missing required fields: id, username, email' });
    }

    const { data, error } = await supabase
      .from('users')
      .insert([{ id, username, email, full_name }])
      .select()
      .single();

    if (error) {
      console.error('Error creating user profile:', error);
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Error in POST /users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error in GET /users/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check if username is available
router.get('/check/username/:username', async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const { data, error } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .single();

    if (error && error.code === 'PGRST116') {
      // No rows returned - username is available
      return res.json({ available: true });
    }

    if (data) {
      return res.json({ available: false });
    }

    res.json({ available: true });
  } catch (error) {
    console.error('Error checking username:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, full_name, avatar_url } = req.body;

    const updates: any = {};
    if (username) updates.username = username;
    if (full_name !== undefined) updates.full_name = full_name;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error('Error in PUT /users/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

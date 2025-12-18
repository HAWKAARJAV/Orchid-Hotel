import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();

// Create order (supports PENDING, SUCCESS, COD)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { customer_name, customer_phone, total_amount, payment_status = 'PENDING' } = req.body;

    if (!customer_name || !customer_phone || !total_amount) {
      return res.status(400).json({ error: 'customer_name, customer_phone, total_amount are required' });
    }

    const orderDate = new Date().toISOString().slice(0, 10);

    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          customer_name,
          customer_phone,
          total_amount,
          payment_status,
          order_date: orderDate,
        },
      ])
      .select('id, token_number, payment_status, order_date')
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json(data);
  } catch (err) {
    console.error('Error creating order:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update payment status (e.g., after gateway success) and return token
router.post('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;

    if (!payment_status) {
      return res.status(400).json({ error: 'payment_status is required' });
    }

    const { data, error } = await supabase
      .from('orders')
      .update({ payment_status })
      .eq('id', id)
      .select('id, token_number, payment_status, order_date')
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json(data);
  } catch (err) {
    console.error('Error updating order status:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch order token
router.get('/:id/token', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('orders')
      .select('id, token_number, payment_status, order_date')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json(data);
  } catch (err) {
    console.error('Error fetching order token:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
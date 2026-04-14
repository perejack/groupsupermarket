// PayHero Payment Status Check API
import { createClient } from '@supabase/supabase-js';

// Hardcoded Supabase credentials - using SERVICE ROLE key for RLS bypass
const SUPABASE_URL = 'https://fyftqlnobwmmlwcdjgua.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5ZnRxbG5vYndtbWx3Y2RqZ3VhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjEyMzE1MiwiZXhwIjoyMDkxNjk5MTUyfQ.brsAY7H7W9m2s9OYoNnfhQZb0hKB7Q3p3Xb04d4cOxc';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { checkout_request_id } = req.query;
    
    if (!checkout_request_id) {
      return res.status(400).json({ error: 'checkout_request_id is required' });
    }

    // Query database for payment status
    const { data: payment, error } = await supabase
      .from('mpesa_payments')
      .select('status, mpesa_receipt_number, updated_at')
      .eq('checkout_request_id', checkout_request_id)
      .single();

    if (error) {
      console.error('Error fetching payment status:', error);
      return res.status(500).json({ error: 'Failed to fetch payment status' });
    }

    if (!payment) {
      return res.status(404).json({ status: 'pending' });
    }

    return res.status(200).json({
      status: payment.status,
      mpesaReceiptNumber: payment.mpesa_receipt_number,
      updatedAt: payment.updated_at,
    });
  } catch (error) {
    console.error('Payment Status Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

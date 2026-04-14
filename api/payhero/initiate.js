// PayHero STK Push API
import { createClient } from '@supabase/supabase-js';

const PAYHERO_API_URL = 'https://backend.payhero.co.ke/api/v2/payments';
const PAYHERO_AUTH_TOKEN = 'Basic dDEwUm1naWREdEFNUElOWEJmSUY6YjVoMFlTM1JYY29GcEdGUHdFcnhZTTJJTFVWcU1RMEhjMFAxVmJZdQ==';
const PAYHERO_CHANNEL_ID = 6980;

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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phone_number, amount, reference, description, user_id, application_id } = req.body;
    
    if (!phone_number || !amount) {
      return res.status(400).json({ error: 'Phone number and amount are required' });
    }

    // Format phone number
    let cleaned = phone_number.replace(/\D/g, '');
    if (cleaned.startsWith('0')) cleaned = '254' + cleaned.substring(1);
    if (cleaned.startsWith('+')) cleaned = cleaned.substring(1);
    if (!cleaned.startsWith('254')) cleaned = '254' + cleaned;

    const externalReference = reference || `KCC${Date.now()}`;
    
    // Get callback URL from request or use default
    const callbackUrl = req.headers.origin 
      ? `${req.headers.origin}/api/payhero/callback`
      : 'https://www.careersapplicationskenya.site/api/payhero/callback';

    // Call PayHero API
    const response = await fetch(PAYHERO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': PAYHERO_AUTH_TOKEN,
      },
      body: JSON.stringify({
        amount: Math.round(amount),
        phone_number: cleaned,
        channel_id: PAYHERO_CHANNEL_ID,
        provider: 'm-pesa',
        external_reference: externalReference,
        customer_name: '',
        callback_url: callbackUrl,
      }),
    });

    const data = await response.json().catch(() => null);
    console.log('PayHero response:', data);

    if (!response.ok || !data) {
      return res.status(response.status || 500).json({
        success: false,
        error: data?.message || 'Failed to initiate payment',
      });
    }

    const checkoutRequestId = data?.CheckoutRequestID || data?.reference || externalReference;

    // Insert payment record into database
    const { error: insertError } = await supabase
      .from('mpesa_payments')
      .insert({
        checkout_request_id: checkoutRequestId,
        user_id: user_id || 'anonymous',
        application_id: application_id || null,
        phone_number: cleaned,
        amount: Math.round(amount),
        status: 'pending',
        external_reference: externalReference,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error('Error inserting payment record:', insertError);
    }

    // Return success response
    return res.status(200).json({
      success: true,
      checkoutRequestId: checkoutRequestId,
      reference: externalReference,
      status: data?.status,
    });
  } catch (error) {
    console.error('PayHero STK Push Error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}

// PayHero Payment Callback Handler - Hardcoded credentials
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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('PayHero callback received:', req.body);
    
    const { response, status, forward_url } = req.body;
    
    if (!response) {
      return res.status(400).json({ error: 'Invalid callback data' });
    }

    const {
      CheckoutRequestID,
      ExternalReference,
      MpesaReceiptNumber,
      Phone,
      ResultCode,
      ResultDesc,
      Status,
      Amount,
    } = response;

    const isSuccess = ResultCode === 0 && Status?.toLowerCase() === 'success';
    
    console.log('Processing payment:', CheckoutRequestID, 'Success:', isSuccess);

    // Update payment record in database using service role key
    const { error: updateError, data: updateData } = await supabase
      .from('mpesa_payments')
      .update({
        status: isSuccess ? 'completed' : 'failed',
        mpesa_receipt_number: MpesaReceiptNumber || null,
        result_code: ResultCode,
        result_desc: ResultDesc,
        updated_at: new Date().toISOString(),
      })
      .eq('checkout_request_id', CheckoutRequestID)
      .select();

    if (updateError) {
      console.error('Error updating payment:', updateError);
    } else {
      console.log('Payment updated successfully:', updateData);
    }

    // If payment successful, update application status
    if (isSuccess) {
      // Get payment record to find user_id and application_id
      const { data: paymentRecord, error: paymentError } = await supabase
        .from('mpesa_payments')
        .select('user_id, application_id')
        .eq('checkout_request_id', CheckoutRequestID)
        .single();

      if (paymentError) {
        console.error('Error finding payment for application update:', paymentError);
      }

      if (paymentRecord) {
        const { user_id, application_id } = paymentRecord;
        console.log('Updating application payment status for user:', user_id, 'application:', application_id);
        
        // Update application with paid status
        const { error: appError, data: appData } = await supabase
          .from('applications')
          .update({
            payment_status: 'completed',
            mpesa_receipt_number: MpesaReceiptNumber,
            paid_at: new Date().toISOString(),
            status: 'confirmed',
          })
          .eq('id', application_id)
          .select();

        if (appError) {
          console.error('Error updating application:', appError);
        } else {
          console.log('Application updated successfully:', appData);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Callback processed',
      status: isSuccess ? 'completed' : 'failed',
    });
  } catch (error) {
    console.error('PayHero Callback Error:', error);
    return res.status(200).json({
      success: true,
      message: 'Callback received (with errors)',
    });
  }
}

// PayHero M-Pesa Integration Service
import { toast } from 'sonner';

export class MpesaService {
  static formatPhone(phone: string): string {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) cleaned = '254' + cleaned.substring(1);
    if (cleaned.startsWith('+')) cleaned = cleaned.substring(1);
    if (!cleaned.startsWith('254')) cleaned = '254' + cleaned;
    return cleaned;
  }

  // Initiate STK Push via PayHero
  static async initiateSTKPush(
    phoneNumber: string,
    amount: number,
    applicationId: string,
    userId: string,
    supermarket: string
  ): Promise<{ success: boolean; checkoutRequestId?: string; error?: string }> {
    try {
      const formattedPhone = this.formatPhone(phoneNumber);
      const checkoutRequestId = `KCC${Date.now()}${Math.random().toString(36).substr(2, 9)}`;

      // Call PayHero API
      const response = await fetch('/api/payhero/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: formattedPhone,
          amount,
          reference: checkoutRequestId,
          description: `Interview processing fee for ${supermarket}`,
          user_id: userId,
          application_id: applicationId,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        return { success: false, error: data?.error || 'Failed to initiate payment' };
      }

      toast.success('STK Push sent! Check your phone and enter PIN.');
      
      return {
        success: true,
        checkoutRequestId: data?.checkoutRequestId || checkoutRequestId,
      };
    } catch (error: any) {
      console.error('PayHero STK Push Error:', error);
      return { success: false, error: error.message || 'Failed to initiate payment' };
    }
  }

  // Poll payment status
  static async pollPaymentStatus(
    checkoutRequestId: string,
    onComplete: () => void,
    onFailed: () => void,
    maxAttempts: number = 30
  ) {
    let attempts = 0;
    
    const checkStatus = async () => {
      if (attempts >= maxAttempts) {
        onFailed();
        return;
      }
      attempts++;

      try {
        // Check payment status from our backend
        const response = await fetch(`/api/payhero/status?checkout_request_id=${checkoutRequestId}`);
        const data = await response.json().catch(() => null);

        if (data?.status === 'completed') {
          onComplete();
          return;
        }

        if (data?.status === 'failed') {
          onFailed();
          return;
        }

        setTimeout(checkStatus, 5000);
      } catch (error) {
        setTimeout(checkStatus, 5000);
      }
    };

    setTimeout(checkStatus, 5000);
  }
}

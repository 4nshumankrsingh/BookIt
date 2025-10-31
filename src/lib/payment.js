// Razorpay payment integration for BookIt

/**
 * Initialize Razorpay payment
 * @param {Object} paymentData - Payment information
 * @param {number} paymentData.amount - Amount in INR (paise)
 * @param {string} paymentData.currency - Currency code (INR)
 * @param {string} paymentData.receipt - Receipt ID
 * @param {Object} paymentData.notes - Additional notes
 * @returns {Promise<Object>} - Razorpay order details
 */
export const createRazorpayOrder = async (paymentData) => {
  try {
    // In a real implementation, this would call your backend API
    // which then calls Razorpay API with your secret key
    
    const response = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment order');
    }

    const order = await response.json();
    return order;
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    throw new Error('Failed to create payment order');
  }
};

/**
 * Verify Razorpay payment signature
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} signature - Razorpay signature
 * @returns {Promise<boolean>} - Whether signature is valid
 */
export const verifyPaymentSignature = async (orderId, paymentId, signature) => {
  try {
    const response = await fetch('/api/payments/verify-signature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        paymentId,
        signature
      }),
    });

    if (!response.ok) {
      throw new Error('Payment verification failed');
    }

    const result = await response.json();
    return result.valid;
  } catch (error) {
    console.error('Payment verification error:', error);
    throw new Error('Payment verification failed');
  }
};

/**
 * Format amount for Razorpay (convert to paise)
 * @param {number} amount - Amount in INR
 * @returns {number} - Amount in paise
 */
export const formatAmountForRazorpay = (amount) => {
  return Math.round(amount * 100); // Convert INR to paise
};

/**
 * Format amount for display (convert from paise to INR)
 * @param {number} amount - Amount in paise
 * @returns {number} - Amount in INR
 */
export const formatAmountFromRazorpay = (amount) => {
  return amount / 100; // Convert paise to INR
};

/**
 * Get Razorpay configuration for client-side
 * @returns {Object} - Razorpay configuration
 */
export const getRazorpayConfig = () => {
  return {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Your Razorpay key ID
    currency: 'INR',
    name: 'BookIt',
    description: 'Travel Experiences Booking',
    prefill: {
      name: '',
      email: '',
      contact: ''
    },
    theme: {
      color: '#2563eb'
    }
  };
};

/**
 * Initialize Razorpay checkout
 * @param {Object} order - Razorpay order details
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const initializeRazorpayCheckout = (order, onSuccess, onError) => {
  const razorpayConfig = getRazorpayConfig();
  
  const options = {
    ...razorpayConfig,
    amount: order.amount,
    order_id: order.id,
    handler: async function (response) {
      try {
        const isValid = await verifyPaymentSignature(
          response.razorpay_order_id,
          response.razorpay_payment_id,
          response.razorpay_signature
        );

        if (isValid) {
          onSuccess(response);
        } else {
          onError(new Error('Payment verification failed'));
        }
      } catch (error) {
        onError(error);
      }
    },
    modal: {
      ondismiss: function() {
        onError(new Error('Payment cancelled by user'));
      }
    }
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};

export default {
  createRazorpayOrder,
  verifyPaymentSignature,
  formatAmountForRazorpay,
  formatAmountFromRazorpay,
  getRazorpayConfig,
  initializeRazorpayCheckout
};
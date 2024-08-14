// src/components/PayPalSuccess.jsx

import React, { useEffect } from 'react';
import axios from 'axios';

const PayPalSuccess = () => {
  useEffect(() => {
    const executePayment = async () => {
      const params = new URLSearchParams(window.location.search);
      const paymentId = params.get('paymentId');
      const payerId = params.get('PayerID');

      try {
        await axios.post('http://localhost:5000/execute-paypal-payment', {
          payment_id: paymentId,
          payer_id: payerId
        });
        // Handle successful payment, e.g., show a success message or redirect to another page
      } catch (error) {
        console.error("Error executing PayPal payment", error);
      }
    };

    executePayment();
  }, []);

  return <div>Processing your payment...</div>;
};

export default PayPalSuccess;

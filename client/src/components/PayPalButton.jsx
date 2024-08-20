import React from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';

const PayPalButton = ({ amount, onSuccess }) => {
  const handleApprove = (data, actions) => {
    return actions.order.capture().then(details => {
      onSuccess(details);
    });
  };

  return (
    <PayPalButtons
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              currency_code: 'USD',
              value: amount.toFixed(2), // Amount should be in the currency format
            },
          }],
        });
      }}
      onApprove={handleApprove}
      onError={(err) => console.error('PayPal error:', err)}
    />
  );
};

export default PayPalButton;
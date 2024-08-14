import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import Navbar from './Navbar';
import Footer from './Footer';
import { loadStripe } from '@stripe/stripe-js';
import './CartPage.css';

const stripePromise = loadStripe('pk_test_51NhQVmGSMQUybJjfFioS46tXNREuyqoTkLZKmZnKHFYmTu7FaazoTJkAKqdIzlq883Hyu4EBk3UcpW8bxOkUdMyb00BDkAUU5X'); // Replace with your public key

function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('/cart');
        setCartItems(response.data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, []);

  const handleDelete = async (paintId) => {
    try {
      await axios.delete('/cart', { data: { paint_id: paintId } });
      setCartItems(prevItems => prevItems.filter(item => item.paint_id !== paintId));
    } catch (error) {
      console.error('Error deleting item from cart:', error);
    }
  };

  const handleIncrement = async (paintId) => {
    try {
      await axios.post('/cart/update', { paint_id: paintId, quantity: 1 });
      const response = await axios.get('/cart');
      setCartItems(response.data);
    } catch (error) {
      console.error('Error incrementing item quantity:', error);
    }
  };

  const handleDecrement = async (paintId) => {
    try {
      await axios.post('/cart/update', { paint_id: paintId, quantity: -1 });
      const response = await axios.get('/cart');
      setCartItems(response.data);
    } catch (error) {
      console.error('Error decrementing item quantity:', error);
    }
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleStripeCheckout = async () => {
    try {
      const stripe = await stripePromise;
  
      // Format line items for Stripe checkout session
      const lineItems = cartItems.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: `${item.size} ${item.color}`,
          },
          unit_amount: item.price * 100, // Amount in cents
        },
        quantity: item.quantity,
      }));
  
      // Create a checkout session
      const response = await axios.post('/create-checkout-session', { line_items: lineItems });
  
      // Redirect to the Stripe Checkout page
      const { id } = response.data; // Ensure you're receiving the `id` property
      const result = await stripe.redirectToCheckout({ sessionId: id });
  
      if (result.error) {
        console.error('Stripe Checkout error:', result.error);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  const handlePayPalCheckout = () => {
    window.paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
         "purchase_units": [{
    "reference_id": "default",
    "amount": {
      "currency_code": "USD",
      "value": "100.00"  // This should be the total amount of the order, not zero
    },
            items: cartItems.map(item => ({
              name: item.name,
              unit_amount: {
                currency_code: 'USD',
                value: item.price.toFixed(2),
              },
              quantity: item.quantity,
            })),
          }],
        });
      },
      onApprove: async (data, actions) => {
        await actions.order.capture();
        // Handle successful payment here
        console.log('Payment successful:', data);
      },
      onError: (err) => {
        console.error('PayPal Checkout error:', err);
      },
    }).render('#paypal-button-container');
  };

  useEffect(() => {
    handlePayPalCheckout(); // Render the PayPal button
  }, [cartItems]);

  return (
    <>
      <Navbar />
      <main>
        <h2>Your Cart</h2>
        {cartItems.length ? (
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.paint_id} className="cart-item">
                <img src={item.image_url} alt={item.name} />
                <h3>{item.name}</h3>
                <p>Price: ${item.price.toFixed(2)}</p>
                <p>Size: {item.size}</p>
                <p>Color: {item.color}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                <button onClick={() => handleDecrement(item.paint_id)} disabled={item.quantity <= 1}>-</button>
                <button onClick={() => handleIncrement(item.paint_id)}>+</button>
                <button onClick={() => handleDelete(item.paint_id)}>Remove</button>
              </div>
            ))}
            <div className="cart-total">
              <h3>Total Price: ${calculateTotalPrice()}</h3>
            </div>
          </div>
        ) : (
          <p>Your cart is empty</p>
        )}
        <button onClick={handleStripeCheckout}>Checkout with Stripe</button>
        <div id="paypal-button-container"></div>
      </main>
      <Footer />
    </>
  );
}

export default CartPage;

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './SuccessPage.css'; // Style the page according to the design
import Navbar from './Navbar';
import Footer from './Footer';

function SuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState('Processing your payment...');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get('session_id');

    const clearCart = async () => {
      try {
        await axios.post('http://localhost:5000/clear-cart');
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    };

    const verifyPayment = async () => {
      try {
        console.log('Session ID:', sessionId); // Debugging
        const response = await axios.post('http://localhost:5000/stripe-success', { session_id: sessionId });
        console.log('Response:', response.data); // Debugging
        if (response.data.message === 'Payment successful') {
          setMessage('Payment was successful!');
        } else {
          setMessage('Payment failed. Please try again.');
        }
      } catch (error) {
        setMessage('An error occurred while verifying payment.');
      }
    };

    if (sessionId) {
      clearCart();
      verifyPayment();
    } else {
      setMessage('Invalid session ID.');
      clearCart(); // Clear cart even if session ID is invalid
    }
  }, [location.search]);

  const handleContinueShopping = () => {
    navigate('/');  // Redirect to the products page or homepage
  };

  const handleTrackOrder = () => {
    navigate('/orders');  // Redirect to the user's order page
  };

  return (
    <div className="success-page">
      <Navbar />
      <h2>Order Successful!</h2>
      <p>Thank you for your purchase. Your order has been successfully placed.</p>
      <p>You will receive a confirmation email with the details of your order.</p>
      <p>Expected delivery date: 3-5 business days</p>
      <button onClick={handleContinueShopping}>Continue Shopping</button>
    </div>
   
  );
  <Footer />
}

export default SuccessPage;

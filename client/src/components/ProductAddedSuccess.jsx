import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function ProductAddedSuccess() {
  return (
    <div>
      <Navbar />
      <h2>Product Added Successfully!</h2>
      <p>The product has been added to the inventory. Thank you!</p>
      <Link to="/dashboard">Go back to Dashboard</Link>
      <Footer />
    </div>
  );
}

export default ProductAddedSuccess;

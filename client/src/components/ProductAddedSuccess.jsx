import React from 'react';
import { Link } from 'react-router-dom';

function ProductAddedSuccess() {
  return (
    <div>
      <h2>Product Added Successfully!</h2>
      <p>The product has been added to the inventory. Thank you!</p>
      <Link to="/dashboard">Go back to Dashboard</Link>
    </div>
  );
}

export default ProductAddedSuccess;

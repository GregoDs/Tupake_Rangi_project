// Homepage.jsx
import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import Navbar from './Navbar';
import Footer from './Footer';
import './Homepage.css';

function Homepage() {
  const [paints, setPaints] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaints = async () => {
      try {
        const response = await axios.get('/paints');
        setPaints(response.data);
      } catch (error) {
        console.error('Error fetching paints:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaints();
  }, []);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const countResponse = await axios.get('/cart/count');
        setCartCount(countResponse.data.count);
      } catch (error) {
        console.error('Error fetching cart count:', error);
      }
    };

    fetchCartCount();
  }, [cartCount]);

  const addToCart = async (paint) => {
    try {
      await axios.post('/cart', { paint_id: paint.id, quantity: 1 });
      // Cart count will be updated via the effect hook
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar cartCount={cartCount} />
      <main>
        <h2>Welcome to Paint Shop</h2>
        <section className="products">
          {paints.length ? (
            <div className="products-container">
              {paints.map(paint => (
                <div key={paint.id} className="product-card">
                  <img src={paint.image_url} alt={paint.name} />
                  <h3>{paint.name}</h3>
                  <p>Price: ${paint.price}</p>
                  <p>Size: {paint.size}</p>
                  <p>Color: {paint.color}</p>
                  <button onClick={() => addToCart(paint)}>Add to Cart</button>
                </div>
              ))}
            </div>
          ) : (
            <p>No products available</p>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Homepage;

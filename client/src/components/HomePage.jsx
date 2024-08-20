import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from '../api/axios';
import Navbar from './Navbar';
import Footer from './Footer';
import './Homepage.css';
import { debounce } from 'lodash';
import { Link } from 'react-router-dom';

const useDebouncedScroll = (delay) => {
  const scrollToProducts = useCallback(debounce((ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, delay), [delay]);

  return scrollToProducts;
};

function Homepage() {
  const [paints, setPaints] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const productsRef = useRef(null);
  const paintLinksRef = useRef([]);
  const scrollToProducts = useDebouncedScroll(300);

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
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('/cart');
        setCartItems(response.data.items || []);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, [cartCount]);

  const addToCart = async (paint) => {
    try {
      await axios.post('/cart', { paint_id: paint.id, quantity: 1 });
      setCartCount(prevCount => prevCount + 1);
      setCartItems(prevItems => [...prevItems, paint.id]);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (paint) => {
    try {
      await axios.delete(`/cart/${paint.id}`);
      setCartCount(prevCount => prevCount - 1);
      setCartItems(prevItems => prevItems.filter(itemId => itemId !== paint.id));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const handleScroll = () => {
    scrollToProducts(productsRef);
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        } else {
          entry.target.classList.remove('in-view');
        }
      });
    }, { threshold: 0.1 });

    paintLinksRef.current.forEach(element => {
      if (element) observer.observe(element);
    });

    return () => {
      paintLinksRef.current.forEach(element => {
        if (element) observer.unobserve(element);
      });
    };
  }, [paints]);

  if (loading) {
    return <div>Loading...</div>;
  }

  
  const buttonStyle = {
    backgroundColor: '#ca3116', /* Updated background color */
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem', /* Adjusted padding */
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    width: '250px', /* Fixed width to control the length */
    textAlign: 'center', /* Center the text inside the button */
  };
  
  // Hover effect
  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: '#a93b10', /* Slightly different color for hover */
  };

return (
  <>
    <Navbar cartCount={cartCount} />
    <header className="homepage-header">
      <div className="hero-section">
        <h1>Beautiful Interior and Exterior Painting Solution</h1>
        <p className="hero-description">
          At our company, we pride ourselves on providing high-quality paints that transform your space with vibrant and lasting color.
        </p>
        <button
          onClick={handleScroll}
          style={buttonStyle}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
        >
          Shop Now
        </button>
      </div>
      </header>
      <div className="paint-collections">
        {['Interior Paints', 'Metallic Paints', 'Exterior PaintPaints'].map((header, index) => (
          <a
            key={index}
            href="#"
            className="paint-link"
            ref={el => paintLinksRef.current[index] = el}
          >
            <img
              src={`https://dt-paintpros.myshopify.com/cdn/shop/files/collection-image-${index + 2}.jpg?v=1689252039&width=1500`}
              alt={header}
              className="paint-image"
            />
            <h3 className="paint-header">{header}</h3>
          </a>
        ))}
      </div>
    
      <div className="paint-calculator-section">
        <div className="paint-calculator-content">
          <h2>Calculate Your Paint Needs</h2>
          <p>Use our Paint Calculator to estimate how much paint you'll need for your project.</p>
          <Link to="/paint-calculator" className="paint-calculator-button">Use Paint Calculator</Link>
        </div>
      </div>
    
      <main>
        <h2 ref={productsRef}>Our Products</h2>
        <section className="products">
          {paints.length ? (
            <div className="products-container">
              {paints.map(paint => {
                const isInCart = Array.isArray(cartItems) && cartItems.includes(paint.id);
                return (
                  <div key={paint.id} className="product-card">
                    <img src={paint.image_url} alt={paint.name} />
                    <h3>{paint.name}</h3>
                    <p>Price: ${paint.price}</p>
                    <p>Size: {paint.size}</p>
                    <p>Color: {paint.color}</p>
                    <button
                      onClick={() => isInCart ? removeFromCart(paint) : addToCart(paint)}
                    >
                      {isInCart ? 'Remove from Cart' : 'Add to Cart'}
                    </button>
                  </div>
                );
              })}
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

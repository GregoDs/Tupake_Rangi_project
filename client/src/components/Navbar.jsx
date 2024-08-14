import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import './Navbar.css';

function Navbar() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/user'); // Adjust endpoint as needed
        if (response.data && response.data.username) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const response = await axios.get('/cart/count');
        setCartCount(response.data.count);
      } catch (error) {
        console.error('Error fetching cart count:', error);
      }
    };

    fetchCartCount();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/logout'); // Call logout endpoint
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav>
      <div className="navbar-container">
        <h1><Link to="/">Paint Shop</Link></h1>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li className="cart">
            <Link to="/cart">
              <img 
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAilBMVEX///8jHyAREiQAAACOjo4AAAv09PQdGRoJAACxsLEaFRZPTU0zLi8SCw13dneqqqpnZWaKiIm7uruioaHi4uLs7OzZ2dkAABcAABuUlJRFRETIyMg9OzsqKSlbWlqBgIFwbm8zMzNISVIgIC4ZGig7PEcAABI0NDt+foRZWWAmJzNRUVh0dHpoanKSBZ1rAAADtklEQVR4nO2a7ZqaMBCFoVE+jSIC8q21tdWue/+3VyFBUSKMawCfdt4/+xjZ5DCcZCZERUEQBEEQBEEQBEEQBEEQ5B9DqzG2FoY/J3Vo9A66cqLW0cl8bEWKYt5qOkOSsTUpkXEvio4fqkVDlEqDsUVpKm2IcsYWpQSxSjmWxV01eqgULXErNta7uKqGn+ksVon2PL2pitgCoauzp0nnfT10X+Wh0p/GImlfqprLFpzecoGXfV2UFfflq0kj7cBF5X2J8r8uytj0pKnmKsuAwnOCsepNVFC5KjKhrFh0Lff1wc1Fo/ekMMWGhYpOwF0lTFT28pJgEhEb7eIqnfrQvlik9BT8Dw/wMkvkVWIql1CRJbSzeWkqy35Rk+IKNalG8cyC6pMH7CwvO6PbV0UFulAUKScQu3OVRrC+/LjsjAAvb2FJaBNil7aoXJXBTMLnq4TaXjO3ToOIq3C4q2D3njArkFd93kHlKtgEXLDJR/veMG7pE2v00pAz+RjeatLELW7Y466aQSYgm3ySMl8wEy6gZVVk09psbEdjhSHkUgBxY3N1nUUB/44AREnLfAUPihRmJLirpGW+klxc+rL1JmFf6nHnBOSZr/tCEIlKmrURIVsumbtq0dUNi6mVS9F0XrmjZYOoWpf5U9E7XWWzzDfIBlbbwkLlp7IyHwSXidLtdrPIy3xX/GjeZFmOkFuQULnyM59vC6uF8r4rV2WtPSwodEEDE4kXK8suko3DxzPbephIzXwlc/FaxVadylVpJMiRFazCM2ROPlccKYO9zOOu0ts2fTpwOXsCbStMysRrkyy6CzmZryJZNHGres0W5+wmkjIfCBf4ZkhW5gOh5bBQSfV5JwEhVjdEHzBQZ7xlbHcSQbetCPLe+J4n2gBr4uZB8Jd2mubN9LbKz80jne+6xLCKI4XZ7fCeQcrmbIyjVM/gb9gMp67KrxIjzYaPVbWDUO8KlOsxgAF+ESkNb3Z562fFtXbj0jxoOmYktaKqVolr9Vpr8KPUtxQVXMe2vtfar6L0dPCErDlXo9ffwWwuqmh/J0UPSQi3NL0xdFCdD+hkjMplpZexIt9vBw/Uslg2VLmbBihJXB7c3AckcIpmZ7RfMWiBeOgHzQiCIAiCIAiCIAiCIAiCIAiCIP8XLT/tGw1l+oYo396QUlTIP/C/6zAMbxqGphAV7n783E/DkOzC9a9w+vtw+thNyXpN9kdy3I0gjIn6+HM47T5Oh8/jYfcZHeyT+ekej+5pEu33Q4i6G+MvGr1KRgh92bEAAAAASUVORK5CYII=" 
                alt="Cart" 
                className="cart-icon" 
              />
              {cartCount > 0 && (
                <span className="cart-count">{cartCount}</span>
              )}
            </Link>
          </li>
          {user ? (
            <li className="dropdown">
              <div className="user-info" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <img
                  src="https://img.icons8.com/?size=256w&id=81139&format=png" // Use your actual profile icon image path
                  alt="Profile"
                  className="profile-icon"
                />
                <span className="username">{user.username}</span>
              </div>
              {dropdownOpen && (
                <ul className="dropdown-menu">
                  <li><Link to="/profile">Profile</Link></li>
                  <li><button onClick={handleLogout}>Logout</button></li>
                </ul>
              )}
            </li>
          ) : (
            <li className="dropdown">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="login-register">
                Account
              </button>
              {dropdownOpen && (
                <ul className="dropdown-menu">
                  <li><Link to="/login">Login</Link></li>
                  <li><Link to="/register">Register</Link></li>
                </ul>
              )}
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

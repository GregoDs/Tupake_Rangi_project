import React, { useState } from 'react';
import axios from '../api/axios';  // Import the Axios instance
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './RegisterPage.css';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/register', { username, email, password });
      if (response.data.message === "User registered successfully") {
        navigate('/');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("There was an error registering!", error);
    }
  };

  return (
    <div>
      <Navbar />
      <main>
        <div className="main-container">
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            
            {/* Add this section */}
            <div className="login-question">
              <p>Already have an account? <a href="/login">Log in here</a></p>
            </div>
            
            <button type="submit">Register</button>
          </form>
        </div>
      </main>
      <Footer className="footer" />
    </div>
  );
}

export default RegisterPage;

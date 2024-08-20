import React, { useState } from 'react';
import axios from '../api/axios'; // Import your Axios instance
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');  // Add state for role
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/login', { email, password, role });
      if (response.data.message === "Logged in successfully") {
        // Check role to navigate
        if (response.data.role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/'); // Redirect to home or user page
        }
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("There was an error logging in!", error);
    }
  };

  return (
    <div>
      <Navbar />
      <main>
        <div className="login-container">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
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
            <input 
              type="text" 
              placeholder="Role" 
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              required 
            />

            <div className="not-registered-question">
              <p>Not registered? <a href="/register">Sign up here</a></p>
            </div>

            <button type="submit">Login</button>
          </form>
        </div>
      </main>
      <Footer className="footer" />
    </div>
  );
}

export default LoginPage;

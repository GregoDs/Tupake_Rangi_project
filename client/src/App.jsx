import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './components/HomePage.jsx';
import LoginPage from './components/LoginPage.jsx';
import RegisterPage from './components/RegisterPage.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import ProductAddedSuccess from './components/ProductAddedSuccess.jsx';
import CartPage from './components/CartPage.jsx';
import PayPalSuccess from './components/PayPalSuccess.jsx';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route exact path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/product-added-success" element={<ProductAddedSuccess />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/paypalsuccess" element={<PayPalSuccess/>} />
        {/* Other routes can be added here */}
      </Routes>
    </Router>
  );
}

export default App;

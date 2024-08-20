import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './components/HomePage.jsx';
import LoginPage from './components/LoginPage.jsx';
import RegisterPage from './components/RegisterPage.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import ProductAddedSuccess from './components/ProductAddedSuccess.jsx';
import CartPage from './components/CartPage.jsx';
import PayPalSuccess from './components/PayPalSuccess.jsx';
import SuccessPage from './components/SuccessPage.jsx';
import PaintCalculator from './components/PaintCalculator.jsx';


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
        <Route path="/paypalsuccess" element={<PayPalSuccess />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/paint-calculator" element={<PaintCalculator />} />
        {/* Other routes can be added here */}
      </Routes>
      
    </Router>
  );
}

export default App;

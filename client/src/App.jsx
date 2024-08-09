import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage.jsx';
import RegisterPage from './components/RegisterPage.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import ProductAddedSuccess from './components/ProductAddedSuccess.jsx';




function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/product-added-success" element={<ProductAddedSuccess />} />
        {/* Other routes can be added here */}
      </Routes>
    </Router>
  );
}

export default App;

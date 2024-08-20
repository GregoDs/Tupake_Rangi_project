import React, { useState, useEffect } from 'react';
import axios from '../api/axios'; // Import your Axios instance
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import Navbar from './Navbar';
import Footer from './Footer';
import './AdminDashboard.css'; // Import the CSS file

function AdminDashboard() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [availability, setAvailability] = useState(true);
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categories, setCategories] = useState([]);
  const [paints, setPaints] = useState([]);
  const [selectedPaint, setSelectedPaint] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchPaints = async () => {
      try {
        const response = await axios.get('/paints');
        setPaints(response.data);
      } catch (error) {
        console.error('Error fetching paints:', error);
      }
    };

    fetchCategories();
    fetchPaints();
  }, []);

  const handleAddPaint = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/paints', {
        name,
        price,
        size,
        color,
        availability,
        category_id: categoryId,
        image_url: imageUrl
      });
      navigate('/product-added-success'); // Redirect to success page
    } catch (error) {
      console.error('Error adding paint:', error);
      alert('Failed to add paint.');
    }
  };

  const handleUpdatePaint = async (e) => {
    e.preventDefault();
    if (selectedPaint) {
      try {
        const response = await axios.put(`/paints/${selectedPaint.id}`, {
          name,
          price,
          size,
          color,
          availability,
          category_id: categoryId,
          image_url: imageUrl
        });
        navigate('/product-added-success'); // Redirect to success page
      } catch (error) {
        console.error('Error updating paint:', error);
        alert('Failed to update paint.');
      }
    }
  };

  const handleDeletePaint = async (paintId) => {
    try {
      const response = await axios.delete(`/paints/${paintId}`);
      setPaints(paints.filter(paint => paint.id !== paintId)); // Update paints list
    } catch (error) {
      console.error('Error deleting paint:', error);
      alert('Failed to delete paint.');
    }
  };

  const clearForm = () => {
    setName('');
    setPrice('');
    setSize('');
    setColor('');
    setAvailability(true);
    setCategoryId('');
    setImageUrl('');
  };

  return (
    <div className="admin-dashboard">
      <Navbar />
      <main>
        <h2>Admin Dashboard</h2>
        <form onSubmit={selectedPaint ? handleUpdatePaint : handleAddPaint} className="paint-form">
          <div className="form-group">
            <label>Product Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Price:</label>
            <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Size:</label>
            <input type="text" value={size} onChange={(e) => setSize(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Color:</label>
            <input type="text" value={color} onChange={(e) => setColor(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Availability:</label>
            <input type="checkbox" checked={availability} onChange={(e) => setAvailability(e.target.checked)} />
          </div>
          <div className="form-group">
            <label>Category:</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.description}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Image URL:</label>
            <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          </div>
          <button type="submit" className="submit-button">
            {selectedPaint ? 'Update Product' : 'Add Product'}
          </button>
        </form>

        <h3>Existing Paints</h3>
        <ul className="paint-list">
          {paints.map(paint => (
            <li key={paint.id} className="paint-item">
              {paint.name} - ${paint.price}
              <button onClick={() => {
                setName(paint.name);
                setPrice(paint.price);
                setSize(paint.size);
                setColor(paint.color);
                setAvailability(paint.availability);
                setCategoryId(paint.category_id);
                setImageUrl(paint.image_url || '');
                setSelectedPaint(paint);
              }} className="edit-button">Edit</button>
              <button onClick={() => handleDeletePaint(paint.id)} className="delete-button">Delete</button>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}

export default AdminDashboard;

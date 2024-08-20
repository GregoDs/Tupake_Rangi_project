import React, { useState } from 'react';
import Navbar from './Navbar';  // Import Navbar component
import Footer from './Footer';  // Import Footer component
import './PaintCalculator.css';

function PaintCalculator() {
  const [formData, setFormData] = useState({
    planning: '',
    space: '',
    room: 1,
    dimensions: {
      width: '',
      length: '',
      height: '',
      window: '',
      door: '',
    },
    ceiling: 'No',
  });

  const [result, setResult] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      dimensions: {
        ...prevData.dimensions,
        [name]: value,
      },
    }));
  };

  const calculatePaint = () => {
    const { width, length, height, window, door } = formData.dimensions;
    const { ceiling } = formData;

    // Convert dimensions from string to number
    const widthNum = parseFloat(width);
    const lengthNum = parseFloat(length);
    const heightNum = parseFloat(height);
    const windowNum = parseFloat(window);
    const doorNum = parseFloat(door);

    // Calculate the area of the walls
    const wallArea = 2 * (widthNum * heightNum + lengthNum * heightNum);

    // Calculate the area of the ceiling if applicable
    const ceilingArea = ceiling === 'Yes' ? widthNum * lengthNum : 0;

    // Assuming average sizes for windows and doors
    const windowArea = windowNum * 15; // 15 sq.ft. per window
    const doorArea = doorNum * 20; // 20 sq.ft. per door

    // Total area to be painted
    const totalArea = wallArea + ceilingArea - windowArea - doorArea;

    // Calculate the amount of paint required
    const paintRequired = totalArea / 350;

    setResult(`Total Area to be painted: ${totalArea.toFixed(2)} sq.ft. \nPaint Required: ${paintRequired.toFixed(2)} gallons`);
  };

  return (
    <div className="paint-calculator-page">
      <Navbar />  {/* Render Navbar component */}
      
      {/* Background Image Section */}
      {/* Image Background Section */}
      <div className="image-section">
        <div className="image-text">
          CALCULATE THE AREA TO BE PAINTED
        </div>
      </div>
      
      
      <h1>Paint Calculator</h1>
      <form className="paint-calculator-form">
        <div className="form-group">
          <label>PLANNING FOR:</label>
          <select name="planning" value={formData.planning} onChange={handleInputChange}>
            <option value="">Select</option>
            <option value="Fresh Painting">Fresh Painting</option>
            <option value="Re-Painting">Re-Painting</option>
          </select>
        </div>

        <div className="form-group">
          <label>SELECT SPACE:</label>
          <select name="space" value={formData.space} onChange={handleInputChange}>
            <option value="">Select</option>
            <option value="Interior">Interior</option>
            <option value="Exterior">Exterior</option>
          </select>
        </div>

        <div className="form-group">
          <label>SELECT ROOM:</label>
          <select name="room" value={formData.room} onChange={handleInputChange}>
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <h3>Enter the dimensions</h3>
          <label>Room</label>
          <input
            type="number"
            name="width"
            placeholder="WIDTH*"
            value={formData.dimensions.width}
            onChange={handleDimensionChange}
          />
          <input
            type="number"
            name="length"
            placeholder="LENGTH*"
            value={formData.dimensions.length}
            onChange={handleDimensionChange}
          />
          <input
            type="number"
            name="height"
            placeholder="HEIGHT*"
            value={formData.dimensions.height}
            onChange={handleDimensionChange}
          />
          <input
            type="number"
            name="window"
            placeholder="WINDOW*"
            value={formData.dimensions.window}
            onChange={handleDimensionChange}
          />
          <input
            type="number"
            name="door"
            placeholder="DOOR*"
            value={formData.dimensions.door}
            onChange={handleDimensionChange}
          />
          <label>CEILING:</label>
          <select name="ceiling" value={formData.ceiling} onChange={handleInputChange}>
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>

        <div className="form-group">
          <label>Paint</label>
          <input type="text" placeholder="Paint" />
          <input type="text" placeholder="Texture" />
          <input type="text" placeholder="Special Effects" />
        </div>

        

        <button type="button" onClick={calculatePaint}>Calculate Now</button>
        <button type="button">Next</button>

        {result && <div className="result">{result}</div>} {/* Display result */}
      </form>
      <Footer />  {/* Render Footer component */}
    </div>
  );
}

export default PaintCalculator;

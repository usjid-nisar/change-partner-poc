import React from 'react';
import './DataVisualization.css';

export const DataVisualization = ({ imageUrl }) => {
  return (
    <div className="visualization-section">
      <h2>Data Visualization</h2>
      <div className="visualization-container">
        <img 
          src={imageUrl} 
          alt="Data Visualization" 
          className="visualization-image"
        />
      </div>
    </div>
  );
}; 
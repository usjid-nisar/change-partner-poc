import React from 'react';
import './AnalysisSection.css';

export const AnalysisSection = ({ analysis }) => {
  if (!analysis) return null;

  return (
    <div className="analysis-section">
      <h2>Key Analysis</h2>
      <div className="analysis-content">
        <div className="analysis-item">
          <label>Highest Impact Dimension:</label>
          <span>{analysis.dimension}</span>
        </div>
        <div className="analysis-item">
          <label>Category:</label>
          <span>{analysis.category}</span>
        </div>
        <div className="analysis-item">
          <label>Impact Level:</label>
          <span className={`impact-${analysis.impact.toLowerCase()}`}>
            {analysis.impact}
          </span>
        </div>
        <div className="analysis-scores">
          <div className="score-item">
            <label>Z-Score:</label>
            <span>{analysis.zScore.toFixed(4)}</span>
          </div>
          <div className="score-item">
            <label>P-Score:</label>
            <span>{analysis.pScore.toFixed(4)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 
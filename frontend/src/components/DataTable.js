import React from 'react';
import './DataTable.css';

export const DataTable = ({ data }) => {
  if (!data || !Array.isArray(data)) {
    return (
      <div className="table-section">
        <h2>Processed Data</h2>
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="table-section">
      <h2>Processed Data</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Dimensions</th>
              <th>P Score</th>
              <th>Z Score</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.Dimensions}</td>
                <td>{typeof row["P Score"] === 'number' ? row["P Score"].toFixed(4) : 'N/A'}</td>
                <td>{typeof row["Z Score"] === 'number' ? row["Z Score"].toFixed(4) : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 
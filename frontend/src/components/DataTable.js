import React from 'react';
import './DataTable.css';

export const DataTable = ({ data }) => {
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
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className={`category-${row.Category.toLowerCase()}`}>
                <td>{row.Dimensions}</td>
                <td>{Number(row["P Score"]).toFixed(4)}</td>
                <td>{Number(row["Z Score"]).toFixed(4)}</td>
                <td>{row.Category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 
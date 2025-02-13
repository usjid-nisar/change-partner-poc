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

  // Create a map of P Scores and their frequencies
  const pScoreFrequency = data.reduce((acc, row) => {
    const pScore = row["P Score"];
    acc[pScore] = (acc[pScore] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="table-section">
      <h2>Processed Data</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Dimensions</th>
              <th>P Score</th>
              <th>Z Score</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr 
                key={row.index}
                className={pScoreFrequency[row["P Score"]] > 1 ? 'duplicate-p-score' : ''}
              >
                <td>{row.index}</td>
                <td>{row.Dimensions}</td>
                <td>{typeof row["P Score"] === 'number' ? row["P Score"].toString() : 'N/A'}</td>
                <td>{typeof row["Z Score"] === 'number' ? row["Z Score"].toString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 
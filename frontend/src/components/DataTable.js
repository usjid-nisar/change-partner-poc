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

  // Function to determine Z Score class
  const getZScoreClass = (zScore) => {
    if (zScore > 0) return 'positive-z';
    if (zScore < 0) return 'negative-z';
    return 'zero-z';
  };

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
                className={`
                  ${pScoreFrequency[row["P Score"]] > 1 ? 'duplicate-p-score' : ''}
                  ${getZScoreClass(row["Z Score"])}
                `}
              >
                <td>{row.index}</td>
                <td>{row.Dimensions}</td>
                <td>{typeof row["P Score"] === 'number' ? row["P Score"].toString() : 'N/A'}</td>
                <td className="z-score-cell">
                  {typeof row["Z Score"] === 'number' ? (
                    <span className={getZScoreClass(row["Z Score"])}>
                      {row["Z Score"] > 0 ? '+' : ''}{row["Z Score"].toString()}
                    </span>
                  ) : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 
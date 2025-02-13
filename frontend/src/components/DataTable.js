import React, { useState } from 'react';
import './DataTable.css';

export const DataTable = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Available options for rows per page
  const rowsPerPageOptions = [10, 25, 50, 100];

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

  // Calculate pagination values
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value);
    setRowsPerPage(newRowsPerPage);
    // Reset to first page when changing rows per page
    setCurrentPage(1);
  };

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="table-section">
      <h2>Processed Data</h2>
      <div className="table-controls">
        <div className="table-info">
          <span>Total entries: {data.length}</span>
          <span>Page {currentPage} of {totalPages}</span>
        </div>
        <div className="rows-per-page">
          <label htmlFor="rowsPerPage">Rows per page:</label>
          <select
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="rows-select"
          >
            {rowsPerPageOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
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
            {currentRows.map((row) => (
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
      <div className="pagination">
        <button 
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="page-button"
        >
          Previous
        </button>
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`page-button ${currentPage === number ? 'active' : ''}`}
          >
            {number}
          </button>
        ))}
        <button 
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="page-button"
        >
          Next
        </button>
      </div>
    </div>
  );
}; 
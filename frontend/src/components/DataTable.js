import React, { useState, useMemo } from 'react';
import './DataTable.css';
import SVGComponent from './Svg';

export const DataTable = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('data'); // 'data' or 'mindmap'
  
  // Available options for rows per page
  const rowsPerPageOptions = [10, 25, 50, 100];

  // Filter data based on search term - moved before conditional return
  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.filter(row => 
      row.Dimensions.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  if (!data || !Array.isArray(data)) {
    return (
      <div className="table-section">
        <h2>Data Analysis</h2>
        <p>No data available</p>
      </div>
    );
  }

  // Create a map of P Scores and their frequencies
  const pScoreFrequency = filteredData.reduce((acc, row) => {
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
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="table-section">
      <h2>Data Analysis</h2>
      
      {/* Tab buttons */}
      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'data' ? 'active' : ''}`}
          onClick={() => setActiveTab('data')}
        >
          Data Table
        </button>
        <button 
          className={`tab-button ${activeTab === 'mindmap' ? 'active' : ''}`}
          onClick={() => setActiveTab('mindmap')}
        >
          Mind Map
        </button>
      </div>

      {/* Tab content */}
      <div className={`tab-content ${activeTab === 'data' ? 'active' : ''}`}>
        {activeTab === 'data' && (
          <>
            <div className="table-controls">
              <div className="table-top-controls">
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Search dimensions..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                  />
                  {searchTerm && (
                    <button 
                      className="clear-search"
                      onClick={() => {
                        setSearchTerm('');
                        setCurrentPage(1);
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
              
              <div className="table-bottom-controls">
                <div className="table-info">
                  <span>
                    Showing {filteredData.length} of {data.length} entries
                  </span>
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
          </>
        )}
      </div>

      <div className={`tab-content ${activeTab === 'mindmap' ? 'active' : ''}`}>
        {activeTab === 'mindmap' && (
          <SVGComponent className="mindmap-svg"  />
        )}
      </div>
    </div>
  );
}; 
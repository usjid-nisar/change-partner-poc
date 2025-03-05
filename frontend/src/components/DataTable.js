import React, { useState, useMemo } from 'react';
import './DataTable.css';
import SvgIcon from './Svg';

export const DataTable = ({ processedData, rawData }) => {
  const [rawCurrentPage, setRawCurrentPage] = useState(1);
  const [processedCurrentPage, setProcessedCurrentPage] = useState(1);
  const [rawRowsPerPage, setRawRowsPerPage] = useState(10);
  const [processedRowsPerPage, setProcessedRowsPerPage] = useState(10);
  const [rawSearchTerm, setRawSearchTerm] = useState('');
  const [processedSearchTerm, setProcessedSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('raw'); // 'raw', 'processed', or 'mindmap'
  
  // Get current page based on active tab
  const currentPage = activeTab === 'raw' ? rawCurrentPage : processedCurrentPage;
  const setCurrentPage = (page) => {
    if (activeTab === 'raw') {
      setRawCurrentPage(page);
    } else {
      setProcessedCurrentPage(page);
    }
  };
  
  // Get rows per page based on active tab
  const rowsPerPage = activeTab === 'raw' ? rawRowsPerPage : processedRowsPerPage;
  const setRowsPerPage = (rows) => {
    if (activeTab === 'raw') {
      setRawRowsPerPage(rows);
    } else {
      setProcessedRowsPerPage(rows);
    }
  };
  
  // Get search term based on active tab
  const searchTerm = activeTab === 'raw' ? rawSearchTerm : processedSearchTerm;
  const setSearchTerm = (term) => {
    if (activeTab === 'raw') {
      setRawSearchTerm(term);
    } else {
      setProcessedSearchTerm(term);
    }
  };
  
  // Available options for rows per page
  const rowsPerPageOptions = [10, 25, 50, 100];

  // Filter data based on active tab and search term
  const filteredData = useMemo(() => {
    const currentData = activeTab === 'raw' ? rawData : processedData;
    if (!currentData || !Array.isArray(currentData)) return [];
    return currentData.filter(row => 
      row.Dimensions.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activeTab, rawData, processedData, searchTerm]);

  if (!processedData && !rawData) {
    return (
      <div className="table-section">
        <h2>Data Analysis</h2>
        <p>No data available</p>
      </div>
    );
  }

  // Create a map of P Scores and their frequencies
  const pScoreFrequency = filteredData.reduce((acc, row) => {
    const pScore = row["P-Value"];
    acc[pScore] = (acc[pScore] || 0) + 1;
    return acc;
  }, {});

  // Function to determine Z-Score class
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
          className={`tab-button ${activeTab === 'raw' ? 'active' : ''}`}
          onClick={() => setActiveTab('raw')}
        >
          Raw Data
        </button>
        <button 
          className={`tab-button ${activeTab === 'processed' ? 'active' : ''}`}
          onClick={() => setActiveTab('processed')}
        >
          Processed Data
        </button>
        <button 
          className={`tab-button ${activeTab === 'mindmap' ? 'active' : ''}`}
          onClick={() => setActiveTab('mindmap')}
        >
          Mind Map
        </button>
      </div>

      {/* Tab content */}
      <div className={`tab-content ${activeTab !== 'mindmap' ? 'active' : ''}`}>
        {activeTab !== 'mindmap' && (
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
                    Showing {filteredData.length} of {processedData ? processedData.length : rawData.length} entries
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
                    <th>High Level Category</th>
                    <th className="sortable-header">
                      <div className="header-content">
                        P-Value
                        {activeTab === 'processed' && (
                          <>
                            <span className="sort-arrow">↑</span>
                            <div className="tooltip">
                              Sorted ascending. Only showing P-Value &lt; 0.05
                            </div>
                          </>
                        )}
                      </div>
                    </th>
                    <th className="sortable-header">
                      <div className="header-content">
                        Z-Score
                        {activeTab === 'processed' && (
                          <>
                            <span className="sort-arrow">↓</span>
                            <div className="tooltip">
                              Sorted by absolute value (descending)
                            </div>
                          </>
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows.map((row) => (
                    <tr 
                      key={row.index}
                      className={`
                        ${activeTab === 'processed' && pScoreFrequency[row["P-Value"]] > 1 ? 'duplicate-p-score' : ''}
                        ${activeTab === 'processed' ? getZScoreClass(row["Z-Score"]) : ''}
                      `}
                    >
                      <td>{row.index}</td>
                      <td>{row.Dimensions}</td>
                      <td>{row.highLevelCategory}</td>
                      <td>{typeof row["P-Value"] === 'number' ? row["P-Value"].toString() : 'N/A'}</td>
                      <td className="z-score-cell">
                        {typeof row["Z-Score"] === 'number' ? (
                          <span className={activeTab === 'processed' ? getZScoreClass(row["Z-Score"]) : ''}>
                            {row["Z-Score"] > 0 ? '+' : ''}{row["Z-Score"].toString()}
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
         <SvgIcon processedData={processedData}/>
        )}
      </div>
    </div>
  );
}; 
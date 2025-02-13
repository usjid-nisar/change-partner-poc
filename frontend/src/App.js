import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { DataTable } from './components/DataTable';
import './App.css';

function App() {
  const [processedData, setProcessedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUploadSuccess = (data) => {
    setProcessedData(data.data);
    setError('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Data Analysis Tool</h1>
      </header>
      <main className="App-main">
        <FileUpload 
          onUploadSuccess={handleUploadSuccess}
          onError={setError}
          setLoading={setLoading}
        />
        
        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading">Processing...</div>}
        
        {processedData && (
          <DataTable 
            data={processedData}
          />
        )}
      </main>
    </div>
  );
}

export default App;

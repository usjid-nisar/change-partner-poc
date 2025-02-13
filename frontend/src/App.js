import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { DataVisualization } from './components/DataVisualization';
import { DataTable } from './components/DataTable';
import './App.css';

function App() {
  const [processedData, setProcessedData] = useState(null);
  const [visualizationUrl, setVisualizationUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUploadSuccess = (data) => {
    setProcessedData(data.data);
    setVisualizationUrl(`http://localhost:3001${data.imageUrl}`);
    setError('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Data Visualization Tool</h1>
      </header>
      <main className="App-main">
        <FileUpload 
          onUploadSuccess={handleUploadSuccess}
          onError={setError}
          setLoading={setLoading}
        />
        
        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading">Processing...</div>}
        
        {visualizationUrl && (
          <DataVisualization 
            imageUrl={visualizationUrl}
          />
        )}
        
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

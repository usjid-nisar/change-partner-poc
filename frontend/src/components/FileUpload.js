import React, { useState } from 'react';
import { uploadFile } from '../services/api';
import './FileUpload.css';

export const FileUpload = ({ onUploadSuccess, onError, setLoading }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      onError('Please select a file first');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const response = await uploadFile(formData);
      onUploadSuccess(response);
    } catch (error) {
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-section">
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="file-input-container">
          <input
            type="file"
            onChange={handleFileSelect}
            accept=".xlsx,.csv"
            className="file-input"
          />
          <button type="submit" className="upload-button">
            Upload & Process
          </button>
        </div>
      </form>
      <div className="requirements">
        <strong>Requirements:</strong>
        <ul>
          <li>Accepted files: Excel (.xlsx) or CSV (.csv)</li>
          <li>Required columns: Dimension, Z-Score, P-Value</li>
        </ul>
      </div>
    </div>
  );
}; 
import React, { useState } from 'react';
import { uploadFile } from '../services/api';
import './FileUpload.css';

export const FileUpload = ({ onUploadSuccess, onError, setLoading }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
    const validTypes = ['.xlsx', '.csv'];
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validTypes.includes(fileExt)) {
      onError(`Invalid file type. Only ${validTypes.join(', ')} files are allowed.`);
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      onError('File is too large. Maximum size is 5MB.');
      return;
    }

    setSelectedFile(file);
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
        <div 
          className={`file-input-container ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            onChange={handleFileSelect}
            accept=".xlsx,.csv"
            className="file-input"
          />
          <div className="file-input-label">
            {selectedFile ? selectedFile.name : 'Drag and drop file here or click to select'}
          </div>
          <button type="submit" className="upload-button" disabled={!selectedFile}>
            Upload & Process
          </button>
        </div>
      </form>
      <div className="requirements">
        <strong>Requirements:</strong>
        <ul>
          <li>Accepted files: Excel (.xlsx) or CSV (.csv)</li>
          <li>Maximum file size: 5MB</li>
          <li>Required columns: Dimension, Z-Score, P-Value</li>
          <li>All numeric values must be valid numbers</li>
        </ul>
      </div>
    </div>
  );
}; 
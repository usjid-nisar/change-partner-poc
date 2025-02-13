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
    
    // Validate file extension
    if (!validTypes.includes(fileExt)) {
        onError(`Invalid file type. Only ${validTypes.join(', ')} files are allowed.`);
        return;
    }
    
    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        onError('File is too large. Maximum size is 5MB.');
        return;
    }

    // Validate file name
    if (!file.name.trim()) {
        onError('Invalid file name.');
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
        let errorData;
        try {
            errorData = JSON.parse(error.message);
        } catch {
            errorData = {
                type: 'UNKNOWN_ERROR',
                message: error.message || 'An unexpected error occurred'
            };
        }

        let errorMessage;
        switch (errorData.type) {
            case 'INVALID_FILE_TYPE':
                errorMessage = 'Please upload only Excel (.xlsx) or CSV (.csv) files.';
                break;
            case 'MISSING_COLUMNS':
                errorMessage = 'The file is missing required columns: Dimension, Z-Score, P-Value.';
                break;
            case 'INVALID_DATA':
                errorMessage = 'The file contains invalid data. Please check all values.';
                break;
            case 'EMPTY_FILE':
                errorMessage = 'The uploaded file is empty.';
                break;
            case 'FILE_TOO_LARGE':
                errorMessage = 'File size exceeds 5MB limit.';
                break;
            case 'INVALID_NUMERIC_VALUE':
                errorMessage = 'Some numeric values in the file are invalid.';
                break;
            case 'MISSING_FILE':
                errorMessage = 'No file was selected for upload.';
                break;
            case 'NETWORK_ERROR':
                errorMessage = 'Network error occurred. Please try again.';
                break;
            default:
                errorMessage = errorData.message || 'An unexpected error occurred.';
        }
        
        onError(errorMessage);
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
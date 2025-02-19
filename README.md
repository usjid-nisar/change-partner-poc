# Data Analysis Visualization Tool

A web-based application for analyzing and visualizing dimensional data with Z-Scores and P-Values. This tool helps in identifying and visualizing the impact of different dimensions through statistical analysis.

## Features

- **File Upload**:

  - Supports CSV and Excel (.xlsx) files
  - Drag-and-drop interface
  - File validation and error handling
  - Maximum file size: 5MB
- **Data Processing**:

  - Automatic sorting by P-Score (ascending)
  - Secondary sorting by Z-Score (descending)
  - Filter P-Score ( < 0.05)
  - Handles positive and negative Z-Scores
  - Full decimal precision display
- **Visualization**:

  - Interactive data table
  - Color-coded Z-Scores (positive: blue, negative: red, zero: gray)
  - Highlighted duplicate P-Scores (yellow background)
  - Automatic dimension categorization
  - Generated PNG visualization
- **Analysis**:

  - Highest impact dimension identification
  - Statistical significance indicators
  - Dimension category mapping
  - Key metrics summary

## Project Structure

## Technical Stack

- **Frontend**:

  - React.js
  - Modern CSS
  - File handling with drag-and-drop
- **Backend**:

  - Node.js
  - Express
  - XLSX for file processing
  - Canvas for visualization

## Getting Started

1. **Installation**:

   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd frontend
   npm install
   ```
2. **Running the Application**:

   ```bash
   # Start backend server
   cd backend
   npm start

   # Start frontend development server
   cd frontend
   npm start
   ```
3. **Access the Application**:

   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Data Format Requirements

The input file must contain the following columns:

- `Dimension`: String identifier for each dimension
- `Z-Score`: Numeric value representing statistical significance
- `P-Value`: Numeric value representing probability

## Testing

Test data files are provided in the `test-data/` directory for various edge cases:

- Duplicate P-Scores
- Extreme values
- Mixed positive/negative Z-Scores
- Signed integers

## Error Handling

The application handles various error cases:

- Invalid file types
- Missing required columns
- Invalid numeric values
- Empty files
- File size limits
- Network errors

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

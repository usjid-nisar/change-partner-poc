const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const { exec } = require('child_process');

const app = express();

// Create required directories if they don't exist
const dirs = ['uploads', 'public'];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        console.log(`Created ${dir} directory`);
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Ensure uploads directory exists
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['.xlsx', '.csv'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only XLSX and CSV files are allowed.'));
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

app.use(express.static(path.join(__dirname, 'public')));

// Validate uploaded file
const validateFile = (filePath) => {
    let data;
    const fileExt = path.extname(filePath).toLowerCase();
    
    if (fileExt === '.csv') {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        data = xlsx.utils.sheet_to_json(
            xlsx.utils.aoa_to_sheet(
                fileContent.split('\n').map(line => line.split(','))
            )
        );
    } else if (fileExt === '.xlsx') {
        const workbook = xlsx.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        data = xlsx.utils.sheet_to_json(sheet);
    } else {
        return null;
    }

    if (!data || data.length === 0) return null;

    // Update required columns to match your Excel file
    const requiredColumns = ["Dimension", "Z-Score", "P-Value"];
    const keys = Object.keys(data[0]);
    
    if (!requiredColumns.every(col => keys.includes(col))) {
        return null;
    }

    // Map the data to match the expected format
    return data.map(row => ({
        "Dimensions": row.Dimension,
        "P Score": row["P-Value"],
        "Z Score": row["Z-Score"]
    }));
};

// Process data
const processData = (data) => {
    return data.map(row => ({
        ...row,
        Category: Math.abs(row["Z Score"]) > 1.96 ? "High" : 
                 Math.abs(row["Z Score"]) > 1.645 ? "Medium" : "Low"
    })).sort((a, b) => b["P Score"] - a["P Score"]);
};

// Generate visualization with enhanced customization
const generateVisualization = (data, outputPath) => {
    try {
        // Increase canvas size for better readability
        const canvas = createCanvas(1200, 800);
        const ctx = canvas.getContext('2d');
        
        // Set white background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 1200, 800);
        
        // Draw title
        ctx.fillStyle = "#333333";
        ctx.font = "bold 32px Arial";
        ctx.fillText("Data Analysis Visualization", 400, 50);
        
        // Draw legend
        const legendY = 100;
        ctx.font = "16px Arial";
        ctx.fillStyle = "red";
        ctx.fillRect(50, legendY - 15, 20, 20);
        ctx.fillStyle = "#333333";
        ctx.fillText("High (|Z| > 1.96)", 80, legendY);
        
        ctx.fillStyle = "orange";
        ctx.fillRect(250, legendY - 15, 20, 20);
        ctx.fillStyle = "#333333";
        ctx.fillText("Medium (|Z| > 1.645)", 280, legendY);
        
        ctx.fillStyle = "green";
        ctx.fillRect(450, legendY - 15, 20, 20);
        ctx.fillStyle = "#333333";
        ctx.fillText("Low (|Z| ≤ 1.645)", 480, legendY);
        
        // Draw headers
        const startY = 180;
        ctx.font = "bold 18px Arial";
        ctx.fillStyle = "#333333";
        ctx.fillText("Dimension", 50, startY);
        ctx.fillText("P Score", 400, startY);
        ctx.fillText("Z Score", 550, startY);
        ctx.fillText("Category", 700, startY);
        
        // Draw horizontal line under headers
        ctx.beginPath();
        ctx.moveTo(50, startY + 10);
        ctx.lineTo(900, startY + 10);
        ctx.strokeStyle = "#333333";
        ctx.stroke();
        
        // Draw data rows
        ctx.font = "16px Arial";
        data.forEach((row, index) => {
            const y = startY + 40 + (index * 30);
            
            // Draw dimension
            ctx.fillStyle = "#333333";
            ctx.fillText(row.Dimensions, 50, y);
            
            // Draw P Score
            ctx.fillText(row["P Score"].toFixed(4), 400, y);
            
            // Draw Z Score
            ctx.fillText(row["Z Score"].toFixed(4), 550, y);
            
            // Draw Category with color
            ctx.fillStyle = row.Category === "High" ? "red" : 
                          row.Category === "Medium" ? "orange" : "green";
            ctx.fillText(row.Category, 700, y);
        });
        
        // Add border to visualization
        ctx.strokeStyle = "#cccccc";
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, 1180, 780);
        
        const buffer = canvas.toBuffer('image/png');
        
        // Ensure the directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(outputPath, buffer);
    } catch (error) {
        console.error('Error generating visualization:', error);
        throw error;
    }
};

app.post('/upload', (req, res) => {
    upload.single('file')(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: 'File upload error: ' + err.message });
        } else if (err) {
            return res.status(400).json({ error: err.message });
        }
        
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded. Please select a file.' });
        }

        const filePath = req.file.path;
        const data = validateFile(filePath);

        if (!data) {
            fs.unlinkSync(filePath);
            return res.status(400).json({ error: 'Invalid file format. Ensure required columns are present.' });
        }

        const processedData = processData(data);
        const outputPath = path.join(__dirname, 'public', 'visualization.png');
        generateVisualization(processedData, outputPath);

        // Clean up the uploaded file after processing
        fs.unlinkSync(filePath);

        // Send response with visualization and data
        res.json({ 
            message: 'File processed successfully', 
            imageUrl: '/visualization.png',
            pdfUrl: '/Language Model Conceptual.ai', // Add PDF URL
            data: processedData 
        });
    });
});

// Serve frontend page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Data Visualization</title>
            <style>
                :root {
                    --primary-color: #2196F3;
                    --secondary-color: #1976D2;
                    --success-color: #4CAF50;
                    --error-color: #f44336;
                    --text-color: #333;
                    --border-color: #ddd;
                }
                
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background-color: #f5f5f5;
                    color: var(--text-color);
                }
                
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    background-color: white;
                    padding: 30px;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                
                h1 {
                    color: var(--primary-color);
                    text-align: center;
                    margin-bottom: 30px;
                    font-size: 2.5em;
                }
                
                h2 {
                    color: var(--secondary-color);
                    border-bottom: 2px solid var(--border-color);
                    padding-bottom: 10px;
                    margin-top: 40px;
                }
                
                .upload-section {
                    background-color: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 30px;
                }
                
                .file-input-container {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 15px;
                }
                
                input[type="file"] {
                    flex: 1;
                    padding: 10px;
                    border: 2px dashed var(--border-color);
                    border-radius: 4px;
                    cursor: pointer;
                }
                
                input[type="file"]:hover {
                    border-color: var(--primary-color);
                }
                
                .requirements {
                    background-color: #fff;
                    padding: 15px;
                    border-left: 4px solid var(--primary-color);
                    margin: 15px 0;
                    font-size: 0.9em;
                }
                
                button {
                    background-color: var(--primary-color);
                    color: white;
                    padding: 12px 24px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 1em;
                    transition: background-color 0.3s;
                }
                
                button:hover {
                    background-color: var(--secondary-color);
                }
                
                .visualization {
                    margin: 30px 0;
                    text-align: center;
                }
                
                .visualization img {
                    max-width: 100%;
                    height: auto;
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                    background-color: white;
                }
                
                th, td {
                    padding: 15px;
                    text-align: left;
                    border-bottom: 1px solid var(--border-color);
                }
                
                th {
                    background-color: #f8f9fa;
                    font-weight: 600;
                    color: var(--secondary-color);
                }
                
                tr:hover {
                    background-color: #f8f9fa;
                }
                
                .loading {
                    display: none;
                    text-align: center;
                    margin: 20px 0;
                }
                
                .loading::after {
                    content: "Processing...";
                    color: var(--secondary-color);
                }
                
                .error-message {
                    color: var(--error-color);
                    background-color: #ffebee;
                    padding: 10px;
                    border-radius: 4px;
                    margin: 10px 0;
                    display: none;
                }
                
                .success-message {
                    color: var(--success-color);
                    background-color: #e8f5e9;
                    padding: 10px;
                    border-radius: 4px;
                    margin: 10px 0;
                    display: none;
                }
            </style>
            <script>
                async function uploadFile() {
                    const loading = document.getElementById('loading');
                    const errorMsg = document.getElementById('error-message');
                    const successMsg = document.getElementById('success-message');
                    
                    try {
                        loading.style.display = 'block';
                        errorMsg.style.display = 'none';
                        successMsg.style.display = 'none';
                        
                        const fileInput = document.getElementById('file');
                        if (!fileInput.files || fileInput.files.length === 0) {
                            throw new Error('Please select a file first');
                        }

                        const formData = new FormData();
                        formData.append('file', fileInput.files[0]);
                        
                        const response = await fetch('/upload', {
                            method: 'POST',
                            body: formData
                        });
                        
                        const result = await response.json();
                        
                        if (!response.ok) {
                            throw new Error(result.error || 'Upload failed');
                        }
                        
                        if (result.imageUrl) {
                            document.getElementById('visualization').src = result.imageUrl + '?t=' + new Date().getTime();
                            document.getElementById('pdf-viewer').src = result.pdfUrl;
                            let tableHtml = '<tr><th>Dimensions</th><th>P Score</th><th>Category</th></tr>';
                            result.data.forEach(row => {
                                tableHtml += '<tr><td>' + row.Dimensions + '</td><td>' + row["P Score"] + '</td><td>' + row.Category + '</td></tr>';
                            });
                            document.getElementById('data-table').innerHTML = tableHtml;
                            
                            successMsg.textContent = 'File processed successfully!';
                            successMsg.style.display = 'block';
                        }
                    } catch (error) {
                        errorMsg.textContent = 'Error: ' + error.message;
                        errorMsg.style.display = 'block';
                        console.error('Upload error:', error);
                    } finally {
                        loading.style.display = 'none';
                    }
                }
            </script>
        </head>
        <body>
            <div class="container">
                <h1>Data Visualization Tool</h1>
                
                <div class="upload-section">
                    <div class="file-input-container">
                        <input type="file" id="file" accept=".xlsx,.csv" />
                        <button onclick="uploadFile()">Upload & Process</button>
                    </div>
                    <div class="requirements">
                        <strong>Requirements:</strong><br>
                        - Accepted files: Excel (.xlsx) or CSV (.csv)<br>
                        - Required columns: Dimension, Z-Score, P-Value
                    </div>
                    <div id="loading" class="loading"></div>
                    <div id="error-message" class="error-message"></div>
                    <div id="success-message" class="success-message"></div>
                </div>
                
                <h2>Visualization</h2>
                <div class="visualization">
                    <img id="visualization" src="" alt="Visualization will appear here">
                </div>
                
                <h2>Processed Data</h2>
                <div class="table-container">
                    <table id="data-table"></table>
                </div>
                
                <h2>Language Model Conceptual</h2>
                <div class="visualization">
                    <embed id="pdf-viewer" src="/Language Model Conceptual.ai" type="application/pdf" width="100%" height="600">
                </div>
            </div>
        </body>
        </html>
    `);
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

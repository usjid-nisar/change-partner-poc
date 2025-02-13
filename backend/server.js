const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs').promises; // Use promises version
const { createCanvas } = require('canvas');
const cors = require('cors'); // Add CORS for frontend communication

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());

// Create required directories
const createRequiredDirs = async () => {
    const dirs = ['uploads', 'public'];
    for (const dir of dirs) {
        try {
            await fs.access(dir);
        } catch {
            await fs.mkdir(dir);
            console.log(`Created ${dir} directory`);
        }
    }
};

// Multer storage configuration
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        await createRequiredDirs();
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
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
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Serve static files
app.use('/static', express.static(path.join(__dirname, 'public')));

// API endpoints
app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const data = await validateFile(req.file.path);
        if (!data) {
            await fs.unlink(req.file.path);
            return res.status(400).json({ 
                error: 'Invalid file format. Required columns: Dimension, Z-Score, P-Value' 
            });
        }

        const processedData = processData(data);
        const outputPath = path.join(__dirname, 'public', 'visualization.png');
        await generateVisualization(processedData, outputPath);

        // Clean up
        await fs.unlink(req.file.path);

        res.json({
            message: 'File processed successfully',
            imageUrl: '/static/visualization.png',
            data: processedData
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Server error processing file' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});

// Helper functions
const validateFile = async (filePath) => {
    try {
        let data;
        const fileExt = path.extname(filePath).toLowerCase();
        
        if (fileExt === '.csv') {
            const fileContent = await fs.readFile(filePath, 'utf8');
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

        const requiredColumns = ["Dimension", "Z-Score", "P-Value"];
        const keys = Object.keys(data[0]);
        
        if (!requiredColumns.every(col => keys.includes(col))) {
            return null;
        }

        return data.map(row => ({
            "Dimensions": row.Dimension,
            "P Score": row["P-Value"],
            "Z Score": row["Z-Score"]
        }));
    } catch (error) {
        console.error('File validation error:', error);
        return null;
    }
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
const generateVisualization = async (data, outputPath) => {
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
        if (!await fs.access(dir)) {
            await fs.mkdir(dir, { recursive: true });
        }
        
        await fs.writeFile(outputPath, buffer);
    } catch (error) {
        console.error('Error generating visualization:', error);
        throw error;
    }
};

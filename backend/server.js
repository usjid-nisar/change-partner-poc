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

// Add error types
const ErrorTypes = {
    INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
    MISSING_COLUMNS: 'MISSING_COLUMNS',
    INVALID_DATA: 'INVALID_DATA',
    EMPTY_FILE: 'EMPTY_FILE',
    FILE_TOO_LARGE: 'FILE_TOO_LARGE'
};

// Add custom error handler
const createError = (type, message) => ({
    type,
    message,
    timestamp: new Date().toISOString()
});

// Update file filter with better error handling
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['.xlsx', '.csv'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(createError(
            ErrorTypes.INVALID_FILE_TYPE,
            `Invalid file type. Only ${allowedTypes.join(', ')} files are allowed.`
        ));
    }
};

// Update multer configuration
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { 
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1 // Only allow one file
    }
}).single('file');

// Serve static files
app.use('/static', express.static(path.join(__dirname, 'public')));

// Add dimension mapping configuration
const dimensionMappings = {
    // Basic emotions mapping
    "Anger": "Negative Emotion",
    "Fear": "Negative Emotion",
    "Sadness": "Negative Emotion",
    "Disgust": "Negative Emotion",
    "Joy": "Positive Emotion",
    "Trust": "Positive Emotion",
    "Anticipation": "Positive Emotion",
    "Surprise": "Neutral Emotion",
    
    // Work-related dimensions
    "Workload": "Work Stress",
    "Time Pressure": "Work Stress",
    "Job Control": "Work Environment",
    "Social Support": "Work Environment",
    "Leadership": "Management",
    "Communication": "Management",
    
    // Default category for unmapped dimensions
    "DEFAULT": "Uncategorized"
};

// Add function to identify highest dimension
const analyzeHighestDimension = (data) => {
    // Sort by absolute Z Score in descending order
    const sortedByZScore = [...data].sort((a, b) => 
        Math.abs(b["Z Score"]) - Math.abs(a["Z Score"])
    );

    // Get the highest dimension
    const highestDimension = sortedByZScore[0];
    
    // Map to higher-level category
    const dimensionName = highestDimension.Dimensions;
    const category = dimensionMappings[dimensionName] || dimensionMappings["DEFAULT"];
    
    return {
        dimension: dimensionName,
        category: category,
        zScore: highestDimension["Z Score"],
        pScore: highestDimension["P Score"],
        impact: highestDimension.Category
    };
};

// Update the upload endpoint
app.post('/api/upload', async (req, res) => {
    upload(req, res, async function(err) {
        try {
            // Handle multer errors
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json(createError(
                        ErrorTypes.FILE_TOO_LARGE,
                        'File is too large. Maximum size is 5MB.'
                    ));
                }
                return res.status(400).json(createError(
                    ErrorTypes.INVALID_FILE_TYPE,
                    'File upload error: ' + err.message
                ));
            } else if (err) {
                return res.status(400).json(err); // Custom error from fileFilter
            }

            // Check if file exists
            if (!req.file) {
                return res.status(400).json(createError(
                    ErrorTypes.INVALID_FILE_TYPE,
                    'No file uploaded. Please select a file.'
                ));
            }

            // Validate file contents
            const data = await validateFile(req.file.path);
            
            // Clean up uploaded file regardless of validation result
            await fs.unlink(req.file.path).catch(console.error);

            if (!data) {
                return res.status(400).json(createError(
                    ErrorTypes.INVALID_DATA,
                    'Invalid file format or data. Please ensure:\n' +
                    '1. Required columns (Dimension, Z-Score, P-Value) are present\n' +
                    '2. All numeric values are valid\n' +
                    '3. File is not empty'
                ));
            }

            const processedResult = processData(data);

            res.json({
                message: 'File processed successfully',
                data: processedResult.data,
                analysis: processedResult.analysis
            });

        } catch (error) {
            // Clean up on error
            if (req.file) {
                await fs.unlink(req.file.path).catch(console.error);
            }
            
            console.error('Upload error:', error);
            res.status(500).json(createError(
                ErrorTypes.INVALID_DATA,
                'Server error processing file: ' + error.message
            ));
        }
    });
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

// Update validateFile function with better error handling
const validateFile = async (filePath) => {
    try {
        let data;
        const fileExt = path.extname(filePath).toLowerCase();
        
        // Read file based on type
        if (fileExt === '.csv') {
            const fileContent = await fs.readFile(filePath, 'utf8');
            if (!fileContent.trim()) {
                throw createError(ErrorTypes.EMPTY_FILE, 'File is empty');
            }
            data = xlsx.utils.sheet_to_json(
                xlsx.utils.aoa_to_sheet(
                    fileContent.split('\n').map(line => line.split(','))
                )
            );
        } else if (fileExt === '.xlsx') {
            const workbook = xlsx.readFile(filePath);
            if (!workbook.SheetNames.length) {
                throw createError(ErrorTypes.EMPTY_FILE, 'Excel file has no sheets');
            }
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            data = xlsx.utils.sheet_to_json(sheet);
        }

        // Validate data presence
        if (!data || data.length === 0) {
            throw createError(ErrorTypes.EMPTY_FILE, 'No data found in file');
        }

        // Validate required columns
        const requiredColumns = ["Dimension", "Z-Score", "P-Value"];
        const keys = Object.keys(data[0]);
        const missingColumns = requiredColumns.filter(col => !keys.includes(col));
        
        if (missingColumns.length > 0) {
            throw createError(
                ErrorTypes.MISSING_COLUMNS,
                `Missing required columns: ${missingColumns.join(', ')}`
            );
        }

        // Convert and validate numeric values
        return data.map((row, index) => {
            const pValue = Number(row["P-Value"]);
            const zScore = Number(row["Z-Score"]);
            
            if (isNaN(pValue) || isNaN(zScore)) {
                throw createError(
                    ErrorTypes.INVALID_DATA,
                    `Invalid numeric value at row ${index + 1}: P-Value or Z-Score is not a number`
                );
            }

            return {
                "Dimensions": row.Dimension,
                "P Score": pValue,
                "Z Score": zScore
            };
        });
    } catch (error) {
        console.error('File validation error:', error);
        throw error; // Propagate error for handling in upload endpoint
    }
};

// Process data
const processData = (data) => {
    // First process the data as before
    const processedData = data.map(row => ({
        ...row,
        Category: Math.abs(row["Z Score"]) > 1.96 ? "High" : 
                 Math.abs(row["Z Score"]) > 1.645 ? "Medium" : "Low"
    })).sort((a, b) => {
        // First sort by P Score in descending order
        if (b["P Score"] !== a["P Score"]) {
            return b["P Score"] - a["P Score"];
        }
        // If P Scores are equal, sort by Z Score in descending order
        return Math.abs(b["Z Score"]) - Math.abs(a["Z Score"]);
    });

    // Analyze the highest dimension
    const analysis = analyzeHighestDimension(processedData);

    return {
        data: processedData,
        analysis: analysis
    };
};

// Generate visualization with enhanced customization
const generateVisualization = async (data, outputPath, analysis) => {
    try {
        // Increase canvas size for better readability
        const canvas = createCanvas(1200, 900); // Increased height for analysis
        const ctx = canvas.getContext('2d');
        
        // Set white background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 1200, 900);
        
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
        ctx.strokeRect(10, 10, 1180, 880);
        
        // Add analysis section
        const analysisY = 750;
        ctx.font = "bold 24px Arial";
        ctx.fillStyle = "#333333";
        ctx.fillText("Key Analysis", 50, analysisY);

        ctx.font = "18px Arial";
        ctx.fillText(`Highest Impact Dimension: ${analysis.dimension}`, 50, analysisY + 40);
        ctx.fillText(`Category: ${analysis.category}`, 50, analysisY + 70);
        ctx.fillText(`Impact Level: ${analysis.impact}`, 50, analysisY + 100);
        ctx.fillText(`Z-Score: ${analysis.zScore.toFixed(4)}`, 400, analysisY + 70);
        ctx.fillText(`P-Score: ${analysis.pScore.toFixed(4)}`, 400, analysisY + 100);
        
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

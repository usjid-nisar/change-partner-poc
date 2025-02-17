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

// Create error types that match with frontend
const ErrorTypes = {
    INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
    MISSING_COLUMNS: 'MISSING_COLUMNS',
    INVALID_DATA: 'INVALID_DATA',
    EMPTY_FILE: 'EMPTY_FILE',
    FILE_TOO_LARGE: 'FILE_TOO_LARGE',
    INVALID_NUMERIC_VALUE: 'INVALID_NUMERIC_VALUE',
    MISSING_FILE: 'MISSING_FILE'
};

// Create error helper function
const createError = (type, message) => ({
    type,
    message,
    timestamp: new Date().toISOString()
});

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        // Create uploads directory if it doesn't exist
        try {
            await fs.access('uploads');
        } catch {
            await fs.mkdir('uploads');
        }
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Configure multer file filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['.xlsx', '.csv'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};

// Initialize multer with configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

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
app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json(createError(
                ErrorTypes.MISSING_FILE,
                'No file uploaded'
            ));
        }

        // Check file size
        if (req.file.size > 5 * 1024 * 1024) {
            return res.status(400).json(createError(
                ErrorTypes.FILE_TOO_LARGE,
                'File size exceeds 5MB limit'
            ));
        }

        const data = await validateFile(req.file.path);
        const processedResult = processData(data);

        // Clean up uploaded file
        await fs.unlink(req.file.path).catch(console.error);

        res.json({
            success: true,
            message: 'File processed successfully',
            data: processedResult.data,
            analysis: processedResult.analysis
        });

    } catch (error) {
        // Clean up on error
        if (req.file) {
            await fs.unlink(req.file.path).catch(console.error);
        }
        
        const statusCode = error.type ? 400 : 500;
        res.status(statusCode).json(createError(
            error.type || ErrorTypes.INVALID_DATA,
            error.message || 'Server error processing file'
        ));
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Update validateFile function with better error messages
const validateFile = async (filePath) => {
    try {
        let data;
        const fileExt = path.extname(filePath).toLowerCase();
        
        // Validate file type
        if (!fileExt) {
            throw createError(ErrorTypes.INVALID_FILE_TYPE, 'File must have an extension');
        }
        
        if (!['.xlsx', '.csv'].includes(fileExt)) {
            throw createError(
                ErrorTypes.INVALID_FILE_TYPE,
                'Invalid file type. Only .xlsx and .csv files are allowed'
            );
        }

        // Read and validate file content
        if (fileExt === '.csv') {
            const fileContent = await fs.readFile(filePath, 'utf8');
            if (!fileContent.trim()) {
                throw createError(ErrorTypes.EMPTY_FILE, 'CSV file is empty');
            }
            data = xlsx.utils.sheet_to_json(
                xlsx.utils.aoa_to_sheet(
                    fileContent.split('\n').map(line => line.split(','))
                )
            );
        } else {
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
        const headers = Object.keys(data[0]);
        const missingColumns = requiredColumns.filter(col => 
            !headers.some(header => header.toLowerCase() === col.toLowerCase())
        );

        if (missingColumns.length > 0) {
            throw createError(
                ErrorTypes.MISSING_COLUMNS,
                `Missing required columns: ${missingColumns.join(', ')}`
            );
        }

        // Validate numeric values
        data.forEach((row, index) => {
            const rowNumber = index + 2; // Adding 2 because index starts at 0 and we skip header row
            if (isNaN(Number(row['Z-Score']))) {
                throw createError(
                    ErrorTypes.INVALID_NUMERIC_VALUE,
                    `Invalid Z-Score value at row ${rowNumber}`
                );
            }
            if (isNaN(Number(row['P-Value']))) {
                throw createError(
                    ErrorTypes.INVALID_NUMERIC_VALUE,
                    `Invalid P-Value value at row ${rowNumber}`
                );
            }
        });

        return data;
    } catch (error) {
        console.error('File validation error:', error);
        throw error.type ? error : createError(ErrorTypes.INVALID_DATA, error.message);
    }
};

// Process data with signed integer awareness
const processData = (data) => {
    // Map and normalize the data
    const processedData = data.map((row, index) => ({
        index: index + 1,
        Dimensions: row.Dimension || row['Dimension'],
        "Z Score": Number(row['Z-Score'] || row['Z Score']),
        "P Score": Number(row['P-Value'] || row['P Score'])
    }));
    
    // Filter for P-scores < 0.05 and sort by absolute Z Score
    const sortedData = processedData
        .filter(row => row["P Score"] < 0.05)
        .filter(row => row["Z Score"] >=  2.0)
        .sort((a, b) => {
            // First sort by P Score (descending)
            if (a["P Score"] !== b["P Score"]) {
                return b["P Score"] - a["P Score"];
            }
            // If P Scores are equal, sort by absolute Z Score (descending)
            return Math.abs(b["Z Score"]) - Math.abs(a["Z Score"]);
        });
    
    // Reindex after sorting
    const finalData = sortedData.map((row, index) => ({
        index: index + 1,
        Dimensions: row.Dimensions,
        "Z Score": row["Z Score"],
        "P Score": row["P Score"]
    }));
    
    return {
        data: finalData
    };
};

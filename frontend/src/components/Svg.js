import * as React from "react";
import { useState, useEffect } from "react";

const generateJigsawPath = (x, y, width, height, isEven) => {
  const tabSize = Math.min(width, height) * 0.2; // Size of the jigsaw tabs
  const radius = Math.min(width, height) * 0.1; // Corner radius
  
  // Calculate tab positions and curves
  const tabIn = isEven ? -tabSize : tabSize;
  const tabOut = isEven ? tabSize : -tabSize;
  
  return `
    M ${x + radius} ${y}
    L ${x + width/2 - tabSize} ${y}
    Q ${x + width/2} ${y} ${x + width/2} ${y + tabIn}
    Q ${x + width/2} ${y + tabSize} ${x + width/2 + tabSize} ${y}
    L ${x + width - radius} ${y}
    Q ${x + width} ${y} ${x + width} ${y + radius}
    L ${x + width} ${y + height/2 - tabSize}
    Q ${x + width} ${y + height/2} ${x + width + tabOut} ${y + height/2}
    Q ${x + width + tabSize} ${y + height/2} ${x + width} ${y + height/2 + tabSize}
    L ${x + width} ${y + height - radius}
    Q ${x + width} ${y + height} ${x + width - radius} ${y + height}
    L ${x + width/2 + tabSize} ${y + height}
    Q ${x + width/2} ${y + height} ${x + width/2} ${y + height - tabIn}
    Q ${x + width/2} ${y + height - tabSize} ${x + width/2 - tabSize} ${y + height}
    L ${x + radius} ${y + height}
    Q ${x} ${y + height} ${x} ${y + height - radius}
    L ${x} ${y + height/2 + tabSize}
    Q ${x} ${y + height/2} ${x - tabOut} ${y + height/2}
    Q ${x - tabSize} ${y + height/2} ${x} ${y + height/2 - tabSize}
    L ${x} ${y + radius}
    Q ${x} ${y} ${x + radius} ${y}
    Z
  `;
};

const SvgIcon = (props) => {
  const [isGender, setIsGender] = useState("female");
  const [totalBoxes, setTotalBoxes] = useState(6);
  const [rows, setRows] = useState(2);
  const [columns, setColumns] = useState(3);

  // Calculate optimal grid dimensions
  const calculateGridDimensions = (total) => {
    // Find factors closest to square root
    const sqrt = Math.sqrt(total);
    let row = Math.round(sqrt);
    let col = Math.ceil(total / row);
    
    // Adjust if we need more rows
    while (row * col < total) {
      row++;
    }
    
    // Try to make it more aesthetic by adjusting aspect ratio
    if (row * (col - 1) >= total && col > 2) {
      col--;
    }

    return { rows: row, columns: col };
  };

  // Update grid when total boxes changes
  useEffect(() => {
    const { rows: r, columns: c } = calculateGridDimensions(totalBoxes);
    setRows(r);
    setColumns(c);
  }, [totalBoxes]);

  // Handle total boxes change
  const handleTotalBoxesChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) setTotalBoxes(value);
  };

  // Grid configuration with simplified control and colors
  const gridConfig = {
    // Boundary coordinates
    startX: 250,
    endX: 1440,
    startY: 42,
    endY: 1196,
    
    // Visual settings
    lineColor: "#ccc",
    pointColor: "#666",
    lineWidth: 0.5,
    pointRadius: 1.5,
    curveIntensity: {
      vertical: 10,
      horizontal: 3
    },
    // Color palette for sections (will repeat if more sections than colors)
    colors: [
      'rgba(33, 150, 243, 0.1)',   // Blue
      'rgba(244, 67, 54, 0.1)',    // Red
      'rgba(76, 175, 80, 0.1)',    // Green
      'rgba(255, 152, 0, 0.1)',    // Orange
      'rgba(156, 39, 176, 0.1)',   // Purple
      'rgba(0, 188, 212, 0.1)',    // Cyan
      'rgba(255, 87, 34, 0.1)',    // Deep Orange
      'rgba(233, 30, 99, 0.1)',    // Pink
      'rgba(3, 169, 244, 0.1)'     // Light Blue
    ]
  };

  // Calculate grid cell sizes
  const cellWidth = (gridConfig.endX - gridConfig.startX) / columns;
  const cellHeight = (gridConfig.endY - gridConfig.startY) / rows;

  // Update generateGrid function
  const generateGrid = () => {
    const sections = [];
    const points = [];

    // Generate jigsaw sections
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < columns; i++) {
        const x = gridConfig.startX + (i * cellWidth);
        const y = gridConfig.startY + (j * cellHeight);
        const colorIndex = j * columns + i;
        const isEven = (i + j) % 2 === 0;
        
        const jigsawPath = generateJigsawPath(x, y, cellWidth, cellHeight, isEven);

        sections.push(
          <path
            key={`section-${i}-${j}`}
            d={jigsawPath}
            fill={gridConfig.colors[colorIndex % gridConfig.colors.length]}
            stroke={gridConfig.lineColor}
            strokeWidth={gridConfig.lineWidth}
            filter="url(#shadow)"
          />
        );

        // Add intersection points at corners
        points.push(
          <circle
            key={`p-${i}-${j}`}
            cx={x + cellWidth/2}
            cy={y + cellHeight/2}
            r={gridConfig.pointRadius}
            fill={gridConfig.pointColor}
            className="grid-point"
          />
        );
      }
    }

    return (
      <>
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.1"/>
          </filter>
        </defs>
        {sections}
        {points}
      </>
    );
  };

  return (
    <div className="mindmap-container">
      <div className="gender-switch-container">
        <span className={`gender-label ${isGender === 'female' ? 'active' : ''}`}>Female</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={isGender === "male"}
            onChange={() => setIsGender(isGender === "female" ? "male" : "female")}
          />
          <span className="slider round"></span>
        </label>
        <span className={`gender-label ${isGender === 'male' ? 'active' : ''}`}>Male</span>
      </div>

      {/* Simplified grid control */}
      <div className="grid-control">
        <div className="grid-input">
          <label>Number of Boxes:</label>
          <input 
            type="number" 
            min="1" 
            value={totalBoxes}
            onChange={handleTotalBoxesChange}
          />
        </div>
        <div className="grid-dimensions">
          {rows}x{columns} grid
        </div>
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1440"
        height="1440"
        viewBox="0 0 1440 1440"
        className="mindmap-svg"
        {...props}
      >
        {isGender === "female" ? (
          <g>
            <defs>
              <clipPath id="silhouetteClip">
                <path
                  d='M935.4 996c-31.1-59.3-45.8-122.7-36.9-195.3l26.6-.4c66-16.6 50.7-4.1 97.8-57.3 2.1 11.8-4.6 23.6 6.3 35.5-.2-39.2 16.5-34.9 34.8-66.8-2.2 19.1-4.6 18.8 2.5 37.5 18.9-32.6 45.5-34.9 82-50.9 71-51.5 74.1-71 66.3-152.4 13.3 18.8 25.9 24.8 37.9 20.9-60.9-17.6-50.2-159-64.2-211.5-6.3-23.6-31.9-43.8-75.9-100l-39.4-50.4c-13.4-17.1-19.4-32.5-37.1-44.9-32.9-23.1-75.4-39.3-117.2-54.5-80.9-29.3-75.3-29.9-162.6-27.8-90.4-14.2-73.2-12.7-146.9 12.9-21.1 7.3-46.4 11.4-69.8 15.5-20.1 3.6-26.4 19.3-35.7 37-10.4 19.6 16.5 51.3 26 69.9-38.3 52.9-63.5 86.3-92.4 137.6-18.7 33.3-13.6 85.8-16.6 90.1-19.6 28.2-55 44.8-82.7 65.6-11 6.6-22.5 13.5-21.5 28.5 1 13.6 22.5 27 33.1 34.1 5.8 22.5.3 31.4-17.1 47.1-5.8 19.1 5.7 26.5 22.1 43.2-20.1 19.5-19.7 15.9-17.4 44.5l14 4c14.2 3.9 3.9 21.2-.3 28.5-28.6 73.3 62.8 62.6 105.5 56 33.6-5.1 65 1.3 84 14.8 36.1 25.9 46.2 77.8 73.2 126 20.6 77.4 33.1 110.5 35.8 184.8.7 17.4.1 18.5-5.8 34.8-24.8 24.1-25.8 46.2-32.9 77.8-4.8 21.2-17.8 50.8-22.4 72.8-19.8 53.1-37.2 95.2-56.3 136.8h596.3c-25.1-119.9-65.6-254.2-126.4-335.1-27-36-50.5-78.1-66.7-108.9z'
                />
              </clipPath>
            </defs>

            {/* Background silhouette */}
            <path
              fill='#39256e'
              stroke='#231f20'
              strokeMiterlimit='10'
              strokeWidth='2'
              d='M1020.1 1196.2c-30.9-41.4-57.7-90.1-76.2-125.6-35.7-68.5-52.4-141.7-42.3-225.6l30.4-.4c75.6-19.1 58.1-4.8 112-66.2 2.3 13.7-5.3 27.3 7.1 41-.1-45.2 18.9-40.2 39.9-77.1-2.6 22-5.3 21.8 2.9 43.3 21.6-37.6 52-40.3 93.8-58.7 81.2-59.5 84.7-82 75.8-176 15.2 21.7 29.6 28.7 43.4 24.1-69.7-20.3-57.4-183.5-73.5-244.2-7.2-27.2-36.5-50.5-86.8-115.4l-45.1-58.2c-15.3-19.7-22.2-37.5-42.4-51.8C1021.4 78.7 972.8 60 925 42.5 832.4 8.6 838.8 7.9 738.9 10.4 635.5-6 655.2-4.3 570.9 25.2c-24.1 8.4-53.1 13.2-79.8 18-23.1 4.1-30.3 22.2-40.9 42.6-11.9 22.7 18.9 59.3 29.8 80.7-43.9 61.2-72.7 99.7-105.7 159-21.4 38.4-15.6 99-19 104-22.4 32.6-62.9 51.7-94.6 75.7-12.7 7.6-25.8 15.6-24.6 32.9 1.1 15.6 25.7 31.2 37.9 39.4 6.5 25.9.3 36.2-19.6 54.3-6.6 22.1 6.5 30.6 25.3 49.9-23.1 22.5-22.6 18.4-20 51.4l16.1 4.6c16.2 4.6 4.4 24.5-.4 32.9-32.7 84.7 71.8 72.3 120.7 64.7 38.5-5.9 74.4 1.4 96.1 17.1 41.3 29.8 52.8 89.8 83.7 145.4 23.7 89.4 37.9 127.6 41 213.4.8 20.1.1 21.3-6.6 40.2-28.4 27.8-29.5 53.3-37.7 89.8-5.5 24.5-20.4 58.6-25.6 84'
            ></path>
            <path
              fill='#fefefe'
              stroke='#231f20'
              strokeMiterlimit='10'
              strokeWidth='2'
              d='M935.4 996c-31.1-59.3-45.8-122.7-36.9-195.3l26.6-.4c66-16.6 50.7-4.1 97.8-57.3 2.1 11.8-4.6 23.6 6.3 35.5-.2-39.2 16.5-34.9 34.8-66.8-2.2 19.1-4.6 18.8 2.5 37.5 18.9-32.6 45.5-34.9 82-50.9 71-51.5 74.1-71 66.3-152.4 13.3 18.8 25.9 24.8 37.9 20.9-60.9-17.6-50.2-159-64.2-211.5-6.3-23.6-31.9-43.8-75.9-100l-39.4-50.4c-13.4-17.1-19.4-32.5-37.1-44.9-32.9-23.1-75.4-39.3-117.2-54.5-80.9-29.3-75.3-29.9-162.6-27.8-90.4-14.2-73.2-12.7-146.9 12.9-21.1 7.3-46.4 11.4-69.8 15.5-20.1 3.6-26.4 19.3-35.7 37-10.4 19.6 16.5 51.3 26 69.9-38.3 52.9-63.5 86.3-92.4 137.6-18.7 33.3-13.6 85.8-16.6 90.1-19.6 28.2-55 44.8-82.7 65.6-11 6.6-22.5 13.5-21.5 28.5 1 13.6 22.5 27 33.1 34.1 5.8 22.5.3 31.4-17.1 47.1-5.8 19.1 5.7 26.5 22.1 43.2-20.1 19.5-19.7 15.9-17.4 44.5l14 4c14.2 3.9 3.9 21.2-.3 28.5-28.6 73.3 62.8 62.6 105.5 56 33.6-5.1 65 1.3 84 14.8 36.1 25.9 46.2 77.8 73.2 126 20.6 77.4 33.1 110.5 35.8 184.8.7 17.4.1 18.5-5.8 34.8-24.8 24.1-25.8 46.2-32.9 77.8-4.8 21.2-17.8 50.8-22.4 72.8-19.8 53.1-37.2 95.2-56.3 136.8h596.3c-25.1-119.9-65.6-254.2-126.4-335.1-27-36-50.5-78.1-66.7-108.9z'
            ></path>
            
            {/* Clipped grid */}
            <g clipPath="url(#silhouetteClip)">
              <g className="grid-lines">
                {generateGrid()}
              </g>
            </g>
          </g>
        ) : (
          <text x="50%" y="50%" textAnchor="middle" fontSize="48" fill="black">
            Male
          </text>
        )}
      </svg>
    </div>
  );
};

export default React.memo(SvgIcon);

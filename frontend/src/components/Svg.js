import * as React from "react";
import { useState, useEffect } from "react";
import DynamicMasonryGrid from "./DynamicMasonryGrid";
import "./svg.css";

const generateJigsawPath = (x, y, width, height, i, j, rows, columns) => {
  const baseSize = Math.min(width, height);
  const tabRadius = baseSize * 0.15;
  const cornerRadius = baseSize * 0.05;

  const tabs = {
    top: { x: x + width / 2, y: y - tabRadius / 2 },
    right: { x: x + width + tabRadius / 2, y: y + height / 2 },
    bottom: { x: x + width / 2, y: y + height + tabRadius / 2 },
    left: { x: x - tabRadius / 2, y: y + height / 2 },
  };

  // Ensure opposite pieces interlock correctly
  const tabDirections = {
    top: j === 0 ? 0 : i % 2 === 0 ? 1 : -1,
    right: i === columns - 1 ? 0 : j % 2 === 0 ? -1 : 1,
    bottom: j === rows - 1 ? 0 : -(i % 2 === 0 ? 1 : -1),
    left: i === 0 ? 0 : -(j % 2 === 0 ? -1 : 1),
  };

  return `
    M ${x + cornerRadius} ${y}
    ${
      j > 0 && tabDirections.top !== 0
        ? `
      L ${tabs.top.x - tabRadius} ${y}
      A ${tabRadius} ${tabRadius} 0 0 ${tabDirections.top > 0 ? 1 : 0} ${
            tabs.top.x + tabRadius
          } ${y}
    `
        : `L ${x + width - cornerRadius} ${y}`
    }
    L ${x + width - cornerRadius} ${y}
    Q ${x + width} ${y} ${x + width} ${y + cornerRadius}
    ${
      i < columns - 1 && tabDirections.right !== 0
        ? `
      L ${x + width} ${tabs.right.y - tabRadius}
      A ${tabRadius} ${tabRadius} 0 0 ${tabDirections.right > 0 ? 1 : 0} ${
            x + width
          } ${tabs.right.y + tabRadius}
    `
        : ""
    }
    L ${x + width} ${y + height - cornerRadius}
    Q ${x + width} ${y + height} ${x + width - cornerRadius} ${y + height}
    ${
      j < rows - 1 && tabDirections.bottom !== 0
        ? `
      L ${tabs.bottom.x + tabRadius} ${y + height}
      A ${tabRadius} ${tabRadius} 0 0 ${tabDirections.bottom > 0 ? 1 : 0} ${
            tabs.bottom.x - tabRadius
          } ${y + height}
    `
        : ""
    }
    L ${x + cornerRadius} ${y + height}
    Q ${x} ${y + height} ${x} ${y + height - cornerRadius}
    ${
      i > 0 && tabDirections.left !== 0
        ? `
      L ${x} ${tabs.left.y + tabRadius}
      A ${tabRadius} ${tabRadius} 0 0 ${tabDirections.left > 0 ? 1 : 0} ${x} ${
            tabs.left.y - tabRadius
          }
    `
        : ""
    }
    L ${x} ${y + cornerRadius}
    Q ${x} ${y} ${x + cornerRadius} ${y}
    Z
  `;
};

const SvgIcon = ({ processedData, ...props }) => {
  const [isGender, setIsGender] = useState("female");
  const [showCategory, setShowCategory] = useState(false);
  const [rows, setRows] = useState(2);
  const [columns, setColumns] = useState(3);

  const calculateGridDimensions = (total) => {
    const sqrt = Math.sqrt(total);
    let row = Math.round(sqrt);
    let col = Math.ceil(total / row);

    while (row * col < total) row++;
    if (row * (col - 1) >= total && col > 2) col--;

    return { rows: row, columns: col };
  };

  useEffect(() => {
    if (processedData && processedData.length > 0) {
      const { rows: r, columns: c } = calculateGridDimensions(
        processedData.length
      );
      setRows(r);
      setColumns(c);
    }
  }, [processedData]);

  const gridConfig = {
    startX: 450,
    endX: 1100,
    startY: 90,
    endY: 850,
    lineColor: "rgba(0, 0, 0, 0.2)",
    pointColor: "#666",
    lineWidth: 2,
    pointRadius: 0,
    baseColor: "rgba(255, 255, 255, 0.95)", // White color for pieces
  };

  const cellWidth = (gridConfig.endX - gridConfig.startX) / columns;
  const cellHeight = (gridConfig.endY - gridConfig.startY) / rows;
  const transformDataForMasonry = () => {
    if (!processedData) return [];

    return processedData.map((piece) => ({
      label: piece.Dimensions,
      zscore: Math.abs(piece["Z Score"]), // Using absolute value since we want positive sizes
      zlabel: `Z: ${piece["Z Score"].toFixed(2)}`,
    }));
  };
  const generateGrid = () => {
    if (!processedData || processedData.length === 0) return null;

    const sections = [];
    let pieceCount = 0;

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < columns; i++) {
        if (pieceCount >= processedData.length) break;

        const dataItem = processedData[pieceCount];
        const x = gridConfig.startX + i * cellWidth;
        const y = gridConfig.startY + j * cellHeight;

        const jigsawPath = generateJigsawPath(
          x,
          y,
          cellWidth,
          cellHeight,
          i,
          j,
          rows,
          columns
        );

        sections.push(
          <g key={`section-${i}-${j}`}>
            <path
              d={jigsawPath}
              fill={gridConfig.baseColor}
              stroke={gridConfig.lineColor}
              strokeWidth={gridConfig.lineWidth}
              filter="url(#shadow)"
              className="jigsaw-piece"
            />
            <text
              x={x + cellWidth / 2}
              y={y + cellHeight / 2}
              textAnchor="middle"
              fill="black"
              className="piece-text"
            >
              <tspan
                x={x + cellWidth / 2}
                y={y + cellHeight / 2 - 10}
                className="dimension-text"
              >
                {showCategory
                  ? dataItem.highLevelCategory
                  : dataItem.Dimensions}
              </tspan>
              <tspan
                x={x + cellWidth / 2}
                y={y + cellHeight / 2 + 15}
                className="score-text"
              >
                Z: {dataItem["Z Score"].toFixed(2)}
              </tspan>
            </text>
          </g>
        );

        pieceCount++;
      }
      if (pieceCount >= processedData.length) break;
    }

    return (
      <>
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="3" dy="3" stdDeviation="4" floodOpacity="0.15" />
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="2" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.2" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {sections}
      </>
    );
  };

  return (
    <div className="mindmap-container">
      <div className="gender-switch-container">
        <span
          className={`gender-label ${isGender === "female" ? "active" : ""}`}
        >
          Female
        </span>
        <label className="switch">
          <input
            type="checkbox"
            checked={isGender === "male"}
            onChange={() =>
              setIsGender(isGender === "female" ? "male" : "female")
            }
          />
          <span className="slider round"></span>
        </label>
        <span className={`gender-label ${isGender === "male" ? "active" : ""}`}>
          Male
        </span>
      </div>

      <div className="category-switch-container">
        <span className={`category-label ${!showCategory ? "active" : ""}`}>
          Dimensions
        </span>
        <label className="switch">
          <input
            type="checkbox"
            checked={showCategory}
            onChange={() => setShowCategory(!showCategory)}
          />
          <span className="slider round"></span>
        </label>
        <span className={`category-label ${showCategory ? "active" : ""}`}>
          Categories
        </span>
      </div>

      <div className="grid-control">
        <div className="grid-dimensions">
          {rows}x{columns} grid
        </div>
      </div>
      {/* <div className="masked-container"> */}
      {/* <DynamicMasonryGrid data={transformDataForMasonry()} /> */}
      {/* </div> */}
      <div className="mt-32 overlay-container">
        <DynamicMasonryGrid data={transformDataForMasonry()} />
        <img src="1.svg" alt="overlay" className="overlay-svg" />
      </div>
    </div>
  );
};

export default React.memo(SvgIcon);

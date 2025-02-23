import React, { useEffect, useRef, useState } from "react";
import "./DynamicMasonryGrid.css";

const DynamicMasonryGrid = ({ data }) => {
  const containerRef = useRef(null);
  const masonryInstanceRef = useRef(null);
  const [boxes, setBoxes] = useState([]);
  const [widthInput, setWidthInput] = useState(100);
  const [heightInput, setHeightInput] = useState(100);
  const boxIdCounter = useRef(0);

  // Adds a new box (or fake box) to the grid.
  const addBoxWithSize = (width, height, label, isFake = false) => {
    const newBox = {
      id: boxIdCounter.current++,
      width,
      height,
      label,
      isFake,
    };
    setBoxes((prev) => [...prev, newBox]);
  };
  // useEffect(() => {
  //   generateSampleBoxes();
  // }, [data]);
  // Always add a top boundary fake box.
  const addTopBoundaryBox = () => {
    addBoxWithSize(90, 100, "", true);
  };

  // Clear the grid and re-add the top boundary box.
  const clearGrid = () => {
    setBoxes([]);
    setTimeout(() => {
      addTopBoundaryBox();
      setTimeout(addPuzzleNotches, 100);
    }, 50);
  };

  // Handler for manual box addition.
  const addNewBox = () => {
    addBoxWithSize(widthInput, heightInput, "Manual");
    setTimeout(addPuzzleNotches, 100);
  };

  // Generate sample boxes based on the provided data array.
  const generateSampleBoxes = async () => {
    if (!data || data.length === 0) return;

    clearGrid();
    await setTimeout(() => {
      const totalZscore = data.reduce((sum, obj) => sum + obj.zscore, 0);
      const TOTAL_AREA = 120000; // Adjust overall size as needed
      const gridUnit = 1; // You can adjust this grid unit if desired.

      data.forEach((obj) => {
        // Calculate the area for the current box.
        const area = (obj.zscore / totalZscore) * TOTAL_AREA;
        // Pick a random candidate ratio between 0.7 and 1.3.
        const candidateRatio = Math.random() * (1.3 - 0.7) + 0.7;

        // Compute snapped dimensions that preserve the area.
        const { width, height } = computeBestSnappedDimensions(area, gridUnit);

        // Add the box with the computed dimensions.
        addBoxWithSize(width, height, `${obj.zlabel}`);
      });
    }, 100);
    setTimeout(addPuzzleNotches, 800);
  };

  // This function adds puzzle notch overlays using direct DOM manipulation.
  const addPuzzleNotches = () => {
    const container = containerRef.current;
    if (!container) return;
    // Remove existing notches.
    container.querySelectorAll(".puzzle-notch").forEach((el) => el.remove());
    const containerRect = container.getBoundingClientRect();
    const tolerance = 10;
    const items = Array.from(container.querySelectorAll(".item"));
    const addedNotches = [];
    const minOverlap = 30; // Minimum connected length to display a notch

    items.forEach((item) => {
      if (item.classList.contains("fake-box")) return;
      const rect = item.getBoundingClientRect();
      let scaleFactor = 1.3 + (Math.min(rect.width, rect.height) - 100) / 100;
      // scaleFactor = Math.max(0.8, Math.min(1.2, scaleFactor));
      console.log(scaleFactor);

      const edges = [
        {
          side: "top",
          fullRange: { start: rect.left, end: rect.right },
          fixed: rect.top,
          axis: "horizontal",
        },
        {
          side: "bottom",
          fullRange: { start: rect.left, end: rect.right },
          fixed: rect.bottom,
          axis: "horizontal",
        },
        {
          side: "left",
          fullRange: { start: rect.top, end: rect.bottom },
          fixed: rect.left,
          axis: "vertical",
        },
        {
          side: "right",
          fullRange: { start: rect.top, end: rect.bottom },
          fixed: rect.right,
          axis: "vertical",
        },
      ];

      edges.forEach((edge) => {
        const overlaps = [];
        items.forEach((other) => {
          if (other === item || other.classList.contains("fake-box")) return;
          const oRect = other.getBoundingClientRect();
          if (edge.side === "top") {
            if (
              Math.abs(oRect.bottom - rect.top) < tolerance &&
              oRect.right > rect.left &&
              oRect.left < rect.right
            ) {
              overlaps.push({
                start: Math.max(rect.left, oRect.left),
                end: Math.min(rect.right, oRect.right),
              });
            }
          } else if (edge.side === "bottom") {
            if (
              Math.abs(oRect.top - rect.bottom) < tolerance &&
              oRect.right > rect.left &&
              oRect.left < rect.right
            ) {
              overlaps.push({
                start: Math.max(rect.left, oRect.left),
                end: Math.min(rect.right, oRect.right),
              });
            }
          } else if (edge.side === "left") {
            if (
              Math.abs(oRect.right - rect.left) < tolerance &&
              oRect.bottom > rect.top &&
              oRect.top < rect.bottom
            ) {
              overlaps.push({
                start: Math.max(rect.top, oRect.top),
                end: Math.min(rect.bottom, oRect.bottom),
              });
            }
          } else if (edge.side === "right") {
            if (
              Math.abs(oRect.left - rect.right) < tolerance &&
              oRect.bottom > rect.top &&
              oRect.top < rect.bottom
            ) {
              overlaps.push({
                start: Math.max(rect.top, oRect.top),
                end: Math.min(rect.bottom, oRect.bottom),
              });
            }
          }
        });
        overlaps.sort((a, b) => a.start - b.start);
        const merged = [];
        overlaps.forEach((interval) => {
          if (!merged.length) {
            merged.push(interval);
          } else {
            const last = merged[merged.length - 1];
            if (interval.start <= last.end + tolerance) {
              last.end = Math.max(last.end, interval.end);
            } else {
              merged.push(interval);
            }
          }
        });
        if (merged.length) {
          const contact = merged.reduce((a, b) =>
            b.end - b.start > a.end - a.start ? b : a
          );
          if (contact.end - contact.start > minOverlap) {
            const baseCenter = (contact.start + contact.end) / 2;
            // Check that the center of contact isn't too close to the edge boundaries
            const edgeLength = edge.fullRange.end - edge.fullRange.start;
            const relativeCenter =
              (baseCenter - edge.fullRange.start) / edgeLength;
            if (relativeCenter < 0.1 || relativeCenter > 0.9) return;

            const variation =
              (Math.random() - 0.5) * (contact.end - contact.start) * 0.2;
            const centerCoord = baseCenter + variation;
            const notchW = 30 * scaleFactor;
            const notchH = 20 * scaleFactor;
            let notchX, notchY;
            if (edge.side === "top") {
              notchX = centerCoord - containerRect.left - notchW / 2;
              notchY = rect.top - containerRect.top - notchH / 2 - 9;
            } else if (edge.side === "bottom") {
              notchX = centerCoord - containerRect.left - notchW / 2;
              notchY = rect.bottom - containerRect.top - notchH / 2 + 11;
            } else if (edge.side === "left") {
              notchX = rect.left - containerRect.left - notchH / 2 - 10;
              notchY = centerCoord - containerRect.top - notchW / 2;
            } else if (edge.side === "right") {
              notchX = rect.right - containerRect.left - notchH / 2 + 10;
              notchY = centerCoord - containerRect.top - notchW / 2;
            }
            const duplicate = addedNotches.some((n) => {
              if (n.side === "left" && edge.side === "right")
                return (
                  Math.abs(n.x - notchX) < 40 && Math.abs(n.y - notchY) < 40
                );
              else if (n.side === "right" && edge.side === "left")
                return (
                  Math.abs(n.x - notchX) < 40 && Math.abs(n.y - notchY) < 40
                );
              else if (n.side === "top" && edge.side === "bottom")
                return (
                  Math.abs(n.x - notchX) < 40 && Math.abs(n.y - notchY) < 40
                );
              else if (n.side === "bottom" && edge.side === "top")
                return (
                  Math.abs(n.x - notchX) < 40 && Math.abs(n.y - notchY) < 40
                );
              return false;
            });
            if (duplicate) return;
            addedNotches.push({ side: edge.side, x: notchX, y: notchY });
            const notch = document.createElement("div");
            notch.className = "puzzle-notch " + edge.side;
            notch.style.position = "absolute";
            notch.style.left = notchX + "px";
            notch.style.top = notchY + "px";
            if (edge.axis === "horizontal") {
              notch.style.width = notchW + "px";
              notch.style.height = notchH + "px";
            } else {
              notch.style.width = notchH + "px";
              notch.style.height = notchW + "px";
            }
            container.appendChild(notch);
          }
        }
      });
    });
  };

  useEffect(() => {
    if (containerRef.current) {
      if (!masonryInstanceRef.current) {
        masonryInstanceRef.current = new window.Masonry(containerRef.current, {
          columnWidth: ".masonry-sizer",
          itemSelector: ".item",
          percentPosition: true,
          gutter: 0,
          initLayout: true,
        });
      } else {
        masonryInstanceRef.current.reloadItems();
        masonryInstanceRef.current.layout();
      }
    }
  }, [boxes]);

  // On initial mount, add the top boundary fake box.
  useEffect(() => {
    addTopBoundaryBox();
  }, []);
  // Snap dimensions to the nearest grid unit while preserving area.
  const computeSnappedDimensions = (area, candidateRatio, gridUnit = 10) => {
    // Compute ideal dimensions from area and ratio.
    const idealWidth = Math.sqrt(area * candidateRatio);
    const idealHeight = Math.sqrt(area / candidateRatio);

    // Snap the width to the nearest grid unit.
    const snappedWidth = Math.round(idealWidth / gridUnit) * gridUnit;

    // Calculate height to preserve area exactly, then snap height.
    const exactHeight = area / snappedWidth;
    const snappedHeight = Math.round(exactHeight / gridUnit) * gridUnit;

    return { width: snappedWidth, height: snappedHeight };
  };
  const computeBestSnappedDimensions = (area, gridUnit = 10) => {
    let bestError = Infinity;
    let bestDims = null;
    // Loop candidate ratios from 0.7 to 1.3 in increments of 0.05.
    for (let r = 0.7; r <= 1.3; r += 0.05) {
      const idealWidth = Math.sqrt(area * r);
      // Snap the width to the grid.
      const snappedWidth = Math.round(idealWidth / gridUnit) * gridUnit;
      // Calculate the exact height needed to preserve the area.
      const exactHeight = area / snappedWidth;
      // Snap the height to the grid.
      const snappedHeight = Math.round(exactHeight / gridUnit) * gridUnit;
      const snappedArea = snappedWidth * snappedHeight;
      const error = Math.abs(snappedArea - area);
      if (error < bestError) {
        bestError = error;
        bestDims = { width: snappedWidth, height: snappedHeight };
      }
    }
    return bestDims;
  };
  // Update the handleReevaluate function.
  const handleReevaluate = () => {
    // Just trigger the puzzle notches recalculation.
    setTimeout(addPuzzleNotches, 100);
  };

  return (
    <div>
      {/* Update Control Panel */}
      <div className="control-panel ">
        <div className="absolute-button-container">
          <button onClick={generateSampleBoxes} className="absolute-button">
            reGenerate Boxes from Data
          </button>
          <button onClick={handleReevaluate} className="absolute-button">
            Reevaluate Notes
          </button>
        </div>
      </div>

      {/* Masonry grid */}
      <div className="masked-container">
        <div
          className="masonry grid "
          ref={containerRef}
          style={{ position: "relative", marginTop: "71px" }}
        >
          <div className="masonry-sizer " style={{ width: "1px" }}></div>
          {boxes.map((box) => (
            <div
              key={box.id}
              className={`item ${
                box.isFake ? "fake-box top-boundary left" : ""
              }`}
              style={{ width: box.width + "px", height: box.height + "px" }}
            >
              {!box.isFake && (
                <div className="inner" style={{ whiteSpace: "pre-line" }}>
                  <p className=" z-30">{box.zlabel}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DynamicMasonryGrid;

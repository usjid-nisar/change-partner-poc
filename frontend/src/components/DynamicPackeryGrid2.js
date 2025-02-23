import React, { useEffect, useRef, useState } from "react";
import "./DynamicMasonryGrid.css"; // Assumes your CSS is available

const DynamicPackeryGrid = ({ data, notches }) => {
  const containerRef = useRef(null);
  const [boxes, setBoxes] = useState([]);
  const boxIdCounter = useRef(0);

  // Add a new box to state.
  const addBoxWithSize = (
    width,
    height,
    label,
    isFake = false,
    x = 0,
    y = 0
  ) => {
    const newBox = {
      id: boxIdCounter.current++,
      width,
      height,
      label,
      isFake,
      x,
      y,
    };
    setBoxes((prev) => [...prev, newBox]);
  };

  // Clear all boxes from the grid.
  const clearGrid = () => {
    setBoxes([]);
  };

  // --- Aspect Ratio Helpers ---
  const computeAspectError = (rect) => {
    const ratio = rect.width / rect.height;
    if (ratio < 0.7) return 0.7 - ratio;
    if (ratio > 1.3) return ratio - 1.3;
    return 0;
  };

  const maxAspectError = (rects) =>
    rects.reduce((max, rect) => Math.max(max, computeAspectError(rect)), 0);

  // --- Slice-and-Dice Packing Algorithm ---
  // Splits the boxes into two groups and partitions the container recursively.
  const sliceAndDice = (boxes, rect, vertical = true) => {
    if (boxes.length === 1) {
      return [
        {
          label: boxes[0].label,
          area: boxes[0].area,
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        },
      ];
    }
    const totalArea = boxes.reduce((sum, b) => sum + b.area, 0);
    let group1 = [];
    let group2 = [];
    let sum1 = 0;
    for (let b of boxes) {
      if (sum1 < totalArea / 2) {
        group1.push(b);
        sum1 += b.area;
      } else {
        group2.push(b);
      }
    }

    const doSplit = (useVertical) => {
      let results = [];
      if (useVertical) {
        const group1Width = rect.width * (sum1 / totalArea);
        const rect1 = {
          x: rect.x,
          y: rect.y,
          width: group1Width,
          height: rect.height,
        };
        const rect2 = {
          x: rect.x + group1Width,
          y: rect.y,
          width: rect.width - group1Width,
          height: rect.height,
        };
        results = results.concat(sliceAndDice(group1, rect1, !useVertical));
        results = results.concat(sliceAndDice(group2, rect2, !useVertical));
      } else {
        const group1Height = rect.height * (sum1 / totalArea);
        const rect1 = {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: group1Height,
        };
        const rect2 = {
          x: rect.x,
          y: rect.y + group1Height,
          width: rect.width,
          height: rect.height - group1Height,
        };
        results = results.concat(sliceAndDice(group1, rect1, !useVertical));
        results = results.concat(sliceAndDice(group2, rect2, !useVertical));
      }
      return results;
    };

    const verticalResults = doSplit(true);
    const horizontalResults = doSplit(false);
    const verticalError = maxAspectError(verticalResults);
    const horizontalError = maxAspectError(horizontalResults);
    return verticalError <= horizontalError
      ? verticalResults
      : horizontalResults;
  };

  // Scale boxes so that their total area exactly equals the container (or free) area.
  const scaleBoxesToContainer = (boxes, containerArea) => {
    const total = boxes.reduce((sum, b) => sum + b.area, 0);
    const scale = containerArea / total;
    return boxes.map((b) => ({ ...b, area: b.area * scale }));
  };

  // --- Obstacle Subtraction Helpers ---
  // Given a rectangle (with x,y,width,height) and an obstacle,
  // return an array of sub-rectangles representing the free space.
  const subtractObstacle = (rect, obs) => {
    // No intersection: return the original rectangle.
    if (
      obs.x >= rect.x + rect.width ||
      obs.x + obs.width <= rect.x ||
      obs.y >= rect.y + rect.height ||
      obs.y + obs.height <= rect.y
    ) {
      return [rect];
    }
    const freeRects = [];
    // Top area
    if (obs.y > rect.y) {
      freeRects.push({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: obs.y - rect.y,
      });
    }
    // Bottom area
    if (obs.y + obs.height < rect.y + rect.height) {
      freeRects.push({
        x: rect.x,
        y: obs.y + obs.height,
        width: rect.width,
        height: rect.y + rect.height - (obs.y + obs.height),
      });
    }
    // Left area (overlapping vertically with the obstacle)
    if (obs.x > rect.x) {
      const overlapY = Math.max(rect.y, obs.y);
      const overlapHeight =
        Math.min(rect.y + rect.height, obs.y + obs.height) - overlapY;
      freeRects.push({
        x: rect.x,
        y: overlapY,
        width: obs.x - rect.x,
        height: overlapHeight,
      });
    }
    // Right area
    if (obs.x + obs.width < rect.x + rect.width) {
      const overlapY = Math.max(rect.y, obs.y);
      const overlapHeight =
        Math.min(rect.y + rect.height, obs.y + obs.height) - overlapY;
      freeRects.push({
        x: obs.x + obs.width,
        y: overlapY,
        width: rect.x + rect.width - (obs.x + obs.width),
        height: overlapHeight,
      });
    }
    return freeRects;
  };

  // Subtract multiple obstacles from a given rectangle.
  const subtractObstacles = (rect, obstacles) => {
    let freeAreas = [rect];
    obstacles.forEach((obs) => {
      const newFree = [];
      freeAreas.forEach((area) => {
        newFree.push(...subtractObstacle(area, obs));
      });
      freeAreas = newFree;
    });
    return freeAreas;
  };

  // --- Generate and Pack Boxes Considering Obstacles ---
  const generateSampleBoxes = async () => {
    if (!data || data.length === 0) return;
    clearGrid();
    await setTimeout(() => {
      // Define overall container dimensions.
      const containerWidth = 520; // Fixed width
      const TOTAL_AREA = 300000; // Original total area
      console.log("TOTAL_AREA", TOTAL_AREA);
      const containerHeight = TOTAL_AREA / containerWidth;
      const containerRect = {
        x: 0,
        y: 0,
        width: containerWidth,
        height: containerHeight,
      };

      // Define obstacles – these areas will be reserved.
      const obstacles = [
        { x: 473, y: 341, width: 100, height: 1000 },
        { x: 0, y: 0, width: 100, height: 100 },
        // { x: 50, y: 0, width: 90, height: 120 },
        // { x: 0, y: 120, width: 90, height: 120 },
        // { x: 420, y: 0, width: 140, height: 50 },
      ];

      const availableAreas = subtractObstacles(containerRect, obstacles);

      console.log("availableAreas", availableAreas);
      let totalFreeArea = availableAreas.reduce(
        (sum, area) => sum + area.width * area.height,
        0
      );

      let totalZscore = data.reduce((sum, obj) => sum + obj.zscore, 0);

      console.log("totalZscore", totalZscore);
      const boxesData = data.map((obj) => ({
        label: obj.zlabel,
        area: (obj.zscore / totalZscore) * totalFreeArea,
      }));
      // sort boxesData by area
      boxesData.sort((a, b) => b.area - a.area);
      // console.log("boxesData", boxesData);

      // Scale the boxes so that they exactly fill the total free area.
      // sort boxesData by area

      const scaledBoxes = scaleBoxesToContainer(boxesData, totalFreeArea);

      // Partition the scaled boxes among the available free areas.
      let groups = [];
      let boxesRemaining = [...scaledBoxes];
      availableAreas.forEach((area) => {
        const targetArea = area.width * area.height;
        let group = [];
        let groupSum = 0;
        while (
          boxesRemaining.length > 0 &&
          groupSum + boxesRemaining[0].area <= targetArea
        ) {
          const box = boxesRemaining.shift();
          group.push(box);
          groupSum += box.area;
        }
        // If no box was added (but boxes remain), force-add one box.
        if (group.length === 0 && boxesRemaining.length > 0) {
          const box = boxesRemaining.shift();
          group.push(box);
          groupSum += box.area;
        }
        groups.push({ freeArea: area, boxes: group });
      });
      // If any boxes remain, add them to the last free area.
      if (boxesRemaining.length > 0 && groups.length > 0) {
        groups[groups.length - 1].boxes =
          groups[groups.length - 1].boxes.concat(boxesRemaining);
      }

      // For each free area group, run the slice-and-dice packing algorithm.
      groups.forEach((group) => {
        if (group.boxes.length > 0) {
          const packed = sliceAndDice(group.boxes, group.freeArea);
          packed.forEach((b) => {
            console.log(b);
            addBoxWithSize(b.width, b.height, b.label, false, b.x, b.y);
          });
        }
      });
    }, 100);
  };

  useEffect(() => {
    generateSampleBoxes();
  }, [data]);

  // Add this useEffect for notches
  useEffect(() => {
    if (notches) {
      setTimeout(() => {
        addPuzzleNotches();
      }, 800); // Add a small delay to ensure DOM is ready
    } else {
      removePuzzleNotches();
    }
  }, [notches]);

  const removePuzzleNotches = () => {
    const container = containerRef.current;
    if (!container) return;
    // Remove existing notches.
    container.querySelectorAll(".puzzle-notch").forEach((el) => el.remove());
  };
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
            // if edge is very small, don't add a notch
            if (edgeLength < 40) return;
            const variation =
              (Math.random() - 0.5) * (contact.end - contact.start) * 0.2;
            const centerCoord = baseCenter + variation;
            const notchW = 30 * scaleFactor;
            const notchH = 20 * scaleFactor;
            let notchX, notchY;
            if (edge.side === "top") {
              notchX = centerCoord - containerRect.left - notchW / 2;
              notchY =
                rect.top - containerRect.top - notchH / 2 - scaleFactor * 8;
            } else if (edge.side === "bottom") {
              notchX = centerCoord - containerRect.left - notchW / 2;
              notchY =
                rect.bottom - containerRect.top - notchH / 2 + scaleFactor * 8;
            } else if (edge.side === "left") {
              notchX =
                rect.left - containerRect.left - notchH / 2 - scaleFactor * 8;
              notchY = centerCoord - containerRect.top - notchW / 2;
            } else if (edge.side === "right") {
              notchX =
                rect.right - containerRect.left - notchH / 2 + scaleFactor * 8;
              notchY = centerCoord - containerRect.top - notchW / 2;
            }
            const duplicate = addedNotches.some((n) => {
              if (n.side === "left" && edge.side === "right")
                return (
                  Math.abs(n.x - notchX) < 50 && Math.abs(n.y - notchY) < 50
                );
              else if (n.side === "right" && edge.side === "left")
                return (
                  Math.abs(n.x - notchX) < 50 && Math.abs(n.y - notchY) < 50
                );
              else if (n.side === "top" && edge.side === "bottom")
                return (
                  Math.abs(n.x - notchX) < 50 && Math.abs(n.y - notchY) < 50
                );
              else if (n.side === "bottom" && edge.side === "top")
                return (
                  Math.abs(n.x - notchX) < 50 && Math.abs(n.y - notchY) < 50
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

  return (
    <div className="w-[900px] mx-auto">
      <div className="control-panel">
        <div className="absolute-button-container">
          {/* <button onClick={generateSampleBoxes} className="absolute-button">
            Re-generate Boxes from Data
          </button> */}
        </div>
      </div>

      <div
        className="flex justify-center w-[530px] ml-1"
        style={{
          width: "570px",
          height: "900px",
          // backgroundColor: "red",
          mask: "url(3.svg) no-repeat center / contain",
          "-webkit-mask": "url(3.svg) no-repeat center / contain",
          margin: "auto",
          // marginTop: "140px",
        }}
      >
        <div style={{ position: "relative" }}>
          <div
            className="packery-grid"
            ref={containerRef}
            style={{
              position: "relative",
              marginTop: "140px",
              width: "530px",
              height: "auto",
            }}
          >
            {boxes.map((box) => (
              <div
                key={box.id}
                className={`item ${
                  box.isFake ? "fake-box top-boundary left" : ""
                }`}
                style={{
                  position: "absolute",
                  left: box.x + "px",
                  top: box.y + "px",
                  width: box.width + "px",
                  height: box.height + "px",
                }}
              >
                {!box.isFake && (
                  <div
                    className="inner hover:shadow-lg cursor-pointer  transition-all duration-300 bg-gray"
                    style={{ whiteSpace: "pre-line" }}
                  >
                    <p className="z-30">
                      {/* have font size according to the box size, bigger box, bigger font , if smaller then 50, do not show the lable, show tool tip on hover.*/}
                      {box.width < 50 && box.height < 50 ? (
                        <span className={`text-[${box.width / 8}px] `}>
                          {box.label}
                        </span>
                      ) : (
                        <span
                          className={`text-[${
                            (box.width + box.height) / 30
                          }px] `}
                        >
                          {box.label}
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          {/*
            // Optionally, render obstacles for visualization:
            obstacles.map((obs, idx) => (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  left: obs.x + "px",
                  top: obs.y + "px",
                  width: obs.width + "px",
                  height: obs.height + "px",
                  backgroundColor: "rgba(255, 0, 0, 0.3)",
                  pointerEvents: "none",
                }}
              ></div>
            ))
          */}
        </div>
      </div>
    </div>
  );
};

export default DynamicPackeryGrid;

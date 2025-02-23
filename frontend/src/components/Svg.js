import * as React from "react";
import { useState } from "react";
import DynamicMasonryGrid from "./DynamicMasonryGrid";
import DynamicPackeryGrid from "./DynamicPackeryGrid";
import DynamicPackeryGrid2 from "./DynamicPackeryGrid2";
import "./svg.css";

const SvgIcon = ({ processedData, ...props }) => {
  const [isGender, setIsGender] = useState("female");
  const [showCategory, setShowCategory] = useState(false);
  const [showNotches, setShowNotches] = useState(false);

  const transformDataForMasonry = () => {
    if (!processedData) return [];

    return processedData.map((piece) => ({
      label: piece.Dimensions,
      category: piece.highLevelCategory,
      zscore: Math.abs(piece["Z Score"]), // Using absolute value since we want positive sizes
      zlabel: showCategory 
        ? piece.highLevelCategory + `\nZ: ${piece["Z Score"].toFixed(2)}`
        : piece.Dimensions + `\nZ: ${piece["Z Score"].toFixed(2)}`,
    }));
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
            onChange={() => {
              setShowNotches(false);
              setIsGender(isGender === "female" ? "male" : "female");
            }}
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

      <div className="notches-switch-container">
        <span
          className={`notches-label ${!showNotches ? "active" : ""}`}
          // onClick={() => setShowNotches(false)}
        >
          Hide Notches
        </span>
        <label className="switch z-50">
          <input
            type="checkbox"
            checked={showNotches}
            onChange={() => setShowNotches((prev) => !prev)}
          />
          <span className="slider round"></span>
        </label>
        <span
          className={`notches-label ${showNotches ? "active" : ""}`}
          // onClick={() => setShowNotches(true)}
        >
          Show Notches
        </span>
      </div>

      <div className="relative">
        <div
          className={`overlay-container w-[900px] mx-auto ${
            isGender === "female" ? "mt-10" : "-mt-10"
          }`}
        >
          {isGender === "female" ? (
            <>
              <DynamicPackeryGrid
                data={transformDataForMasonry()}
                notches={showNotches}
              />
              <img src="1.svg" alt="overlay" className="overlay-svg" />
            </>
          ) : (
            <>
              <DynamicPackeryGrid2
                data={transformDataForMasonry()}
                notches={showNotches}
              />
              <img src="2.svg" alt="overlay" className="overlay-svg -mt-15" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(SvgIcon);

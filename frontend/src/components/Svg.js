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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editableMappings, setEditableMappings] = useState({
    female: {
      dimensions: {},
      categories: {}
    },
    male: {
      dimensions: {},
      categories: {}
    }
  });
  const [originalMappings, setOriginalMappings] = useState({
    female: {
      dimensions: {},
      categories: {}
    },
    male: {
      dimensions: {},
      categories: {}
    }
  });

  // Initialize mappings when processedData changes
  React.useEffect(() => {
    if (processedData) {
      const newMappings = {
        female: {
          dimensions: {},
          categories: {}
        },
        male: {
          dimensions: {},
          categories: {}
        }
      };

      processedData.forEach(piece => {
        // Initialize for both genders
        ['female', 'male'].forEach(gender => {
          newMappings[gender].dimensions[piece.Dimensions] = piece.Dimensions;
          newMappings[gender].categories[piece.highLevelCategory] = piece.highLevelCategory;
        });
      });

      setEditableMappings(newMappings);
      setOriginalMappings(newMappings);
    }
  }, [processedData]);

  const handleLabelEdit = (gender, type, originalLabel, newLabel) => {
    setEditableMappings(prev => ({
      ...prev,
      [gender]: {
        ...prev[gender],
        [type]: {
          ...prev[gender][type],
          [originalLabel]: newLabel
        }
      }
    }));
  };

  const handleReset = () => {
    setEditableMappings(originalMappings);
  };

  const transformDataForMasonry = () => {
    if (!processedData) return [];

    return processedData.map((piece) => ({
      label: piece.Dimensions,
      category: piece.highLevelCategory,
      zscore: Math.abs(piece["Z Score"]),
      zlabel: showCategory 
        ? (editableMappings[isGender].categories[piece.highLevelCategory] || piece.highLevelCategory) + `\nZ: ${piece["Z Score"].toFixed(2)}`
        : (editableMappings[isGender].dimensions[piece.Dimensions] || piece.Dimensions) + `\nZ: ${piece["Z Score"].toFixed(2)}`,
    }));
  };

  return (
    <div className="mindmap-container">
      <div className="gender-switch-container" style={{ marginTop: "25px" }}>
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

      <button
        className="edit-labels-button"
        onClick={() => setIsModalOpen(true)}
      >
        Edit Labels
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Labels</h2>
              <div className="modal-actions">
                <button 
                  className="reset-button"
                  onClick={handleReset}
                >
                  Reset All
                </button>
                <button 
                  className="close-button"
                  onClick={() => setIsModalOpen(false)}
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="modal-body">
              <div className="gender-tabs">
                <button 
                  className={isGender === 'female' ? 'active' : ''}
                  onClick={() => setIsGender('female')}
                >
                  Female
                </button>
                <button 
                  className={isGender === 'male' ? 'active' : ''}
                  onClick={() => setIsGender('male')}
                >
                  Male
                </button>
              </div>

              <div className="labels-section">
                <h3>{showCategory ? 'Categories' : 'Dimensions'}</h3>
                <div className="labels-grid">
                  {Object.entries(showCategory ? 
                    editableMappings[isGender].categories : 
                    editableMappings[isGender].dimensions
                  ).map(([original, current]) => (
                    <div key={original} className="label-item">
                      <span>{original}</span>
                      <input
                        type="text"
                        value={current}
                        onChange={(e) => handleLabelEdit(
                          isGender,
                          showCategory ? 'categories' : 'dimensions',
                          original,
                          e.target.value
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

import * as React from "react";
import { useState } from "react";
import "./svg.css";
import Female from "./female";
import Male from "./male";

const SvgIcon = ({ processedData, ...props }) => {
  const [isGender, setIsGender] = useState("female");
  const [showCategory, setShowCategory] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editableMappings, setEditableMappings] = useState({
    female: {
      dimensions: {},
      categories: {},
    },
    male: {
      dimensions: {},
      categories: {},
    },
  });
  const [originalMappings, setOriginalMappings] = useState({
    female: {
      dimensions: {},
      categories: {},
    },
    male: {
      dimensions: {},
      categories: {},
    },
  });

  // Initialize mappings when processedData changes
  React.useEffect(() => {
    if (processedData) {
      const newMappings = {
        female: {
          dimensions: {},
          categories: {},
        },
        male: {
          dimensions: {},
          categories: {},
        },
      };

      processedData.forEach((piece) => {
        // Initialize for both genders
        ["female", "male"].forEach((gender) => {
          // Store the original dimension name as key and the same as value initially
          if (piece.Dimensions) {
            newMappings[gender].dimensions[piece.Dimensions] = piece.Dimensions;
          }

          // Store the original category name as key and the same as value initially
          if (piece.highLevelCategory) {
            newMappings[gender].categories[piece.highLevelCategory] =
              piece.highLevelCategory;
          }
        });
      });

      setEditableMappings(newMappings);
      setOriginalMappings(JSON.parse(JSON.stringify(newMappings))); // Deep copy
    }
  }, [processedData]);

  const handleLabelEdit = (gender, type, originalLabel, newLabel) => {
    setEditableMappings((prev) => ({
      ...prev,
      [gender]: {
        ...prev[gender],
        [type]: {
          ...prev[gender][type],
          [originalLabel]: newLabel,
        },
      },
    }));
  };

  const handleReset = () => {
    setEditableMappings(originalMappings);
  };

  const handleSave = (format) => {
    const container = document.querySelector(".overlay-container");
    if (!container) return;

    // Implementation will depend on your requirements
    // Here's a basic example using html2canvas
    import("html2canvas").then(({ default: html2canvas }) => {
      html2canvas(container).then((canvas) => {
        const link = document.createElement("a");

        switch (format) {
          case "png":
            link.download = `mindmap-${isGender}-${Date.now()}.png`;
            link.href = canvas.toDataURL("image/png");
            break;
          case "jpeg":
            link.download = `mindmap-${isGender}-${Date.now()}.jpeg`;
            link.href = canvas.toDataURL("image/jpeg");
            break;
          case "pdf":
            import("jspdf").then(({ default: jsPDF }) => {
              const pdf = new jsPDF();
              const imgData = canvas.toDataURL("image/png");
              const pdfWidth = pdf.internal.pageSize.getWidth();
              const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
              pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
              pdf.save(`mindmap-${isGender}-${Date.now()}.pdf`);
            });
            return;
          default:
            return;
        }

        link.click();
      });
    });
  };

  // Sort and get top dimensions (up to 12)
  const getTopDimensions = () => {
    if (!processedData || !Array.isArray(processedData) || processedData.length === 0) return [];

    return processedData
      .sort((a, b) => Math.abs(b["Z Score"]) - Math.abs(a["Z Score"])) // Sort by absolute Z Score in descending order
      .slice(0, 12); // Get top dimensions (up to 12)
  };

  // Create mapping object for SVG labels
  const createSvgMapping = (topDimensions) => {
    const mapping = {};

    // Initialize all positions with empty strings
    for (let i = 1; i <= 12; i++) {
      mapping[`D${i}`] = "";
      mapping[`(d = ${i}.0)`] = "";
    }

    // Fill in available dimensions
    topDimensions.forEach((dim, index) => {
      // Start filling from the highest position (D12) downward
      // This ensures the highest value goes to D12, next to D11, etc.
      const position = 12 - index;
      
      // Skip if we've gone below D1
      if (position < 1) return;

      // Use the edited label if available, otherwise use the original
      const dimensionKey = dim.Dimensions;
      const categoryKey = dim.highLevelCategory;

      if (showCategory) {
        // Use category mapping
        const displayLabel =
          editableMappings[isGender].categories[categoryKey] || categoryKey;
        mapping[`D${position}`] = displayLabel;
      } else {
        // Use dimension mapping
        const displayLabel =
          editableMappings[isGender].dimensions[dimensionKey] || dimensionKey;
        mapping[`D${position}`] = displayLabel;
      }

      // Use Z Score instead of Score, check if it exists
      const zScore = dim["Z Score"];
      mapping[`(d = ${position}.0)`] =
        typeof zScore === "number" ? zScore.toFixed(1) : "N/A";
    });

    return mapping;
  };

  // Render the female SVG with mapped data
  const renderFemaleComponent = () => {
    const topDimensions = getTopDimensions();
    const svgMapping = createSvgMapping(topDimensions);

    return <Female textMapping={svgMapping} {...props} />;
  };

  const renderMaleComponent = () => {
    const topDimensions = getTopDimensions();
    const svgMapping = createSvgMapping(topDimensions);

    return <Male textMapping={svgMapping} {...props} />;
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
                <button className="reset-button" onClick={handleReset}>
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
              {/*  <div className="gender-tabs">
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
              </div> */}

              <div className="labels-section">
                <h3>{showCategory ? "Categories" : "Dimensions"}</h3>
                {/* <div className="type-tabs">
                  <button
                    className={!showCategory ? 'active' : ''}
                    onClick={() => setShowCategory(false)}
                  >
                    Dimensions
                  </button>
                  <button
                    className={showCategory ? 'active' : ''}
                    onClick={() => setShowCategory(true)}
                  >
                    Categories
                  </button>
                </div> */}
                <div className="labels-grid">
                  {Object.entries(
                    showCategory
                      ? editableMappings[isGender].categories
                      : editableMappings[isGender].dimensions
                  ).map(([original, current]) => (
                    <div key={original} className="label-item">
                      <span className="original-label">{original}</span>
                      <input
                        type="text"
                        value={current}
                        onChange={(e) =>
                          handleLabelEdit(
                            isGender,
                            showCategory ? "categories" : "dimensions",
                            original,
                            e.target.value
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative capture-container">
        <div
          className={`overlay-container w-[900px] mx-auto ${
            isGender === "female" ? "mt-20 mb-6" : "mt-32 mb-12"
          }`}
        >
          {isGender === "female"
            ? renderFemaleComponent()
            : renderMaleComponent()}
        </div>
      </div>

      <div className="save-buttons-container flex gap-3 mt-4">
        <button
          className="save-button bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all duration-200 hover:shadow-lg"
          onClick={() => handleSave("png")}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          PNG
        </button>

        <button
          className="save-button bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all duration-200 hover:shadow-lg"
          onClick={() => handleSave("jpeg")}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          JPEG
        </button>

        <button
          className="save-button bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all duration-200 hover:shadow-lg"
          onClick={() => handleSave("pdf")}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          PDF
        </button>
      </div>
    </div>
  );
};

export default React.memo(SvgIcon);

import * as React from "react";
import { useState } from "react";
import DynamicMasonryGrid from "./DynamicMasonryGrid";
import DynamicPackeryGrid from "./DynamicPackeryGrid";
import DynamicPackeryGrid2 from "./DynamicPackeryGrid2";
import "./svg.css";
import Female from './female';

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

  const handleSave = (format) => {
    const container = document.querySelector('.overlay-container');
    if (!container) return;

    // Implementation will depend on your requirements
    // Here's a basic example using html2canvas
    import('html2canvas').then(({ default: html2canvas }) => {
      html2canvas(container).then((canvas) => {
        const link = document.createElement('a');
        
        switch(format) {
          case 'png':
            link.download = `mindmap-${isGender}-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            break;
          case 'jpeg':
            link.download = `mindmap-${isGender}-${Date.now()}.jpeg`;
            link.href = canvas.toDataURL('image/jpeg');
            break;
          case 'pdf':
            import('jspdf').then(({ default: jsPDF }) => {
              const pdf = new jsPDF();
              const imgData = canvas.toDataURL('image/png');
              const pdfWidth = pdf.internal.pageSize.getWidth();
              const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
              pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
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

  // Sort and get top 12 dimensions with their scores
  const getTopDimensions = () => {
    if (!processedData) return [];
    
    return processedData
      .sort((a, b) => b.Score - a.Score) // Sort by Score in descending order
      .slice(0, 12); // Get top 12 dimensions
  };

  // Create mapping object for SVG labels
  const createSvgMapping = (topDimensions) => {
    const mapping = {};
    
    topDimensions.forEach((dim, index) => {
      const position = 12 - index; // Convert to D12 to D1 format
      mapping[`D${position}`] = dim.Dimensions;
      mapping[`(d = ${position}.0)`] = dim.Score.toFixed(1);
    });

    return mapping;
  };

  // Render the female SVG with mapped data
  const renderFemaleComponent = () => {
    const topDimensions = getTopDimensions();
    const svgMapping = createSvgMapping(topDimensions);
    
    return (
      <>
        <DynamicPackeryGrid
          data={transformDataForMasonry()}
          notches={showNotches}
        />
        <Female 
          textMapping={svgMapping}
          {...props}
        />
      </>
    );
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

      <div className="relative capture-container">
        <div
          className={`overlay-container w-[900px] mx-auto ${
            isGender === "female" ? "mt-10" : "-mt-10"
          }`}
        >
          {isGender === "female" ? renderFemaleComponent() : (
            <div>
              <h1>Male</h1>
            </div>
          )}
        </div>
      </div>

      <div className="save-buttons-container flex gap-3 mt-4">
  <button 
    className="save-button bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all duration-200 hover:shadow-lg"
    onClick={() => handleSave('png')}
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    PNG
  </button>
  
  <button 
    className="save-button bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all duration-200 hover:shadow-lg"
    onClick={() => handleSave('jpeg')}
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
    JPEG
  </button>
  
  <button 
    className="save-button bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all duration-200 hover:shadow-lg"
    onClick={() => handleSave('pdf')}
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
    PDF
  </button>
</div>

    </div>
  );
};

export default React.memo(SvgIcon);

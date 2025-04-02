import React, { useState, useEffect, useRef } from "react";
import "./ReportViewer.css";

const ReportViewer = ({ reportPages, setUpdatedReportPages, language }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [dropdownValues, setDropdownValues] = useState({});
  const [showFloatingWindow, setShowFloatingWindow] = useState(false);
  const iframeRef = useRef(null);
  const previousReportPagesRef = useRef([]);

  const translations = {
    en: {
      previous: "Previous",
      next: "Next",
      save: "Save",
      close: "Close",
      savedValues: "Saved Values",
      noReport: "No report available. Please generate one.",
      page: "Page",
      of: "of"
    },
    si: {
      previous: "පෙර",
      next: "පසුව",
      save: "සුරකින්න",
      close: "වසන්න",
      savedValues: "සුරකින ලද අගයන්",
      noReport: "වාර්තාවක් නොමැත. කරුණාකර වාර්තාවක් ජනනය කරන්න.",
      page: "පිටුව",
      of: "න්"
    },
    ta: {
      previous: "முந்தையது",
      next: "அடுத்தது",
      save: "சேமிக்கவும்",
      close: "மூடு",
      savedValues: "சேமிக்கப்பட்ட மதிப்புகள்",
      noReport: "அறிக்கை கிடைக்கவில்லை. தயவுசெய்து ஒன்றை உருவாக்கவும்.",
      page: "பக்கம்",
      of: "இல்"
    }
  };

  const t = translations[language] || translations["en"];

  useEffect(() => {
    if (JSON.stringify(previousReportPagesRef.current) !== JSON.stringify(reportPages)) {
      setDropdownValues({});
      localStorage.removeItem("EditableValues");
      previousReportPagesRef.current = reportPages;
    }
    setCurrentPage(0);
  }, [reportPages]);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.onload = () => {
        restoreEditableValues();
      };
    }
  }, [currentPage]);

  const generateAerData = () => {
    const savedValues = JSON.parse(localStorage.getItem("EditableValues")) || {};
    const aerData = [];

    const aerCodes = Object.keys(savedValues)
      .filter((key) => key.startsWith("S AER ") || key.startsWith("R AER "))
      .map((key) => key.split(" ")[2])
      .filter((value, index, self) => self.indexOf(value) === index);

    aerCodes.forEach((code, index) => {
      const seasonalRainfall = savedValues[`S AER ${code}`] || "N/A";
      const receivedRainfall = savedValues[`R AER ${code}`] || "N/A";

      const ranges = [];
      for (let i = 1; i <= 5; i++) {
        const key = `AER${index + 1}-mtwa-range${i}`;
        ranges.push(savedValues[key] === "Checked" ? "Checked" : "Unchecked");
      }

      aerData.push({
        aerCode: code,
        seasonalRainfall,
        receivedRainfall,
        ranges,
      });
    });

    return aerData;
  };

  const handleCaptureEditableValues = () => {
    if (iframeRef.current) {
      const iframeDocument = iframeRef.current.contentDocument;
      if (iframeDocument) {
        const dropdowns = iframeDocument.querySelectorAll("select[id^='S AER'], select[id^='R AER']");
        const checkboxes = iframeDocument.querySelectorAll("input[type='checkbox']");

        const newValues = {};

        dropdowns.forEach((dropdown) => {
          newValues[dropdown.id] = dropdown.value;
        });

        checkboxes.forEach((checkbox) => {
          newValues[checkbox.id] = checkbox.checked ? "Checked" : "Unchecked";
        });

        setDropdownValues((prevValues) => ({
          ...prevValues,
          ...newValues,
        }));

        localStorage.setItem("EditableValues", JSON.stringify(newValues));

        setUpdatedReportPages((prevPages) => {
          const updatedPages = [...prevPages];
          updatedPages[currentPage] = iframeDocument.documentElement.outerHTML;
          return updatedPages;
        });

        setShowFloatingWindow(true);
      }
    }
  };

  const restoreEditableValues = () => {
    const savedValues = JSON.parse(localStorage.getItem("EditableValues")) || {};
    if (iframeRef.current) {
      const iframeDocument = iframeRef.current.contentDocument;
      if (iframeDocument) {
        Object.entries(savedValues).forEach(([id, value]) => {
          const element = iframeDocument.getElementById(id);
          if (element) {
            if (element.tagName === "SELECT") {
              element.value = value;
            } else if (element.type === "checkbox") {
              element.checked = value === "Checked";
            }
          }
        });
      }
    }
  };

  return (
    <div className="report-viewer-container">
      {reportPages.length > 0 ? (
        <>
          <iframe
            ref={iframeRef}
            title="Report Viewer"
            srcDoc={reportPages[currentPage]}
            className="iframe"
          />
          <div className="pagination-controls">
            <button
              className="pagination-button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
            >
              {t.previous}
            </button>
            <span className="page-indicator">
              {t.page} {currentPage + 1} {t.of} {reportPages.length}
            </span>
            <button
              className="save-button"
              onClick={() => {
                handleCaptureEditableValues();
                const aerData = generateAerData();
                console.log("AER Data:", aerData);
              }}
            >
              {t.save}
            </button>
            <button
              className="pagination-button"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, reportPages.length - 1))}
              disabled={currentPage === reportPages.length - 1}
            >
              {t.next}
            </button>
          </div>

          {showFloatingWindow && (
            <div className="floating-window">
              <div className="floating-content">
                <h3>{t.savedValues}</h3>
                <ul>
                  {Object.entries(dropdownValues).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}:</strong> {value}
                    </li>
                  ))}
                </ul>
                <button
                  className="close-floating-button"
                  onClick={() => setShowFloatingWindow(false)}
                >
                  {t.close}
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <p>{t.noReport}</p>
      )}
    </div>
  );
};

export default ReportViewer;

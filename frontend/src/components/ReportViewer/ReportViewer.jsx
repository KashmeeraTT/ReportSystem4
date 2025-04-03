import React, { useState, useEffect, useRef } from "react";
import "./ReportViewer.css";

const ReportViewer = ({ reportPages, setUpdatedReportPages, language }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1); // zoom level
  const iframeRef = useRef(null);
  const previousReportPagesRef = useRef([]);

  const translations = {
    en: {
      previous: "Previous",
      next: "Next",
      noReport: "No report available. Please generate one.",
      page: "Page",
      of: "of",
      zoomIn: "Zoom In",
      zoomOut: "Zoom Out",
      reset: "Reset Zoom"
    },
    si: {
      previous: "පෙර",
      next: "පසුව",
      noReport: "වාර්තාවක් නොමැත. කරුණාකර වාර්තාවක් ජනනය කරන්න.",
      page: "පිටුව",
      of: "න්",
      zoomIn: "විශාල කරන්න",
      zoomOut: "කුඩා කරන්න",
      reset: "ප්‍රමාණය නැවත සකසන්න"
    },
    ta: {
      previous: "முந்தையது",
      next: "அடுத்தது",
      noReport: "அறிக்கை கிடைக்கவில்லை. தயவுசெய்து ஒன்றை உருவாக்கவும்.",
      page: "பக்கம்",
      of: "இல்",
      zoomIn: "பெரிதாக்கு",
      zoomOut: "சிறிதாக்கு",
      reset: "மீட்டமை"
    }
  };

  const t = translations[language] || translations.en;

  useEffect(() => {
    if (JSON.stringify(previousReportPagesRef.current) !== JSON.stringify(reportPages)) {
      previousReportPagesRef.current = reportPages;
    }
    setCurrentPage(0);
  }, [reportPages]);

  const zoomStyle = {
    transform: `scale(${zoom})`,
    transformOrigin: "top left",
    width: `${100 / zoom}%`,
    height: `${100 / zoom}%`
  };

  return (
    <div className="report-viewer-container">
      {reportPages.length > 0 ? (
        <>
          <div className="iframe-wrapper">
            <div className="iframe-zoomable" style={zoomStyle} dangerouslySetInnerHTML={{ __html: reportPages[currentPage] }} />
          </div>

          <div className="pagination-controls">
            <div className="zoom-controls">
              <button onClick={() => setZoom((z) => Math.min(z + 0.1, 2))}>{t.zoomIn}</button>
              <button onClick={() => setZoom((z) => Math.max(z - 0.1, 0.5))}>{t.zoomOut}</button>
              <button onClick={() => setZoom(1)}>{t.reset}</button>
            </div>

            <div className="page-nav">
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
                className="pagination-button"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, reportPages.length - 1))}
                disabled={currentPage === reportPages.length - 1}
              >
                {t.next}
              </button>
            </div>
          </div>
        </>
      ) : (
        <p className="no-report-text">{t.noReport}</p>
      )}
    </div>
  );
};

export default ReportViewer;

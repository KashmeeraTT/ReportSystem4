import React, { useState, useEffect, useRef } from "react";
import "./ReportViewer.css";

const ReportViewer = ({ reportPages, setUpdatedReportPages, language }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const iframeRef = useRef(null);
  const previousReportPagesRef = useRef([]);

  const translations = {
    en: {
      previous: "Previous",
      next: "Next",
      noReport: "No report available. Please generate one.",
      page: "Page",
      of: "of"
    },
    si: {
      previous: "පෙර",
      next: "පසුව",
      noReport: "වාර්තාවක් නොමැත. කරුණාකර වාර්තාවක් ජනනය කරන්න.",
      page: "පිටුව",
      of: "න්"
    },
    ta: {
      previous: "முந்தையது",
      next: "அடுத்தது",
      noReport: "அறிக்கை கிடைக்கவில்லை. தயவுசெய்து ஒன்றை உருவாக்கவும்.",
      page: "பக்கம்",
      of: "இல்"
    }
  };

  const t = translations[language] || translations["en"];

  useEffect(() => {
    if (JSON.stringify(previousReportPagesRef.current) !== JSON.stringify(reportPages)) {
      previousReportPagesRef.current = reportPages;
    }
    setCurrentPage(0);
  }, [reportPages]);

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
              className="pagination-button"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, reportPages.length - 1))}
              disabled={currentPage === reportPages.length - 1}
            >
              {t.next}
            </button>
          </div>
        </>
      ) : (
        <p>{t.noReport}</p>
      )}
    </div>
  );
};

export default ReportViewer;

import React, { useState, useEffect } from "react";
import "./ReportViewer.css";

const ReportViewer = ({ reportPages }) => {
    const [currentPage, setCurrentPage] = useState(0);

    // Reset page counter when new reportPages are received
    useEffect(() => {
        setCurrentPage(0); // Reset to the first page whenever reportPages change
    }, [reportPages]);

    // Navigate to the next page
    const handleNext = () => {
        if (currentPage < reportPages.length - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Navigate to the previous page
    const handlePrevious = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="report-container">
            {reportPages.length > 0 ? (
                <>
                    <iframe
                        title="Report Viewer"
                        srcDoc={reportPages[currentPage]}
                        className="iframe"
                    />
                    <div className="pagination-controls">
                        <button
                            className="pagination-button"
                            onClick={handlePrevious}
                            disabled={currentPage === 0}
                        >
                            Previous
                        </button>
                        <span>Page {currentPage + 1} of {reportPages.length}</span>
                        <button
                            className="pagination-button"
                            onClick={handleNext}
                            disabled={currentPage === reportPages.length - 1}
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <p>No report available. Please generate one.</p>
            )}
        </div>
    );
};

export default ReportViewer;

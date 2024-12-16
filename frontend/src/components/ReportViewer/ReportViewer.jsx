import React, { useState, useEffect } from "react";
import "./ReportViewer.css";

const ReportViewer = ({ reportPages }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [dropdownValues, setDropdownValues] = useState({});
    const [showFloatingWindow, setShowFloatingWindow] = useState(false);

    // Reset page counter when new reportPages are received
    useEffect(() => {
        setCurrentPage(0); // Reset to the first page whenever reportPages change
    }, [reportPages]);

    // Capture dropdown values dynamically
    const handleCaptureDropdownValues = () => {
        const dropdowns = document.querySelectorAll("select[id^='AER']");
        const capturedValues = {};
        dropdowns.forEach((dropdown) => {
            const id = dropdown.id; // Get dropdown ID
            const value = dropdown.value; // Get dropdown value
            capturedValues[id] = value; // Save to the object
        });
        setDropdownValues(capturedValues); // Update state
        setShowFloatingWindow(true); // Show the floating window
    };

    // Close the floating window
    const handleCloseFloatingWindow = () => {
        setShowFloatingWindow(false);
    };

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
                        <button
                            className="capture-dropdown-button"
                            onClick={handleCaptureDropdownValues}
                            style={{
                                marginLeft: "10px",
                                padding: "5px 10px",
                                cursor: "pointer",
                            }}
                        >
                            Capture Dropdown Values
                        </button>
                    </div>

                    {showFloatingWindow && (
                        <div className="floating-window">
                            <div className="floating-content">
                                <h3>Dropdown Values</h3>
                                <ul>
                                    {Object.entries(dropdownValues).map(([key, value]) => (
                                        <li key={key}>
                                            <strong>{key}:</strong> {value}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    className="close-floating-button"
                                    onClick={handleCloseFloatingWindow}
                                    style={{
                                        padding: "5px 10px",
                                        marginTop: "10px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <p>No report available. Please generate one.</p>
            )}
        </div>
    );
};

export default ReportViewer;

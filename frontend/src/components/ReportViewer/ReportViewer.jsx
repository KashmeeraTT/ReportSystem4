import React, { useState, useEffect } from "react";
import "./ReportViewer.css";

const ReportViewer = ({ reportPages }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [dropdownValues, setDropdownValues] = useState({});
    const [showFloatingWindow, setShowFloatingWindow] = useState(false);

    useEffect(() => {
        setCurrentPage(0); // Reset to the first page whenever reportPages change
    }, [reportPages]);

    // Restore dropdown values on page load
    useEffect(() => {
        restoreDropdownValues();
    }, [currentPage]);

    const restoreDropdownValues = () => {
        const savedValues = JSON.parse(localStorage.getItem("DropdownValues")) || {};
        Object.entries(savedValues).forEach(([id, value]) => {
            const dropdown = document.getElementById(id);
            if (dropdown) {
                dropdown.value = value; // Restore the saved value
            }
        });
    };

    const handleCaptureDropdownValues = () => {
        const dropdowns = document.querySelectorAll("select[id^='AER']");
        const capturedValues = {};

        dropdowns.forEach((dropdown) => {
            const id = dropdown.id;
            const value = dropdown.value;
            capturedValues[id] = value;
        });

        setDropdownValues(capturedValues);
        localStorage.setItem("DropdownValues", JSON.stringify(capturedValues));
        setShowFloatingWindow(true);
    };

    const handleCloseFloatingWindow = () => {
        setShowFloatingWindow(false);
    };

    const handleNext = () => {
        if (currentPage < reportPages.length - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

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

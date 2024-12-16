import React, { useState, useEffect, useRef } from "react";
import "./ReportViewer.css";

const ReportViewer = ({ reportPages, setUpdatedReportPages }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [dropdownValues, setDropdownValues] = useState({});
    const [showFloatingWindow, setShowFloatingWindow] = useState(false);
    const iframeRef = useRef(null); // Reference to the iframe element
    const previousReportPagesRef = useRef([]); // Track previous reportPages

    // Reset dropdownValues only when reportPages change
    useEffect(() => {
        if (JSON.stringify(previousReportPagesRef.current) !== JSON.stringify(reportPages)) {
            // Clear dropdown storage and update previousReportPagesRef
            setDropdownValues({});
            localStorage.removeItem("DropdownValues");
            previousReportPagesRef.current = reportPages;
        }
        setCurrentPage(0); // Reset to the first page when reportPages change
    }, [reportPages]);

    // Restore dropdown values when the iframe loads
    useEffect(() => {
        if (iframeRef.current) {
            iframeRef.current.onload = () => {
                restoreDropdownValues();
            };
        }
    }, [currentPage]);

    const handleCaptureDropdownValues = () => {
        if (iframeRef.current) {
            const iframeDocument = iframeRef.current.contentDocument;
            if (iframeDocument) {
                const dropdowns = iframeDocument.querySelectorAll("select[id^='AER']");
                const newValues = {};
                dropdowns.forEach((dropdown) => {
                    newValues[dropdown.id] = dropdown.value; // Capture the current dropdown value
                });

                // Merge new values with existing values (no removal of old data)
                setDropdownValues((prevValues) => ({
                    ...prevValues,
                    ...newValues,
                }));

                // Save the updated dropdownValues to localStorage
                const mergedValues = { ...dropdownValues, ...newValues };
                localStorage.setItem("DropdownValues", JSON.stringify(mergedValues));

                // Update the current page in the updated report
                setUpdatedReportPages((prevPages) => {
                    const updatedPages = [...prevPages];
                    updatedPages[currentPage] = iframeDocument.documentElement.outerHTML;
                    return updatedPages;
                });

                setShowFloatingWindow(true);
            } else {
                console.error("Could not access iframe document.");
            }
        }
    };

    const restoreDropdownValues = () => {
        const savedValues = JSON.parse(localStorage.getItem("DropdownValues")) || {};
        if (iframeRef.current) {
            const iframeDocument = iframeRef.current.contentDocument;
            if (iframeDocument) {
                Object.entries(savedValues).forEach(([id, value]) => {
                    const dropdown = iframeDocument.getElementById(id);
                    if (dropdown) {
                        dropdown.value = value;
                    }
                });
            }
        }
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
                        ref={iframeRef}
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

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
                restoreEditableValues();
            };
        }
    }, [currentPage]);

    const handleCaptureEditableValues = () => {
        if (iframeRef.current) {
            const iframeDocument = iframeRef.current.contentDocument;
            if (iframeDocument) {
                const dropdowns = iframeDocument.querySelectorAll("select[id^='AER']");
                const checkboxes = iframeDocument.querySelectorAll("input[type='checkbox']");
    
                const newValues = {};
    
                // Capture dropdown values
                dropdowns.forEach((dropdown) => {
                    newValues[dropdown.id] = dropdown.value;
                });
    
                // Capture checkbox states
                checkboxes.forEach((checkbox) => {
                    newValues[checkbox.id] = checkbox.checked; // true or false
                });
    
                // Merge new values with existing ones
                setDropdownValues((prevValues) => ({
                    ...prevValues,
                    ...newValues,
                }));
    
                // Save to localStorage
                const mergedValues = { ...dropdownValues, ...newValues };
                localStorage.setItem("EditableValues", JSON.stringify(mergedValues));
    
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
    

    const restoreEditableValues = () => {
        const savedValues = JSON.parse(localStorage.getItem("EditableValues")) || {};
        if (iframeRef.current) {
            const iframeDocument = iframeRef.current.contentDocument;
            if (iframeDocument) {
                // Restore dropdown values
                Object.entries(savedValues).forEach(([id, value]) => {
                    const dropdown = iframeDocument.getElementById(id);
                    if (dropdown) {
                        dropdown.value = value;
                    }
                    // Restore checkbox states
                    const checkbox = iframeDocument.getElementById(id);
                    if (checkbox && checkbox.type === "checkbox") {
                        checkbox.checked = value;
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
                            className="save-button"
                            onClick={handleCaptureEditableValues}
                        >
                            Save
                        </button>
                    </div>

                    {showFloatingWindow && (
                        <div className="floating-window">
                            <div className="floating-content">
                                <h3>Saved Values</h3>
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

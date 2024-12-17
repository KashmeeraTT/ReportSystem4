import React, { useState, useEffect, useRef } from "react";
import "./ReportViewer.css";

const ReportViewer = ({ reportPages, setUpdatedReportPages }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [dropdownValues, setDropdownValues] = useState({});
    const [showFloatingWindow, setShowFloatingWindow] = useState(false);
    const iframeRef = useRef(null);
    const previousReportPagesRef = useRef([]);

    // Reset values on new report pages
    useEffect(() => {
        if (JSON.stringify(previousReportPagesRef.current) !== JSON.stringify(reportPages)) {
            setDropdownValues({});
            localStorage.removeItem("EditableValues");
            previousReportPagesRef.current = reportPages;
        }
        setCurrentPage(0);
    }, [reportPages]);

    // Restore values when iframe loads
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
                const dropdowns = iframeDocument.querySelectorAll("select[id^='SAER'], select[id^='RAER']");
                const checkboxes = iframeDocument.querySelectorAll("input[type='checkbox']");

                const newValues = {};

                // Capture dropdown values
                dropdowns.forEach((dropdown) => {
                    newValues[dropdown.id] = dropdown.value;
                });

                // Capture checkbox states
                checkboxes.forEach((checkbox) => {
                    newValues[checkbox.id] = checkbox.checked ? "Checked" : "Unchecked";
                });

                // Merge and save values
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

    const handleCloseFloatingWindow = () => setShowFloatingWindow(false);
    const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, reportPages.length - 1));
    const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

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
                        <span className="page-indicator">
                            Page {currentPage + 1} of {reportPages.length}
                        </span>
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

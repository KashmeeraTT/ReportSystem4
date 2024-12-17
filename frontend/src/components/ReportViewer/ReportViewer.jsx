import React, { useState, useEffect, useRef } from "react";
import "./ReportViewer.css";
import generateAERSection from "../AERAdvisory/generateAERSection";

const ReportViewer = ({ htmlReport, setUpdatedReportPages, district }) => {
    const [updatedReportPages, setUpdatedReportPagesState] = useState([]); // Updated pages
    const [currentPage, setCurrentPage] = useState(0);
    const [dropdownValues, setDropdownValues] = useState({});
    const [showFloatingWindow, setShowFloatingWindow] = useState(false);
    const iframeRef = useRef(null);

    // Generate AER advisory and replace placeholder
    const processReportWithAdvisory = (originalReport) => {
        const aerData = generateAerData();
        const aerSectionHTML = generateAERSection(district, aerData);

        // Replace placeholder
        const updatedReport = originalReport.replace(
            `<div id="PART_B_PLACEHOLDER">This is a placeholder</div>`,
            aerSectionHTML
        );

        // Split report into pages
        const pages = updatedReport.split("<!-- PAGE BREAK -->");
        setUpdatedReportPagesState(pages);
    };

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

                setUpdatedReportPagesState((prevPages) => {
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
    const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, updatedReportPages.length - 1));
    const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

    // Process new htmlReport only when it changes
    useEffect(() => {
        if (htmlReport) {
            processReportWithAdvisory(htmlReport);
            setCurrentPage(0); // Reset to first page only when a new report arrives
        }
    }, [htmlReport]);

    useEffect(() => {
        if (iframeRef.current) {
            iframeRef.current.onload = () => restoreEditableValues();
        }
    }, [currentPage]);

    return (
        <div className="report-viewer-container">
            {updatedReportPages.length > 0 ? (
                <>
                    <iframe
                        ref={iframeRef}
                        title="Report Viewer"
                        srcDoc={updatedReportPages[currentPage]}
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
                            Page {currentPage + 1} of {updatedReportPages.length}
                        </span>
                        <button
                            className="save-button"
                            onClick={() => {
                                handleCaptureEditableValues();
                                console.log("AER Data:", generateAerData());
                            }}
                        >
                            Save
                        </button>
                        <button
                            className="pagination-button"
                            onClick={handleNext}
                            disabled={currentPage === updatedReportPages.length - 1}
                        >
                            Next
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

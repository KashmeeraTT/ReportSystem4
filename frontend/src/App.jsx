import React, { useState } from "react";
import Form from "./components/Form/Form";
import ReportViewer from "./components/ReportViewer/ReportViewer";
import "./styles/global.css";
import API_BASE_URL from "./config";

function App() {
  const [reportPages, setReportPages] = useState([]); // Store generated report pages
  const [isEditable, setIsEditable] = useState(true); // Determine if form fields are editable
  const [isGenerating, setIsGenerating] = useState(false); // State for generating reports
  const [isDownloading, setIsDownloading] = useState(false); // State for downloading reports
  const [error, setError] = useState(""); // Error state

  // Function to handle report generation
  const generateReport = async (formData) => {
    setIsGenerating(true); // Show loading animation for generating
    setError(""); // Reset any previous error
    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate report");
      }

      const htmlReport = await response.text();
      const pages = htmlReport.split("<!-- PAGE BREAK -->"); // Split report into pages
      setReportPages(pages); // Update the report pages state
      setIsEditable(false); // Disable the form fields
    } catch (error) {
      console.error(error.message);
      setError("Failed to fetch report. Please try again."); // Set error message
    } finally {
      setIsGenerating(false); // Hide loading animation for generating
    }
  };

  // Function to handle report downloading
  const downloadReport = () => {
    if (reportPages.length === 0) {
      setError("No report available to download.");
      return;
    }

    setIsDownloading(true); // Start download animation
    try {
      const blob = new Blob([reportPages.join("\n")], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "report.html";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error.message);
      setError("Failed to download report.");
    } finally {
      setIsDownloading(false); // End download animation
    }
  };

  return (
    <div className="container">
      {/* Loading Overlay */}
      {(isGenerating || isDownloading) && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>
            {isGenerating ? "Generating report..." : isDownloading ? "Downloading report..." : ""}
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Form Section */}
      <Form
        onGenerateReport={generateReport}
        isEditable={isEditable}
        setReportPages={setReportPages}
        setIsEditable={setIsEditable}
        reportPages={reportPages}
        onDownload={downloadReport}
      />

      {/* Report Viewer Section */}
      <ReportViewer reportPages={reportPages} />
    </div>
  );
}

export default App;

import React, { useState } from "react";
import Form from "./components/Form/Form";
import ReportViewer from "./components/ReportViewer/ReportViewer";
import "./styles/global.css";
import API_BASE_URL from "./config";
import { SpeedInsights } from "@vercel/speed-insights/react";

function App() {
  const [reportPages, setReportPages] = useState([]);
  const [updatedReportPages, setUpdatedReportPages] = useState([]);
  const [isEditable, setIsEditable] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState(null); // null = no language selected yet

  const generateReport = async (formData) => {
    setIsFetching(true);
    setError("");
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
      const pages = htmlReport.split("<!-- PAGE BREAK -->");
      setReportPages(pages);
      setUpdatedReportPages([...pages]);
      setIsEditable(false);
    } catch (error) {
      console.error(error.message);
      setError("Failed to fetch report. Please try again.");
    } finally {
      setIsFetching(false);
    }
  };

  // Render landing page if language is not yet selected
  if (!language) {
    return (
      <div className="landing-page">
        <h2>Select Language</h2>
        <div className="language-buttons">
          <button onClick={() => setLanguage("en")}>English</button>
          <button onClick={() => setLanguage("si")}>සිංහල</button>
          <button onClick={() => setLanguage("ta")}>தமிழ்</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {isFetching && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
      {error && <div className="error-message">{error}</div>}

      <div className="form-container">
        <Form
          onGenerateReport={generateReport}
          isEditable={isEditable}
          setReportPages={setReportPages}
          setIsEditable={setIsEditable}
          updatedReportPages={updatedReportPages}
          language={language} // optional: pass language to Form
        />
      </div>

      <div className="report-viewer-container">
        <ReportViewer
          reportPages={reportPages}
          setUpdatedReportPages={setUpdatedReportPages}
          language={language} // optional: pass language to Viewer
        />
      </div>

      <SpeedInsights />
    </div>
  );
}

export default App;

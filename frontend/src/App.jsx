import React, { useState, useEffect } from "react";
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
  const [language, setLanguage] = useState(null);

  // Load language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("appLanguage");
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

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

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    const confirmChange = window.confirm("Changing the language will reset the form. Continue?");
    if (confirmChange) {
      localStorage.setItem("appLanguage", newLang);
      setLanguage(newLang);
      setReportPages([]);
      setUpdatedReportPages([]);
      setIsEditable(true);
    }
  };

  // Show landing page if no language is selected yet
  if (!language) {
    return (
      <div className="landing-page">
        <div className="landing-content">
          <h1 className="main-title">
            District Agro-met Advisory Co-production<br />Software Application
          </h1>
          <h2 className="sub-title">
            දිස්ත්‍රික් කෘෂි-කාලගුණික උපදේශන සමසම්පාදනය<br />සදහා වන මෘදුකාංග යෙදුම
          </h2>
          <h2 className="sub-title">
            மாவட்ட வேளாண் வானிலை ஆலோசனையின் ஒருங்கிணைப்பு<br />பொருந்தக்கூடிய மென்பொருள் பயன்பாடு
          </h2>
          <div className="language-buttons">
            <button onClick={() => {
              setLanguage("en");
              localStorage.setItem("appLanguage", "en");
            }}>English</button>
            <button onClick={() => {
              setLanguage("si");
              localStorage.setItem("appLanguage", "si");
            }}>සිංහල</button>
            <button onClick={() => {
              setLanguage("ta");
              localStorage.setItem("appLanguage", "ta");
            }}>தமிழ்</button>
          </div>
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
          language={language}
        />

        {/* Language selector moved to bottom of form */}
        <div className="language-switcher-container">
          <select
            className="language-selector"
            value={language}
            onChange={handleLanguageChange}
          >
            <option value="en">🌐 English</option>
            <option value="si">🌐 සිංහල</option>
            <option value="ta">🌐 தமிழ்</option>
          </select>
        </div>
      </div>

      <div className="report-viewer-container">
        <ReportViewer
          reportPages={reportPages}
          setUpdatedReportPages={setUpdatedReportPages}
          language={language}
        />
      </div>

      <SpeedInsights />
    </div>
  );
}

export default App;

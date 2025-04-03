import React, { useState, useEffect } from "react";
import Form from "./components/Form/Form";
import ReportViewer from "./components/ReportViewer/ReportViewer";
import AERFloatingTable from "./components/AERFloatingTable/AERFloatingTable";
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
  const [aerHtmlPage, setAerHtmlPage] = useState("");

  useEffect(() => {
    const savedLang = localStorage.getItem("appLanguage");
    const hasVisited = sessionStorage.getItem("hasVisited");

    if (savedLang && hasVisited === "true") {
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
      sessionStorage.setItem("hasVisited", "true");
      setLanguage(newLang);
      setReportPages([]);
      setUpdatedReportPages([]);
      setIsEditable(true);
    }
  };

  const handleLandingLanguageSelect = (lang) => {
    setLanguage(lang);
    localStorage.setItem("appLanguage", lang);
    sessionStorage.setItem("hasVisited", "true");
  };

  const handleAerTableSave = (htmlPage) => {
    setAerHtmlPage(htmlPage);
    setUpdatedReportPages((prev) => [...prev, htmlPage]);
  };

  if (!language) {
    return (
      <div className="landing-page">
        <img src="/logos/Logo-IrrigationDept.png" alt="Irrigation Dept Logo" className="landing-logo logo-id" />
        <img src="/logos/Logo-MCB.png" alt="MCB Logo" className="landing-logo logo-mcb" />
        <img src="/logos/Logo-CRIWMP.png" alt="CRIWMP Logo" className="landing-logo logo-criwmp" />
        <div className="landing-content">
          <h1 className="main-title">District Agro-met Advisory Co-production<br />Software Application</h1>
          <h2 className="sub-title">දිස්ත්‍රික් කෘෂි-කාලගුණික උපදේශන සමසම්පාදනය<br />සදහා වන මෘදුකාංග යෙදුම</h2>
          <h2 className="sub-title">மாவட்ட வேளாண் வானிலை ஆலோசனையின் ஒருங்கிணைப்பு<br />பொருந்தக்கூடிய மென்பொருள் பயன்பாடு</h2>
          <div className="language-buttons">
            <button onClick={() => handleLandingLanguageSelect("en")}>English</button>
            <button onClick={() => handleLandingLanguageSelect("si")}>සිංහල</button>
            <button onClick={() => handleLandingLanguageSelect("ta")}>தமிழ்</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {isFetching && <div className="loading-overlay"><div className="spinner"></div></div>}
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
        <div className="language-switcher-container">
          <select className="language-selector" value={language} onChange={handleLanguageChange}>
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

      <AERFloatingTable onSave={handleAerTableSave} />

      <SpeedInsights />
    </div>
  );
}

export default App;

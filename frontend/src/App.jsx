import React, { useState } from "react";
import Form from "./components/Form/Form";
import ReportViewer from "./components/ReportViewer/ReportViewer";
import "./styles/global.css";

function App() {
  const [reportPages, setReportPages] = useState([]); // Store generated report pages
  const [isEditable, setIsEditable] = useState(true); // Determine if form fields are editable

  // Function to handle report generation
  const generateReport = async (formData) => {
    try {
      const response = await fetch("http://localhost:3000/api/reports/generate", {
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
    }
  };

  return (
    <div className="container">
      {/* Form Section */}
      <Form
        onGenerateReport={generateReport}
        isEditable={isEditable}
        setReportPages={setReportPages}
        setIsEditable={setIsEditable}
        reportPages={reportPages}
      />

      {/* Report Viewer Section */}
      <ReportViewer reportPages={reportPages} />
    </div>
  );
}

export default App;

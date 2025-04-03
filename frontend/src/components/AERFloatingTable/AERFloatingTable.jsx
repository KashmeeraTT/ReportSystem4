// AERFloatingTable.jsx
import React, { useState } from "react";
import "./AERFloatingTable.css";

const AERFloatingTable = ({ onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formValues, setFormValues] = useState({});

  const aerCodes = ["DL1b", "DL1e", "DL1f"];
  const rainfallOptions = ["Below Normal", "Near Normal", "Above Normal"];

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSave = () => {
    const htmlPage = generateStaticHTML(formValues);
    onSave(htmlPage);
    setIsOpen(false);
  };

  const generateStaticHTML = (values) => {
    const row = (label, getValue) => `
      <tr>
        <td>${label}</td>
        ${aerCodes.map((code) => `<td>${getValue(code)}</td>`).join("")}
      </tr>
    `;

    const checkboxRow = (label, rangeNum) => row(label, (code) => {
      const key = `AER-${code}-range${rangeNum}`;
      return values[key] ? "✔️" : "";
    });

    return `
      <div class="section" style="page-break-after: always;">
        <h2 style="text-align:center;">Agromet Parameter Selection</h2>
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-family: Arial, sans-serif;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th>Agro-met Parameter</th>
              ${aerCodes.map((code) => `<th>AER ${code}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${row("Seasonal Rainfall Forecast", (code) => values[`SRF-${code}`] || "N/A")}
            ${row("Received Rainfall Last Month", (code) => values[`RRF-${code}`] || "N/A")}
            ${checkboxRow("Minor Tank Water Availability 0%-30%", 1)}
            ${checkboxRow("Minor Tank Water Availability 31%-50%", 2)}
            ${checkboxRow("Minor Tank Water Availability 51%-70%", 3)}
            ${checkboxRow("Minor Tank Water Availability 71%-90%", 4)}
            ${checkboxRow("Minor Tank Water Availability 91%-100%", 5)}
          </tbody>
        </table>
      </div>
    `;
  };

  return (
    <div className="aer-floating-wrapper">
      <button className="floating-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✖ Close AER Table" : "📋 Fill AER Table"}
      </button>

      {isOpen && (
        <div className="aer-table-window">
          <h3 style={{ marginTop: 0 }}>Fill Agro-met Advisory Table</h3>
          <table className="aer-table">
            <thead>
              <tr>
                <th>Parameter</th>
                {aerCodes.map((code) => (
                  <th key={code}>{code}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { key: "SRF", label: "Seasonal Rainfall Forecast" },
                { key: "RRF", label: "Received Rainfall Last Month" },
              ].map(({ key, label }) => (
                <tr key={key}>
                  <td>{label}</td>
                  {aerCodes.map((code) => (
                    <td key={code}>
                      <select
                        name={`${key}-${code}`}
                        value={formValues[`${key}-${code}`] || ""}
                        onChange={handleSelectChange}
                      >
                        <option value="">--</option>
                        {rainfallOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>
                  ))}
                </tr>
              ))}

              {[1, 2, 3, 4, 5].map((range) => (
                <tr key={range}>
                  <td>MTWA {range * 20 - 20}%–{range * 20}%</td>
                  {aerCodes.map((code) => (
                    <td key={code}>
                      <input
                        type="checkbox"
                        name={`AER-${code}-range${range}`}
                        checked={!!formValues[`AER-${code}-range${range}`]}
                        onChange={handleCheckboxChange}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button className="save-aer-button" onClick={handleSave}>
            Save Table as Report Page
          </button>
        </div>
      )}
    </div>
  );
};

export default AERFloatingTable;

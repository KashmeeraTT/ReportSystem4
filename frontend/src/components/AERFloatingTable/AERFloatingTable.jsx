import React, { useState, useEffect } from "react";
import "./AERFloatingTable.css";

const districtAERCodes = {
  Vavuniya: ["DL1b", "DL1e", "DL1f"],
  Anuradhapura: ["DL2a", "DL2b", "DL2c"],
  Ampara: ["DL3a", "DL3b", "DL3c"],
  // Add more districts as needed
};

const AERFloatingTable = ({ onSave, district }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [aerCodes, setAerCodes] = useState([]);
  const rainfallOptions = ["Below Normal", "Near Normal", "Above Normal"];

  useEffect(() => {
    if (district && districtAERCodes[district]) {
      setAerCodes(districtAERCodes[district]);
    } else {
      setAerCodes([]);
    }
  }, [district]);

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (code, rangeNum) => {
    const updatedValues = { ...formValues };
    for (let i = 1; i <= 5; i++) {
      delete updatedValues[`AER-${code}-range${i}`];
    }
    updatedValues[`AER-${code}-range${rangeNum}`] = true;
    setFormValues(updatedValues);
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

    const radioRow = (label, rangeNum) =>
      row(label, (code) =>
        values[`AER-${code}-range${rangeNum}`] ? "Yes" : ""
      );

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Agromet Advisory Table</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 40px;
            background: #f8f9fa;
          }
          .section {
            page-break-after: always;
          }
          h2 {
            text-align: center;
            color: #2c3e50;
            margin-bottom: 30px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            box-shadow: 0 0 12px rgba(0,0,0,0.08);
            border-radius: 8px;
            overflow: hidden;
          }
          th {
            background: linear-gradient(to right, #2980b9, #6dd5fa);
            color: white;
            padding: 12px;
            text-align: center;
            font-size: 15px;
          }
          td {
            padding: 10px;
            text-align: center;
            border: 1px solid #dee2e6;
            font-size: 14px;
          }
          tr:nth-child(even) {
            background-color: #f2f2f2;
          }
          tr:hover td {
            background-color: #e9f7fe;
          }
        </style>
      </head>
      <body>
        <div class="section">
          <h2>Agromet Parameter Selection</h2>
          <table>
            <thead>
              <tr>
                <th>Agro-met Parameter</th>
                ${aerCodes.map((code) => `<th>${code}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${row("Seasonal Rainfall Forecast", (c) => values[`SRF-${c}`] || "N/A")}
              ${row("Received Rainfall Last Month", (c) => values[`RRF-${c}`] || "N/A")}
              ${radioRow("Minor Tank Water Availability 0%-30%", 1)}
              ${radioRow("Minor Tank Water Availability 31%-50%", 2)}
              ${radioRow("Minor Tank Water Availability 51%-70%", 3)}
              ${radioRow("Minor Tank Water Availability 71%-90%", 4)}
              ${radioRow("Minor Tank Water Availability 91%-100%", 5)}
            </tbody>
          </table>
        </div>
      </body>
      </html>
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
              {["SRF", "RRF"].map((key) => (
                <tr key={key}>
                  <td>{key === "SRF" ? "Seasonal Rainfall Forecast" : "Received Rainfall Last Month"}</td>
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
                        type="radio"
                        name={`AER-${code}`}
                        checked={!!formValues[`AER-${code}-range${range}`]}
                        onChange={() => handleRadioChange(code, range)}
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

import React, { useState, useEffect } from "react";
import "./AERFloatingTable.css";

const districtAERCodes = {
  Vavuniya: ["DL1b", "DL1e", "DL1f"],
  Anuradhapura: ["DL2a", "DL2b", "DL2c"],
  Ampara: ["DL3a", "DL3b", "DL3c"],
  // 🔁 Add more districts with corresponding codes as needed
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

    const checkboxRow = (label, rangeNum) =>
      row(label, (code) =>
        values[`AER-${code}-range${rangeNum}`] ? "✓" : ""
      );

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Agromet Advisory Table</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .section { page-break-after: always; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <div class="section">
          <h2 style="text-align:center;">Agromet Parameter Selection</h2>
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
              ${checkboxRow("Minor Tank Water Availability 0%-30%", 1)}
              ${checkboxRow("Minor Tank Water Availability 31%-50%", 2)}
              ${checkboxRow("Minor Tank Water Availability 51%-70%", 3)}
              ${checkboxRow("Minor Tank Water Availability 71%-90%", 4)}
              ${checkboxRow("Minor Tank Water Availability 91%-100%", 5)}
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

const Papa = require("papaparse");

module.exports = function generateSection(title, data, observedPrecipitation = null, previousMonth = null, previousMonthYear = null) {
    if (!data || !data.content) {
        return `
            <div class="section" style="page-break-after: always;">
                <h2>${title}</h2>
                <p>Data not available.</p>
            </div>
            <!-- PAGE BREAK -->
        `;
    }

    let updatedText = data.content.text || "";
    if (observedPrecipitation) {
        updatedText = updatedText.replace("<OBSERVED_PERCIPITATION>", `${observedPrecipitation}%`);
    }

    // Decode buffers to Base64 for PNGs
    const png1Base64 = data.content.png1 ? `data:image/png;base64,${Buffer.from(data.content.png1).toString('base64')}` : null;
    const png2Base64 = data.content.png2 ? `data:image/png;base64,${Buffer.from(data.content.png2).toString('base64')}` : null;
    const png3Base64 = data.content.png3 ? `data:image/png;base64,${Buffer.from(data.content.png3).toString('base64')}` : null;

    // Render CSV data as an HTML table
    const renderCsvToHtmlTable = (csvBuffer, isEditable = false) => {
        if (!csvBuffer) return "";
    
        // Decode the CSV buffer to a string using UTF-16LE encoding
        let csvString = csvBuffer.toString("utf16le");
    
        // Remove BOM if present
        csvString = csvString.replace(/^\uFEFF/, '');
    
        // Parse CSV data using Papaparse
        const { data: parsedData, errors } = Papa.parse(csvString.trim(), {
            header: false,        // Don't treat the first row as headers
            skipEmptyLines: true, // Ignore empty lines
            quoteChar: '"',       // Handle quoted fields correctly
            delimiter: ",",       // Explicitly set delimiter as a comma
        });
    
        if (errors.length) {
            console.error("Error parsing CSV:", errors);
            return "<p>Error parsing CSV data.</p>";
        }
    
        // Generate HTML table with optional editable column
        let htmlTable = isEditable
            ? `<form id="csv3Form" onsubmit="handleCsv3Submit(event)">
                <table border="1" style="border-collapse: collapse; width: 100%; text-align: left;">`
            : `<table border="1" style="border-collapse: collapse; width: 100%; text-align: left;">`;
    
        parsedData.forEach((row, rowIndex) => {
            htmlTable += "<tr>";
            row.forEach((cell, colIndex) => {
                if (rowIndex === 0) {
                    // Header row
                    htmlTable += `<th style="padding: 8px; background-color: #f2f2f2;">${cell}</th>`;
                } else if (isEditable && colIndex === 4) {
                    // Editable "Water Availability (%)" column
                    htmlTable += `
                        <td style="padding: 8px;">
                            <input 
                                type="number" 
                                name="waterAvailabilityRow${rowIndex}" 
                                value="${cell}" 
                                min="0" 
                                max="100" 
                                style="width: 100%; padding: 4px;" 
                                required 
                            />
                        </td>`;
                } else {
                    // Static columns
                    htmlTable += `<td style="padding: 8px;">${cell}</td>`;
                }
            });
            htmlTable += "</tr>";
        });
    
        htmlTable += isEditable
            ? `
                </table>
                <button type="submit" style="margin-top: 10px; padding: 8px 16px; background-color: #4CAF50; color: white; border: none; cursor: pointer;">
                    Save Changes
                </button>
            </form>`
            : "</table>";
    
        // Add client-side script for handling form submission for editable tables
        if (isEditable) {
            htmlTable += `
                <script>
                    function handleCsv3Submit(event) {
                        event.preventDefault();
                        
                        const formData = new FormData(event.target);
                        const updatedData = {};
    
                        // Collect updated values
                        formData.forEach((value, key) => {
                            updatedData[key] = value;
                        });
    
                        console.log("Updated Data:", updatedData);
    
                        // TODO: Add logic to process/save the updated data (e.g., via an API or server-side processing)
                        alert("Changes saved successfully!");
                    }
                </script>
            `;
        }
    
        return htmlTable;
    };
    
    // Decode and render the CSV buffers
    const csv1Table = data.content.csv1 ? renderCsvToHtmlTable(data.content.csv1, false) : ""; // Static
    const csv2Table = data.content.csv2 ? renderCsvToHtmlTable(data.content.csv2, false) : ""; // Static
    const csv3Table = data.content.csv3 ? renderCsvToHtmlTable(data.content.csv3, true) : "";  // Editable

    // Build the content
    let htmlContent = "";

    if (updatedText || csv1Table || csv2Table || png1Base64 || png2Base64 || png3Base64) {

        // If any data is available, show the content
        if (updatedText) {
            htmlContent += `
                <div class="section" style="page-break-after: always;">
                    <h2>${title}</h2>
                    ${updatedText}
                </div>
                <!-- PAGE BREAK -->
            `;
        }

        if (csv1Table) {
            htmlContent += `
                <div class="section" style="page-break-after: always;">
                    <h2>${title}</h2>
                    ${csv1Table}
                </div>
                <!-- PAGE BREAK -->
            `;
        }

        if (csv2Table) {
            htmlContent += `
                <div class="section" style="page-break-after: always;">
                    <h2>Provincial Irrigation ${title}</h2>
                    ${csv2Table}
                </div>
                <!-- PAGE BREAK -->
            `;
        }

        if (csv3Table) {
            htmlContent += `
                <div class="section" style="page-break-after: always;">
                    <h2>${title} AERs</h2>
                    ${csv3Table}
                </div>
                <!-- PAGE BREAK -->
            `;
        }

        if (png1Base64) {
            htmlContent += `
                <div class="section" style="page-break-after: always;">
                    <h2>${title}</h2>
                    <div style="text-align: center;">
                        <img src="${png1Base64}" alt="${title} Image 1" style="max-width: 100%; height: auto;" />
                    </div>
                </div>
                <!-- PAGE BREAK -->
            `;
        }

        if (png2Base64) {
            htmlContent += `
                <div class="section" style="page-break-after: always;">
                    <h2>Percnt of Normal Precipitation for ${previousMonth} ${previousMonthYear}</h2>
                    <div style="text-align: center;">
                        <img src="${png2Base64}" alt="${title} Image 2" style="max-width: 100%; height: auto;" />
                    </div>
                </div>
                <!-- PAGE BREAK -->
            `;
        }

        if (png3Base64) {
            htmlContent += `
                <div class="section" style="page-break-after: always;">
                    <h2>${title}</h2>
                    <div style="text-align: center;">
                        <img src="${png3Base64}" alt="${title} Image 3" style="max-width: 100%; height: auto;" />
                    </div>
                </div>
                <!-- PAGE BREAK -->
            `;
        }
    } else {
        // If no CSV or PNG is available, show "Data not available."
        htmlContent += `
            <div class="section" style="page-break-after: always;">
                <h2>${title}</h2>
                <p>Data not available.</p>
            </div>
            <!-- PAGE BREAK -->
        `;
    }

    return htmlContent;
};

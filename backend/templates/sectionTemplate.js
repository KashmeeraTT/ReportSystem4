const Papa = require("papaparse");

module.exports = function generateSection(title, data, observedPrecipitation = null) {
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
    const renderCsvToHtmlTable = (csvBuffer) => {
        if (!csvBuffer) return "";

        // Decode the CSV buffer to a string using UTF-16LE encoding
        let csvString = csvBuffer.toString("utf16le");
        console.log("CSV String:", csvString);

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

        // Generate HTML table
        let htmlTable = "<table border='1' style='border-collapse: collapse; width: 100%; text-align: left;'>";

        parsedData.forEach((row, rowIndex) => {
            htmlTable += "<tr>";
            row.forEach((cell) => {
                if (rowIndex === 0) {
                    // Header row
                    htmlTable += `<th style="padding: 8px; background-color: #f2f2f2;">${cell}</th>`;
                } else {
                    // Data row
                    htmlTable += `<td style="padding: 8px;">${cell}</td>`;
                }
            });
            htmlTable += "</tr>";
        });

        htmlTable += "</table>";
        return htmlTable;
    };

    // Decode and render the CSV buffers
    const csv1Table = data.content.csv1 ? renderCsvToHtmlTable(data.content.csv1) : "";
    const csv2Table = data.content.csv2 ? renderCsvToHtmlTable(data.content.csv2) : "";

    // Return the generated HTML section
    return `
        <div class="section" style="page-break-after: always;">
            <h2>${title}</h2>
            <p>${updatedText || "No text available."}</p>
            <div style="text-align: center;">
                ${png1Base64 ? `<img src="${png1Base64}" alt="${title} Image 1" />` : ""}
                ${png2Base64 ? `<img src="${png2Base64}" alt="${title} Image 2" />` : ""}
                ${png3Base64 ? `<img src="${png3Base64}" alt="${title} Image 3" />` : ""}
                ${csv1Table ? `<div style="margin-top: 20px;">${csv1Table}</div>` : ""}
                ${csv2Table ? `<div style="margin-top: 20px;">${csv2Table}</div>` : ""}
            </div>
        </div>
        <!-- PAGE BREAK -->
    `;
};

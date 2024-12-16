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

    // Function to render a CSV file into an editable HTML table
    const renderCsvToHtmlTable = (csvBuffer) => {
        if (!csvBuffer) return "";

        let csvString = csvBuffer.toString("utf16le").replace(/^\uFEFF/, "");
        const { data: parsedData, errors } = Papa.parse(csvString.trim(), {
            header: false,
            skipEmptyLines: true,
            quoteChar: '"',
            delimiter: ",",
        });

        if (errors.length) {
            console.error("Error parsing CSV:", errors);
            return "<p>Error parsing CSV data.</p>";
        }

        const savedValues = JSON.parse(localStorage.getItem("WaterAvailability")) || {};
        const minMaxByAER = {};

        const waterAvailabilityIndex = parsedData[0]?.indexOf("Water Availability (%)");
        const hasWaterAvailability = waterAvailabilityIndex !== -1;

        let htmlTable = `<table border="1" style="border-collapse: collapse; width: 100%; text-align: left;">`;

        parsedData.forEach((row, rowIndex) => {
            htmlTable += "<tr>";
            row.forEach((cell, colIndex) => {
                if (rowIndex === 0) {
                    htmlTable += `<th style="padding: 8px; background-color: #f2f2f2;">${cell}</th>`;
                } else if (hasWaterAvailability && colIndex === waterAvailabilityIndex) {
                    const key = row[0];
                    const savedValue = savedValues[key] || cell;
                    const aer = row[3];
                    const value = parseInt(savedValue) || 0;

                    if (!minMaxByAER[aer]) {
                        minMaxByAER[aer] = { min: value, max: value };
                    } else {
                        minMaxByAER[aer].min = Math.min(minMaxByAER[aer].min, value);
                        minMaxByAER[aer].max = Math.max(minMaxByAER[aer].max, value);
                    }

                    htmlTable += `
                        <td style="padding: 8px;">
                            <input 
                                type="number" 
                                value="${savedValue}" 
                                min="0" 
                                max="100" 
                                style="width: 60px;" 
                                onchange="handleWaterInputChange(event, '${key}')"
                            />
                        </td>`;
                } else {
                    htmlTable += `<td style="padding: 8px;">${cell}</td>`;
                }
            });
            htmlTable += "</tr>";
        });

        htmlTable += "</table>";

        if (hasWaterAvailability) {
            localStorage.setItem("MinMaxByAER", JSON.stringify(minMaxByAER));
            renderSideWindow(minMaxByAER);
        }

        return htmlTable;
    };

    // Function to handle input changes and save to localStorage
    window.handleWaterInputChange = (event, key) => {
        const value = event.target.value;
        if (value >= 0 && value <= 100) {
            const savedValues = JSON.parse(localStorage.getItem("WaterAvailability")) || {};
            savedValues[key] = value;
            localStorage.setItem("WaterAvailability", JSON.stringify(savedValues));
        } else {
            alert("Please enter a value between 0 and 100.");
            event.target.value = "";
        }
    };

    const renderSideWindow = (minMaxByAER) => {
        const sideWindow = document.getElementById("side-window");
        if (!sideWindow) {
            const newWindow = document.createElement("div");
            newWindow.id = "side-window";
            newWindow.style.position = "fixed";
            newWindow.style.top = "10px";
            newWindow.style.right = "10px";
            newWindow.style.padding = "10px";
            newWindow.style.border = "1px solid #ccc";
            newWindow.style.background = "#f9f9f9";
            newWindow.innerHTML = `
                <h4>Water Availability (Min/Max)</h4>
                <ul id="aer-stats"></ul>
            `;
            document.body.appendChild(newWindow);
        }

        const statsList = document.getElementById("aer-stats");
        statsList.innerHTML = "";

        Object.entries(minMaxByAER).forEach(([aer, stats]) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${aer}: Min=${stats.min}, Max=${stats.max}`;
            statsList.appendChild(listItem);
        });
    };
    
    // Decode and render the CSV buffers
    const csv1Table = data.content.csv1 ? renderCsvToHtmlTable(data.content.csv1) : ""; // Static
    const csv2Table = data.content.csv2 ? renderCsvToHtmlTable(data.content.csv2) : ""; // Static

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

const Papa = require("papaparse");

module.exports = function generateSection(title, data, previousMonth = null, previousMonthYear = null, language = "en", altTitles = {}) {
    if (!data || !data.content) {
        return `
            <div class="section" style="page-break-after: always;">
                <h2>${title}</h2>
                <p>Data not available.</p>
            </div>
            <!-- PAGE BREAK -->
        `;
    }

    const getAltTitle = (key, defaultText) => {
        return altTitles?.[key]?.[language] || defaultText;
    };

    const png1Base64 = data.content.png1 ? `data:image/png;base64,${Buffer.from(data.content.png1).toString('base64')}` : null;
    const png2Base64 = data.content.png2 ? `data:image/png;base64,${Buffer.from(data.content.png2).toString('base64')}` : null;
    const png3Base64 = data.content.png3 ? `data:image/png;base64,${Buffer.from(data.content.png3).toString('base64')}` : null;

    const renderCsvToHtmlTable = (csvBuffer) => {
        if (!csvBuffer) return "";

        let csvString = csvBuffer.toString("utf16le").replace(/^\uFEFF/, '');
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

        let htmlTable = `<table border="1" style="border-collapse: collapse; width: 100%; text-align: left;">`;
        parsedData.forEach((row, rowIndex) => {
            htmlTable += "<tr>";
            row.forEach((cell) => {
                if (rowIndex === 0) {
                    htmlTable += `<th style="padding: 8px; background-color: #f2f2f2;">${cell}</th>`;
                } else {
                    htmlTable += `<td style="padding: 8px;">${cell}</td>`;
                }
            });
            htmlTable += "</tr>";
        });
        htmlTable += "</table>";
        return htmlTable;
    };

    const csv1Table = data.content.csv1 ? renderCsvToHtmlTable(data.content.csv1) : "";
    const csv2Table = data.content.csv2 ? renderCsvToHtmlTable(data.content.csv2) : "";

    let htmlContent = "";

    if (data.content.text || csv1Table || csv2Table || png1Base64 || png2Base64 || png3Base64) {
        if (data.content.text) {
            htmlContent += `
                <div class="section" style="page-break-after: always;">
                    <h2>${title}</h2>
                    ${data.content.text}
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
                    <h2>${getAltTitle("provincialIrrigation", "Provincial Irrigation")} - ${title}</h2>
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
                    <h2>${getAltTitle("percentOfNormal", "Percent of Normal Precipitation")} - ${previousMonth} ${previousMonthYear}</h2>
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

module.exports = function generateSection(title, data, observedPrecipitation = null) {
    if (!data) {
        return `
            <div class="section" style="page-break-after: always;">
                <h2>${title}</h2>
                <p>Data not available.</p>
            </div>
            <!-- PAGE BREAK -->
        `;
    }

    let updatedText = data.content.text;
    if (observedPrecipitation) {
        updatedText = updatedText.replace("<OBSERVED_PERCIPITATION>", `${observedPrecipitation}%`);
    }

    const png1Base64 = data.content.png1 ? `data:image/png;base64,${data.content.png1.toString('base64')}` : null;
    const png2Base64 = data.content.png2 ? `data:image/png;base64,${data.content.png2.toString('base64')}` : null;
    const png3Base64 = data.content.png3 ? `data:image/png;base64,${data.content.png3.toString('base64')}` : null;

    const renderCsvToHtmlTable = (csvData) => {
        if (!csvData) return "";

        const rows = csvData.split("\n");
        let htmlTable = "<table border='1' style='border-collapse: collapse; width: 100%; text-align: left;'>";

        rows.forEach((row, rowIndex) => {
            const columns = row.split(",");
            if (rowIndex === 0) {
                htmlTable += "<tr>";
                columns.forEach((cell) => {
                    htmlTable += `<th style="padding: 8px; background-color: #f2f2f2;">${cell.trim()}</th>`;
                });
                htmlTable += "</tr>";
            } else {
                htmlTable += "<tr>";
                columns.forEach((cell) => {
                    htmlTable += `<td style="padding: 8px;">${cell.trim()}</td>`;
                });
                htmlTable += "</tr>";
            }
        });

        htmlTable += "</table>";
        return htmlTable;
    };

    const csv1Table = data.content.csv1 ? renderCsvToHtmlTable(data.content.csv1) : "";
    const csv2Table = data.content.csv2 ? renderCsvToHtmlTable(data.content.csv2) : "";

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

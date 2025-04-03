module.exports = function generateReportTemplate(sections, district, day, month, year) {
    return `
        <html>
            <head>
                <title>${district} District Agro-met Advisory Co-production Report - ${day} ${month} ${year}</title>
                <style>
                body {
                    font-family: "Segoe UI", Tahoma, sans-serif;
                    margin: 20px;
                    line-height: 1.6;
                    color: #333;
                }
                h1, h2, h3, h4 {
                    font-family: "Segoe UI", Tahoma, sans-serif;
                    text-align: justify;
                    color: rgb(0, 0, 0);
                }
                p {
                    font-family: "Segoe UI", Tahoma, sans-serif;
                    text-align: justify;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                    font-family: "Segoe UI", Tahoma, sans-serif;
                }
                table th, table td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                table th {
                    background-color: #f4f4f4;
                    font-weight: bold;
                    color: #555;
                }
                </style>
            </head>
            <body>
                <style>
                body {
                    font-family: "Segoe UI", Tahoma, sans-serif;
                    margin: 20px;
                    line-height: 1.6;
                    color: #333;
                }
                h1, h2, h3, h4 {
                    font-family: "Segoe UI", Tahoma, sans-serif;
                    text-align: justify;
                    color: rgb(0, 0, 0);
                }
                p {
                    font-family: "Segoe UI", Tahoma, sans-serif;
                    text-align: justify;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                    font-family: "Segoe UI", Tahoma, sans-serif;
                }
                table th, table td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                table th {
                    background-color: #f4f4f4;
                    font-weight: bold;
                    color: #555;
                }
                </style>
                ${sections.join("\n")}
            </body>
        </html>
    `;
};

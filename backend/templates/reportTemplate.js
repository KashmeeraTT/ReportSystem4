module.exports = function generateReportTemplate(sections, district, day, month, year) {
    return `
        <html>
            <head>
                <title>${district} District Agro-met Advisory Co-production Report - ${day} ${month} ${year}</title>
                <style>
                    body {
                        font-family: Calibri, Arial, sans-serif; /* Modern and professional */
                        margin: 20px;
                        line-height: 1.6;
                        color: #333;
                    }
                    h1, h2, h3, h4 {
                        font-family: Georgia, 'Times New Roman', serif; /* Formal for headers */
                        text-align: center;
                        color: #2a2a2a;
                    }
                    .section {
                        margin-top: 20px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
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
                ${sections.join("\n")}
                <div class="section">
                    <h4>Part B</h4>
                </div>
            </body>
        </html>
    `;
};

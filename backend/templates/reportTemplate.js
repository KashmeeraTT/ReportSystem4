module.exports = function generateReportTemplate(sections, district, day, month, year) {
    return `
        <html>
            <head>
                <title>${district} District Agro-met Advisory Co-production Report - ${day} ${month} ${year}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
                    h1, h2, h3 { text-align: center; }
                    .section { margin-top: 20px; }
                </style>
            </head>
            <body>
                ${sections.join("\n")}
            </body>
        </html>
    `;
};

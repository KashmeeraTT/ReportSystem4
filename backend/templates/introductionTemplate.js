module.exports = function generateIntroduction(district, day, month, year) {
    return `
        <div class="section" style="page-break-after: always;">
            <h1>District Agro-met Advisory Co-production</h1>
            <h2>${district} District</h2>
            <h3>${day} ${month} ${year}</h3>
            <p style="text-align: justify;">
                The Natural Resources Management Centre, Department of Agriculture (NRMC, DoA) 
                has released the Agro-met advisory for ${month} ${year}, incorporating weather 
                forecasts from the Department of Meteorology (DoM) and irrigation water availability 
                information from various departments. Field-level data were collected from multiple sources 
                to compile this report.
            </p>
            <p style="text-align: justify;">
                The Department of Meteorology (DoM) has issued the seasonal weather forecast 
                for the upcoming three-month period, outlining anticipated weather conditions.
            </p>
        </div>
        <!-- PAGE BREAK -->
    `;
};

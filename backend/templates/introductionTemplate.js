module.exports = function generateIntroduction(district, day, month, year) {
    return `
        <div class="section" style="page-break-after: always;">
            <h1 style="text-align: center;">District Agro-met Advisory Co-production</h1>
            <h2 style="text-align: center;">${district} District</h2>
            <h3 style="text-align: center;">${day} ${month} ${year}</h3>
            <h4 style="text-align: center;">Part A</h4>
            <p style="text-align: justify;">
                The Natural Resources Management Centre, Department of Agriculture (NRMC, DoA) has released the Agro-met advisory for ${month} ${year}, which incorporates weather forecasts provided by the Department of Meteorology (DoM) and the irrigation water availability information from the Irrigation Department (ID), Mahaweli Water Management Secretariat (MASL-WMS) and the Department of Agrarian Development (DAD). Field-level data and information for this document were collected from the Department of Agriculture (DoA), Mahaweli Authority of Sri Lanka (MASL), ID, DAD and plantation research institutes.
            </p>
            <p style="text-align: justify;">
                The Department of Meteorology (DoM) has issued the seasonal weather forecast 
                for the upcoming three-month period, outlining anticipated weather conditions.
            </p>
        </div>
        <!-- PAGE BREAK -->
    `;
};

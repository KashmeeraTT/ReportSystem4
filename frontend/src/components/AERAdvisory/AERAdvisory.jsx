module.exports = function generateAERSection(district, aerData) {
    if (!aerData || !Array.isArray(aerData)) {
        return ["<div class='section'><p>Data not available.</p></div>"];
    }

    // Define ranges mapping
    const rangesMapping = [
        "0%-30%",
        "31%-50%",
        "51%-70%",
        "71%-90%",
        "91%-100%",
    ];

    // Function to get the advisory text based on conditions
    const generateAdvisoryText = (aer) => {
        const { seasonalRainfall, receivedRainfall, ranges } = aer;

        if (seasonalRainfall === "Above Normal" && receivedRainfall === "Below Normal") {
            if (ranges[0] === "Checked") {
                return "Use incipient rains for land preparation, Look for 3 - 3½ months paddy varieties, Use weedicides for weed control, Adjust irrigation intervals during vegetative phase as per the rainfall catch to save the water in the tank and use saved water during rest of the season";
            }
            if (ranges[1] === "Checked") {
                return "Use incipient rains for land preparation, Look for 3½ months varieties, Adjust irrigation intervals during vegetative phase as per the rainfall catch to save the water in the tank and use saved water during rest of the season";
            }
            if (ranges[2] === "Checked") {
                return "Use incipient rains for land preparation, Look for 3½ - 4 months varieties, Use weedicides for weed control, Adjust irrigation intervals during vegetative phase as per the rainfall catch to save the water in the tank and use saved water during rest of the season";
            }
            if (ranges[3] === "Checked") {
                return "Use incipient rains for land preparation, Look for 3½ - 4 months varieties, Adjust irrigation intervals during vegetative phase as per the rainfall catch during the rest of the season and in the next season";
            }
            if (ranges[4] === "Checked") {
                return "Use incipient rains for land preparation, Look for 3½ to 4 months varieties, Adjust irrigation intervals during vegetative phase as per the rainfall catch to save the water in the tank to use during next season";
            }
        }

        return "No specific advisory available for the current conditions.";
    };

    // Function to render a single AER section
    const renderSection = (aer) => {
        const advisoryText = generateAdvisoryText(aer);
        const checkedRangeIndex = aer.ranges.findIndex((range) => range === "Checked");
        const waterAvailabilityRange =
            checkedRangeIndex !== -1 ? rangesMapping[checkedRangeIndex] : "N/A";

        return `
            <div class="section" style="font-family: Arial, sans-serif; margin: 20px; text-align: left;">
                <h2>Agro-met Advisory for ${district} District</h2>
                <p>
                    In the <strong>${district}</strong> district for Agro Ecological Region <strong>${aer.aerCode}</strong> 
                    with a Seasonal Rainfall Forecast of <strong>${aer.seasonalRainfall}</strong> 
                    and Last Month Received Rainfall of <strong>${aer.receivedRainfall}</strong>, 
                    the Agro-met advisory for the next cultivation season for small tanks with water available from 
                    <strong>${waterAvailabilityRange}</strong> of full capacity is:
                </p>
                <p style="font-style: italic; color: #2c3e50; margin-top: 10px;">
                    ${advisoryText}
                </p>
            </div>
            <!-- PAGE BREAK -->
        `;
    };

    // Generate full HTML content by iterating through the AER data
    let fullHTMLContent = "";

    aerData.forEach((aer) => {
        fullHTMLContent += renderSection(aer);
    });

    return fullHTMLContent;
};

const Meteorology = require("../models/Meteorology");

// Find the nearest previous document within one year
async function findNearestPrevious(category, subcategory, district, year, month, day) {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Ensure the month is valid
    const monthIndex = months.indexOf(month);
    if (monthIndex === -1) {
        throw new Error(`Invalid month name: ${month}`);
    }

    // Start date (one year before the input date)
    const startDate = new Date(year - 1, monthIndex, day);

    // Query within the one-year range
    for (let y = year; y >= startDate.getFullYear(); y--) {
        for (let m = y === year ? monthIndex : months.length - 1;
            m >= (y === startDate.getFullYear() ? startDate.getMonth() : 0);
            m--) {
            const queryMonth = months[m];
            const query = {
                category,
                subcategory,
                district,
                year: y,
                month: queryMonth,
            };

            // Add day condition only for the input month of the input year
            if (y === year && m === monthIndex) {
                query.day = { $lte: day }; // Include equality for the same month
            }

            const result = await Meteorology.findOne(query)
                .sort({ year: -1, month: -1, day: -1 })
                .exec();

            if (result) {
                return result;
            }
        }
    }
    return null;
}

module.exports = { findNearestPrevious };

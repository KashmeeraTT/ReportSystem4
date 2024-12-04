const moment = require("moment");

// Calculate ISO week number
function calculateWeekNumber(day, month, year) {
    const date = moment(`${year}-${month}-${day}`, "YYYY-MMMM-DD");
    return date.isoWeek();
}
// Calculate next month
function calculateNextMonth(day, month, year) {
    const date = moment(`${year}-${month}-${day}`, "YYYY-MMMM-DD");
    return date.add(1, "month").format("MMMM");
}

// Calculate next month year
function calculateNextMonthYear(day, month, year) {
    const date = moment(`${year}-${month}-${day}`, "YYYY-MMMM-DD");
    return date.add(1, "month").year();
}

// Calculate next next month
function calculateNextNextMonth(day, month, year) {
    const date = moment(`${year}-${month}-${day}`, "YYYY-MMMM-DD");
    return date.add(2, "month").format("MMMM");
}

// Calculate next next month year
function calculateNextNextMonthYear(day, month, year) {
    const date = moment(`${year}-${month}-${day}`, "YYYY-MMMM-DD");
    return date.add(2, "month").year();
}

// Calculate previous month
function calculatePreviousMonth(day, month, year) {
    const date = moment(`${year}-${month}-${day}`, "YYYY-MMMM-DD");
    return date.subtract(1, "month").format("MMMM");
}

// Calculate previous month year
function calculatePreviousMonthYear(day, month, year) {
    const date = moment(`${year}-${month}-${day}`, "YYYY-MMMM-DD");
    return date.subtract(1, "month").year();
}

// Adjust week numbers
function adjustWeekNumbers(year, startWeekNumber, weeksToCheck = 4) {
    const weeks = [];
    for (let i = 0; i < weeksToCheck; i++) {
        const currentDate = moment()
            .year(year)
            .isoWeek(startWeekNumber + i)
            .startOf("isoWeek");

        weeks.push({
            weekNumber: currentDate.isoWeek(),
            year: currentDate.year(),
        });
    }
    return weeks;
}
module.exports = {
    calculateWeekNumber,
    calculateNextMonth,
    calculateNextMonthYear,
    calculateNextNextMonth,
    calculateNextNextMonthYear,
    calculatePreviousMonth,
    calculatePreviousMonthYear,
    adjustWeekNumbers
};

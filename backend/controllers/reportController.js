const Meteorology = require("../models/Meteorology");
const { calculateNextMonth, calculateNextMonthYear, calculateNextNextMonth, calculateNextNextMonthYear, calculatePreviousMonth, calculatePreviousMonthYear, adjustWeekNumbers, calculateWeekNumber } = require("../utils/dateUtils");
const { findNearestPrevious } = require("../utils/databaseUtils");
const generateIntroduction = require("../templates/introductionTemplate");
const generateSection = require("../templates/sectionTemplate");
const generateReportTemplate = require("../templates/reportTemplate");
const { topics, altTitles } = require("../utils/localization");


exports.generateReport = async (req, res, next) => {
    const { year, month, day, district, language = "en"  } = req.body;

    const getAltTitle = (key, defaultText) => {
        return altTitles?.[key]?.[language] || defaultText;
    };

    try {
        const weekNumber = calculateWeekNumber(day, month, year);
        const adjustedWeeks = adjustWeekNumbers(year, weekNumber);

        const nextMonth = calculateNextMonth(day, month, year);
        const nextMonthYear = calculateNextMonthYear(day, month, year);

        const nextNextMonth = calculateNextNextMonth(day, month, year);
        const nextNextMonthYear = calculateNextNextMonthYear(day, month, year);

        const previousMonth = calculatePreviousMonth(day, month, year);
        const previousMonthYear = calculatePreviousMonthYear(day, month, year);

        const seasonalRainfall = await Meteorology.findOne({ category: "Rainfall", subcategory: "Seasonal", month, year });

        const rainfallForecast1 = await Meteorology.findOne({ category: "Rainfall", subcategory: "Monthly", month, submonth: month, year });
        const rainfallForecast2 = await Meteorology.findOne({ category: "Rainfall", subcategory: "Monthly", month, submonth: nextMonth, year });
        const rainfallForecast3 = await Meteorology.findOne({ category: "Rainfall", subcategory: "Monthly", month, submonth: nextNextMonth, year });

        const weeklyRainfall0 = await Meteorology.findOne({ category: "Rainfall", subcategory: "Weekly", year, district, weekNumber, subweekNumber: 0 });
        const weeklyRainfall1 = await Meteorology.findOne({ category: "Rainfall", subcategory: "Weekly", year, district, weekNumber, subweekNumber: 1 });
        const weeklyRainfall2 = await Meteorology.findOne({ category: "Rainfall", subcategory: "Weekly", year, district, weekNumber, subweekNumber: 2 });
        const weeklyRainfall3 = await Meteorology.findOne({ category: "Rainfall", subcategory: "Weekly", year, district, weekNumber, subweekNumber: 3 });
        const weeklyRainfall4 = await Meteorology.findOne({ category: "Rainfall", subcategory: "Weekly", year, district, weekNumber, subweekNumber: 4 });

        const receivedRainfall = await Meteorology.findOne({ category: "Rainfall", subcategory: "Recieved", year, month: previousMonth, district });

        const climatologicalRainfall = await Meteorology.findOne({ category: "Rainfall", subcategory: "Climatological", year, month, district });

        const majorReservoir = await findNearestPrevious("Reservoir", "Major", district, year, month, day);
        const mediumReservoir = await findNearestPrevious("Reservoir", "Medium", district, year, month, day);
        const minorTank = await findNearestPrevious("Reservoir", "Minor", district, year, month, day);

        const Parameters = await Meteorology.findOne({ department: "DOA", category: "Parameters", month, year, district });

        const introduction = generateIntroduction(district, day, month, year, language);

        const sections = [
            introduction,
          
            generateSection(
              `${topics.seasonalSummary[language]} ${month} ${year}, ${nextMonth} ${nextMonthYear}, ${nextNextMonth} ${nextNextMonthYear}`,
              seasonalRainfall,
              month,
              year,
              getAltTitle("seasonalSummary", "Seasonal Rainfall Forecast Summary for")
            ),
          
            generateSection(
              `${topics.rainfallForecast[language]} ${month} ${year}`,
              rainfallForecast1,
              null,
              null,
              altTitles
            ),
            generateSection(
              `${topics.rainfallForecast[language]} ${nextMonth} ${nextMonthYear}`,
              rainfallForecast2,
              null,
              null,
              altTitles
            ),
            generateSection(
              `${topics.rainfallForecast[language]} ${nextNextMonth} ${nextNextMonthYear}`,
              rainfallForecast3,
              null,
              null,
              altTitles
            ),
          
            generateSection(
              `${topics.weeklySummary[language]} Week ${weekNumber} ${year}, Week ${adjustedWeeks[1].weekNumber} ${adjustedWeeks[1].year}, Week ${adjustedWeeks[2].weekNumber} ${adjustedWeeks[2].year}, Week ${adjustedWeeks[3].weekNumber} ${adjustedWeeks[3].year}`,
              weeklyRainfall0,
              null,
              null,
              altTitles
            ),
          
            generateSection(
              `${topics.weeklySummary[language]} - Subweek 1 (Week ${weekNumber} ${year})`,
              weeklyRainfall1,
              null,
              null,
              altTitles
            ),
            generateSection(
              `${topics.weeklySummary[language]} - Subweek 2 (Week ${adjustedWeeks[1].weekNumber} ${adjustedWeeks[1].year})`,
              weeklyRainfall2,
              null,
              null,
              altTitles
            ),
            generateSection(
              `${topics.weeklySummary[language]} - Subweek 3 (Week ${adjustedWeeks[2].weekNumber} ${adjustedWeeks[2].year})`,
              weeklyRainfall3,
              null,
              null,
              altTitles
            ),
            generateSection(
              `${topics.weeklySummary[language]} - Subweek 4 (Week ${adjustedWeeks[3].weekNumber} ${adjustedWeeks[3].year})`,
              weeklyRainfall4,
              null,
              null,
              altTitles
            ),
          
            generateSection(
              `${topics.receivedRain[language]} ${previousMonth} ${previousMonthYear}`,
              receivedRainfall,
              previousMonth,
              previousMonthYear,
              getAltTitle("percentOfNormal", "Percent of Normal Precipitation")
            ),
          
            generateSection(
              `${topics.climatology[language]} ${month} ${year}, ${nextMonth} ${nextMonthYear}, ${nextNextMonth} ${nextNextMonthYear}`,
              climatologicalRainfall,
              null,
              null,
              altTitles
            ),
          
            generateSection(
              `${topics.majorReservoir[language]} ${day} ${month} ${year} - ${district} District`,
              majorReservoir,
              null,
              null,
              altTitles
            ),
            generateSection(
              `${topics.mediumReservoir[language]} ${day} ${month} ${year} - ${district} District`,
              mediumReservoir,
              null,
              null,
              getAltTitle("provincialIrrigation", "Provincial Irrigation")
            ),
            generateSection(
              `${topics.minorTank[language]} ${day} ${month} ${year} - ${district} District`,
              minorTank,
              null,
              null,
              altTitles
            ),
          
            generateSection(
              `${topics.parameters[language]} ${month} ${year}`,
              Parameters,
              null,
              null,
              altTitles
            ),
          ];
          
        const report = generateReportTemplate(sections, district, day, month, year);
        const filename = `${district}_Report_${day}_${month}_${year}.html`;

        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("Content-Type", "text/html");
        res.send(report);
    } catch (error) {
        next(error);
    }
};

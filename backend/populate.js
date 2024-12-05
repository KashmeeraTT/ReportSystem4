const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Meteorology = require("./models/Meteorology");
const { text } = require("body-parser");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/EnvironmentData");

// Function to read a text file and return its content
const readTextFile = (filePath) => {
    try {
        const content = fs.readFileSync(filePath, "utf-8"); // Read the file in UTF-8 format
        return content; // Return the text content
    } catch (error) {
        console.error("Error reading the file:", error);
        throw error;
    }
};

// Function to read a PNG file and convert it to Buffer
const readImage = (imagePath) => {
    return fs.readFileSync(imagePath);
};

// Function to read a CSV file and convert it to binary
const readCsvAsBinary = (csvPath) => {
    return fs.readFileSync(csvPath); // Reads the file as a Buffer without encoding
};

// Sample Data
const meteorologyData = [
    {
        department: "DoM",
        category: "Rainfall",
        subcategory: "Seasonal",
        month: "November",
        year: 2024,
        content: {
            csv1: readCsvAsBinary(path.join(__dirname, "dbAssets/AgroMet Data for Vavuniya", "2024-11-00-DoM-Rainfall-Forecast-Seasonal-and-Monthly-Data.csv")), // Store CSV as binary
        },
    },
    {
        department: "DoM",
        category: "Rainfall",
        subcategory: "Seasonal",
        month: "November",
        year: 2024,
        content: {
            png1: readImage(path.join(__dirname, "dbAssets/AgroMet Data for Vavuniya", "2024-11-00-DoM-Rainfall-Forecast-Seasonal.png")), // Store image as Buffer
        },
    },
    {
        department: "DoM",
        category: "Rainfall",
        subcategory: "Seasonal",
        month: "November",
        submonth: "November",
        year: 2024,
        content: {
            png1: readImage(path.join(__dirname, "dbAssets/AgroMet Data for Vavuniya", "2024-11-00-DoM-Rainfall-Forecast-Monthly1.png")), // Store image as Buffer
        },
    },
    {
        department: "DoM",
        category: "Rainfall",
        subcategory: "Seasonal",
        month: "November",
        submonth: "December",
        year: 2024,
        content: {
            png1: readImage(path.join(__dirname, "dbAssets/AgroMet Data for Vavuniya", "2024-11-00-DoM-Rainfall-Forecast-Monthly2.png")), // Store image as Buffer
        },
    },
    {
        department: "DoM",
        category: "Rainfall",
        subcategory: "Seasonal",
        month: "November",
        submonth: "January",
        year: 2024,
        content: {
            png1: readImage(path.join(__dirname, "dbAssets/AgroMet Data for Vavuniya", "2024-11-00-DoM-Rainfall-Forecast-Monthly3.png")), // Store image as Buffer
        },
    },
    {
        department: "DoM",
        category: "Rainfall",
        subcategory: "Weekly",
        district: "Vavuniya",
        year: 2024,
        weekNumber: 45,
        subweekNumber: 0,
        content: {
            csv1: readCsvAsBinary(path.join(__dirname, "dbAssets/AgroMet Data for Vavuniya", "2024-12-00-DoM-Rainfall-Forecast-Weekly-Data.csv")), // Store CSV as binary
        },
    },
    {
        department: "DoM",
        category: "Rainfall",
        subcategory: "Weekly",
        district: "Vavuniya",
        year: 2024,
        weekNumber: 45,
        subweekNumber: 1,
        content: {
            png1: readImage(path.join(__dirname, "dbAssets/AgroMet Data for Vavuniya", "2024-12-00-DoM-Rainfall-Forecast-Weekly1.png")),
        },
    },
    {
        department: "DoM",
        category: "Rainfall",
        subcategory: "Weekly",
        district: "Vavuniya",
        year: 2024,
        weekNumber: 45,
        subweekNumber: 2,
        content: {
            png1: readImage(path.join(__dirname, "dbAssets/AgroMet Data for Vavuniya", "2024-12-00-DoM-Rainfall-Forecast-Weekly2.png")),
        },
    },
    {
        department: "DoM",
        category: "Rainfall",
        subcategory: "Weekly",
        district: "Vavuniya",
        year: 2024,
        weekNumber: 45,
        subweekNumber: 3,
        content: {
            png1: readImage(path.join(__dirname, "dbAssets/AgroMet Data for Vavuniya", "2024-12-00-DoM-Rainfall-Forecast-Weekly3.png")),
        },
    },
    {
        department: "DoM",
        category: "Rainfall",
        subcategory: "Weekly",
        district: "Vavuniya",
        year: 2024,
        weekNumber: 45,
        subweekNumber: 4,
        content: {
            png1: readImage(path.join(__dirname, "dbAssets/AgroMet Data for Vavuniya", "2024-12-00-DoM-Rainfall-Forecast-Weekly4.png")),
        },
    },
    {
        department: "DoM",
        category: "Rainfall",
        subcategory: "Recieved",
        month: "October",
        year: 2024,
        district: "Vavuniya",
        content: {
            csv1: readCsvAsBinary(path.join(__dirname, "dbAssets/AgroMet Data for Vavuniya", "2024-11-00-DoM-Observed-Rainfall-Anomaly-Data.csv")), // Store CSV as binary
            png1: readImage(path.join(__dirname, 'dbAssets/AgroMet Data for Vavuniya', '2024-11-00-DoM-Received-Monthly-Rainfall.png')),
            png2: readImage(path.join(__dirname, 'dbAssets/AgroMet Data for Vavuniya', '2024-11-00-DoM-Observed-Percent-of-Normal-Precipitation.png')),
        },
    },
    {
        department: "DoM",
        category: "Rainfall",
        subcategory: "Climatological",
        month: "October",
        year: 2024,
        district: "Vavuniya",
        content: {
            text: readTextFile(path.join(__dirname, 'dbAssets/AgroMet Data for Vavuniya', '2024-12-00-DoA-Agromet-Advisory-Summary.txt')),
        },
    },
    {
        department: "ID",
        category: "Reservoir",
        subcategory: "Major",
        day: 7,
        month: "November",
        year: 2024,
        district: "Vavuniya",
        content: {
            csv1: readCsvAsBinary(path.join(__dirname, "dbAssets/AgroMet Data for Vavuniya", "2024-11-07-ID-Reservoir-Water-Availability-Data-Major.csv")),
        },
    },
    {
        department: "ID",
        category: "Reservoir",
        subcategory: "Medium",
        day: 7,
        month: "November",
        year: 2024,
        district: "Vavuniya",
        content: {
            csv1: readCsvAsBinary(path.join(__dirname, "dbAssets/AgroMet Data for Vavuniya", "2024-11-07-ID-Reservoir-Water-Availability-Data-Medium.csv")),
            csv2: readCsvAsBinary(path.join(__dirname, "dbAssets/AgroMet Data for Vavuniya", "2024-11-07-PID-Reservoir-Water-Availability-Data-Medium.csv")),
        },
    },
    {
        department: "DAD",
        category: "Reservoir",
        subcategory: "Minor",
        day: 7,
        month: "November",
        year: 2024,
        district: "Vavuniya",
        content: {
            csv1: readCsvAsBinary(path.join(__dirname, "dbAssets/AgroMet Data for Vavuniya", "2024-11-07-DAD-Reservoir-Water-Availability-Data-Small.csv")),
            png1: readImage(path.join(__dirname, 'dbAssets/AgroMet Data for Vavuniya', '2024-11-00-DAD-Water-Availability-Forecast-Minor-Tank.png')),
        },
    },
    // Add other data here in similar fashion, using `readImage` for png1, png2, and png3
];

// Function to populate the database
async function populateData() {
    try {
        await Meteorology.deleteMany(); // Clear any existing data
        await Meteorology.insertMany(meteorologyData); // Insert new data
        console.log("Database populated successfully!");
        mongoose.connection.close(); // Close connection after populating
    } catch (error) {
        console.error("Error populating database:", error);
    }
}

populateData();

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const reportRoutes = require("./routes/reports");

dotenv.config();

const app = express();

// Configure CORS
const allowedOrigins = ['https://report-system-fronend-next.vercel.app']; // Add your frontend's origin here
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Allow cookies or authentication headers
}));

app.use(express.json());
app.use("/api/reports", reportRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;

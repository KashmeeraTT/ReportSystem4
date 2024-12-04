const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const reportRoutes = require("./routes/reports");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/reports", reportRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;

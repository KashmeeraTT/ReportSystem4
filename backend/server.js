const app = require("./app");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, HOST, ()  => {
            console.log(`Server running on port ${process.env.PORT || 3000}`);
        });
    })
    .catch(err => console.error("Database connection failed:", err));

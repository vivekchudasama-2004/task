const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const userRoutes = require("./routes/user");
const AppDataSource = require("./data-source");

// Initialize Database
AppDataSource.initialize().then(() => {
    const app = express();

    // Middleware
    app.use(cors());
    app.use(helmet());
    app.use(express.json()); // Built-in body parser

    // Routes
    app.use("/users", userRoutes);

    app.listen(3000, () => {
        console.log("Server started on port 3000!");
    });

}).catch(error => console.log("Database Connection Error: ", error));
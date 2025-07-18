// Main Express app setup, registers routes/middleware
// backend/src/app.js
const express = require("express");
const cors = require("cors");
const allRoutes = require("./routes"); // Import consolidated routes

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Register All Routes ---
app.use("/", allRoutes); // Use the consolidated router

// --- Error Handling Middleware (Optional, but good practice) ---
// This should be your last middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = app;

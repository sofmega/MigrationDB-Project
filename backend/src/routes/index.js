// backend/src/routes/index.js
const express = require("express");
const authRoutes = require("./authRoutes");
const taskRoutes = require("./taskRoutes"); // <-- This is mounted at '/tasks'

const router = express.Router();

router.use("/", authRoutes);
router.use("/tasks", taskRoutes); // <--- HERE! All routes in taskRoutes get prefixed with '/tasks'

module.exports = router;

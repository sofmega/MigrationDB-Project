// backend/src/routes/taskRoutes.js
const express = require("express");
const taskController = require("../controllers/taskController");
const authenticateToken = require("../middleware/authMiddleware");
const router = express.Router();

// Public route for tasks
router.get("/public-tasks", taskController.getPublic); // <--- THIS LINE IS THE KEY

// Protected routes for user-specific tasks
router.post("/", authenticateToken, taskController.create);
router.get("/", authenticateToken, taskController.getAll);
router.put("/:id", authenticateToken, taskController.update);
router.delete("/:id", authenticateToken, taskController.delete);

module.exports = router;

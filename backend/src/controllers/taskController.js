// backend/src/controllers/taskController.js
const taskService = require("../services/taskService");

const taskController = {
  async create(req, res) {
    const { text } = req.body;
    const userId = req.user.id;
    if (!text) {
      return res.status(400).json({ message: "Task text is required." });
    }
    try {
      const newTask = await taskService.createTask(text, userId);
      res.status(201).json(newTask);
    } catch (error) {
      console.error("Error creating task:", error.message);
      res.status(500).json({ message: "Server error creating task." });
    }
  },

  async getAll(req, res) {
    const userId = req.user.id;
    try {
      const tasks = await taskService.getAllTasks(userId);
      res.status(200).json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
      res.status(500).json({ message: "Server error fetching tasks." });
    }
  },

  async getPublic(req, res) {
    // Controller for public tasks
    try {
      const tasks = await taskService.getPublicTasks();
      res.status(200).json(tasks);
    } catch (error) {
      console.error("Error fetching public tasks:", error.message);
      res.status(500).json({ message: "Server error fetching public tasks." });
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { text, completed } = req.body;
    const userId = req.user.id;
    try {
      const updatedTask = await taskService.updateTask(id, userId, {
        text,
        completed,
      });
      res.status(200).json(updatedTask);
    } catch (error) {
      console.error("Error updating task:", error.message);
      if (error.message.includes("not found or unauthorized")) {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Server error updating task." });
    }
  },

  async delete(req, res) {
    const { id } = req.params;
    const userId = req.user.id;
    try {
      await taskService.deleteTask(id, userId);
      res.status(204).send(); // No content for successful deletion
    } catch (error) {
      console.error("Error deleting task:", error.message);
      if (error.message.includes("not found or unauthorized")) {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Server error deleting task." });
    }
  },
};

module.exports = taskController;

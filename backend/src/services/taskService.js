// backend/src/services/taskService.js
const prisma = require("../config/prisma"); // Import the prisma client

const taskService = {
  async createTask(text, userId) {
    return prisma.task.create({ data: { text, userId } });
  },

  async getAllTasks(userId) {
    return prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
  },

  async getPublicTasks() {
    // New service method for public tasks
    return prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  async updateTask(id, userId, data) {
    const updatedTask = await prisma.task.updateMany({
      where: { id, userId }, // Ensure user can only update their own tasks
      data: {
        text: data.text,
        completed: data.completed,
        updatedAt: new Date(),
      },
    });
    if (updatedTask.count === 0) {
      throw new Error("Task not found or unauthorized.");
    }
    return prisma.task.findUnique({ where: { id } }); // Return the updated task
  },

  async deleteTask(id, userId) {
    const deletedTask = await prisma.task.deleteMany({
      where: { id, userId }, // Ensure user can only delete their own tasks
    });
    if (deletedTask.count === 0) {
      throw new Error("Task not found or unauthorized.");
    }
    return true; // Indicate success
  },
};

module.exports = taskService;

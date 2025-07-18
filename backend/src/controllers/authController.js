// backend/src/controllers/authController.js
const authService = require("../services/authService");

const authController = {
  async register(req, res) {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "All fields (email, password, name) are required." });
    }
    try {
      await authService.registerUser(email, password, name);
      res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
      console.error("Error during registration:", error.message);
      if (error.message.includes("exists")) {
        return res.status(409).json({ message: error.message });
      }
      res.status(500).json({ message: "Server error during registration." });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }
    try {
      const { user, token } = await authService.loginUser(email, password);
      res.status(200).json({
        message: `Welcome, ${user.name}!`,
        name: user.name,
        token,
      });
    } catch (error) {
      console.error("Error during login:", error.message);
      if (error.message.includes("Invalid credentials")) {
        return res.status(401).json({ message: error.message });
      }
      res.status(500).json({ message: "Server error during login." });
    }
  },
};

module.exports = authController;

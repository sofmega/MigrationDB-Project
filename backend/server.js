// backend/server.js
require("dotenv").config({ path: "./.env" }); // Make sure dotenv loads from the correct path
const app = require("./src/app"); // Import the Express app from src/app.js

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Login endpoint: http://localhost:${PORT}/login`);
  console.log(`Register endpoint: http://localhost:${PORT}/register`);
  console.log(`Public tasks: http://localhost:${PORT}/tasks/public-tasks`); // New public endpoint
  console.log(`Protected task CRUD endpoints: http://localhost:${PORT}/tasks`);
});

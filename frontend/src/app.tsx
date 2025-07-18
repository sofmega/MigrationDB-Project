// frontend/src/app.tsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import NewPage from "./pages/NewPage";
import RegisterPage from "./pages/RegisterPage"; // Import the new RegisterPage

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} /> {/* New route for RegisterPage */}
        <Route path="/new" element={<NewPage />} />
        {/* Optional: Add a default route for "/" if you want a home page */}
        <Route path="/" element={
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome Home!</h1>
              <p className="text-gray-600 mb-6">
                Navigate to{" "}
                <a href="/login" className="text-blue-600 hover:underline">
                  Login
                </a>{" "}
                or{" "}
                <a href="/register" className="text-blue-600 hover:underline">
                  Register
                </a>{" "}
                to get started.
              </p>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;

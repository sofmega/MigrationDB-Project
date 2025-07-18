import React, { useState, useEffect } from "react"; // Make sure useEffect is imported
import { useNavigate } from 'react-router-dom';

// Define a type for your Task item. It's good practice to have this
// either here or in a shared types file.
interface Task {
  id: string;
  text: string;
  completed: boolean;
  userId: string; // The backend still sends this
  createdAt: string;
  updatedAt: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // State for public tasks
  const [publicTasks, setPublicTasks] = useState<Task[]>([]);
  const [loadingPublicTasks, setLoadingPublicTasks] = useState(true);
  const [publicTasksError, setPublicTasksError] = useState<string | null>(null);

  // --- Login Handler ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userName", data.name);
        setMessage(data.message);
        navigate('/new');
      } else {
        console.error("Backend Login Error Response:", data);
        setMessage(`Login failed: ${data.message || "Invalid credentials."}`);
      }
    } catch (error: any) {
      console.error("Network or server connection error:", error);
      setMessage(`Login failed: Could not connect to the server. Please ensure the backend is running.`);
    }
  };

  // --- Fetch Public Tasks on Component Mount ---
  useEffect(() => {
    const fetchPublicTasks = async () => {
      setLoadingPublicTasks(true);
      setPublicTasksError(null);
      try {
        // Ensure this URL matches your backend's public endpoint
        const response = await fetch("http://localhost:5000/tasks/public-tasks"); // Adjusted for the new route structure
        if (response.ok) {
          const data: Task[] = await response.json();
          setPublicTasks(data);
        } else {
          const errorData = await response.json();
          setPublicTasksError(`Failed to load public tasks: ${errorData.message || response.statusText}`);
        }
      } catch (error: any) {
        console.error("Network error fetching public tasks:", error);
        setPublicTasksError(`Could not connect to the server to load public tasks.`);
      } finally {
        setLoadingPublicTasks(false);
      }
    };

    fetchPublicTasks();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Login Page (with Public Tasks)</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
              Email:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
              Password:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out"
          >
            Login
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-center ${message.includes("failed") || message.includes("error") ? "text-red-600" : "text-green-600"}`}>
            {message}
          </p>
        )}
        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-green-600 hover:underline font-semibold">
            Register here
          </a>
        </p>
      </div>

      {/* Public Tasks Section */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mt-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">All Public Tasks</h2>
        {loadingPublicTasks ? (
          <p className="text-center text-gray-500">Loading public tasks...</p>
        ) : publicTasksError ? (
          <p className="text-red-600 text-center">{publicTasksError}</p>
        ) : publicTasks.length === 0 ? (
          <p className="text-center text-gray-500">No public tasks available yet.</p>
        ) : (
          <ul className="space-y-2 max-h-60 overflow-y-auto"> {/* Added max-height and overflow for scroll */}
            {publicTasks.map((task) => (
              <li
                key={task.id}
                className="bg-gray-50 p-3 rounded-md border border-gray-200 flex items-center justify-between"
              >
                <span
                  className={`text-lg ${
                    task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                  }`}
                >
                  {task.text}
                </span>
                {/* Optional: Show completion status, but disable interaction */}
                <span className={`text-xs px-2 py-1 rounded ${task.completed ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                    {task.completed ? 'Completed' : 'Pending'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
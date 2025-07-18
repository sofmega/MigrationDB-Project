// frontend/src/pages/NewPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Define a type for our Task item
interface Task {
  id: string;
  text: string;
  completed: boolean;
  userId: string; // From the backend
  createdAt: string;
  updatedAt: string;
}

const NewPage: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState<string>('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to get the auth token
  const getAuthToken = () => localStorage.getItem('authToken');

  // --- Fetch Tasks from Backend (READ) ---
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        navigate('/login'); // Redirect if no token
        return;
      }

      const response = await fetch("http://localhost:5000/tasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Send JWT token
        },
      });

      if (response.ok) {
        const data: Task[] = await response.json();
        setTasks(data);
      } else if (response.status === 401 || response.status === 403) {
        // Token invalid or expired, force logout
        handleLogout();
        setError("Session expired. Please log in again.");
      } else {
        const errorData = await response.json();
        setError(`Failed to fetch tasks: ${errorData.message || response.statusText}`);
      }
    } catch (err: any) {
      console.error("Network error fetching tasks:", err);
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [navigate]); // Add navigate to dependency array

  // Load user name and fetch tasks on component mount
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
    fetchTasks();
  }, [fetchTasks]); // fetchTasks is stable due to useCallback

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  // --- CRUD Operations (Connected to Backend) ---

  // Create Task
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim() === '') return;

    setError(null);
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch("http://localhost:5000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ text: newTaskText }),
      });

      if (response.ok) {
        const newTask: Task = await response.json();
        setTasks((prevTasks) => [...prevTasks, newTask]);
        setNewTaskText('');
      } else {
        const errorData = await response.json();
        setError(`Failed to add task: ${errorData.message || response.statusText}`);
      }
    } catch (err: any) {
      console.error("Network error adding task:", err);
      setError(`Network error: ${err.message}`);
    }
  };

  // Update Task (Toggle Completion)
  const handleToggleComplete = async (taskToUpdate: Task) => {
    setError(null);
    const updatedCompletion = !taskToUpdate.completed;
    const originalTasks = tasks; // Store original state for optimistic update rollback

    // Optimistic Update: Update UI immediately
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskToUpdate.id ? { ...task, completed: updatedCompletion } : task
      )
    );

    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(`http://localhost:5000/tasks/${taskToUpdate.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ text: taskToUpdate.text, completed: updatedCompletion }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Failed to update task: ${errorData.message || response.statusText}`);
        // Rollback on error
        setTasks(originalTasks);
      }
      // If response.ok, UI is already updated optimistically, nothing else to do
    } catch (err: any) {
      console.error("Network error updating task:", err);
      setError(`Network error: ${err.message}`);
      // Rollback on network error
      setTasks(originalTasks);
    }
  };

  // Update Task (Start Editing)
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setEditText(task.text);
  };

  // Update Task (Save Edited Text)
  const handleSaveEdit = async (id: string) => {
    if (editText.trim() === '') return;

    setError(null);
    const taskToUpdate = tasks.find(task => task.id === id);
    if (!taskToUpdate) return; // Should not happen

    const originalTasks = tasks; // Store original state for optimistic update rollback

    // Optimistic Update
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, text: editText } : task
      )
    );
    setEditingTask(null); // Exit editing mode immediately
    setEditText('');

    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ text: editText, completed: taskToUpdate.completed }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Failed to save edit: ${errorData.message || response.statusText}`);
        // Rollback on error
        setTasks(originalTasks);
      }
    } catch (err: any) {
      console.error("Network error saving edit:", err);
      setError(`Network error: ${err.message}`);
      // Rollback on network error
      setTasks(originalTasks);
    }
  };

  // Delete Task
  const handleDeleteTask = async (id: string) => {
    setError(null);
    const originalTasks = tasks; // Store original state for optimistic update rollback

    // Optimistic Update
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));

    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Failed to delete task: ${errorData.message || response.statusText}`);
        // Rollback on error
        setTasks(originalTasks);
      }
      // If response.ok (204 No Content), UI is already updated
    } catch (err: any) {
      console.error("Network error deleting task:", err);
      setError(`Network error: ${err.message}`);
      // Rollback on network error
      setTasks(originalTasks);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {userName || 'User'}!
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 ease-in-out"
          >
            Logout
          </button>
        </div>

        <p className="text-gray-600 mb-6 text-center">Manage your tasks below.</p>

        {error && (
          <p className="text-red-600 text-center mb-4">{error}</p>
        )}

        {/* Add New Task Form (CREATE) */}
        <form onSubmit={handleAddTask} className="flex gap-2 mb-8">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add a new task..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading} // Disable input while loading/saving
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
            disabled={loading}
          >
            Add Task
          </button>
        </form>

        {/* Task List (READ, UPDATE, DELETE) */}
        {loading ? (
          <p className="text-center text-gray-500">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks yet. Add one above!</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-md shadow-sm"
              >
                {editingTask?.id === task.id ? (
                  // Edit mode
                  <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(task.id); }} className="flex-grow flex items-center gap-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-grow px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600"
                      disabled={loading}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingTask(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-500"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  // Display mode
                  <>
                    <span
                      className={`flex-grow text-lg cursor-pointer ${
                        task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                      }`}
                      onClick={() => handleToggleComplete(task)} // Pass the whole task
                    >
                      {task.text}
                    </span>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NewPage;
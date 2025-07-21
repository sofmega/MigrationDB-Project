// frontend/src/pages/NewPage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from "firebase/auth"; // CORRECTED
import type { User } from "firebase/auth"; // CORRECTED
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Timestamp, orderBy } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

// Update Task interface for Firestore Timestamps
interface Task {
  id: string;
  text: string;
  completed: boolean;
  userId: string;
  createdAt: Timestamp;
}

const NewPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState<string>('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setLoading(false);
      } else {
        // User is signed out, redirect to login
        navigate('/login');
      }
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [navigate]);

  // Fetch tasks in real-time when user is authenticated
  useEffect(() => {
    if (!currentUser) return;

    setError(null);
    const tasksCollectionRef = collection(db, "tasks");
    const q = query(tasksCollectionRef, where("userId", "==", currentUser.uid), orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData: Task[] = [];
      querySnapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() } as Task);
      });
      setTasks(tasksData);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching tasks:", err);
      setError(`Failed to fetch tasks: ${err.message}`);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup snapshot listener
  }, [currentUser]);


  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error: any) {
      console.error("Logout Error:", error);
      setError(`Logout failed: ${error.message}`);
    }
  };

  // --- Firestore CRUD Operations ---

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim() === '' || !currentUser) return;

    try {
      await addDoc(collection(db, "tasks"), {
        text: newTaskText,
        completed: false,
        userId: currentUser.uid,
        createdAt: Timestamp.now(),
      });
      setNewTaskText('');
    } catch (err: any) {
      setError(`Failed to add task: ${err.message}`);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    const taskDocRef = doc(db, "tasks", task.id);
    try {
      await updateDoc(taskDocRef, { completed: !task.completed });
    } catch (err: any) {
      setError(`Failed to update task: ${err.message}`);
    }
  };

  const handleSaveEdit = async (id: string) => {
    if (editText.trim() === '') return;
    const taskDocRef = doc(db, "tasks", id);
    try {
      await updateDoc(taskDocRef, { text: editText });
      setEditingTask(null);
      setEditText('');
    } catch (err: any) {
      setError(`Failed to save edit: ${err.message}`);
    }
  };
  
  const handleDeleteTask = async (id: string) => {
    const taskDocRef = doc(db, "tasks", id);
    try {
      await deleteDoc(taskDocRef);
    } catch (err: any) {
      setError(`Failed to delete task: ${err.message}`);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setEditText(task.text);
  };

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }
  
  // Render page content
  return (
     <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {currentUser?.displayName || 'User'}!
          </h1>
          <button onClick={handleLogout} className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700">
            Logout
          </button>
        </div>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        
        {/* Add New Task Form */}
        <form onSubmit={handleAddTask} className="flex gap-2 mb-8">
          <input type="text" value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} placeholder="Add a new task..." className="flex-grow px-4 py-2 border rounded-md"/>
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">Add Task</button>
        </form>

        {/* Task List */}
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks yet. Add one above!</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md shadow-sm">
                {editingTask?.id === task.id ? (
                  <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(task.id); }} className="flex-grow flex items-center gap-2">
                    <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)} className="flex-grow px-3 py-1 border rounded-md"/>
                    <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600">Save</button>
                    <button type="button" onClick={() => setEditingTask(null)} className="bg-gray-400 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-500">Cancel</button>
                  </form>
                ) : (
                  <>
                    <span onClick={() => handleToggleComplete(task)} className={`flex-grow text-lg cursor-pointer ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {task.text}
                    </span>
                    <div className="flex gap-2 ml-4">
                      <button onClick={() => handleEditTask(task)} className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-600">Edit</button>
                      <button onClick={() => handleDeleteTask(task.id)} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600">Delete</button>
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
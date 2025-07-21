// frontend/src/pages/RegisterPage.tsx

import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig"; // Import auth and db

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Update the user's profile with their name
      await updateProfile(user, { displayName: name });
      
      // 3. Create a user document in Firestore
      // Use the user's UID as the document ID for easy lookup
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: user.email,
      });

      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => navigate('/login'), 2000);

    } catch (error: any) {
      console.error("Registration Error:", error);
      setMessage(`Registration failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Register New Account</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">Name:</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your name" />
          </div>
          {/* Email Input */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">Email:</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your email" />
          </div>
          {/* Password Input */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">Password:</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your password" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        {message && <p className={`mt-4 text-center ${message.includes("failed") ? "text-red-600" : "text-green-600"}`}>{message}</p>}
        <p className="mt-6 text-center text-gray-600">Already have an account? <a href="/login" className="text-blue-600 hover:underline font-semibold">Login here</a></p>
      </div>
    </div>
  );
}
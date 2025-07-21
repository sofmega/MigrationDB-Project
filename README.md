# Full-Stack Task Management App 

This is a simple yet complete full-stack web application for managing tasks. It was originally built using Supabase and Prisma but has been fully migrated to use the Firebase platform, including Firebase Authentication and Cloud Firestore.

The application allows users to register, log in, and perform CRUD (Create, Read, Update, Delete) operations on their personal tasks. Unauthorized users can view a list of all tasks on the login page.

# ✨ Features
User Authentication: Secure user registration and login handled by Firebase Authentication.

Task Management (CRUD): Logged-in users can create, view, update, and delete their own tasks.

Protected Routes: Backend API routes for personal tasks are protected and require a valid Firebase ID token.

Public Task View: The login page displays a read-only list of all tasks created by all users.

Optimistic UI Updates: The frontend provides a smooth user experience by updating the UI immediately for task operations (create, update, delete) and rolling back only if an error occurs.

Real-time Auth State: The application uses Firebase's real-time auth state listener to manage user sessions seamlessly.

# 🛠️ Tech Stack
Frontend:

React & TypeScript

Vite (Development Server)

Tailwind CSS (Styling)

Firebase Client SDK (for auth and communication)

React Router DOM (for routing)

Backend:

Node.js & Express

Firebase Admin SDK (for backend logic, auth, and DB access)

CORS

Database:

Google Cloud Firestore (NoSQL) / Supabase prisma

# 🚀 Getting Started
Follow these instructions to get the project running on your local machine.

Prerequisites
Node.js (v16 or later)

npm (or yarn)

A Google Firebase project.

A Supabase prisma

1. Backend Setup
Navigate to the backend directory:

Bash

cd backend
Install dependencies:

Bash

npm install  

Set up Firebase Admin SDK:

Go to your Firebase project console.

Navigate to Project Settings > Service accounts.

Click "Generate new private key" to download your service account JSON file.

Rename this file to firebase-service-account-key.json and place it in the root of the /backend directory.

Create an environment file:

Create a .env file in the /backend directory. It currently only needs the port number, but the JWT_SECRET can be removed as it's no longer used.

Extrait de code

PORT=5000
Run the backend server:

Bash

npm start

The server should now be running on http://localhost:5000.

2. Frontend Setup

Navigate to the frontend directory:

Bash

cd ../frontend
Install dependencies:

Bash

npm install

Configure Firebase Client:

Open the frontend/src/firebaseConfig.ts file.

Go to your Firebase project console.

Navigate to Project Settings > General.

Under "Your apps", find or create a Web App.

Copy the firebaseConfig object and replace the placeholder values in the firebaseConfig.ts file.

Run the frontend development server:

Bash

npm run dev
The React application will be available at http://localhost:5173 (or another port if 5173 is busy).

# How to Run Migration Script : 

 Migrating Data from Supabase
 
If you used the previous Supabase version of this app, you can migrate your data using the provided script. If you are starting fresh, you can skip this step.

Add Supabase Credentials: In the backend/.env file, add your Supabase project URL and anon key.

Run the Script: Navigate to the /backend directory and run the migration script:

Bash

# This command executes the migration-script.js file

node migration-script.js  

This script will transfer all users and tasks to your Firebase project. You only need to do this once.

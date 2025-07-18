#Full-Stack Task Management App (MERN + Firebase)
This is a full-stack web application that provides a simple and efficient way for users to manage their tasks. It features a secure user authentication system and full CRUD (Create, Read, Update, Delete) functionality for tasks. The backend is built with Node.js and Express, using Firebase for authentication (Firebase Auth) and its database (Firestore). The frontend is a modern, responsive single-page application built with React, TypeScript, and styled with Tailwind CSS.

Features
User Authentication: Secure user registration and login system handled by Firebase Auth.

Task Management (CRUD):

Create: Authenticated users can add new tasks.

Read: Users can view a list of all their tasks after logging in.

Update: Users can edit the text of their tasks or mark them as complete/incomplete.

Delete: Users can permanently delete their tasks.

Public Task View: A public-facing list on the login page displays all tasks from all users, showcasing recent activity on the platform.

Protected Routes: Backend API endpoints for task management are protected, ensuring users can only access and modify their own data.

Optimistic UI Updates: The frontend provides a smooth user experience by updating the UI immediately for actions like toggling completion, editing, and deleting tasks, and then synchronizing with the backend.

Technology Stack
Backend
Runtime: Node.js

Framework: Express.js

Database: Google Firestore (NoSQL)

Authentication: Firebase Authentication

Server Communication: REST API

Frontend
Library: React 18

Language: TypeScript

Routing: React Router

Styling: Tailwind CSS

API Communication: Fetch API

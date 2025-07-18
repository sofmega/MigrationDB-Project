Full-Stack Task Management App (Firebase Edition)
This is a simple yet complete full-stack web application for managing tasks. It was originally built using Supabase and Prisma but has been fully migrated to use the Firebase platform, including Firebase Authentication and Cloud Firestore.

The application allows users to register, log in, and perform CRUD (Create, Read, Update, Delete) operations on their personal tasks. Unauthorized users can view a list of all tasks on the login page.

✨ Features
User Authentication: Secure user registration and login handled by Firebase Authentication.

Task Management (CRUD): Logged-in users can create, view, update, and delete their own tasks.

Protected Routes: Backend API routes for personal tasks are protected and require a valid Firebase ID token.

Public Task View: The login page displays a read-only list of all tasks created by all users.

Optimistic UI Updates: The frontend provides a smooth user experience by updating the UI immediately for task operations (create, update, delete) and rolling back only if an error occurs.

Real-time Auth State: The application uses Firebase's real-time auth state listener to manage user sessions seamlessly.

🛠️ Tech Stack
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

Google Cloud Firestore (NoSQL)

📂 Project Structure
The project is organized into two main directories:

/
├── frontend/   # Contains the React/Vite client application
└── backend/    # Contains the Node.js/Express server
🚀 Getting Started
Follow these instructions to get the project running on your local machine.

Prerequisites
Node.js (v16 or later)

npm (or yarn)

A Google Firebase project.

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

🌐 API Endpoints
All API routes are prefixed with the base URL http://localhost:5000.

Method	Endpoint	Protection	Description
POST	/register	Public	Registers a new user.
GET	/tasks/public-tasks	Public	Gets all tasks from all users.
POST	/tasks	Private	Creates a new task for the authenticated user.
GET	/tasks	Private	Gets all tasks for the authenticated user.
PUT	/tasks/:id	Private	Updates a specific task for the authenticated user.
DELETE	/tasks/:id	Private	Deletes a specific task for the authenticated user.

Exporter vers Sheets
Note: Private routes require a Bearer token in the Authorization header, which should be the ID token obtained from Firebase upon login.

🔐 Authentication Flow
The application has shifted from a custom JWT-based system to Firebase Authentication.

Registration: The user fills out the registration form. The frontend sends the credentials to the POST /register backend endpoint. The backend uses the Firebase Admin SDK to create a new user in Firebase Auth and a corresponding user profile in Firestore.

Login: The user enters their email and password on the login page. The frontend uses the Firebase Client SDK's signInWithEmailAndPassword method to authenticate the user directly with Firebase. The backend's /login endpoint is no longer used.

Session Management: Upon successful login, the Firebase SDK automatically manages the user's session and ID token. An onAuthStateChanged listener in the React app detects the user's sign-in state and navigates them to the task page.

Authenticated Requests: For all private API calls (like creating or deleting a task), the frontend gets the current user's ID token using auth.currentUser.getIdToken() and includes it in the Authorization: Bearer <ID_TOKEN> header.

Backend Verification: The Express server uses a middleware to intercept these requests. It verifies the ID token using the Firebase Admin SDK's verifyIdToken method. If the token is valid, the request proceeds; otherwise, a 403 Forbidden error is returned.

Logout: Clicking the logout button calls the signOut() method from the Firebase Client SDK, which clears the session. The onAuthStateChanged listener then automatically redirects the user to the login page.

// frontend/src/firebaseConfig.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Import for Firebase Authentication
import { getFirestore } from "firebase/firestore"; // Import for Cloud Firestore (if you plan to use it)

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4x9otWsP2m1FShupKO2BqkXCLXFCP59w",
  authDomain: "e-petitpas.firebaseapp.com",
  databaseURL:
    "https://e-petitpas-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "e-petitpas",
  storageBucket: "e-petitpas.firebasestorage.app",
  messagingSenderId: "71946838711",
  appId: "1:71946838711:web:9c9248ee5874eff76ce332",
  measurementId: "G-CQN6N2P1QY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // Initialized Analytics

// Initialize Firebase services you want to use
export const auth = getAuth(app); // Exporting auth for use in components
export const db = getFirestore(app); // Exporting db for Firestore (uncomment if needed)

// Export the app instance if you need it elsewhere
export default app;

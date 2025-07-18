// frontend/src/firebaseConfig.ts

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB4x9otWsP2m1FShupKO2BqkXCLXFCP59w",
  authDomain: "e-petitpas.firebaseapp.com",
  databaseURL: "https://e-petitpas-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "e-petitpas",
  storageBucket: "e-petitpas.firebasestorage.app",
  messagingSenderId: "71946838711",
  appId: "1:71946838711:web:9c9248ee5874eff76ce332",
  measurementId: "G-CQN6N2P1QY",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

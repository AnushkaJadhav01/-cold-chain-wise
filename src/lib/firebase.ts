import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCjjMH2y1QXmGSiwEzC1SVbY7kvNiYPMok",
  authDomain: "cold-chain-a4667.firebaseapp.com",
  projectId: "cold-chain-a4667",
  storageBucket: "cold-chain-a4667.firebasestorage.app",
  messagingSenderId: "122464401882",
  appId: "1:122464401882:web:85bea055feb8d8ba8b68e3",
  measurementId: "G-267GEJENJE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export instances
export const auth = getAuth(app);
export const db = getDatabase(app);
export default app;

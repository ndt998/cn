// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3lDKv3UZ52u0vNDR3tMUQMhsZ1HMDGL0",
  authDomain: "cnprd-e5d92.firebaseapp.com",
  projectId: "cnprd-e5d92",
  storageBucket: "cnprd-e5d92.firebasestorage.app",
  messagingSenderId: "664579171182",
  appId: "1:664579171182:web:ea8fd70c51f1dca12d977f",
  measurementId: "G-GCPYD6XFG6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Export services to use in other files
export { app, analytics, auth, db };

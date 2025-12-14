// Firebase Web SDK Configuration for Frontend
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDMc7Jjalkz8ymZkLfcbjMAtZgUpYC2xeU",
  authDomain: "dsa-cose-vs.firebaseapp.com",
  projectId: "dsa-cose-vs",
  storageBucket: "dsa-cose-vs.firebasestorage.app",
  messagingSenderId: "249427875322",
  appId: "1:249427875322:web:e2a8c1a78cd1157f2f8043",
  measurementId: "G-R9WJ2VM2ZT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

// Export for use in other files
export { app, analytics, db, auth };


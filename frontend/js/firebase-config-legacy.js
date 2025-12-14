// Firebase Web SDK Configuration for Frontend (Legacy/Non-Module Version)
// This version uses script tags instead of ES6 modules

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMc7Jjalkz8ymZkLfcbjMAtZgUpYC2xeU",
  authDomain: "dsa-cose-vs.firebaseapp.com",
  projectId: "dsa-cose-vs",
  storageBucket: "dsa-cose-vs.firebasestorage.app",
  messagingSenderId: "249427875322",
  appId: "1:249427875322:web:e2a8c1a78cd1157f2f8043",
  measurementId: "G-R9WJ2VM2ZT"
};

// Initialize Firebase (will be initialized after Firebase SDK loads)
let firebaseApp, firebaseAnalytics, firebaseDb, firebaseAuth;

// Wait for Firebase SDK to load
if (typeof firebase !== 'undefined') {
  firebaseApp = firebase.initializeApp(firebaseConfig);
  firebaseAnalytics = firebase.analytics();
  firebaseDb = firebase.firestore();
  firebaseAuth = firebase.auth();
}


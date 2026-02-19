import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBE4TNirs91UjnowQfy_Z-lPkfka2PaBTo",
  authDomain: "imuslim-ed870.firebaseapp.com",
  projectId: "imuslim-ed870",
  storageBucket: "imuslim-ed870.firebasestorage.app",
  messagingSenderId: "710978877912",
  appId: "1:710978877912:web:9be62b46dd027b1b5edaad",
  measurementId: "G-KSX2B0T81W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
import { getFirestore } from "firebase/firestore";
const db = getFirestore(app);

export { app, analytics, db };
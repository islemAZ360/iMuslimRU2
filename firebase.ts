// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBE4TNirs91UjnowQfy_Z-lPkfka2PaBTo",
    authDomain: "imuslim-ed870.firebaseapp.com",
    projectId: "imuslim-ed870",
    storageBucket: "imuslim-ed870.firebasestorage.app",
    messagingSenderId: "710978877912",
    appId: "1:710978877912:web:fdefff50aaa2169f5edaad",
    measurementId: "G-5XB1DTH7X6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { app, analytics, auth, googleProvider, db };

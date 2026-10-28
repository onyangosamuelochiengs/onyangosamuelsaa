// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdkdgnaOH041TlEMNBk9J2Utk1uR7Sseo",
  authDomain: "kibabii-university-clubs.firebaseapp.com",
  projectId: "kibabii-university-clubs",
  storageBucket: "kibabii-university-clubs.firebasestorage.app",
  messagingSenderId: "680679383856",
  appId: "1:680679383856:web:79e5636fceec1399f85ef5",
  measurementId: "G-Y92YRML1KY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsxJq2ru0EIF3R9iGdrFh426V4M8wXz7s",
  authDomain: "blooddonationsystem-9f456.firebaseapp.com",
  databaseURL: "https://blooddonationsystem-9f456-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "blooddonationsystem-9f456",
  storageBucket: "blooddonationsystem-9f456.firebasestorage.app",
  messagingSenderId: "160419323662",
  appId: "1:160419323662:web:27f9b58ad9cb9e07d2415f",
  measurementId: "G-YZW3HCPDMN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase();

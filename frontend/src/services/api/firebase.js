import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAsxJq2ru0EIF3R9iGdrFh426V4M8wXz7s",
  authDomain: "blooddonationsystem-9f456.firebaseapp.com",
  databaseURL:
    "https://blooddonationsystem-9f456-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "blooddonationsystem-9f456",
  storageBucket: "blooddonationsystem-9f456.firebasestorage.app",
  messagingSenderId: "160419323662",
  appId: "1:160419323662:web:27f9b58ad9cb9e07d2415f",
  measurementId: "G-YZW3HCPDMN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const analytics = getAnalytics(app);
export const db = getDatabase();
export { auth, provider };

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "advanced-ai-76e4c.firebaseapp.com",
  projectId: "advanced-ai-76e4c",
  storageBucket: "advanced-ai-76e4c.firebasestorage.app",
  messagingSenderId: "803125628084",
  appId: "1:803125628084:web:ec992513b8d0df50979be1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
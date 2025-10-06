// app/lib/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // <-- Tambahkan ini

const firebaseConfig = {
  apiKey: "AIzaSyC9pQ2S8TfT2IbR-hsQB6Zau56sBvZ_XKk",
  authDomain: "reservasikuapp.firebaseapp.com",
  projectId: "reservasikuapp",
  storageBucket: "reservasikuapp.firebasestorage.app",
  messagingSenderId: "19062788371",
  appId: "1:19062788371:web:8f0b68f1d9d492add58ae6",
  measurementId: "G-JW9DTV9WTK"
};

// Initialize Firebase
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app); // <-- Tambahkan ini

export { db, auth }; // <-- Ekspor auth
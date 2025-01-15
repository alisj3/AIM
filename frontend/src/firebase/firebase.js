// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const firebaseConfig = {
  apiKey: "AIzaSyAWitPMxtHy0182N66QSUl1ZtuxZIG1Ers",
  authDomain: "aim-db-577a9.firebaseapp.com",
  projectId: "aim-db-577a9",
  storageBucket: "aim-db-577a9.firebasestorage.app",
  messagingSenderId: "515593608994",
  appId: "1:515593608994:web:f1e6565e15af1c498fcf7b",
  measurementId: "G-PTQ47GNBKL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore(app)
export default app
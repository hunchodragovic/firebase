// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBcpSXshfXowcaQLwWAvZN1AQ3m-KXBpiw",
  authDomain: "fir-dd8b1.firebaseapp.com",
  projectId: "fir-dd8b1",
  storageBucket: "fir-dd8b1.firebasestorage.app",
  messagingSenderId: "172050588253",
  appId: "1:172050588253:web:82d608b5c616f70a5c23b4",
  measurementId: "G-CF7XBR475E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider
export const database = getFirestore(app)

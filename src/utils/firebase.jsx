// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDomioEceG-FtCv_ELiIKhRfo56v1NY4fM",
  authDomain: "my-dairy-app-1683d.firebaseapp.com",
  projectId: "my-dairy-app-1683d",
  storageBucket: "my-dairy-app-1683d.appspot.com",
  messagingSenderId: "503691797963",
  appId: "1:503691797963:web:91d1f005fb7d9ce381024e",
  measurementId: "G-7SJDW1PNC3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();
export const db = getFirestore(app);
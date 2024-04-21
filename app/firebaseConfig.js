// Config file for the NoSql database hosted at Google FireStore

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Web app's Firebase configuration

const credentials = {
  apiKey: "AIzaSyB5X6vJuZ6zqYCHsOdhdiyCnUHgkzI4dsA",
  authDomain: "user-management-b7235.firebaseapp.com",
  projectId: "user-management-b7235",
  storageBucket: "user-management-b7235.appspot.com",
  messagingSenderId: "658336029617",
  appId: "1:658336029617:web:22613886fa7e10f2363b90"
};

// Initialize Firebase
const app = initializeApp(credentials);

// Initialize database
const db = getFirestore(app);

export default db;
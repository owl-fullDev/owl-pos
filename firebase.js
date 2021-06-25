import firebase from "firebase/app";
import "firebase/auth";

var firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: "owl-system.firebaseapp.com",
  databaseURL:
    "https://owl-system-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "owl-system",
  storageBucket: "owl-system.appspot.com",
  messagingSenderId: process.env.VUE_APP_FIREBASE_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

export default auth;

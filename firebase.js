import * as firebase from 'firebase';

// Optionally import the services that you want to use
import "firebase/auth";
//import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";


// Initialize Firebase
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBQ8dx9bkh9MHUbq5qeEKWlRYFHYAJD-uY",
    authDomain: "traderank-288df.firebaseapp.com",
    databaseURL: "https://traderank-288df.firebaseio.com",
    projectId: "traderank-288df",
    storageBucket: "traderank-288df.appspot.com",
    messagingSenderId: "763046292820",
    appId: "1:763046292820:web:fcc9a159f42abb83eeacc1",
    measurementId: "G-XVT6SG0SP8"
  };
  
// Initialize Firebase
let Firebase = firebase.initializeApp(firebaseConfig)

export default Firebase
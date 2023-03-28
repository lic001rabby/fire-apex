// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: "apexvuefire",
  storageBucket: "apexvuefire.appspot.com",
  messagingSenderId: "108844212857",
  appId: "1:108844212857:web:97b5e0109eda18221e2aa8"
};




function getFirebase() {
  firebase.initializeApp(firebaseConfig);
  return firebase;
}

export { firebaseConfig, getFirebase }

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyDTuDUFRO7yBQdBfDj3z8-jRBl1hFGwq_U",
authDomain: "hspantryapp-a701a.firebaseapp.com",
projectId: "hspantryapp-a701a",
storageBucket: "hspantryapp-a701a.appspot.com",
messagingSenderId: "1071547762588",
appId: "1:1071547762588:web:3fecde968e4bbd0874aa59",
measurementId: "G-FXFE7ZE933"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore =getFirestore(app);
const analytics = getAnalytics(app);
export {app, firestore}

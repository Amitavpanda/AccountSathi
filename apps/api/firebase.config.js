

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCnAJvLBkEfQOasmJH0yPbXpsD4lrXj8Fs",
    authDomain: "inventorymanagement-379f8.firebaseapp.com",
    projectId: "inventorymanagement-379f8",
    storageBucket: "inventorymanagement-379f8.appspot.com",
    messagingSenderId: "668914571535",
    appId: "1:668914571535:web:08f9fca43ffc18de57867a",
    measurementId: "G-07SYHX4BQ9"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);


  export { app, analytics };
/// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCQfpJ56nzb2PoYz3rRWoVHeH713Adc6gA",
  authDomain: "comelonesfit-3f45a.firebaseapp.com",
  projectId: "comelonesfit-3f45a",
  storageBucket: "comelonesfit-3f45a.appspot.com",
  messagingSenderId: "247007592056",
  appId: "1:247007592056:web:410c62619df8cd5e1bb78d",
  measurementId: "G-P0742TDT6Z", // Solo si usas Analytics coloca estas claves
};

// Inicializa Firebase
let app;
let analytics;
let auth;

if (typeof window !== "undefined") {
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  auth=getAuth(app);
}

export{ auth, app, analytics };
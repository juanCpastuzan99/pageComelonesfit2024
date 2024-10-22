// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"; // Opcional: solo si usas Analytics

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCQfpJ56nzb2PoYz3rRWoVHeH713Adc6gA",
  authDomain: "comelonesfit-3f45a.firebaseapp.com",
  projectId: "comelonesfit-3f45a",
  storageBucket: "comelonesfit-3f45a.appspot.com",
  messagingSenderId: "247007592056",
  appId: "1:247007592056:web:410c62619df8cd5e1bb78d",
  measurementId: "G-P0742TDT6Z", // Solo si usas Analytics
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
let analytics;

// Verifica si estás en el navegador
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, analytics };
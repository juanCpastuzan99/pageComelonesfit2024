// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCQfpJ56nzb2PoYz3rRWoVHeH713Adc6gA",
  authDomain: "comelonesfit-3f45a.firebaseapp.com",
  projectId: "comelonesfit-3f45a",
  storageBucket: "comelonesfit-3f45a.appspot.com",
  messagingSenderId: "247007592056",
  appId: "1:247007592056:web:410c62619df8cd5e1bb78d",
  measurementId: "G-P0742TDT6Z",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
let analytics;

// Verifica si estás en el navegador
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Inicializa Auth y Firestore
const auth = getAuth(app);
const db = getFirestore(app);
export const firestore = db; // Para compatibilidad con código existente

// Inicializar Storage
export const storage = getStorage(app);

export { app, analytics, auth, db };

// Exportaciones por defecto
export default app;
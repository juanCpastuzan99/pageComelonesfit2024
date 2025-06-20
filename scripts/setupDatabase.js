// Script para configurar y verificar la base de datos
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, getDoc, writeBatch } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { db } from "../app/firebase/firebaseConfig";
import { sampleProducts } from "../app/models/Product";
import { appConfig } from "../app/config/appConfig";

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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const dbFirestore = getFirestore(app);

async function setupDatabase() {
  const auth = getAuth();
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error("Las variables de entorno NEXT_PUBLIC_ADMIN_EMAIL y NEXT_PUBLIC_ADMIN_PASSWORD son obligatorias.");
    return;
  }

  try {
    const adminUserRef = doc(db, "users", "admin_user");
    const adminUserSnap = await getDoc(adminUserRef);

    if (!adminUserSnap.exists()) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
          email: adminEmail,
          role: "owner",
          nombre: "Admin",
          apellido: "ComelonesFit",
          createdAt: new Date(),
        });
      } catch (error) {
        if (error.code !== 'auth/email-already-in-use') {
          throw error;
        }
      }
    }

    const productsCollection = collection(db, "productos");
    const productsSnapshot = await getDocs(productsCollection);

    if (productsSnapshot.empty) {
      const batch = writeBatch(dbFirestore);
      sampleProducts.forEach((product) => {
        const docRef = doc(collection(db, "productos"));
        batch.set(docRef, product);
      });
      await batch.commit();
    }

    const configRef = doc(db, "config", "appSettings");
    const configSnap = await getDoc(configRef);

    if (!configSnap.exists()) {
      await setDoc(configRef, appConfig);
    }

  } catch (error) {
    console.error("Error durante la configuración de la base de datos:", error);
  }
}

// Ejecutar la configuración
setupDatabase(); 
// Script para verificar el acceso administrativo actual
// Ejecutar con: node scripts/verifyAdminAccess.js

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCQfpJ56nzb2PoYz3rRWoVHeH713Adc6gA",
  authDomain: "comelonesfit-3f45a.firebaseapp.com",
  projectId: "comelonesfit-3f45a",
  storageBucket: "comelonesfit-3f45a.appspot.com",
  messagingSenderId: "247007592056",
  appId: "1:247007592056:web:410c62619df8cd5e1bb78d",
  measurementId: "G-P0742TDT6Z"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const OWNER_EMAIL = 'pastuzanjuancarlos@gmail.com';

async function verifyAdminAccess() {
  try {
    // Verificar lista de emails administradores
    const configDoc = await getDoc(doc(db, 'config', 'admin'));
    let adminEmails = [];
    let onlyOwnerInAdminList = false;
    if (configDoc.exists()) {
      adminEmails = configDoc.data().adminEmails || [];
      if (adminEmails.length === 1 && adminEmails[0] === OWNER_EMAIL) {
        onlyOwnerInAdminList = true;
      }
    }

    // Verificar roles de usuarios
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    const allUsers = usersSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    
    const ownerUsers = allUsers.filter(u => u.role === 'owner');
    const adminUsers = allUsers.filter(u => u.role === 'admin');

    let ownerExistsAndCorrect = false;
    const ownerUser = allUsers.find(u => u.email === OWNER_EMAIL);
    if (ownerUser) {
      if (ownerUser.role === 'owner') {
        ownerExistsAndCorrect = true;
      }
    }

    // Resumen de seguridad
    const isSecure = onlyOwnerInAdminList && ownerExistsAndCorrect && ownerUsers.length === 1 && adminUsers.length === 0;

  } catch (error) {
    console.error('❌ Error al verificar el acceso administrativo:', error);
  } finally {
    process.exit(0);
  }
}

verifyAdminAccess(); 
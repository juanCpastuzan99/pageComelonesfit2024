// Script para limpiar acceso administrativo
// Solo deja a pastuzanjuancarlos@gmail.com como administrador

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { db } from "../app/firebase/firebaseConfig.js";

// Configuración de Firebase - usar la configuración real del proyecto
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

async function cleanupAdminAccess() {
  try {
    const adminEmailsRef = doc(db, 'config', 'adminEmails');
    await setDoc(adminEmailsRef, { emails: [OWNER_EMAIL] });

    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);

    const batch = writeBatch(db);

    usersSnapshot.forEach(userDoc => {
      const user = userDoc.data();
      const userRef = doc(db, 'users', userDoc.id);

      if (user.email === OWNER_EMAIL) {
        if (user.role !== 'owner') {
          batch.update(userRef, { role: 'owner' });
        }
      } else {
        if (user.role === 'admin' || user.role === 'owner') {
          batch.update(userRef, { role: 'customer' }); 
        }
      }
    });

    await batch.commit();

  } catch (error) {
    console.error("Error al limpiar el acceso de administrador:", error);
  }
}

// Función para verificar el estado actual
async function checkCurrentStatus() {
  console.log('🔍 Verificando estado actual del sistema...');
  
  try {
    // Verificar emails admin
    const adminConfigRef = doc(db, 'config', 'adminEmails');
    const adminConfigDoc = await getDoc(adminConfigRef);
    
    if (adminConfigDoc.exists()) {
      const adminEmails = adminConfigDoc.data().emails || [];
      console.log(`📧 Emails administradores actuales: ${adminEmails.join(', ')}`);
    } else {
      console.log('📧 No hay configuración de emails admin');
    }
    
    // Verificar usuarios con roles admin/owner
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    
    const adminUsers = [];
    const ownerUsers = [];
    
    usersSnapshot.docs.forEach(doc => {
      const userData = doc.data();
      if (userData.role === 'admin') {
        adminUsers.push(userData.email);
      } else if (userData.role === 'owner') {
        ownerUsers.push(userData.email);
      }
    });
    
    console.log(`👑 Usuarios con rol 'owner': ${ownerUsers.join(', ')}`);
    console.log(`👑 Usuarios con rol 'admin': ${adminUsers.join(', ')}`);
    console.log(`👤 Total de usuarios: ${usersSnapshot.docs.length}`);
    
  } catch (error) {
    console.error('❌ Error verificando estado:', error);
  }
}

// Ejecutar el script
if (process.argv.includes('--check')) {
  checkCurrentStatus();
} else {
  cleanupAdminAccess();
}

export { cleanupAdminAccess, checkCurrentStatus }; 
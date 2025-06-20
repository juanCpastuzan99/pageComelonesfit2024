// Script para verificar el acceso administrativo usando Firebase Admin SDK
// Ejecutar con: node scripts/verifyAdminAccessAdmin.js

import admin from 'firebase-admin';

// Inicializar Firebase Admin
const serviceAccount = {
  "type": "service_account",
  "project_id": "comelonesfit-3f45a",
  "private_key_id": "tu-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\ntu-private-key\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@comelonesfit-3f45a.iam.gserviceaccount.com",
  "client_id": "tu-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40comelonesfit-3f45a.iam.gserviceaccount.com"
};

// Inicializar la app si no está inicializada
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();
const OWNER_EMAIL = 'pastuzanjuancarlos@gmail.com';

async function verifyAdminAccess() {
  try {
    // Verificar lista de emails administradores
    const configDoc = await db.collection('config').doc('adminEmails').get();
    let adminEmails = [];
    let onlyOwnerInAdminList = false;
    if (configDoc.exists) {
      adminEmails = configDoc.data().emails || [];
      if (adminEmails.length === 1 && adminEmails[0] === OWNER_EMAIL) {
        onlyOwnerInAdminList = true;
      }
    }

    // Verificar roles de usuarios
    const usersSnapshot = await db.collection('users').get();
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
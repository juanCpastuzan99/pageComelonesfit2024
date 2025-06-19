const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Configuración de Firebase (usa variables de entorno o pega aquí tu config si es necesario)
const firebaseConfig = {
  projectId: 'comelonesfit-3f45a',
};

// Inicializar Firebase Admin
initializeApp({
  credential: applicationDefault(),
  ...firebaseConfig,
});

const db = getFirestore();

async function getDashboardMetrics() {
  try {
    // Contar usuarios
    const usersSnap = await db.collection('users').get();
    const usersCount = usersSnap.size;

    // Contar productos
    const productsSnap = await db.collection('products').get();
    const productsCount = productsSnap.size;

    // Contar órdenes y sumar ventas
    const ordersSnap = await db.collection('orders').get();
    const ordersCount = ordersSnap.size;
    let sales = 0;
    ordersSnap.forEach(doc => {
      const data = doc.data();
      sales += typeof data.total === 'number' ? data.total : 0;
    });

    // Mostrar métricas
    console.log('--- MÉTRICAS DEL DASHBOARD ---');
    console.log(`Usuarios:  ${usersCount}`);
    console.log(`Productos: ${productsCount}`);
    console.log(`Órdenes:   ${ordersCount}`);
    console.log(`Ventas:    $${sales.toLocaleString()}`);
    console.log('-------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('Error obteniendo métricas:', error);
    process.exit(1);
  }
}

getDashboardMetrics(); 
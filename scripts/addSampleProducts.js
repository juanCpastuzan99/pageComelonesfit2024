const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs } = require('firebase/firestore');
const { sampleProducts } = require('../app/models/Product');
const { firebaseConfig } = require('./firebaseAdminConfig');

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const productsCollection = collection(db, 'productos');

const addSampleProducts = async () => {
  try {
    console.log('Verificando si ya existen productos...');
    const existingProductsSnapshot = await getDocs(productsCollection);
    if (!existingProductsSnapshot.empty) {
      console.log('Ya existen productos en la base de datos. No se agregarán nuevos productos de muestra.');
      return;
    }

    console.log('Agregando productos de muestra a la base de datos...');
    const results = [];
    for (const product of sampleProducts) {
      const docRef = await addDoc(productsCollection, {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      results.push(docRef.id);
      console.log(`Producto "${product.nombre}" agregado con ID: ${docRef.id}`);
    }
    console.log(`${results.length} productos de muestra agregados exitosamente.`);
  } catch (error) {
    console.error('Error agregando productos de prueba:', error);
  }
};

addSampleProducts(); 
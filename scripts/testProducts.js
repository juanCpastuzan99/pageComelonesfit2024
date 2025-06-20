// Script de prueba para verificar la funcionalidad de productos
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from './firebaseConfig'; // Asegúrate que la ruta a tu config de Firebase sea correcta
import { sampleProducts } from '../app/models/Product';

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
const db = getFirestore(app);

async function testProducts() {
  try {
    // 1. Verificar que la colección 'productos' existe
    const productsCollection = collection(db, 'productos');
    const productsSnapshot = await getDocs(productsCollection);

    // 2. Agregar un producto de prueba
    const testProduct = {
      nombre: "Producto de Prueba",
      precio: 100,
      stock: 10,
      categoria: "Pruebas",
      descripcion: "Este es un producto de prueba automatizada.",
      createdAt: new Date()
    };
    const docRef = await addDoc(productsCollection, testProduct);

    // 3. Verificar que el producto fue agregado
    const productDoc = await getDoc(doc(db, 'productos', docRef.id));

    // 4. Listar todos los productos
    const productsData = await getDocs(productsCollection);
    const products = productsData.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  } catch (error) {
    console.error("Error durante las pruebas de productos:", error);
  }
}

// Ejecutar las pruebas
testProducts(); 
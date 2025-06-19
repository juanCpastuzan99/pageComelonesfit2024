import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Product } from '../models/Product';

export const productService = {
  // Agregar un nuevo producto
  async addProduct(productData) {
    try {
      const product = new Product(productData);
      const docRef = await addDoc(collection(db, 'products'), product.toFirestore());
      return { id: docRef.id, ...productData };
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  // Obtener todos los productos
  async getAllProducts() {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      return querySnapshot.docs.map(doc => Product.fromFirestore(doc));
    } catch (error) {
      console.error('Error getting products:', error);
      throw error;
    }
  },

  // Actualizar un producto
  async updateProduct(id, productData) {
    try {
      const productRef = doc(db, 'products', id);
      const product = new Product({ ...productData, id });
      await updateDoc(productRef, product.toFirestore());
      return { id, ...productData };
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Eliminar un producto
  async deleteProduct(id) {
    try {
      await deleteDoc(doc(db, 'products', id));
      return id;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Agregar productos de prueba
  async addSampleProducts() {
    const sampleProducts = [
      {
        nombre: 'Proteína Whey Gold Standard',
        descripcion: 'Proteína de suero de leche de alta calidad, 24g de proteína por porción',
        precio: 49.99,
        imagen: 'https://example.com/whey.jpg',
        destacado: true,
        categoria: 'Suplementos',
        stock: 50,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'BCAA 2:1:1',
        descripcion: 'Aminoácidos ramificados para recuperación muscular',
        precio: 29.99,
        imagen: 'https://example.com/bcaa.jpg',
        destacado: true,
        categoria: 'Suplementos',
        stock: 30,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Creatina Monohidratada',
        descripcion: 'Creatina pura para aumentar la fuerza y masa muscular',
        precio: 19.99,
        imagen: 'https://example.com/creatine.jpg',
        destacado: false,
        categoria: 'Suplementos',
        stock: 40,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Barra de Proteína',
        descripcion: 'Snack rico en proteínas, 20g de proteína por barra',
        precio: 2.99,
        imagen: 'https://example.com/protein-bar.jpg',
        destacado: true,
        categoria: 'Snacks',
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    try {
      const results = await Promise.all(
        sampleProducts.map(product => this.addProduct(product))
      );
      console.log('Productos de prueba agregados:', results);
      return results;
    } catch (error) {
      console.error('Error adding sample products:', error);
      throw error;
    }
  }
}; 
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { sampleProducts } from '../models/Product';

const productsCollection = collection(db, 'productos');

export const productService = {
  getProducts: async ({ destacados = null, ordenarPor = 'createdAt', direccion = 'desc', limite = 20 } = {}) => {
    try {
      let q = query(productsCollection, orderBy(ordenarPor, direccion), limit(limite));
      if (destacados !== null) {
        q = query(q, where('destacado', '==', destacados));
      }

      const querySnapshot = await getDocs(q);
      const newProducts = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt),
        };
      });

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      return { newProducts, lastVisible };
    } catch (error) {
      console.error('[productService] Error al obtener productos:', error);
      throw error;
    }
  },

  addProduct: async (productData) => {
    try {
      const newProduct = {
        ...productData,
        precio: parseFloat(productData.precio) || 0,
        stock: parseInt(productData.stock, 10) || 0,
        destacado: !!productData.destacado,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const docRef = await addDoc(productsCollection, newProduct);
      return { id: docRef.id, ...newProduct };
    } catch (error) {
      console.error('[productService] Error al agregar producto:', error);
      throw error;
    }
  },

  updateProduct: async (productId, productData) => {
    try {
      const productRef = doc(db, 'productos', productId);
      const updatedData = {
        ...productData,
        updatedAt: new Date(),
      };
      if (productData.precio) {
        updatedData.precio = parseFloat(productData.precio) || 0;
      }
      if (productData.stock) {
        updatedData.stock = parseInt(productData.stock, 10) || 0;
      }
      if (productData.destacado !== undefined) {
        updatedData.destacado = !!productData.destacado;
      }
      await updateDoc(productRef, updatedData);
      return { id: productId, ...updatedData };
    } catch (error) {
      console.error(`[productService] Error al actualizar producto ${productId}:`, error);
      throw error;
    }
  },

  deleteProduct: async (productId) => {
    try {
      const productRef = doc(db, 'productos', productId);
      await deleteDoc(productRef);
    } catch (error) {
      console.error(`[productService] Error al eliminar producto ${productId}:`, error);
      throw error;
    }
  },

  addSampleProducts: async () => {
    try {
      const results = [];
      for (const product of sampleProducts) {
        const docRef = await addDoc(productsCollection, {
          ...product,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        results.push(docRef.id);
      }
      return results;
    } catch (error) {
      console.error('Error agregando productos de prueba:', error);
      throw error;
    }
  },
}; 
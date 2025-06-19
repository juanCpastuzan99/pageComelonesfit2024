import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../app/firebase/firebaseConfig';

export const useProducts = ({ destacados = false, limite = 10, ordenarPor = 'createdAt', direccion = 'desc' } = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const productsRef = collection(db, 'products');
      let q = query(productsRef);

      if (destacados) {
        q = query(q, where('destacado', '==', true));
      }

      q = query(q, orderBy(ordenarPor, direccion), limit(limite));
      
      const querySnapshot = await getDocs(q);
      const productsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setProducts(productsList);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  }, [destacados, limite, ordenarPor, direccion]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}; 
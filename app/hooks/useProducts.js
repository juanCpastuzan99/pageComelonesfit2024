// hooks/useProducts.js - Versión mejorada con logs de depuración
import { useState, useEffect, useCallback, useRef } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { productService } from '../services/productService'; // Importa el servicio

export const useProducts = (initialOptions = {}) => {
  const [products, setProducts] = useState([]);
  const productsRef = useRef(products);
  productsRef.current = products;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Opciones de filtrado y orden
  const [options, setOptions] = useState({
    searchTerm: '',
    sortOrder: 'default',
    category: '',
    destacados: null,
    ...initialOptions,
  });

  const loadProducts = useCallback(async (loadMore = false) => {
    setLoading(true);
    setError(null);
    try {
      const lastProduct = loadMore ? productsRef.current[productsRef.current.length - 1] : null;
      const { newProducts, lastVisible } = await productService.getProducts({ ...options, limit: 10, startAfter: lastProduct });
      
      setProducts(prev => loadMore ? [...prev, ...newProducts] : newProducts);
      setHasMore(!!lastVisible);
    } catch (err) {
      setError(err.message || 'Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  }, [options]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const addProduct = async (productData) => {
    try {
      const newProduct = await productService.addProduct(productData);
      setProducts(prev => [newProduct, ...prev]);
      return newProduct;
    } catch (error) {
      console.error("Error adding product in hook:", error);
      throw error;
    }
  };

  const updateProduct = async (productId, updatedData) => {
    try {
      await productService.updateProduct(productId, updatedData);
      setProducts(prev =>
        prev.map(p => (p.id === productId ? { ...p, ...updatedData } : p))
      );
    } catch (error) {
      console.error("Error updating product in hook:", error);
      throw error;
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await productService.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      console.error("Error deleting product in hook:", error);
      throw error;
    }
  };

  const categories = [...new Set((products || []).map(p => p.categoria).filter(Boolean))];

  return {
    products,
    loading,
    error,
    hasMore,
    loadMore: () => loadProducts(true),
    refetch: loadProducts,
    searchTerm: options.searchTerm,
    setSearchTerm: (term) => setOptions(prev => ({ ...prev, searchTerm: term })),
    sortOrder: options.sortOrder,
    setSortOrder: (order) => setOptions(prev => ({ ...prev, sortOrder: order })),
    category: options.category,
    setCategory: (cat) => setOptions(prev => ({ ...prev, category: cat })),
    destacados: options.destacados,
    setDestacados: (destacado) => setOptions(prev => ({ ...prev, destacados: destacado })),
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
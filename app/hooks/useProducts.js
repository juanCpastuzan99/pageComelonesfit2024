// hooks/useProducts.js - Versión mejorada con logs de depuración
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export const useProducts = (options = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    destacados = false,
    limite = null,
    ordenarPor = 'createdAt',
    direccion = 'desc'
  } = options;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Iniciando carga de productos...', { 
          destacados, 
          limite, 
          ordenarPor,
          direccion 
        });

        // Verificar conexión con Firestore
        if (!db) {
          throw new Error('No se pudo conectar con Firestore');
        }
        
        // Construir la consulta base
        let productsQuery = collection(db, 'products');
        console.log('📦 Referencia a colección products creada');
        
        // Aplicar filtros y ordenamiento
        if (destacados) {
          console.log('⭐ Aplicando filtro de productos destacados');
          productsQuery = query(
            productsQuery,
            where('destacado', '==', true),
            orderBy(ordenarPor, direccion)
          );
        } else {
          console.log('📋 Aplicando ordenamiento general');
          productsQuery = query(
            productsQuery,
            orderBy(ordenarPor, direccion)
          );
        }
        
        // Aplicar límite si se especifica
        if (limite && limite > 0) {
          console.log(`🔢 Aplicando límite de ${limite} productos`);
          productsQuery = query(productsQuery, limit(limite));
        }
        
        console.log('🔍 Ejecutando consulta a Firestore...');
        const productsSnapshot = await getDocs(productsQuery);
        console.log('✅ Consulta completada, documentos encontrados:', productsSnapshot.size);
        
        const productsList = productsSnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('📄 Producto encontrado:', { id: doc.id, ...data });
          return {
            id: doc.id,
            ...data
          };
        });
        
        console.log('📦 Total de productos cargados:', productsList.length);
        setProducts(productsList);
        
      } catch (err) {
        console.error('❌ Error al cargar productos:', err);
        setError(err.message || 'Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [destacados, limite, ordenarPor, direccion]);

  const refetch = async () => {
    console.log('🔄 Refetch solicitado');
    setLoading(true);
    setError(null);
    
    try {
      // Construir la consulta base
      let productsQuery = collection(db, 'products');
      
      // Aplicar filtros y ordenamiento
      if (destacados) {
        productsQuery = query(
          productsQuery,
          where('destacado', '==', true),
          orderBy(ordenarPor, direccion)
        );
      } else {
        productsQuery = query(
          productsQuery,
          orderBy(ordenarPor, direccion)
        );
      }
      
      // Aplicar límite si se especifica
      if (limite && limite > 0) {
        productsQuery = query(productsQuery, limit(limite));
      }
      
      const productsSnapshot = await getDocs(productsQuery);
      const productsList = productsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data
        };
      });
      
      console.log('📦 Productos recargados:', productsList.length);
      setProducts(productsList);
    } catch (err) {
      console.error('❌ Error al recargar productos:', err);
      setError(err.message || 'Error al recargar los productos');
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener IDs de productos existentes
  const getProductIds = () => {
    return products.map(p => p.id);
  };

  return { products, loading, error, refetch, getProductIds };
};
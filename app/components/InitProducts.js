'use client';
import { useState } from 'react';
import { productService } from '../services/productService';

export default function InitProducts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [productsAdded, setProductsAdded] = useState(0);

  const handleInitProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      setProductsAdded(0);
      
      console.log('🚀 Iniciando agregado de productos de prueba...');
      
      // Verificar si ya existen productos
      const existingProducts = await productService.getAllProducts();
      console.log('📊 Productos existentes:', existingProducts.length);
      
      if (existingProducts.length > 0) {
        console.log('⚠️ Ya existen productos en la base de datos');
        setError('Ya existen productos en la base de datos. Por favor, elimina los productos existentes antes de inicializar.');
        return;
      }
      
      // Agregar productos de prueba
      const results = await productService.addSampleProducts();
      console.log('✅ Productos agregados:', results);
      
      setProductsAdded(results.length);
      setSuccess(true);
    } catch (err) {
      console.error('❌ Error initializing products:', err);
      setError(err.message || 'Error al inicializar los productos');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-4 bg-green-100 text-green-700 rounded-lg">
        <p className="font-semibold">¡Productos inicializados correctamente!</p>
        <p>Se agregaron {productsAdded} productos de prueba.</p>
        <p className="mt-2">Por favor, recarga la página para ver los productos.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <button
        onClick={handleInitProducts}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Inicializando...' : 'Inicializar Productos de Prueba'}
      </button>
      {error && (
        <div className="mt-2 p-2 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
} 
"use client";
import React from 'react';
import { useProducts } from '../hooks/useProducts';
import InventoryTable from '../../components/InventoryTable';
import { useToast } from '../hooks/useToast';

const InventoryPage = () => {
  const { products, loading, error, updateProduct, deleteProduct } = useProducts();
  const { addToast } = useToast();

  const handleUpdate = async (productId, updatedData) => {
    try {
      await updateProduct(productId, updatedData);
      addToast('Producto actualizado con éxito', 'success');
    } catch (error) {
      addToast(`Error al actualizar el producto: ${error.message}`, 'error');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
          Gestión de Inventario
        </h1>
        <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
          Visualiza y administra el stock y los precios de tus productos.
        </p>
      </header>

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Cargando inventario...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12 px-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-red-500 dark:text-red-400 font-semibold">Error al cargar el inventario:</p>
          <p className="text-red-400 dark:text-red-300 text-sm mt-2">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <InventoryTable 
          products={products} 
          onUpdate={handleUpdate} 
        />
      )}
    </div>
  );
};

export default InventoryPage; 
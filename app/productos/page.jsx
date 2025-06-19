"use client";
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useProducts } from '../../hooks/useProducts';
import { usePermissions } from '../hooks/usePermissions';
import { useCart } from '../context/CartContext';
import ProductCard from '../../components/ProductCard';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../../components/ToastContainer';
import AddProductModal from '../../components/AddProductModal';
import { formatCurrency } from '../../utils/priceFormatter';

const ProductosPage = () => {
  const { products, loading: loadingProducts, error: productsError, refetch } = useProducts({
    destacados: false,
    ordenarPor: 'createdAt',
    direccion: 'desc'
  });
  const { toasts, showSuccess, removeToast } = useToast();
  const { isAdmin, canDeleteProducts, user } = usePermissions();
  const { removeDeletedProducts } = useCart();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [localProducts, setLocalProducts] = useState([]);

  // Sincronizar productos locales con los del hook
  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  const handleAddToCartSuccess = (message) => {
    showSuccess(message);
  };

  const handleProductAdded = (message) => {
    showSuccess(message);
    // Refetch products to show the new one
    if (refetch) {
      refetch();
    }
  };

  const handleProductDeleted = (productId, message) => {
    // Remover el producto de la lista local
    setLocalProducts(prevProducts => {
      const newProducts = prevProducts.filter(p => p.id !== productId);
      return newProducts;
    });
    
    // Limpiar el producto eliminado del carrito
    removeDeletedProducts([productId]);
    
    showSuccess(message);
  };

  const handleProductUpdated = (message) => {
    showSuccess(message);
    // Refetch products to show the updated one
    if (refetch) {
      refetch();
    }
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  return (
    <ProtectedRoute requiredPermission="manage_products">
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-400 dark:to-emerald-300 mb-4">
              Gestión de Productos
            </h1>
            <p className="text-xl text-green-700 dark:text-green-300">
              Administra tu catálogo de productos fitness
            </p>
          </div>

          {/* Controles de Administración */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleOpenAddModal}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl transition-all duration-300 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Nuevo Producto
                </button>
                <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-300 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Importar Productos
                </button>
              </div>
              
              <div className="flex gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    className="pl-10 pr-4 py-3 rounded-xl border border-green-200 dark:border-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  />
                  <svg className="w-5 h-5 text-green-500 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <select className="px-4 py-3 rounded-xl border border-green-200 dark:border-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white">
                  <option value="">Todas las categorías</option>
                  <option value="suplementos">Suplementos</option>
                  <option value="equipamiento">Equipamiento</option>
                  <option value="ropa">Ropa</option>
                </select>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Productos</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{localProducts.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">En Stock</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {localProducts.filter(p => p.stock > 0).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Agotados</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {localProducts.filter(p => p.stock <= 0).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Destacados</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {localProducts.filter(p => p.destacado).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Productos */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-400 dark:to-emerald-300">
                Catálogo de Productos
              </h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
                <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            </div>

            {loadingProducts ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              </div>
            ) : productsError ? (
              <div className="text-center py-12">
                <p className="text-red-600 dark:text-red-400">{productsError}</p>
              </div>
            ) : localProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No hay productos disponibles
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Comienza creando tu primer producto para tu catálogo
                </p>
                <button 
                  onClick={handleOpenAddModal}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl transition-all duration-300 flex items-center gap-2 mx-auto"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Crear Primer Producto
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {localProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showDetails={true}
                    showAdminOptions={true}
                    onViewDetails={(product) => {
                      console.log('Ver detalles:', product);
                    }}
                    onAddToCartSuccess={handleAddToCartSuccess}
                    onProductDeleted={handleProductDeleted}
                    onProductUpdated={handleProductUpdated}
                  >
                    <span className="text-xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(product.precio)}
                    </span>
                  </ProductCard>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Toast Container */}
        <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

        {/* Modal para agregar producto */}
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          onProductAdded={handleProductAdded}
        />
      </div>
    </ProtectedRoute>
  );
};

export default ProductosPage;
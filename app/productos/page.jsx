"use client";
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useProducts } from '../hooks/useProducts';
import { usePermissions } from '../hooks/usePermissions';
import { useCart } from '../context/CartContext';
import ProductCard from '../../components/ProductCard';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../../components/ToastContainer';
import AddProductModal from '../../components/AddProductModal';
import { formatCurrency } from '../../utils/priceFormatter';
import ProductDetailModal from '../../components/ProductDetailModal';

const ProductosPage = () => {
  const { products, loading: loadingProducts, error: productsError, refetch, deleteProduct } = useProducts({
    destacados: null,
    ordenarPor: 'createdAt',
    direccion: 'desc',
    limite: 100
  });
  const { toasts, showSuccess, showError, removeToast } = useToast();
  const { isAdmin } = usePermissions();
  const { removeFromCart } = useCart();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [localProducts, setLocalProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    if (products) {
      setLocalProducts(products);
    }
  }, [products]);

  const handleProductAdded = (message) => {
    showSuccess(message);
    refetch(); // Recargar la lista de productos
  };

  const handleProductDeleted = async (productId) => {
    try {
      await deleteProduct(productId);
      setLocalProducts(prev => prev.filter(p => p.id !== productId));
      removeFromCart(productId);
      showSuccess('Producto eliminado con éxito.');
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      showError('Error al eliminar el producto.');
    }
  };

  const handleProductUpdated = (message) => {
    showSuccess(message);
    refetch(); // Recargar para mostrar los cambios
  };

  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => setIsAddModalOpen(false);

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  return (
    <ProtectedRoute requiredPermission="manage_products">
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-[4.5rem] pb-6">
        <div className="w-full max-w-7xl mx-auto px-3">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-2xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-400 dark:to-emerald-300 mb-2">
              Gestión de Productos
            </h1>
            <p className="text-base sm:text-xl text-green-700 dark:text-green-300">
              Administra tu catálogo completo de productos
            </p>
          </div>

          {/* Controles de Administración */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-3 mb-4">
            <button onClick={handleOpenAddModal} className="w-full h-10 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md text-sm sm:text-base font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              Nuevo Producto
            </button>
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
              <div className="text-center py-12 text-red-500">
                <p>{productsError}</p>
              </div>
            ) : localProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Tu catálogo está vacío</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Crea tu primer producto para empezar a vender.</p>
                <button onClick={handleOpenAddModal} className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl">
                  Crear Primer Producto
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {localProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onProductDeleted={handleProductDeleted}
                    onProductUpdated={handleProductUpdated}
                    onAddToCartSuccess={showSuccess}
                    showDetails={true}
                    onViewDetails={handleViewDetails}
                    showAdminOptions={isAdmin}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onProductAdded={handleProductAdded}
      />
      <ProductDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        product={selectedProduct}
      />
    </ProtectedRoute>
  );
};

export default ProductosPage;
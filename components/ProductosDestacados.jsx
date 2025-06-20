// components/ProductosDestacados.jsx - Con debug para verificar funcionamiento
import React, { useState } from 'react';
import { useProducts } from '../app/hooks/useProducts';
import ProductCard from './ProductCard';
import { CartProvider, useCart } from "../app/context/CartContext";
import AddProductModal from './AddProductModal';
import { usePermissions } from '../app/hooks/usePermissions';
import { useToast } from '../app/hooks/useToast';
import ProductDetailModal from './ProductDetailModal';

const ProductosDestacados = ({ showLogin = false, onShowLogin }) => {
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // Usar opciones para filtrar productos destacados si es necesario
  const options = filtro === 'destacados' ? { destacados: true, fallback: true } : {};
  const { products, loading, error, refetch } = useProducts(options);
  const { addToCart } = useCart();
  const { isAdmin } = usePermissions();
  const { showSuccess } = useToast();

  // Filtrar productos por búsqueda EN MEMORIA
  const productsFiltrados = (products || []).filter(product => {
    if (!busqueda) return true;
    
    const nombre = (product.nombre || '').toLowerCase();
    const descripcion = (product.descripcion || '').toLowerCase();
    const busquedaLower = busqueda.toLowerCase();
    
    return nombre.includes(busquedaLower) || descripcion.includes(busquedaLower);
  });

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleProductAdded = (message) => {
    showSuccess(message);
    // Refetch products to show the new one
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

  const handleAddToCart = (product) => {
    addToCart(product);
    if (onShowLogin) {
      onShowLogin();
    }
    if (showSuccess) {
      showSuccess(`${product.nombre} agregado al carrito.`);
    }
  };

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-8">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
            Error al cargar productos
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Recargar página
          </button>
        </div>
      </div>
    );
  }

  return (
    <CartProvider>
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-400 dark:to-emerald-300">
            {showLogin ? 'Productos Destacados' : 'Productos Disponibles'}
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Campo de búsqueda */}
            <div className="relative">
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar productos..."
                className="px-4 py-2 pl-10 rounded-xl border border-green-200 dark:border-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white w-full sm:w-64"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Filtros - Solo mostrar si no es homepage */}
            {!showLogin && (
              <select
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="px-4 py-2 rounded-xl border border-green-200 dark:border-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="todos">Todos los productos</option>
                <option value="destacados">Solo destacados</option>
              </select>
            )}

            {/* Botón de nuevo producto - Solo si no es homepage y es admin */}
            {!showLogin && isAdmin && (
              <button 
                onClick={handleOpenAddModal}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nuevo Producto
              </button>
            )}
          </div>
        </div>

        {/* Debug info - Solo en desarrollo */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs">
            Debug: {products?.length ?? 0} productos totales, {productsFiltrados.length} filtrados, 
            filtro: {filtro}, búsqueda: {busqueda}, loading: {loading ? 'Sí' : 'No'}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            <span className="ml-4 text-gray-600 dark:text-gray-400">Cargando productos...</span>
          </div>
        ) : productsFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {busqueda 
                ? <>No hay resultados para tu búsqueda: <strong>{busqueda}</strong></>
                : (products?.length ?? 0) === 0 
                  ? 'No hay productos disponibles. Agrega algunos productos en Firebase.' 
                  : 'No hay productos destacados disponibles'
              }
            </p>
            {busqueda && (
              <button 
                onClick={() => setBusqueda('')}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productsFiltrados.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showDetails={true}
                  onViewDetails={handleViewDetails}
                  onAddToCart={() => handleAddToCart(product)}
                  showAdminOptions={!showLogin && isAdmin}
                />
              ))}
            </div>
            
            {productsFiltrados.length > 0 && (
              <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                Mostrando {productsFiltrados.length} de {products?.length ?? 0} productos
                {busqueda && ` para "${busqueda}"`}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal para agregar producto */}
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
    </CartProvider>
  );
};

export default ProductosDestacados;
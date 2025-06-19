// components/ProductosDestacados.jsx - Con debug para verificar funcionamiento
import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from './ProductCard';
import { CartProvider, useCart } from "./context/CartContext";

const ProductosDestacados = ({ showLogin = false, onShowLogin }) => {
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  
  console.log('🎯 ProductosDestacados render:', { showLogin, filtro });
  
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();

  console.log('📊 Estado del hook:', { 
    productos: products.length, 
    loading, 
    error: error ? 'Sí' : 'No' 
  });

  // Filtrar productos por búsqueda EN MEMORIA
  const productsFiltrados = products.filter(product => {
    if (!busqueda) return true;
    
    const nombre = (product.name || '').toLowerCase();
    const descripcion = (product.description || '').toLowerCase();
    const busquedaLower = busqueda.toLowerCase();
    
    return nombre.includes(busquedaLower) || descripcion.includes(busquedaLower);
  });

  console.log('🔍 Productos después de búsqueda:', productsFiltrados.length);

  const handleViewDetails = (product) => {
    console.log('👁️ Ver detalles:', product.name);
    if (onShowLogin) {
      onShowLogin();
    } else {
      console.log('Mostrar detalles de:', product);
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
            {/* Búsqueda */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl border border-green-200 dark:border-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              />
              <svg className="w-5 h-5 text-green-500 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            {/* Botón de nuevo producto - Solo si no es homepage */}
            {!showLogin && (
              <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl transition-all duration-300 flex items-center gap-2">
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
            Debug: {products.length} productos totales, {productsFiltrados.length} filtrados, 
            filtro: {filtro}, búsqueda: "{busqueda}", loading: {loading ? 'Sí' : 'No'}
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
                ? <>No se encontraron productos para: {busqueda}</>
                : products.length === 0 
                  ? 'No hay productos disponibles. Agrega algunos productos en Firebase.' 
                  : 'No hay productos destacados disponibles'
              }
            </p>
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
                  onAddToCart={addToCart}
                />
              ))}
            </div>
            
            {productsFiltrados.length > 0 && (
              <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                Mostrando {productsFiltrados.length} de {products.length} productos
              </div>
            )}
          </>
        )}
      </div>
    </CartProvider>
  );
};

export default ProductosDestacados;
"use client";
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from './context/AuthContext';
import { usePermissions } from './hooks/usePermissions';
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import LoginForm from './components/auth/LoginForm';
import ToastContainer from '../components/ToastContainer';
import CartSyncStatus from '../components/CartSyncStatus';
import { useToast } from './hooks/useToast';
import { SidebarProvider } from './context/SidebarContext';
import ContentWithDynamicPadding from './(protected)/ContentWithDynamicPadding';

// Componente principal de la aplicación con toda la lógica
function AppContent() {
  const { user, loading } = useAuth();
  const { isAdmin } = usePermissions();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const [showLogin, setShowLogin] = useState(false);
  const [loginMode, setLoginMode] = useState('login');
  const { toasts, showSuccess, removeToast } = useToast();

  
  // Usar el hook useProducts
  const { products, loading: loadingProducts, error: productsError } = useProducts({
    destacados: false,
    ordenarPor: 'createdAt',
    direccion: 'desc'
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }, [isDarkMode]);

  const handleAddToCartSuccess = (message) => {
    showSuccess(message);
  };

  // Mostrar loading mientras se verifica autenticación
  if (loading) {
    return (
      <div className="min-h-screen d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-muted">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario y showLogin es true, mostrar página de login
  if (!user && showLogin) {
    return (
      <div className="min-h-screen d-flex align-items-center justify-content-center bg-light">
        <div className="card shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
          <div className="card-body p-4">
            <div className="text-center mb-4">
              <h2 className="card-title h3 text-primary">Hermita super market</h2>
              <p className="text-muted">Acceso rápido</p>
            </div>
            <LoginForm initialMode={loginMode} />
          </div>
        </div>
      </div>
    );
  }

  // Usuario autenticado - mostrar interfaz completa
  if (user) {
    return (
      <SidebarProvider>
        <Navbar 
          className="fixed top-0 left-0 w-full z-40" 
          onShowLogin={setShowLogin}
          setLoginMode={setLoginMode}
        />
        <Sidebar />
        <ContentWithDynamicPadding>
          <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="flex-1 flex flex-col min-w-0">
              <main className="flex-1 p-8">
                <div className="max-w-7xl mx-auto">
                  {/* Sección de Bienvenida */}
                  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-8 transform hover:scale-[1.02] transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-400 dark:to-emerald-300 mb-4">
                          ¡Bienvenido, {user.email?.split('@')[0] || 'Usuario'}!
                        </h1>
                        <p className="text-xl text-green-700 dark:text-green-300">
                          {isAdmin ? 'Panel de Administración' : '¡Estamos listos para ayudarte a alcanzar tus objetivos fitness!'}
                        </p>
                        {isAdmin && (
                          <div className="mt-2 flex items-center space-x-2">
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                              👑 Administrador
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Acceso completo a todas las funciones
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600 rounded-2xl flex items-center justify-center">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Resumen de Actividad - Solo para administradores */}
                  {isAdmin && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">Productos</h3>
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{products.length}</p>
                        <p className="text-sm text-green-600 dark:text-green-400">Total de productos</p>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">Clientes</h3>
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">1,234</p>
                        <p className="text-sm text-green-600 dark:text-green-400">Clientes activos</p>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">Pedidos</h3>
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                          </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">89</p>
                        <p className="text-sm text-green-600 dark:text-green-400">Pedidos este mes</p>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">Ventas</h3>
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">$12,345</p>
                        <p className="text-sm text-green-600 dark:text-green-400">Ventas totales</p>
                      </div>
                    </div>
                  )}

                  {/* Productos Disponibles */}
                  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-400 dark:to-emerald-300">
                        {isAdmin ? 'Gestión de Productos' : 'Productos Destacados'}
                      </h2>
                      <div className="flex gap-4">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Buscar productos..."
                            className="pl-10 pr-4 py-2 rounded-xl border border-green-200 dark:border-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                          />
                          <svg className="w-5 h-5 text-green-500 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        {/* Botón de Nuevo Producto - Solo para administradores */}
                        {isAdmin && (
                          <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl transition-all duration-300 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Nuevo Producto
                          </button>
                        )}
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
                    ) : products.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400">
                          {isAdmin ? 'No hay productos disponibles. Crea el primer producto.' : 'No hay productos disponibles'}
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            showDetails={true}
                            onViewDetails={(product) => {
                              // Aquí puedes agregar la lógica para ver detalles del producto
                              console.log('Ver detalles:', product);
                            }}
                            onAddToCartSuccess={handleAddToCartSuccess}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </main>
            </div>

            {/* Toast Container */}
            <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
            
            {/* Cart Sync Status - Solo para usuarios autenticados */}
            <CartSyncStatus />
          </div>
        </ContentWithDynamicPadding>
      </SidebarProvider>
    );
  }

  // Página de inicio para usuarios no autenticados
  return (
    <>
      <Navbar 
        onShowLogin={setShowLogin}
        setLoginMode={setLoginMode}
      />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-400 dark:to-emerald-300 mb-6">
              ComelonesFit
            </h1>
            <p className="text-xl md:text-2xl text-green-700 dark:text-green-300 mb-8 max-w-3xl mx-auto">
              Tu tienda de confianza para productos fitness y suplementos saludables. Transforma tu vida con los mejores productos para tu bienestar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  setLoginMode('login');
                  setShowLogin(true);
                }}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Comenzar Ahora
              </button>
              <button 
                onClick={() => {
                  setLoginMode('register');
                  setShowLogin(true);
                }}
                className="px-8 py-4 bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 border-2 border-green-500 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Crear Cuenta
              </button>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-4">Productos de Calidad</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Seleccionamos cuidadosamente los mejores productos fitness y suplementos para tu salud
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-4">Envío Rápido</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Recibe tus productos en la puerta de tu casa con nuestro servicio de entrega confiable
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-4">Atención Personalizada</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Nuestro equipo está aquí para ayudarte a encontrar los productos perfectos para tus objetivos
              </p>
            </div>
          </div>

          {/* Productos Disponibles - Ahora visible para todos */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-400 dark:to-emerald-300 mb-4">
                Nuestros Productos
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Descubre nuestra amplia gama de productos fitness y suplementos para potenciar tu rendimiento
              </p>
            </div>

            {loadingProducts ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              </div>
            ) : productsError ? (
              <div className="text-center py-12">
                <p className="text-red-600 dark:text-red-400">{productsError}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">No hay productos disponibles en este momento</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showDetails={true}
                    onViewDetails={(product) => {
                      // Aquí puedes agregar la lógica para ver detalles del producto
                      console.log('Ver detalles:', product);
                    }}
                    onAddToCartSuccess={handleAddToCartSuccess}
                  />
                ))}
              </div>
            )}

            {/* Call to Action para registrarse */}
            <div className="text-center mt-12">
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                ¿Quieres acceder a descuentos exclusivos y recibir notificaciones de nuevos productos?
              </p>
              <button 
                onClick={() => {
                  setLoginMode('register');
                  setShowLogin(true);
                }}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Crear Cuenta Gratis
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function Home() {
  return <AppContent />;
}
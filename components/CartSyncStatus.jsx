import React from 'react';
import { useCart } from '../app/context/CartContext';
import { useAuth } from '../app/context/AuthContext';

const CartSyncStatus = () => {
  const { loading, error, syncCartWithDatabase, loadCartFromDatabase } = useCart();
  const { user } = useAuth();

  if (!user) {
    return null; // No mostrar para usuarios no autenticados
  }

  return (
    <div className="fixed bottom-4 left-4 z-40">
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg shadow-lg mb-2 max-w-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Error de sincronización</span>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <p className="text-xs mt-1">{error}</p>
        </div>
      )}

      {loading && (
        <div className="bg-blue-100 dark:bg-blue-900 border border-blue-400 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-lg shadow-lg max-w-sm">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-sm font-medium">Sincronizando carrito...</span>
          </div>
        </div>
      )}

      {/* Botones de sincronización manual */}
      <div className="flex space-x-2 mt-2">
        <button
          onClick={syncCartWithDatabase}
          disabled={loading}
          className="px-3 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white text-xs rounded-lg transition-colors duration-300 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Sincronizar
        </button>
        <button
          onClick={loadCartFromDatabase}
          disabled={loading}
          className="px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white text-xs rounded-lg transition-colors duration-300 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Recargar
        </button>
      </div>
    </div>
  );
};

export default CartSyncStatus; 
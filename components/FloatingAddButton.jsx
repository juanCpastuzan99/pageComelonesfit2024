"use client";

import React, { useState } from 'react';
import { usePermissions } from '../app/hooks/usePermissions';
import { useToast } from '../app/hooks/useToast';
import { useProducts } from '../app/hooks/useProducts';
import AddProductModal from './AddProductModal';

const FloatingAddButton = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { isAdmin } = usePermissions();
  const { showSuccess } = useToast();
  const { refetch } = useProducts();

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

  // Solo mostrar si es admin
  if (!isAdmin) {
    return null;
  }

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={handleOpenAddModal}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 transform hover:scale-110"
        title="Agregar nuevo producto"
        aria-label="Agregar nuevo producto"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>

      {/* Modal para agregar producto */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onProductAdded={handleProductAdded}
      />
    </>
  );
};

export default FloatingAddButton; 
// components/ProductCard.jsx
import React, { useState } from 'react';
import { useCart } from '../app/context/CartContext';
import { usePermissions } from '../app/hooks/usePermissions';
import { productService } from '../app/services/productService';
import EditProductModal from './EditProductModal';
import { formatCurrency } from '../utils/priceFormatter';

const ProductCard = ({ product, showDetails = false, onViewDetails, onAddToCartSuccess, showAdminOptions = false, onProductDeleted, onProductUpdated }) => {
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { isAdmin, canEditProducts, canDeleteProducts } = usePermissions();
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const getStockStatus = (stock) => {
    if (stock > 10) return { text: 'En Stock', class: 'bg-green-500' };
    if (stock > 0) return { text: 'Últimas Unidades', class: 'bg-yellow-500' };
    return { text: 'Agotado', class: 'bg-red-500' };
  };

  const stockStatus = getStockStatus(product.stock || 0);

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/500x300?text=Sin+Imagen";
  };

  const handleAddToCart = async () => {
    if (product.stock <= 0) return;
    
    setIsAdding(true);
    try {
      addToCart(product);
      
      // Mostrar notificación de éxito
      if (onAddToCartSuccess) {
        onAddToCartSuccess(`${product.nombre || product.name} agregado al carrito`);
      }
      
      // Simular un pequeño delay para mostrar feedback visual
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditProduct = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleProductUpdated = (message) => {
    if (onProductUpdated) {
      onProductUpdated(message);
    }
  };

  const handleDeleteProduct = async () => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar "${product.nombre || product.name}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await productService.deleteProduct(product.id);
      
      // Notificar al componente padre que el producto fue eliminado
      if (onProductDeleted) {
        onProductDeleted(product.id, `${product.nombre || product.name} eliminado exitosamente`);
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      alert('Error al eliminar el producto. Por favor, intenta de nuevo.');
    } finally {
      setIsDeleting(false);
    }
  };

  const cartQuantity = getItemQuantity(product.id);
  const isInCartItem = isInCart(product.id);

  return (
    <>
      <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1">
        <div className="relative h-48 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900">
          <img
            src={product.imagen || product.image || product.imageUrl || "https://via.placeholder.com/500x300?text=Sin+Imagen"}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
          
          {/* Badge de stock */}
          <div className="absolute top-2 right-2">
            <span className={`px-3 py-1 text-white text-sm rounded-full ${stockStatus.class}`}>
              {stockStatus.text}
            </span>
          </div>
          
          {/* Badge de destacado */}
          {product.destacado && (
            <div className="absolute top-2 left-2">
              <span className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-full flex items-center">
                ⭐ Destacado
              </span>
            </div>
          )}

          {/* Badge de cantidad en carrito */}
          {isInCartItem && cartQuantity > 0 && (
            <div className="absolute bottom-2 left-2">
              <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-full flex items-center">
                🛒 {cartQuantity}
              </span>
            </div>
          )}

          {/* Opciones de administración - Solo para administradores */}
          {isAdmin && showAdminOptions && (
            <div className="absolute top-2 left-2 right-2 flex justify-between">
              <div className="flex gap-1">
                {canEditProducts && (
                  <button
                    onClick={handleEditProduct}
                    className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                    title="Editar producto"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
                {canDeleteProducts && (
                  <button
                    onClick={handleDeleteProduct}
                    disabled={isDeleting}
                    className={`p-1 text-white rounded-full transition-colors ${
                      isDeleting 
                        ? 'bg-gray-500 cursor-not-allowed' 
                        : 'bg-red-500 hover:bg-red-600'
                    }`}
                    title={isDeleting ? "Eliminando..." : "Eliminar producto"}
                  >
                    {isDeleting ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
              <div className="flex items-center">
                <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                  Admin
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {product.nombre || product.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {product.descripcion || product.description}
          </p>
          
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(product.precio)}
              </span>
              {product.originalPrice && product.originalPrice > (product.precio ?? 0) && (
                <span className="text-sm text-gray-500 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            
            <div className="flex gap-2">
              {/* Botón de ver detalles */}
              {showDetails && onViewDetails && (
                <button 
                  onClick={() => onViewDetails(product)}
                  className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-300"
                  title="Ver detalles"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              )}
              
              {/* Botón de agregar al carrito */}
              <button 
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || isAdding}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  product.stock > 0 && !isAdding
                    ? isInCartItem
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                } ${isAdding ? 'animate-pulse' : ''}`}
                title={product.stock > 0 ? (isInCartItem ? "Agregado al carrito" : "Agregar al carrito") : "Producto agotado"}
              >
                {isAdding ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : isInCartItem ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Información adicional para administradores */}
          {isAdmin && showAdminOptions && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
                <div>
                  <span className="font-medium">Stock:</span> {product.stock || 0}
                </div>
                <div>
                  <span className="font-medium">ID:</span> {product.id}
                </div>
                <div>
                  <span className="font-medium">Categoría:</span> {product.categoria || product.category || 'Sin categoría'}
                </div>
                <div>
                  <span className="font-medium">Creado:</span> {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de edición */}
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onProductUpdated={handleProductUpdated}
        product={product}
      />
    </>
  );
};

export default ProductCard;
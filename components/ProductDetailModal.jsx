"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTag, FaInfoCircle, FaBoxOpen } from 'react-icons/fa';
import { formatCurrency } from '../utils/priceFormatter';
import Image from 'next/image';

const ProductDetailModal = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;

  const getStockStatus = (stock) => {
    if (stock > 10) return { text: 'En Stock', class: 'text-green-500' };
    if (stock > 0) return { text: 'Últimas Unidades', class: 'text-yellow-500' };
    return { text: 'Agotado', class: 'text-red-500' };
  };
  const stockStatus = getStockStatus(product.stock);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-gray-800/50 text-white rounded-full hover:bg-gray-800/80 transition-colors"
            >
              <FaTimes />
            </button>

            <div className="w-full h-64 bg-gray-200 dark:bg-gray-700">
              <Image
                src={product.imagen || "https://placehold.co/600x400?text=Sin+Imagen"}
                alt={product.nombre}
                width={600}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 md:p-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.nombre}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{product.descripcion}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-xl">
                  <FaTag className="mx-auto text-green-500 text-2xl mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Precio</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(product.precio)}</p>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-xl">
                  <FaBoxOpen className="mx-auto text-blue-500 text-2xl mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Stock</p>
                  <p className={`text-xl font-bold ${stockStatus.class}`}>{stockStatus.text}</p>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-xl">
                  <FaInfoCircle className="mx-auto text-purple-500 text-2xl mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Categoría</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{product.categoria || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductDetailModal; 
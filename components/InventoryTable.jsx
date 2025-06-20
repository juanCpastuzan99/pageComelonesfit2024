"use client";
import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/priceFormatter';
import Image from 'next/image';
import { FaSave, FaTimes, FaPencilAlt } from 'react-icons/fa';

const InventoryTable = ({ products, onUpdate }) => {
  const [editableProducts, setEditableProducts] = useState({});

  useEffect(() => {
    if (!products) return;
    const initialEditable = products.reduce((acc, product) => {
      acc[product.id] = {
        precio: product.precio,
        stock: product.stock,
      };
      return acc;
    }, {});
    setEditableProducts(initialEditable);
  }, [products]);

  const handleInputChange = (productId, field, value) => {
    setEditableProducts(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const handleSave = (productId) => {
    const updatedData = editableProducts[productId];
    onUpdate(productId, {
      precio: parseFloat(updatedData.precio) || 0,
      stock: parseInt(updatedData.stock, 10) || 0,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Producto</th>
              <th scope="col" className="px-6 py-3">Categoría</th>
              <th scope="col" className="px-6 py-3 text-center">Precio</th>
              <th scope="col" className="px-6 py-3 text-center">Stock</th>
              <th scope="col" className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {(products || []).map((product) => (
              <tr key={product.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <Image
                      src={product.imagen || "https://placehold.co/100x100?text=N/A"}
                      alt={product.nombre}
                      width={40}
                      height={40}
                      className="rounded-lg object-cover"
                    />
                    <span>{product.nombre}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{product.categoria || 'N/A'}</td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={editableProducts[product.id]?.precio ?? ''}
                    onChange={(e) => handleInputChange(product.id, 'precio', e.target.value)}
                    className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-center"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={editableProducts[product.id]?.stock ?? ''}
                    onChange={(e) => handleInputChange(product.id, 'stock', e.target.value)}
                    className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-center"
                  />
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleSave(product.id)}
                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <FaSave />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable; 
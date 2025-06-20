"use client";
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { useProducts } from '../../../app/hooks/useProducts';
import { formatCurrency } from '../../../utils/priceFormatter';
import { FaBoxes, FaChartLine, FaUsers, FaExclamationTriangle, FaTrophy, FaSpinner } from 'react-icons/fa';
import { reportService } from '../../../app/services/reportService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const InventoryTable = ({ products, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>Error al cargar el inventario: {error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <FaBoxes className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold">No se encontraron productos</h3>
        <p>Tu inventario está vacío. Agrega productos para verlos aquí.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700/50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Producto</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Categoría</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Precio</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Stock</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estado</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{product.nombre}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">{product.categoria}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="text-sm text-gray-900 dark:text-white">{formatCurrency(product.precio)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  product.stock > 10 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  product.stock > 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {product.stock}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                {product.stock === 0 && (
                  <span className="inline-flex items-center gap-2 text-red-600 dark:text-red-400">
                    <FaExclamationTriangle />
                    Agotado
                  </span>
                )}
                 {product.stock > 0 && product.stock <= 10 && (
                  <span className="inline-flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                    <FaExclamationTriangle />
                    Bajo Stock
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const BestSellersReport = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await reportService.getSalesAnalytics();
        setAnalytics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 gap-3">
        <FaSpinner className="animate-spin text-blue-500" />
        <p className="text-gray-500 dark:text-gray-400">Calculando analíticas de ventas...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error: {error}</div>;
  }
  
  if (!analytics || analytics.bestSellers.length === 0) {
    return (
       <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <FaTrophy className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold">No hay datos de ventas</h3>
        <p>Aún no se han registrado pedidos para calcular los productos más vendidos.</p>
      </div>
    );
  }

  const maxSold = Math.max(...analytics.bestSellers.map(p => p.totalSold), 0);

  return (
    <ul className="space-y-4">
      {analytics.bestSellers.map((product, index) => (
        <li key={product.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex items-center gap-4">
            <span className={`text-lg font-bold w-8 text-center ${index < 3 ? 'text-yellow-500' : 'text-gray-400'}`}>#{index + 1}</span>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 dark:text-white">{product.nombre}</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-1">
                <div 
                  className="bg-blue-500 h-2.5 rounded-full" 
                  style={{ width: `${(product.totalSold / maxSold) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900 dark:text-white">{product.totalSold}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">unidades</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

const SalesChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportService.getSalesOverTime(30)
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80 gap-3">
        <FaSpinner className="animate-spin text-blue-500" />
        <p className="text-gray-500 dark:text-gray-400">Cargando datos del gráfico...</p>
      </div>
    );
  }
  
  const formatYAxis = (tick) => formatCurrency(tick);
  const formatTooltip = (value) => formatCurrency(value);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} />
        <Tooltip formatter={formatTooltip} />
        <Legend />
        <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} name="Ingresos" />
      </LineChart>
    </ResponsiveContainer>
  );
};

const ReportesPage = () => {
  const { products, loading: loadingProducts, error: productsError } = useProducts({
    destacados: null,
    limite: 1000,
  });

  const stats = {
    totalProducts: products.length,
    outOfStock: products.filter(p => p.stock === 0).length,
    totalUsers: 0, // Placeholder
  };

  return (
    <ProtectedRoute requiredPermission="access_admin">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Cabecera */}
          <header className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Reportes y Estadísticas
            </h1>
            <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
              Una vista detallada del rendimiento de tu negocio.
            </p>
          </header>

          {/* Tarjetas de estadísticas rápidas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-6">
              <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full">
                <FaBoxes className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Productos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{loadingProducts ? '...' : stats.totalProducts}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-6">
              <div className="bg-red-100 dark:bg-red-900 p-4 rounded-full">
                <FaExclamationTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Productos Agotados</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{loadingProducts ? '...' : stats.outOfStock}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-6">
              <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-full">
                <FaUsers className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Usuarios</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          {/* Gráfico de Ventas */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 mt-10">
             <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                <FaChartLine className="text-green-500" />
                Ingresos en los Últimos 30 Días
              </h2>
              <SalesChart />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Reporte de Productos Más Vendidos */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                <FaTrophy className="text-yellow-500" />
                Productos Más Vendidos (Top 10)
              </h2>
              <BestSellersReport />
            </div>

            {/* Reporte de Inventario */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                Reporte de Inventario
              </h2>
              <InventoryTable products={products} loading={loadingProducts} error={productsError} />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ReportesPage; 
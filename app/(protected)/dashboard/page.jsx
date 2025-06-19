"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaWeight, FaRuler, FaFire, FaChartLine, FaHeartbeat, FaTrophy, FaPlus } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserMetrics, selectImcCategory, selectImcColor, selectTrendIcon, selectTrendText } from '../../../store/slices/userMetricsSlice';
import AddMetricsModal from '../../../components/AddMetricsModal';
import { collection, getCountFromServer, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { usePermissions } from '../../hooks/usePermissions';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const dispatch = useDispatch();
  const userMetrics = useSelector((state) => state.userMetrics);
  const { isAdmin } = usePermissions();

  const [showAddModal, setShowAddModal] = useState(false);

  // Estados para los totales
  const [totals, setTotals] = useState({
    users: 0,
    products: 0,
    orders: 0,
    sales: 0
  });
  const [loadingTotals, setLoadingTotals] = useState(true);

  // Proteger la ruta usando useAuth
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [user, authLoading, router]);

  // Cargar métricas del usuario
  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchUserMetrics(user.uid));
    }
  }, [user?.uid, dispatch]);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchTotals = async () => {
      setLoadingTotals(true);
      try {
        // Contar usuarios
        const usersSnap = await getCountFromServer(collection(db, 'users'));
        // Contar productos
        const productsSnap = await getCountFromServer(collection(db, 'products'));
        // Contar pedidos y sumar ventas
        const ordersSnap = await getDocs(collection(db, 'orders'));
        let sales = 0;
        ordersSnap.forEach(doc => {
          const data = doc.data();
          sales += typeof data.total === 'number' ? data.total : 0;
        });
        setTotals({
          users: usersSnap.data().count,
          products: productsSnap.data().count,
          orders: ordersSnap.size,
          sales
        });
      } catch (e) {
        setTotals({ users: 0, products: 0, orders: 0, sales: 0 });
      } finally {
        setLoadingTotals(false);
      }
    };
    fetchTotals();
  }, [isAdmin]);

  // Mostrar loading mientras se verifica autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, no mostrar nada (se está redirigiendo)
  if (!user) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardHoverVariants = {
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  // Funciones auxiliares para métricas
  const getImcCategory = selectImcCategory;
  const getImcColor = selectImcColor;
  const getTrendIcon = selectTrendIcon;
  const getTrendText = selectTrendText;

  // Usar stats de Redux o valores por defecto
  const weeklyStats = userMetrics.stats?.weekly || {
    averageWeight: 0,
    averageHeight: 0,
    weeklyCalories: 0,
    imc: 0,
    totalEntries: 0
  };

  const { averageWeight, averageHeight, weeklyCalories, imc } = weeklyStats;

  const metrics = [
    {
      id: 'imc',
      title: 'Índice de Masa Corporal',
      value: imc > 0 ? imc.toFixed(1) : '--',
      unit: imc > 0 ? getImcCategory(imc) : 'Sin datos',
      icon: FaWeight,
      color: imc > 0 ? getImcColor(imc) : '#6B7280',
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
      hoverBg: 'hover:from-blue-600 hover:to-blue-700',
      isEmpty: imc === 0
    },
    {
      id: 'calories',
      title: 'Calorías Semanales',
      value: weeklyCalories > 0 ? weeklyCalories.toLocaleString() : '--',
      unit: 'kcal',
      icon: FaFire,
      color: weeklyCalories > 0 ? '#F97316' : '#6B7280',
      bgColor: 'bg-gradient-to-br from-orange-500 to-orange-600',
      hoverBg: 'hover:from-orange-600 hover:to-orange-700',
      isEmpty: weeklyCalories === 0
    },
    {
      id: 'height',
      title: 'Estatura Promedio',
      value: averageHeight > 0 ? averageHeight.toFixed(1) : '--',
      unit: 'cm',
      icon: FaRuler,
      color: averageHeight > 0 ? '#0EA5E9' : '#6B7280',
      bgColor: 'bg-gradient-to-br from-sky-500 to-sky-600',
      hoverBg: 'hover:from-sky-600 hover:to-sky-700',
      isEmpty: averageHeight === 0
    },
    {
      id: 'weight',
      title: 'Peso Promedio',
      value: averageWeight > 0 ? averageWeight.toFixed(1) : '--',
      unit: 'kg',
      icon: FaChartLine,
      color: averageWeight > 0 ? '#8B5CF6' : '#6B7280',
      bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600',
      hoverBg: 'hover:from-purple-600 hover:to-purple-700',
      isEmpty: averageWeight === 0
    }
  ];

  // Tarjetas de resumen admin
  const adminCards = [
    { label: 'Usuarios', value: totals.users, color: 'bg-blue-500' },
    { label: 'Productos', value: totals.products, color: 'bg-green-500' },
    { label: 'Pedidos', value: totals.orders, color: 'bg-yellow-500' },
    { label: 'Ventas', value: `$${totals.sales.toLocaleString('es-CO')}`, color: 'bg-emerald-500' },
  ];

  // Loading state
  if (userMetrics.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Cargando métricas...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (userMetrics.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-md w-full mx-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <div className="text-red-500 text-2xl mb-3">⚠️</div>
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Error al cargar las métricas
            </h3>
            <p className="text-red-600 dark:text-red-300 text-sm mb-4">
              {userMetrics.error}
            </p>
            <button 
              onClick={() => dispatch(fetchUserMetrics(user.uid))}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors mr-2"
            >
              Reintentar
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
            >
              Agregar datos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 shadow-md" role="banner">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg" aria-hidden="true">
                  <FaHeartbeat className="text-white text-xl" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent tracking-tight leading-tight">
                    Dashboard de Salud
                  </h1>
                  <p className="text-slate-700 dark:text-slate-300 text-base md:text-lg font-medium mt-1">
                    Monitorea tu progreso hacia un estilo de vida más saludable
                  </p>
                </div>
              </div>
              <div className="flex justify-center md:justify-end">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-4 focus-visible:ring-emerald-400 focus-visible:outline-none text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl outline-none"
                  aria-label="Agregar Métricas"
                >
                  <FaPlus className="text-sm" aria-hidden="true" />
                  <span>Agregar Métricas</span>
                </button>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" role="main">
          {/* Metrics Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {metrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <motion.div
                  key={metric.id}
                  variants={itemVariants}
                  whileHover="hover"
                  className="group focus-within:ring-4 focus-within:ring-emerald-300 rounded-2xl transition-all"
                  tabIndex={0}
                  aria-label={metric.title}
                >
                  <motion.div
                    className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 p-7 shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col justify-between"
                    variants={cardHoverVariants}
                  >
                    {/* Top accent line */}
                    <div 
                      className="h-1 w-full rounded-full mb-6 bg-gradient-to-r opacity-90"
                      style={{
                        background: `linear-gradient(90deg, transparent 0%, ${metric.color}cc 50%, transparent 100%)`
                      }}
                      aria-hidden="true"
                    />

                    {/* Header with icon and trophy */}
                    <div className="flex items-start justify-between mb-6">
                      <div 
                        className={`w-12 h-12 rounded-xl ${metric.bgColor} ${metric.hoverBg} flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110`}
                        aria-hidden="true"
                      >
                        <IconComponent className="text-white text-xl" />
                        <span className="sr-only">{metric.title}</span>
                      </div>
                      {metric.id === 'imc' && imc >= 18.5 && imc < 25 && (
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-md" aria-label="IMC saludable">
                          <FaTrophy className="text-white text-sm" />
                          <span className="sr-only">IMC saludable</span>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-semibold text-slate-700 dark:text-slate-200 mb-3 leading-tight">
                      {metric.title}
                    </h3>

                    {/* Value */}
                    <div className="mb-2">
                      {metric.isEmpty ? (
                        <div className="space-y-2">
                          <span className="text-3xl font-bold text-slate-400 dark:text-slate-500">
                            {metric.value}
                          </span>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            <button 
                              className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 underline focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none rounded"
                              onClick={() => setShowAddModal(true)}
                              aria-label={`Agregar datos para ${metric.title}`}
                            >
                              Agregar datos
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span 
                          className="text-3xl font-extrabold leading-none"
                          style={{ color: metric.color }}
                        >
                          {metric.value}
                        </span>
                      )}
                    </div>

                    {/* Unit */}
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">
                      {metric.unit}
                    </p>

                    {/* Progress bar for calories */}
                    {metric.id === 'calories' && weeklyCalories > 0 && (
                      <div className="space-y-2">
                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
                            initial={{ width: '0%' }}
                            animate={{ 
                              width: `${Math.min((weeklyCalories / 15000) * 100, 100)}%` 
                            }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 + index * 0.1 }}
                          />
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          Meta semanal: 15,000 kcal
                        </p>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Trend information */}
          {userMetrics.hasData && userMetrics.stats?.trend && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mb-10"
            >
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xl flex items-center justify-center gap-3">
                <span className="text-2xl" aria-hidden="true">{getTrendIcon(userMetrics.stats.trend)}</span>
                <span className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                  {getTrendText(userMetrics.stats.trend)}
                </span>
              </div>
            </motion.div>
          )}

          {/* Motivational Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-200 dark:border-emerald-800 rounded-full backdrop-blur-sm shadow-md">
              <FaHeartbeat className="text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
                {userMetrics.hasData 
                  ? '¡Mantén el buen trabajo! Tu salud es tu mayor inversión'
                  : '¡Comienza tu viaje hacia una vida más saludable!'
                }
              </span>
            </div>
          </motion.div>

          {/* Additional Stats Section */}
          {userMetrics.hasData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="mt-20"
            >
              <section className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 p-10 shadow-xl" aria-labelledby="resumen-progreso">
                <h2 id="resumen-progreso" className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-8 text-center tracking-tight">
                  Resumen de Progreso
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl shadow">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {user?.displayName ? user.displayName.split(' ')[0] : 'Usuario'}
                    </div>
                    <div className="text-sm text-blue-600/70 dark:text-blue-400/70">
                      Nombre de usuario
                    </div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl shadow">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                      {userMetrics.stats?.weekly?.totalEntries || 0}
                    </div>
                    <div className="text-sm text-green-600/70 dark:text-green-400/70">
                      Registros esta semana
                    </div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl shadow">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                      {userMetrics.stats?.overall?.totalEntries || 0}
                    </div>
                    <div className="text-sm text-purple-600/70 dark:text-purple-400/70">
                      Total de registros
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}
        </main>
      </div>

      {/* Modal para agregar métricas */}
      {showAddModal && (
        <AddMetricsModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            dispatch(fetchUserMetrics(user.uid)); // Recargar datos después de agregar
          }}
        />
      )}
    </>
  );
} 
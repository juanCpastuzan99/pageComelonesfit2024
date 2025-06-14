"use client";
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaWeight, FaRuler, FaFire, FaChartLine, FaHeartbeat, FaTrophy } from 'react-icons/fa';
import { userMetricsService } from '../../../utils/services/userMetricsService';
import Sidebar from '../../../components/Sidebar';
import { fetchUserMetrics } from '../../../store/slices/userMetricsSlice';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { userMetrics, loading, error } = useSelector((state) => ({
    userMetrics: state.userMetrics || {},
    loading: state.userMetrics?.loading || false,
    error: state.userMetrics?.error || null
  }));

  const imc = userMetrics.imc ?? 0;
  const weeklyCalories = userMetrics.weeklyCalories ?? 0;
  const averageHeight = userMetrics.averageHeight ?? 0;
  const averageWeight = userMetrics.averageWeight ?? 0;
  const { isDarkMode } = useSelector((state) => state.theme);
  const router = useRouter();

  // Fetch user metrics when component mounts
  useEffect(() => {
    fetchUserMetrics( dispatch );
  }, [dispatch]);

  const getImcCategory = userMetricsService.getImcCategory;
  const getImcColor = userMetricsService.getImcColor;

  // Proteger la ruta
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);
  if (!isAuthenticated) return null;

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

  const cardStyle = {
    borderRadius: '16px',
    border: '2px solid',
    background: isDarkMode 
      ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.95) 100%)',
    backdropFilter: 'blur(10px)',
    boxShadow: isDarkMode
      ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)'
      : '0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden'
  };

  const iconContainerStyle = (color) => ({
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0 4px 16px ${color}40`,
    marginBottom: '16px'
  });

  const metrics = [
    {
      id: 'imc',
      title: 'Índice de Masa Corporal',
      value: imc.toFixed(1),
      unit: getImcCategory(imc),
      icon: FaWeight,
      color: getImcColor(imc),
      borderColor: getImcColor(imc)
    },
    {
      id: 'calories',
      title: 'Calorías Semanales',
      value: weeklyCalories.toLocaleString(),
      unit: 'kcal',
      icon: FaFire,
      color: '#F97316',
      borderColor: '#F97316'
    },
    {
      id: 'height',
      title: 'Estatura Promedio',
      value: averageHeight.toFixed(1),
      unit: 'cm',
      icon: FaRuler,
      color: '#0EA5E9',
      borderColor: '#0EA5E9'
    },
    {
      id: 'weight',
      title: 'Peso Promedio',
      value: averageWeight.toFixed(1),
      unit: 'kg',
      icon: FaChartLine,
      color: '#8B5CF6',
      borderColor: '#8B5CF6'
    }
  ];

  // Add loading state handling
  if (loading) {
    return (
      <div className="postlogin-layout d-flex" style={{ minHeight: "100vh" }}>
        <Sidebar />
        <div className="flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Add error state handling
  if (error) {
    return (
      <div className="postlogin-layout d-flex" style={{ minHeight: "100vh" }}>
        <Sidebar />
        <div className="flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="alert alert-danger" role="alert">
            Error loading metrics: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="postlogin-layout d-flex" style={{ minHeight: "100vh" }}>
        <Sidebar />
        <div className="flex-grow-1" style={{ 
          marginLeft: 0,
          transition: 'margin-left 0.3s ease',
          display: 'flex',
          justifyContent: 'flex-start',
          width: '100%'
        }}>
          <main style={{
            minHeight: '100vh',
            width: '100%',
            maxWidth: '1400px',
            background: isDarkMode 
              ? 'radial-gradient(ellipse at top, #1e293b 0%, #0f172a 50%, #020617 100%)'
              : 'radial-gradient(ellipse at top, #f1f5f9 0%, #ffffff 50%, #f8fafc 100%)',
            padding: '0'
          }}>
            {/* Header mejorado */}
            <div style={{
              background: isDarkMode 
                ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.8) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)',
              backdropFilter: 'blur(20px)',
              borderBottom: `1px solid ${isDarkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.2)'}`,
              padding: '32px 24px',
              position: 'sticky',
              top: 0,
              zIndex: 10
            }}>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '12px', 
                  marginBottom: '12px' 
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
                  }}>
                    <FaHeartbeat style={{ color: 'white', fontSize: '18px' }} />
                  </div>
                  <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    margin: 0
                  }}>
                    Dashboard de Salud
                  </h1>
                </div>
                <p style={{
                  color: isDarkMode ? '#94A3B8' : '#64748B',
                  fontSize: '1.1rem',
                  margin: 0
                }}>
                  Monitorea tu progreso hacia un estilo de vida más saludable
                </p>
              </motion.div>
            </div>

            {/* Contenido principal */}
            <div className="container" style={{ 
              maxWidth: '1200px', 
              margin: '0 auto', 
              padding: '48px 20px',
              width: '100%'
            }}>
              <motion.div 
                className="row g-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {metrics.map((metric, index) => {
                  const IconComponent = metric.icon;
                  return (
                    <motion.div
                      key={metric.id}
                      className="col-12 col-sm-6 col-lg-3"
                      variants={itemVariants}
                      whileHover="hover"
                    >
                      <motion.div
                        style={{
                          ...cardStyle,
                          borderColor: metric.borderColor,
                          padding: '24px'
                        }}
                        variants={cardHoverVariants}
                        onHoverStart={() => {}}
                        onHoverEnd={() => {}}
                      >
                        {/* Efecto de brillo en el fondo */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '2px',
                          background: `linear-gradient(90deg, transparent 0%, ${metric.color}60 50%, transparent 100%)`,
                          opacity: 0.8
                        }} />

                        {/* Contenido de la tarjeta */}
                        <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                          {/* Header con icono y trofeo */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div style={iconContainerStyle(metric.color)}>
                              <IconComponent style={{ color: 'white', fontSize: '20px' }} />
                            </div>
                            {metric.id === 'imc' && imc >= 18.5 && imc < 25 && (
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
                              }}>
                                <FaTrophy style={{ color: 'white', fontSize: '14px' }} />
                              </div>
                            )}
                          </div>

                          {/* Título */}
                          <h3 style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: isDarkMode ? '#CBD5E1' : '#475569',
                            marginBottom: '8px',
                            lineHeight: '1.3'
                          }}>
                            {metric.title}
                          </h3>

                          {/* Valor principal */}
                          <div style={{ marginBottom: '4px' }}>
                            <span style={{
                              fontSize: '2.2rem',
                              fontWeight: 'bold',
                              color: metric.color,
                              lineHeight: '1'
                            }}>
                              {metric.value}
                            </span>
                          </div>

                          {/* Unidad */}
                          <p style={{
                            fontSize: '0.8rem',
                            fontWeight: '500',
                            color: isDarkMode ? '#94A3B8' : '#64748B',
                            margin: 0
                          }}>
                            {metric.unit}
                          </p>

                          {/* Barra de progreso para calorías */}
                          {metric.id === 'calories' && weeklyCalories > 0 && (
                            <div style={{ marginTop: '16px' }}>
                              <div style={{
                                height: '6px',
                                borderRadius: '3px',
                                background: isDarkMode ? '#334155' : '#E2E8F0',
                                overflow: 'hidden'
                              }}>
                                <motion.div
                                  style={{
                                    height: '100%',
                                    borderRadius: '3px',
                                    background: `linear-gradient(90deg, ${metric.color} 0%, ${metric.color}CC 100%)`
                                  }}
                                  initial={{ width: '0%' }}
                                  animate={{ 
                                    width: `${Math.min((weeklyCalories / 15000) * 100, 100)}%` 
                                  }}
                                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 + index * 0.1 }}
                                />
                              </div>
                              <p style={{
                                fontSize: '0.75rem',
                                color: isDarkMode ? '#94A3B8' : '#64748B',
                                marginTop: '8px',
                                margin: '8px 0 0 0'
                              }}>
                                Meta semanal: 15,000 kcal
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Mensaje motivacional */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                style={{ textAlign: 'center', marginTop: '64px' }}
              >
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 32px',
                  borderRadius: '50px',
                  background: isDarkMode 
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)'
                    : 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(236, 253, 245, 0.8) 100%)',
                  border: `2px solid ${isDarkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.3)'}`,
                  backdropFilter: 'blur(10px)'
                }}>
                  <FaHeartbeat style={{ color: '#10B981', fontSize: '16px' }} />
                  <span style={{
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    color: isDarkMode ? '#10B981' : '#047857'
                  }}>
                    ¡Mantén el buen trabajo! Tu salud es tu mayor inversión
                  </span>
                </div>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
      <style jsx global>{`
        @media (max-width: 600px) {
          .navbar .container {
            padding-left: 8px !important;
            padding-right: 8px !important;
            min-width: 100vw !important;
          }
          .navbar-brand {
            font-size: 1.1rem !important;
            margin-right: auto !important;
          }
          .navbar-toggler {
            margin-left: 8px !important;
            border: none !important;
            box-shadow: none !important;
          }
          .navbar-collapse {
            background: ${isDarkMode ? '#1e293b' : '#fff'} !important;
            position: absolute !important;
            top: 56px;
            left: 0;
            width: 100vw !important;
            z-index: 1000;
            padding: 12px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .navbar-nav {
            flex-direction: column !important;
            align-items: flex-start !important;
            width: 100vw !important;
            padding-left: 16px;
          }
          .nav-link {
            padding: 8px 0 !important;
            width: 100vw !important;
          }
          .d-flex.align-items-center.gap-3,
          .d-flex.align-items-center.gap-2 {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.5rem !important;
            width: 100vw !important;
            padding-left: 16px;
          }
        }
      `}</style>
    </>
  );
}
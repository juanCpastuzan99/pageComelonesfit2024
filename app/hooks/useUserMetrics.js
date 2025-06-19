import { useState, useEffect, useCallback } from 'react';
import { userMetricsService } from '../services/userMetricsServices';
import { useAuth } from '../context/AuthContext';

export function useUserMetrics() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar métricas del usuario
  const loadUserMetrics = useCallback(async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Cargar estadísticas (incluye métricas semanales y generales)
      const userStats = await userMetricsService.getUserStats(user.uid);
      setStats(userStats);

      // Cargar todas las métricas para la lista
      const allMetrics = await userMetricsService.getUserMetrics(user.uid);
      setMetrics(allMetrics);

    } catch (err) {
      console.error('Error cargando métricas:', err);
      setError(err.message);
      
      // Set default empty stats if there's an error
      setStats({
        weekly: {
          averageWeight: 0,
          averageHeight: 0,
          weeklyCalories: 0,
          imc: 0,
          totalEntries: 0
        },
        overall: {
          averageWeight: 0,
          averageHeight: 0,
          weeklyCalories: 0,
          imc: 0,
          totalEntries: 0
        },
        lastEntry: null,
        trend: 'stable'
      });
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  // Agregar nueva métrica
  const addMetrics = useCallback(async (metricsData) => {
    if (!user?.uid) throw new Error('Usuario no autenticado');

    try {
      setError(null);
      const result = await userMetricsService.addUserMetrics(user.uid, metricsData);
      
      // Recargar métricas después de agregar
      await loadUserMetrics();
      
      return result;
    } catch (err) {
      console.error('Error agregando métricas:', err);
      setError(err.message);
      throw err;
    }
  }, [user?.uid, loadUserMetrics]);

  // Actualizar métrica existente
  const updateMetrics = useCallback(async (entryId, metricsData) => {
    try {
      setError(null);
      const result = await userMetricsService.updateUserMetrics(entryId, metricsData);
      
      // Recargar métricas después de actualizar
      await loadUserMetrics();
      
      return result;
    } catch (err) {
      console.error('Error actualizando métricas:', err);
      setError(err.message);
      throw err;
    }
  }, [loadUserMetrics]);

  // Eliminar métrica
  const deleteMetrics = useCallback(async (entryId) => {
    try {
      setError(null);
      const result = await userMetricsService.deleteUserMetrics(entryId);
      
      // Recargar métricas después de eliminar
      await loadUserMetrics();
      
      return result;
    } catch (err) {
      console.error('Error eliminando métricas:', err);
      setError(err.message);
      throw err;
    }
  }, [loadUserMetrics]);

  // Recargar métricas manualmente
  const refresh = useCallback(() => {
    return loadUserMetrics();
  }, [loadUserMetrics]);

  // Cargar métricas cuando el usuario cambie
  useEffect(() => {
    loadUserMetrics();
  }, [loadUserMetrics]);

  // Funciones auxiliares
  const getImcCategory = (imc) => userMetricsService.getImcCategory(imc);
  const getImcColor = (imc) => userMetricsService.getImcColor(imc);
  const getTrendIcon = (trend) => userMetricsService.getTrendIcon(trend);
  const getTrendText = (trend) => userMetricsService.getTrendText(trend);

  return {
    // Data
    metrics,
    stats,
    loading,
    error,
    
    // Actions
    addMetrics,
    updateMetrics,
    deleteMetrics,
    refresh,
    
    // Helpers
    getImcCategory,
    getImcColor,
    getTrendIcon,
    getTrendText,
    
    // Computed values
    hasData: metrics.length > 0,
    latestEntry: metrics[0] || null,
    weeklyStats: stats?.weekly || {
      averageWeight: 0,
      averageHeight: 0,
      weeklyCalories: 0,
      imc: 0,
      totalEntries: 0
    }
  };
}
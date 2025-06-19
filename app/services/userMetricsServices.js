import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  updateDoc,
  deleteDoc 
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export class UserMetricsService {
  constructor() {
    this.COLLECTION_NAME = 'userMetrics';
  }

  // Crear una nueva entrada de métricas
  async addUserMetrics(userId, metricsData) {
    try {
      // Validar datos requeridos
      if (!userId) {
        throw new Error('userId es requerido');
      }

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), {
        userId,
        weight: parseFloat(metricsData.weight) || 0,
        height: parseFloat(metricsData.height) || 0,
        bodyFat: parseFloat(metricsData.bodyFat) || 0,
        muscleMass: parseFloat(metricsData.muscleMass) || 0,
        calories: parseFloat(metricsData.calories) || 0,
        date: metricsData.date || new Date().toISOString().split('T')[0],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      console.log('Métricas agregadas con ID:', docRef.id);
      return { id: docRef.id, success: true };
    } catch (error) {
      console.error('Error agregando métricas:', error);
      throw new Error('Error al agregar métricas: ' + error.message);
    }
  }

  // Obtener todas las métricas de un usuario (mejorado con manejo de errores)
  async getUserMetrics(userId, limitCount = 50) {
    try {
      if (!userId) {
        throw new Error('userId es requerido');
      }

      // Separar queries para evitar problemas de índices
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'), // Usar createdAt en lugar de date
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const metrics = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        metrics.push({
          id: doc.id,
          ...data,
          // Convertir timestamp a fecha legible si existe
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt
        });
      });

      // Ordenar por fecha después de obtener los datos
      return metrics.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      console.error('Error obteniendo métricas:', error);
      throw new Error('Error al obtener métricas: ' + error.message);
    }
  }

  // Obtener métricas de la última semana (mejorado)
  async getWeeklyMetrics(userId) {
    try {
      if (!userId) {
        throw new Error('userId es requerido');
      }

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const weekAgoString = oneWeekAgo.toISOString().split('T')[0];

      // Query simplificado para evitar problemas de índices
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        where('date', '>=', weekAgoString)
      );

      const querySnapshot = await getDocs(q);
      const metrics = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        metrics.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt
        });
      });

      // Ordenar manualmente por fecha
      return metrics.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      console.error('Error obteniendo métricas semanales:', error);
      // Fallback: obtener todas las métricas y filtrar localmente
      try {
        const allMetrics = await this.getUserMetrics(userId);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const weekAgoString = oneWeekAgo.toISOString().split('T')[0];
        
        return allMetrics.filter(metric => metric.date >= weekAgoString);
      } catch (fallbackError) {
        throw new Error('Error al obtener métricas semanales: ' + error.message);
      }
    }
  }

  // Calcular promedios y estadísticas (mejorado con validaciones)
  calculateStats(metrics) {
    if (!metrics || metrics.length === 0) {
      return {
        averageWeight: 0,
        averageHeight: 0,
        weeklyCalories: 0,
        imc: 0,
        totalEntries: 0
      };
    }

    const validWeights = metrics
      .filter(m => m && typeof m.weight === 'number' && m.weight > 0)
      .map(m => m.weight);
    
    const validHeights = metrics
      .filter(m => m && typeof m.height === 'number' && m.height > 0)
      .map(m => m.height);
    
    const totalCalories = metrics.reduce((sum, m) => {
      return sum + (typeof m?.calories === 'number' ? m.calories : 0);
    }, 0);

    const averageWeight = validWeights.length > 0 
      ? validWeights.reduce((sum, w) => sum + w, 0) / validWeights.length 
      : 0;

    const averageHeight = validHeights.length > 0 
      ? validHeights.reduce((sum, h) => sum + h, 0) / validHeights.length 
      : 0;

    // Calcular IMC (peso en kg / altura en m²)
    const imc = (averageWeight > 0 && averageHeight > 0) 
      ? averageWeight / Math.pow(averageHeight / 100, 2) 
      : 0;

    return {
      averageWeight: Math.round(averageWeight * 10) / 10,
      averageHeight: Math.round(averageHeight * 10) / 10,
      weeklyCalories: totalCalories,
      imc: Math.round(imc * 10) / 10,
      totalEntries: metrics.length
    };
  }

  // Obtener estadísticas calculadas del usuario (con mejor manejo de errores)
  async getUserStats(userId) {
    try {
      if (!userId) {
        throw new Error('userId es requerido');
      }

      const [weeklyMetrics, allMetrics] = await Promise.all([
        this.getWeeklyMetrics(userId).catch(err => {
          console.warn('Error obteniendo métricas semanales:', err);
          return [];
        }),
        this.getUserMetrics(userId, 30).catch(err => {
          console.warn('Error obteniendo todas las métricas:', err);
          return [];
        })
      ]);
      
      const weeklyStats = this.calculateStats(weeklyMetrics);
      const overallStats = this.calculateStats(allMetrics);

      return {
        weekly: weeklyStats,
        overall: overallStats,
        lastEntry: allMetrics[0] || null,
        trend: this.calculateTrend(allMetrics)
      };
    } catch (error) {
      console.error('Error calculando estadísticas:', error);
      throw new Error('Error al calcular estadísticas: ' + error.message);
    }
  }

  // Calcular tendencia (mejorado con validaciones)
  calculateTrend(metrics) {
    if (!metrics || metrics.length < 2) return 'stable';

    const validMetrics = metrics.filter(m => m && typeof m.weight === 'number' && m.weight > 0);
    if (validMetrics.length < 2) return 'stable';

    const recent = validMetrics.slice(0, Math.min(5, validMetrics.length));
    const older = validMetrics.slice(5, Math.min(10, validMetrics.length));

    if (recent.length === 0 || older.length === 0) return 'stable';

    const recentAvgWeight = recent.reduce((sum, m) => sum + m.weight, 0) / recent.length;
    const olderAvgWeight = older.reduce((sum, m) => sum + m.weight, 0) / older.length;

    const difference = recentAvgWeight - olderAvgWeight;

    if (difference > 0.5) return 'increasing';
    if (difference < -0.5) return 'decreasing';
    return 'stable';
  }

  // Actualizar entrada existente (mejorado)
  async updateUserMetrics(entryId, metricsData) {
    try {
      if (!entryId) {
        throw new Error('entryId es requerido');
      }

      const docRef = doc(db, this.COLLECTION_NAME, entryId);
      const updateData = {
        updatedAt: serverTimestamp()
      };

      // Solo actualizar campos que se proporcionan
      if (metricsData.weight !== undefined) updateData.weight = parseFloat(metricsData.weight) || 0;
      if (metricsData.height !== undefined) updateData.height = parseFloat(metricsData.height) || 0;
      if (metricsData.bodyFat !== undefined) updateData.bodyFat = parseFloat(metricsData.bodyFat) || 0;
      if (metricsData.muscleMass !== undefined) updateData.muscleMass = parseFloat(metricsData.muscleMass) || 0;
      if (metricsData.calories !== undefined) updateData.calories = parseFloat(metricsData.calories) || 0;
      if (metricsData.date) updateData.date = metricsData.date;

      await updateDoc(docRef, updateData);

      return { success: true };
    } catch (error) {
      console.error('Error actualizando métricas:', error);
      throw new Error('Error al actualizar métricas: ' + error.message);
    }
  }

  // Eliminar entrada (sin cambios, ya está bien)
  async deleteUserMetrics(entryId) {
    try {
      if (!entryId) {
        throw new Error('entryId es requerido');
      }

      await deleteDoc(doc(db, this.COLLECTION_NAME, entryId));
      return { success: true };
    } catch (error) {
      console.error('Error eliminando métricas:', error);
      throw new Error('Error al eliminar métricas: ' + error.message);
    }
  }

  // Funciones auxiliares (sin cambios, están bien)
  getImcCategory(imc) {
    if (imc === 0) return 'Sin datos';
    if (imc < 18.5) return 'Bajo peso';
    if (imc < 25) return 'Normal';
    if (imc < 30) return 'Sobrepeso';
    return 'Obesidad';
  }

  getImcColor(imc) {
    if (imc === 0) return '#6B7280';
    if (imc < 18.5) return '#3B82F6';
    if (imc < 25) return '#10B981';
    if (imc < 30) return '#F59E0B';
    return '#EF4444';
  }

  getTrendIcon(trend) {
    switch (trend) {
      case 'increasing': return '📈';
      case 'decreasing': return '📉';
      default: return '➡️';
    }
  }

  getTrendText(trend) {
    switch (trend) {
      case 'increasing': return 'Tendencia al alza';
      case 'decreasing': return 'Tendencia a la baja';
      default: return 'Estable';
    }
  }

  // Método auxiliar para crear índices (ejecutar una vez)
  async setupIndexes() {
    console.log(`
    Para configurar los índices necesarios en Firestore, ejecuta estos comandos en tu terminal:

    firebase firestore:indexes --project YOUR_PROJECT_ID

    O crea manualmente estos índices en la consola de Firebase:

    Colección: ${this.COLLECTION_NAME}
    Índices compuestos:
    1. userId (Ascending) + date (Descending)
    2. userId (Ascending) + createdAt (Descending)
    `);
  }
}

// Instancia del servicio para exportar
export const userMetricsService = new UserMetricsService();
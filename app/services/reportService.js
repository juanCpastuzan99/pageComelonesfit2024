import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const ordersCollection = collection(db, 'orders');
const productsCollection = collection(db, 'productos');

export const reportService = {
  /**
   * Calcula las analíticas de ventas a partir de los pedidos.
   * @returns {Promise<object>} Un objeto con productos más vendidos y otras estadísticas.
   */
  async getSalesAnalytics() {
    try {
      // 1. Obtener todos los productos para tener sus datos (nombre, imagen, etc.)
      const productsSnapshot = await getDocs(productsCollection);
      const productsData = {};
      productsSnapshot.forEach(doc => {
        productsData[doc.id] = { id: doc.id, ...doc.data() };
      });

      // 2. Obtener todos los pedidos
      const ordersSnapshot = await getDocs(ordersCollection);
      if (ordersSnapshot.empty) {
        return {
          bestSellers: [],
          totalRevenue: 0,
          totalOrders: 0,
        };
      }

      // 3. Procesar los pedidos para calcular las ventas
      const productSales = {};
      let totalRevenue = 0;

      ordersSnapshot.forEach(orderDoc => {
        const order = orderDoc.data();
        totalRevenue += order.total || 0;

        if (order.items && Array.isArray(order.items)) {
          order.items.forEach(item => {
            if (!productSales[item.productId]) {
              productSales[item.productId] = {
                ...productsData[item.productId], // Copiar datos del producto
                totalSold: 0,
                revenueGenerated: 0,
              };
            }
            productSales[item.productId].totalSold += item.quantity;
            productSales[item.productId].revenueGenerated += (item.price * item.quantity);
          });
        }
      });

      // 4. Convertir a array y ordenar
      const bestSellers = Object.values(productSales)
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, 10); // Top 10 productos

      return {
        bestSellers,
        totalRevenue,
        totalOrders: ordersSnapshot.size,
      };

    } catch (error) {
      console.error("[reportService] Error al obtener analíticas de ventas:", error);
      throw new Error("No se pudieron calcular las analíticas de ventas.");
    }
  },

  /**
   * Agrupa los ingresos por día para un período de tiempo.
   * @param {number} days El número de días hacia atrás a considerar.
   * @returns {Promise<Array>} Un array de objetos, cada uno con una fecha y un total de ingresos.
   */
  async getSalesOverTime(days = 30) {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      const ordersSnapshot = await getDocs(
        query(ordersCollection, where('createdAt', '>=', startDate), where('createdAt', '<=', endDate))
      );
      
      const salesByDate = {};

      // Inicializar todos los días en el rango con 0 ventas
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(endDate.getDate() - i);
        const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
        salesByDate[formattedDate] = 0;
      }

      ordersSnapshot.forEach(doc => {
        const order = doc.data();
        const orderDate = order.createdAt.toDate().toISOString().split('T')[0];
        
        if (salesByDate[orderDate] !== undefined) {
          salesByDate[orderDate] += order.total || 0;
        }
      });

      const formattedData = Object.keys(salesByDate)
        .map(date => ({
          date,
          total: salesByDate[date],
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      return formattedData;

    } catch (error) {
      console.error("[reportService] Error al obtener ventas a lo largo del tiempo:", error);
      throw new Error("No se pudieron calcular las ventas a lo largo del tiempo.");
    }
  }
}; 
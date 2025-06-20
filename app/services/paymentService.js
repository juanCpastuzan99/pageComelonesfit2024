import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, updateDoc, doc, getDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { nequiConfig, getNequiToken, createNequiPayment, checkNequiPaymentStatus } from '../config/nequiConfig';

export const paymentService = {
  // Crear una nueva orden de pago
  async createOrder(orderData) {
    try {
      const orderRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        status: 'pending',
        paymentMethod: 'nequi',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return {
        success: true,
        orderId: orderRef.id,
        order: { id: orderRef.id, ...orderData }
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Error al crear la orden de pago');
    }
  },

  // Actualizar el estado de una orden
  async updateOrderStatus(orderId, status, paymentDetails = null) {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status,
        paymentDetails,
        updatedAt: new Date()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error updating order status:', error);
      throw new Error('Error al actualizar el estado de la orden');
    }
  },

  // Generar link de pago Nequi
  async generateNequiPaymentLink(orderData) {
    try {
      // Si estamos en desarrollo y queremos usar datos simulados
      if (nequiConfig.development.useMockData) {
        return await this.generateMockPaymentLink(orderData);
      }

      // Obtener token de acceso de Nequi
      const accessToken = await getNequiToken();
      
      // Preparar datos del pago
      const paymentData = {
        amount: orderData.total,
        reference: orderData.orderId,
        description: `Compra ComelonesFit - ${orderData.items.length} productos`,
        customerEmail: orderData.customerEmail,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone
      };

      // Crear pago en Nequi
      const nequiResponse = await createNequiPayment(paymentData, accessToken);
      
      return {
        success: true,
        paymentUrl: nequiResponse.paymentUrl,
        paymentId: nequiResponse.paymentId
      };
    } catch (error) {
      console.error('Error generating Nequi payment link:', error);
      
      // Si falla la API real, usar datos simulados como fallback
      if (nequiConfig.development.useMockData) {
        console.log('Falling back to mock data');
        return await this.generateMockPaymentLink(orderData);
      }
      
      throw new Error('Error al generar el link de pago');
    }
  },

  // Generar link de pago simulado (para desarrollo)
  async generateMockPaymentLink(orderData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          paymentUrl: nequiConfig.development.mockPaymentUrl,
          paymentId: nequiConfig.development.mockPaymentId,
          status: 'pending'
        });
      }, 1000);
    });
  },

  // Verificar el estado de un pago
  async checkPaymentStatus(paymentId) {
    try {
      // Si estamos en desarrollo y queremos usar datos simulados
      if (nequiConfig.development.useMockData) {
        return await this.checkMockPaymentStatus(paymentId);
      }

      // Obtener token de acceso de Nequi
      const accessToken = await getNequiToken();
      
      // Verificar estado en Nequi
      const response = await checkNequiPaymentStatus(paymentId, accessToken);
      
      return {
        success: true,
        status: response.status,
        details: response
      };
    } catch (error) {
      console.error('Error checking payment status:', error);
      throw new Error('Error al verificar el estado del pago');
    }
  },

  // Verificar estado simulado (para desarrollo)
  async checkMockPaymentStatus(paymentId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simular diferentes estados
        const statuses = ['pending', 'completed', 'failed'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        resolve({
          success: true,
          status: randomStatus,
          details: {
            paymentId,
            timestamp: new Date().toISOString(),
            amount: 50000 // Simular monto
          }
        });
      }, 500);
    });
  },

  // Procesar webhook de Nequi (para cuando Nequi confirme el pago)
  async processNequiWebhook(webhookData) {
    try {
      const { orderId, paymentId, status, amount } = webhookData;
      
      // Verificar que el monto coincida
      const orderRef = doc(db, 'orders', orderId);
      const orderDoc = await getDoc(orderRef);
      
      if (!orderDoc.exists()) {
        throw new Error('Orden no encontrada');
      }
      
      const order = orderDoc.data();
      
      if (order.total !== amount) {
        throw new Error('El monto no coincide');
      }
      
      // Actualizar el estado de la orden
      await this.updateOrderStatus(orderId, status, {
        paymentId,
        processedAt: new Date(),
        webhookData
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error processing Nequi webhook:', error);
      throw error;
    }
  },

  // Obtener historial de órdenes de un usuario
  async getUserOrders(userId) {
    try {
      if (!userId) {
        throw new Error('ID de usuario requerido');
      }

      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
      // const q = query(ordersRef, where('userId', '==', userId)); // <-- Prueba sin ordenar
      const querySnapshot = await getDocs(q);
      
      const orders = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      
      return orders;
    } catch (error) {
      console.error('Error getting user orders:', error);
      
      // Proporcionar mensajes de error más específicos
      if (error.code === 'permission-denied') {
        throw new Error('No tienes permisos para acceder a las órdenes');
      } else if (error.code === 'unavailable') {
        throw new Error('Servicio temporalmente no disponible. Intenta nuevamente');
      } else if (error.message === 'ID de usuario requerido') {
        throw error; // Re-lanzar el error de validación
      } else {
        throw new Error(`Error al obtener las órdenes del usuario: ${error.message}`);
      }
    }
  },

  // Obtener todas las órdenes (para el admin)
  async getAllOrders() {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const orders = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });

      return orders;
    } catch (error) {
      console.error('Error getting all orders:', error);
      throw new Error('Error al obtener todas las órdenes');
    }
  },

  // Obtener detalles de una orden específica
  async getOrderDetails(orderId) {
    try {
      const orderRef = doc(db, 'orders', orderId);
      const orderDoc = await getDoc(orderRef);
      
      if (!orderDoc.exists()) {
        throw new Error('Orden no encontrada');
      }
      
      return { id: orderDoc.id, ...orderDoc.data() };
    } catch (error) {
      console.error('Error getting order details:', error);
      throw new Error('Error al obtener los detalles de la orden');
    }
  }
}; 
// app/config/nequiConfig.js
// Configuración para la integración con Nequi API

export const nequiConfig = {
  // Credenciales de la API (deben estar en variables de entorno)
  clientId: process.env.NEXT_PUBLIC_NEQUI_CLIENT_ID || '',
  clientSecret: process.env.NEXT_PUBLIC_NEQUI_CLIENT_SECRET || '',
  
  // URLs de la API de Nequi
  baseUrl: process.env.NEXT_PUBLIC_NEQUI_BASE_URL || 'https://api.nequi.com',
  
  // Endpoints específicos
  endpoints: {
    // Autenticación OAuth2
    token: '/oauth2/token',
    
    // Crear pago
    createPayment: '/payments/v1/payments',
    
    // Consultar estado del pago
    checkPayment: '/payments/v1/payments/{paymentId}',
    
    // Webhook para confirmaciones
    webhook: '/webhooks/payments'
  },
  
  // Configuración de pagos
  payment: {
    currency: 'COP',
    country: 'CO',
    language: 'es',
    
    // URLs de retorno (deben coincidir con las configuradas en Nequi)
    returnUrl: process.env.NEXT_PUBLIC_NEQUI_RETURN_URL || 'https://tu-dominio.com/payment/success',
    cancelUrl: process.env.NEXT_PUBLIC_NEQUI_CANCEL_URL || 'https://tu-dominio.com/payment/cancel',
    
    // Configuración de webhook
    webhookUrl: process.env.NEXT_PUBLIC_NEQUI_WEBHOOK_URL || 'https://tu-dominio.com/api/webhooks/nequi',
    webhookSecret: process.env.NEXT_PUBLIC_NEQUI_WEBHOOK_SECRET || ''
  },
  
  // Configuración de la aplicación
  app: {
    name: 'ComelonesFit',
    description: 'Tienda de productos fitness y saludables',
    logo: 'https://tu-dominio.com/logo.png'
  },
  
  // Configuración de desarrollo
  development: {
    // Para pruebas, puedes usar datos simulados
    useMockData: process.env.NODE_ENV === 'development',
    
    // Datos de prueba
    mockPaymentUrl: 'https://nequi.com/payment/mock',
    mockPaymentId: 'nequi_mock_123'
  }
};

// Función para obtener el token de acceso
export const getNequiToken = async () => {
  try {
    const response = await fetch(`${nequiConfig.baseUrl}${nequiConfig.endpoints.token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${nequiConfig.clientId}:${nequiConfig.clientSecret}`)}`
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'payments'
      })
    });

    if (!response.ok) {
      throw new Error('Error al obtener token de Nequi');
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting Nequi token:', error);
    throw error;
  }
};

// Función para crear un pago en Nequi
export const createNequiPayment = async (paymentData, accessToken) => {
  try {
    const response = await fetch(`${nequiConfig.baseUrl}${nequiConfig.endpoints.createPayment}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'x-api-key': nequiConfig.clientId
      },
      body: JSON.stringify({
        amount: paymentData.amount,
        currency: nequiConfig.payment.currency,
        reference: paymentData.reference,
        description: paymentData.description,
        customer: {
          email: paymentData.customerEmail,
          name: paymentData.customerName,
          phone: paymentData.customerPhone
        },
        returnUrl: nequiConfig.payment.returnUrl,
        cancelUrl: nequiConfig.payment.cancelUrl,
        webhookUrl: nequiConfig.payment.webhookUrl
      })
    });

    if (!response.ok) {
      throw new Error('Error al crear pago en Nequi');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating Nequi payment:', error);
    throw error;
  }
};

// Función para verificar el estado de un pago
export const checkNequiPaymentStatus = async (paymentId, accessToken) => {
  try {
    const url = nequiConfig.endpoints.checkPayment.replace('{paymentId}', paymentId);
    const response = await fetch(`${nequiConfig.baseUrl}${url}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-api-key': nequiConfig.clientId
      }
    });

    if (!response.ok) {
      throw new Error('Error al verificar estado del pago');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking Nequi payment status:', error);
    throw error;
  }
};

// Función para validar webhook de Nequi
export const validateNequiWebhook = (payload, signature) => {
  // Aquí implementarías la validación del webhook según la documentación de Nequi
  // Por ahora, retornamos true para desarrollo
  return true;
};

export default nequiConfig; 
# Integración de Pagos con Nequi

Esta guía te ayudará a configurar e integrar pagos con Nequi en tu aplicación ComelonesFit.

## 📋 Requisitos Previos

1. **Cuenta de desarrollador en Nequi**
   - Registrarse en el portal de desarrolladores de Nequi
   - Obtener credenciales de API (Client ID y Client Secret)

2. **Dominio configurado**
   - Tu aplicación debe estar en un dominio HTTPS válido
   - URLs de retorno configuradas

## 🔧 Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz de tu proyecto con las siguientes variables:

```env
# Credenciales de Nequi
NEXT_PUBLIC_NEQUI_CLIENT_ID=tu_client_id_aqui
NEXT_PUBLIC_NEQUI_CLIENT_SECRET=tu_client_secret_aqui

# URLs de la API de Nequi
NEXT_PUBLIC_NEQUI_BASE_URL=https://api.nequi.com

# URLs de retorno (reemplaza con tu dominio real)
NEXT_PUBLIC_NEQUI_RETURN_URL=https://tu-dominio.com/payment/success
NEXT_PUBLIC_NEQUI_CANCEL_URL=https://tu-dominio.com/payment/cancel

# Webhook (opcional, para confirmaciones automáticas)
NEXT_PUBLIC_NEQUI_WEBHOOK_URL=https://tu-dominio.com/api/webhooks/nequi
NEXT_PUBLIC_NEQUI_WEBHOOK_SECRET=tu_webhook_secret_aqui
```

### 2. Configuración en Nequi

1. **Accede al portal de desarrolladores de Nequi**
2. **Configura tu aplicación:**
   - Nombre: ComelonesFit
   - Descripción: Tienda de productos fitness y saludables
   - URLs de retorno: Las mismas que configuraste en las variables de entorno
   - Webhook URL: Para confirmaciones automáticas de pago

3. **Obtén tus credenciales:**
   - Client ID
   - Client Secret
   - API Key (si es requerida)

## 🚀 Implementación

### Estructura de Archivos

```
app/
├── config/
│   └── nequiConfig.js          # Configuración de Nequi
├── services/
│   └── paymentService.js       # Servicio de pagos
├── payment/
│   ├── success/
│   │   └── page.jsx           # Página de éxito
│   └── cancel/
│       └── page.jsx           # Página de cancelación
└── ...

components/
├── CheckoutModal.jsx          # Modal de checkout
└── CartIcon.jsx              # Icono del carrito (actualizado)
```

### Flujo de Pago

1. **Usuario agrega productos al carrito**
2. **Hace clic en "Pagar con Nequi"**
3. **Se abre el modal de checkout con 3 pasos:**
   - Información de contacto
   - Resumen del pedido
   - Método de pago (Nequi)
4. **Se crea la orden en Firebase**
5. **Se genera el link de pago en Nequi**
6. **Usuario es redirigido a Nequi**
7. **Después del pago, regresa a la página de éxito o cancelación**

## 🔍 Funcionalidades Implementadas

### ✅ Completadas

- [x] Servicio de pagos con Nequi
- [x] Modal de checkout de 3 pasos
- [x] Páginas de éxito y cancelación
- [x] Integración con Firebase para órdenes
- [x] Configuración de variables de entorno
- [x] Manejo de errores
- [x] Datos simulados para desarrollo

### 🔄 En Desarrollo

- [ ] Webhook para confirmaciones automáticas
- [ ] Historial de órdenes en el perfil
- [ ] Notificaciones por email
- [ ] Seguimiento de envíos

## 🧪 Pruebas

### Modo Desarrollo

En desarrollo, el sistema usa datos simulados por defecto. Para probar:

1. **Asegúrate de que `NODE_ENV=development`**
2. **Los pagos se simulan automáticamente**
3. **Puedes ver las órdenes en Firebase**

### Modo Producción

Para producción:

1. **Configura las variables de entorno reales**
2. **Asegúrate de que `NODE_ENV=production`**
3. **Las llamadas se harán a la API real de Nequi**

## 📱 Uso

### Para el Usuario Final

1. **Navegar por productos**
2. **Agregar al carrito**
3. **Hacer clic en el icono del carrito**
4. **Completar información de contacto**
5. **Revisar resumen del pedido**
6. **Pagar con Nequi**
7. **Recibir confirmación**

### Para el Administrador

1. **Ver órdenes en Firebase**
2. **Recibir notificaciones de webhook**
3. **Procesar envíos**
4. **Actualizar estados de órdenes**

## 🔒 Seguridad

### Medidas Implementadas

- ✅ Validación de formularios
- ✅ Verificación de montos
- ✅ Autenticación OAuth2
- ✅ Manejo seguro de credenciales
- ✅ Validación de webhooks

### Recomendaciones

- 🔒 Usa HTTPS en producción
- 🔒 Mantén las credenciales seguras
- 🔒 Valida todos los webhooks
- 🔒 Implementa rate limiting
- 🔒 Monitorea las transacciones

## 🐛 Solución de Problemas

### Errores Comunes

1. **"Error al obtener token de Nequi"**
   - Verifica las credenciales
   - Asegúrate de que la API esté disponible

2. **"Error al crear pago en Nequi"**
   - Verifica los datos del pago
   - Revisa los logs de Nequi

3. **"Webhook no válido"**
   - Verifica la URL del webhook
   - Asegúrate de que sea HTTPS

### Logs

Los logs se guardan en la consola del navegador y en Firebase. Revisa:

- Console del navegador para errores del frontend
- Firebase Functions logs para errores del backend
- Logs de Nequi para errores de la API

## 📞 Soporte

### Contacto

- **Email:** soporte@comelonesfit.com
- **WhatsApp:** [Tu número de WhatsApp]
- **Documentación Nequi:** [Link a la documentación oficial]

### Recursos Útiles

- [Documentación oficial de Nequi](https://docs.nequi.com)
- [Portal de desarrolladores](https://developers.nequi.com)
- [Guía de webhooks](https://docs.nequi.com/webhooks)

## 🔄 Actualizaciones

### Versión 1.0.0
- ✅ Integración básica con Nequi
- ✅ Modal de checkout
- ✅ Páginas de éxito/cancelación
- ✅ Configuración de variables de entorno

### Próximas Versiones
- 🔄 Webhooks automáticos
- 🔄 Historial de órdenes
- 🔄 Notificaciones por email
- 🔄 Múltiples métodos de pago

---

**Nota:** Esta integración está configurada para funcionar con la API de Nequi. Asegúrate de revisar la documentación oficial para cualquier cambio en los endpoints o parámetros requeridos. 
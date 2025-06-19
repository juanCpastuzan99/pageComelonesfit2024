'use client';
// Forzar redeploy en Vercel
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const PaymentCancelPage = () => {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener parámetros de la URL
    const orderId = searchParams.get('orderId');
    const reason = searchParams.get('reason') || 'Pago cancelado por el usuario';
    
    if (orderId) {
      setOrderDetails({
        orderId,
        reason,
        status: 'cancelled'
      });
    }
    
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 text-center">
          {/* Icono de cancelación */}
          <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Pago Cancelado
          </h1>

          {/* Mensaje */}
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Tu pago no se pudo completar. No te preocupes, tu carrito sigue intacto y puedes intentar nuevamente cuando quieras.
          </p>

          {/* Detalles de la orden */}
          {orderDetails && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Información de la Orden
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Número de Orden:</span>
                  <span className="font-medium">{orderDetails.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estado:</span>
                  <span className="font-medium text-yellow-600 dark:text-yellow-400">
                    Cancelado
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Razón:</span>
                  <span className="font-medium">{orderDetails.reason}</span>
                </div>
              </div>
            </div>
          )}

          {/* Información adicional */}
          <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
              ¿Qué puedes hacer?
            </h4>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
              <p>• Verificar que tengas fondos suficientes en tu cuenta Nequi</p>
              <p>• Intentar el pago nuevamente desde tu carrito</p>
              <p>• Contactarnos si tienes problemas técnicos</p>
              <p>• Usar otro método de pago si está disponible</p>
            </div>
          </div>

          {/* Posibles causas */}
          <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-3">
              Posibles causas de la cancelación:
            </h4>
            <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-2">
              <p>• Fondos insuficientes en la cuenta Nequi</p>
              <p>• Problemas de conectividad</p>
              <p>• Cancelación manual del pago</p>
              <p>• Tiempo de sesión expirado</p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-colors duration-300"
            >
              Volver al Inicio
            </Link>
            <Link
              href="/productos"
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors duration-300"
            >
              Ver Productos
            </Link>
          </div>

          {/* Contacto */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              ¿Necesitas ayuda con tu pago?
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Contáctanos en{' '}
              <a href="mailto:soporte@comelonesfit.com" className="text-green-600 dark:text-green-400 hover:underline">
                soporte@comelonesfit.com
              </a>
              {' '}o por WhatsApp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage; 
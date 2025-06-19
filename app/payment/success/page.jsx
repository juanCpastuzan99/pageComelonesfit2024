"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener parámetros de la URL
    const orderId = searchParams.get('orderId');
    const paymentId = searchParams.get('paymentId');
    
    if (orderId) {
      // Aquí puedes cargar los detalles de la orden desde Firebase
      setOrderDetails({
        orderId,
        paymentId,
        status: 'completed'
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
          {/* Icono de éxito */}
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            ¡Pago Exitoso!
          </h1>

          {/* Mensaje */}
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Tu pago ha sido procesado correctamente. Hemos recibido tu orden y te enviaremos un email de confirmación con los detalles.
          </p>

          {/* Detalles de la orden */}
          {orderDetails && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Detalles de tu Orden
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Número de Orden:</span>
                  <span className="font-medium">{orderDetails.orderId}</span>
                </div>
                {orderDetails.paymentId && (
                  <div className="flex justify-between">
                    <span>ID de Pago:</span>
                    <span className="font-medium">{orderDetails.paymentId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estado:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    Confirmado
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Información adicional */}
          <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
              ¿Qué sigue?
            </h4>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
              <p>• Recibirás un email de confirmación en los próximos minutos</p>
              <p>• Procesaremos tu pedido y te contactaremos para coordinar la entrega</p>
              <p>• Puedes hacer seguimiento de tu orden desde tu perfil</p>
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
              href="/perfil"
              className="px-8 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-colors duration-300"
            >
              Ver Mis Pedidos
            </Link>
          </div>

          {/* Contacto */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              ¿Tienes alguna pregunta sobre tu pedido?
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Contáctanos en{' '}
              <a href="mailto:soporte@comelonesfit.com" className="text-green-600 dark:text-green-400 hover:underline">
                soporte@comelonesfit.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage; 
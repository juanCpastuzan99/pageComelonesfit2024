import React, { useState } from 'react';
import { useCart } from '../app/context/CartContext';
import { useAuth } from '../app/context/AuthContext';
import { paymentService } from '../app/services/paymentService';
import { useToast } from '../app/hooks/useToast';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { formatCurrency } from '../utils/priceFormatter';
import Image from 'next/image';

const PAYMENT_METHODS = [
  { key: 'nequi', label: 'Nequi', type: 'auto' },
  { key: 'bancolombia', label: 'Bancolombia', type: 'manual' },
  { key: 'bbva', label: 'BBVA', type: 'manual' },
];

const BANK_ACCOUNTS = {
  bancolombia: {
    name: 'Ejemplo Titular',
    type: 'Ahorros',
    number: '12345678901',
    id: '1234567890',
    bank: 'Bancolombia',
  },
  bbva: {
    name: 'Ejemplo Titular',
    type: 'Ahorros',
    number: '98765432109',
    id: '1234567890',
    bank: 'BBVA',
  },
};

const CheckoutModal = ({ isOpen, onClose, onSuccess }) => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [formData, setFormData] = useState({
    customerName: user?.displayName || '',
    customerEmail: user?.email || '',
    customerPhone: '',
    shippingAddress: '',
    city: '',
    department: '',
    postalCode: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Datos, 2: Confirmación, 3: Pago
  const [paymentMethod, setPaymentMethod] = useState('nequi');
  const [receiptFile, setReceiptFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const required = ['customerName', 'customerEmail', 'customerPhone', 'shippingAddress', 'city'];
    const missing = required.filter(field => !formData[field]);
    
    if (missing.length > 0) {
      showError(`Por favor completa los campos: ${missing.join(', ')}`);
      return false;
    }
    
    if (!formData.customerEmail.includes('@')) {
      showError('Por favor ingresa un email válido');
      return false;
    }
    
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && !validateForm()) {
      return;
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Crear la orden
      const orderData = {
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price ?? item.precio ?? 0,
          quantity: item.quantity,
          total: (item.price ?? item.precio ?? 0) * item.quantity
        })),
        total: items.reduce((sum, item) => sum + ((item.price ?? item.precio ?? 0) * item.quantity), 0),
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        shippingAddress: {
          address: formData.shippingAddress,
          city: formData.city,
          department: formData.department,
          postalCode: formData.postalCode
        },
        userId: user?.uid || null,
        paymentMethod,
        status: paymentMethod === 'nequi' ? 'pending' : 'pending_verification',
      };

      if (paymentMethod === 'nequi') {
        const orderResult = await paymentService.createOrder(orderData);
        const paymentResult = await paymentService.generateNequiPaymentLink({
          ...orderData,
          orderId: orderResult.orderId
        });
        window.open(paymentResult.paymentUrl, '_blank');
        showSuccess('Redirigiendo a Nequi para completar el pago...');
        onClose();
        clearCart();
        if (onSuccess) onSuccess(orderResult.orderId);
      } else {
        // Bancolombia o BBVA: subir comprobante
        if (!receiptFile) {
          showError('Por favor sube el comprobante de la transferencia.');
          setLoading(false);
          return;
        }
        setUploading(true);
        // Subir comprobante a Firebase Storage
        const storage = getStorage();
        const storageRef = ref(storage, `receipts/${user?.uid || 'anon'}/${Date.now()}_${receiptFile.name}`);
        await uploadBytes(storageRef, receiptFile);
        const receiptUrl = await getDownloadURL(storageRef);
        setUploading(false);
        // Guardar orden con comprobante
        const orderResult = await paymentService.createOrder({
          ...orderData,
          receiptUrl,
        });
        showSuccess('Comprobante enviado. Tu pago será verificado.');
        onClose();
        clearCart();
        if (onSuccess) onSuccess(orderResult.orderId);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      showError('Error al procesar el pago. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Finalizar Compra
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center mt-6">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 mx-2 ${step >= 2 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>
                2
              </div>
              <div className={`w-16 h-1 mx-2 ${step >= 3 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 3 ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>
                3
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Información de Contacto
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    placeholder="+57 300 123 4567"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dirección de Envío *
                </label>
                <input
                  type="text"
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Calle 123 # 45-67"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Departamento
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Resumen del Pedido
              </h3>
              
              {/* Productos */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={item.image || item.imageUrl || "https://via.placeholder.com/50x50"}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Cantidad: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency((item.price ?? item.precio ?? 0) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Total */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-gray-900 dark:text-white">Total:</span>
                  <span className="text-green-600 dark:text-green-400">{formatCurrency(items.reduce((sum, item) => sum + ((item.price ?? item.precio ?? 0) * item.quantity), 0))}</span>
                </div>
              </div>
              
              {/* Información de envío */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Información de Envío:</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formData.customerName}<br />
                  {formData.shippingAddress}<br />
                  {formData.city}, {formData.department}<br />
                  Tel: {formData.customerPhone}
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Método de Pago
              </h3>
              <div className="flex flex-col gap-4 mb-4">
                {PAYMENT_METHODS.map((method) => (
                  <label key={method.key} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${paymentMethod === method.key ? 'border-green-500 bg-green-50 dark:bg-green-900' : 'border-gray-200 dark:border-gray-700'}` }>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.key}
                      checked={paymentMethod === method.key}
                      onChange={() => setPaymentMethod(method.key)}
                      className="form-radio text-green-500"
                    />
                    <span className="font-medium text-gray-900 dark:text-white">{method.label}</span>
                  </label>
                ))}
              </div>
              {paymentMethod === 'nequi' && (
                <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800 dark:text-green-200">Pago con Nequi</h4>
                      <p className="text-sm text-green-600 dark:text-green-300">
                        Pago seguro y rápido
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300 space-y-2">
                    <p>• Serás redirigido a Nequi para completar el pago</p>
                    <p>• El pago se procesará de forma segura</p>
                    <p>• Recibirás confirmación por email</p>
                  </div>
                </div>
              )}
              {(paymentMethod === 'bancolombia' || paymentMethod === 'bbva') && (
                <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                  <div className="mb-4">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Datos para Transferencia ({BANK_ACCOUNTS[paymentMethod].bank})</h4>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                      <li><b>Banco:</b> {BANK_ACCOUNTS[paymentMethod].bank}</li>
                      <li><b>Tipo de cuenta:</b> {BANK_ACCOUNTS[paymentMethod].type}</li>
                      <li><b>Número de cuenta:</b> {BANK_ACCOUNTS[paymentMethod].number}</li>
                      <li><b>Nombre titular:</b> {BANK_ACCOUNTS[paymentMethod].name}</li>
                      <li><b>Cédula:</b> {BANK_ACCOUNTS[paymentMethod].id}</li>
                    </ul>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">Sube el comprobante de la transferencia *</label>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={e => setReceiptFile(e.target.files[0])}
                      className="block w-full text-sm text-gray-700 dark:text-gray-200"
                      disabled={uploading || loading}
                    />
                  </div>
                  <div className="text-xs text-yellow-700 dark:text-yellow-300">
                    Tu pedido será procesado una vez verifiquemos el pago. Recibirás confirmación por email.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between">
            {step > 1 && (
              <button
                onClick={handlePrevStep}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                Anterior
              </button>
            )}
            
            <div className="flex-1"></div>
            
            {step < 3 ? (
              <button
                onClick={handleNextStep}
                disabled={loading}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-300"
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={handlePayment}
                disabled={loading || uploading}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-lg transition-colors duration-300 flex items-center space-x-2"
              >
                {loading || uploading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <span>{paymentMethod === 'nequi' ? 'Pagar con Nequi' : paymentMethod === 'bancolombia' ? 'Enviar Comprobante Bancolombia' : 'Enviar Comprobante BBVA'}</span>
                    <span className="text-lg">{formatCurrency(items.reduce((sum, item) => sum + ((item.price ?? item.precio ?? 0) * item.quantity), 0))}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal; 
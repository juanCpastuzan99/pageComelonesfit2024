"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSave, FaWeight, FaRuler, FaFire, FaImage, FaLink, FaUpload } from 'react-icons/fa';
import { useUserMetrics } from '../app/hooks/useUserMetrics';
import { storage, db } from '../app/firebase/firebaseConfig';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useAuth } from '../app/context/AuthContext';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function AddMetricsModal({ isOpen, onClose, onSuccess }) {
  const { addMetrics } = useUserMetrics();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    calories: '',
    bodyFat: '',
    muscleMass: '',
    date: new Date().toISOString().split('T')[0] // Today's date
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate at least one field is filled
    const hasData = Object.entries(formData).some(([key, value]) => 
      key !== 'date' && value && value.toString().trim() !== ''
    );

    if (!hasData) {
      setError('Por favor, ingresa al menos una métrica');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert string values to numbers where appropriate
      const metricsData = {
        weight: formData.weight ? parseFloat(formData.weight) : 0,
        height: formData.height ? parseFloat(formData.height) : 0,
        calories: formData.calories ? parseInt(formData.calories) : 0,
        bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : 0,
        muscleMass: formData.muscleMass ? parseFloat(formData.muscleMass) : 0,
        date: formData.date
      };

      await addMetrics(metricsData);
      
      // Reset form
      setFormData({
        weight: '',
        height: '',
        calories: '',
        bodyFat: '',
        muscleMass: '',
        date: new Date().toISOString().split('T')[0]
      });

      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Error al guardar las métricas');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full h-full max-w-none max-h-none rounded-none sm:max-w-md sm:h-auto sm:max-h-[90vh] sm:rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
              Agregar Métricas
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <FaTimes className="text-slate-500 dark:text-slate-400" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Error message */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Fecha
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                required
              />
            </div>

            {/* Weight */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <FaWeight className="text-blue-500" />
                Peso (kg)
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                step="0.1"
                min="0"
                max="300"
                placeholder="Ej: 70.5"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Height */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <FaRuler className="text-sky-500" />
                Estatura (cm)
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                step="0.1"
                min="0"
                max="300"
                placeholder="Ej: 175"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Calories */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <FaFire className="text-orange-500" />
                Calorías consumidas
              </label>
              <input
                type="number"
                name="calories"
                value={formData.calories}
                onChange={handleInputChange}
                min="0"
                max="10000"
                placeholder="Ej: 2000"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Body Fat */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Grasa corporal (%)
              </label>
              <input
                type="number"
                name="bodyFat"
                value={formData.bodyFat}
                onChange={handleInputChange}
                step="0.1"
                min="0"
                max="100"
                placeholder="Ej: 15.5"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Muscle Mass */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Masa muscular (kg)
              </label>
              <input
                type="number"
                name="muscleMass"
                value={formData.muscleMass}
                onChange={handleInputChange}
                step="0.1"
                min="0"
                max="200"
                placeholder="Ej: 45.2"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Helper text */}
            <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
              💡 <strong>Tip:</strong> No necesitas llenar todos los campos. Agrega solo las métricas que hayas medido hoy.
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <FaSave className="text-sm" />
                )}
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// Nuevo modal para cambiar foto de perfil
export function ChangeProfilePhotoModal({ isOpen, onClose, onSuccess }) {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Vista previa al seleccionar archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño del archivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('El archivo es demasiado grande. Máximo 5MB permitido.');
        return;
      }
      
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setError('Por favor selecciona un archivo de imagen válido.');
        return;
      }
      
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setImageUrl('');
      setError(null);
    }
  };

  // Vista previa al pegar enlace
  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
    setPreview(e.target.value);
    setSelectedFile(null);
    setError(null);
  };

  // Guardar la foto de perfil
  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Usuario no autenticado');
      return;
    }
    
    setLoading(true);
    setError(null);
    let photoURL = '';
    
    try {
      if (selectedFile) {
        console.log('Subiendo imagen a Storage...');
        const timestamp = Date.now();
        const fileRef = ref(storage, `profile_photos/${user.uid}/${timestamp}_${selectedFile.name}`);
        const snapshot = await uploadBytes(fileRef, selectedFile);
        photoURL = await getDownloadURL(snapshot.ref);
        console.log('Imagen subida:', photoURL);
      } else if (imageUrl) {
        // Validar que sea un enlace http(s) y no un data URL
        if (!/^https?:\/\//.test(imageUrl)) {
          setError('Por favor ingresa un enlace válido que empiece con http:// o https://');
          setLoading(false);
          return;
        }
        photoURL = imageUrl;
      } else {
        setError('Selecciona una imagen o ingresa un enlace');
        setLoading(false);
        return;
      }
      
      // Validar longitud máxima de la URL
      if (photoURL.length > 2048) {
        setError('La URL de la foto es demasiado larga. Usa una imagen más pequeña o un enlace más corto.');
        setLoading(false);
        return;
      }
      
      console.log('Actualizando perfil en Auth...');
      await updateProfile(user, { photoURL });
      
      console.log('Actualizando Firestore...');
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { photoURL });
      
      console.log('Recargando usuario...');
      await user.reload();
      
      if (onSuccess) onSuccess(photoURL);
      onClose();
      
    } catch (err) {
      console.error('Error al actualizar la foto de perfil:', err);
      
      let errorMessage = 'Error al actualizar la foto de perfil';
      
      // Manejar errores específicos de Firebase
      if (err.code === 'storage/unauthorized') {
        errorMessage = 'No tienes permisos para subir archivos';
      } else if (err.code === 'storage/quota-exceeded') {
        errorMessage = 'Se ha excedido el límite de almacenamiento';
      } else if (err.code === 'auth/requires-recent-login') {
        errorMessage = 'Necesitas volver a iniciar sesión para cambiar tu foto';
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = 'Error de conexión. Verifica tu internet';
      } else if (err.message) {
        errorMessage += ': ' + err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Limpiar estado al cerrar
  const handleClose = () => {
    setSelectedFile(null);
    setImageUrl('');
    setPreview('');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full h-full max-w-none max-h-none rounded-none sm:max-w-md sm:h-auto sm:max-h-[90vh] sm:rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
              Cambiar foto de perfil
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <FaTimes className="text-slate-500 dark:text-slate-400" />
            </button>
          </div>
          <form onSubmit={handleSave} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <FaUpload className="text-blue-500" /> Subir imagen desde tu dispositivo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Máximo 5MB. Formatos: JPG, PNG, GIF
              </p>
            </div>
            <div className="text-center text-slate-500 dark:text-slate-400">o</div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <FaLink className="text-green-500" /> Usar enlace de imagen
              </label>
              <input
                type="url"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={imageUrl}
                onChange={handleUrlChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
            {preview && (
              <div className="flex flex-col items-center gap-2 mt-4">
                <span className="text-xs text-slate-500 dark:text-slate-400">Vista previa:</span>
                <img 
                  src={preview} 
                  alt="Vista previa" 
                  className="w-32 h-32 object-cover rounded-full border border-slate-200 dark:border-slate-600"
                  onError={() => setError('No se pudo cargar la vista previa de la imagen')}
                />
              </div>
            )}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || (!selectedFile && !imageUrl)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <FaImage className="text-sm" />
                )}
                {loading ? 'Guardando...' : 'Guardar foto'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
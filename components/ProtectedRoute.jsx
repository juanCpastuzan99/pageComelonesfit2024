import React from 'react';
import { usePermissions } from '../app/hooks/usePermissions';

const ProtectedRoute = ({ 
  children, 
  requiredPermission, 
  fallback = null,
  showMessage = true 
}) => {
  const { can, userRole, isAdmin } = usePermissions();

  // Si no se especifica permiso requerido, mostrar el contenido
  if (!requiredPermission) {
    return <>{children}</>;
  }

  // Verificar si el usuario tiene el permiso requerido
  if (can(requiredPermission)) {
    return <>{children}</>;
  }

  // Si no tiene permisos y se debe mostrar mensaje
  if (showMessage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Acceso Restringido
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
            No tienes permisos para acceder a esta sección. Solo los administradores pueden gestionar productos.
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Tu rol actual:</strong> {userRole}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Permiso requerido:</strong> {requiredPermission}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-300"
            >
              Volver
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-300"
            >
              Ir al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si no se debe mostrar mensaje, retornar el fallback o null
  return fallback;
};

export default ProtectedRoute; 
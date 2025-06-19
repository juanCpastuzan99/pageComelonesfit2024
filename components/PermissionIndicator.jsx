import React from 'react';
import { usePermissions } from '../app/hooks/usePermissions';

const PermissionIndicator = () => {
  const { isAdmin, userRole } = usePermissions();

  if (!isAdmin) {
    return null; // No mostrar nada para usuarios no administradores
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs font-medium text-green-600 dark:text-green-400">
          {userRole === 'admin' ? '👑 Admin' : userRole}
        </span>
      </div>
      <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
    </div>
  );
};

export default PermissionIndicator; 
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { permissionService } from '../services/permissionService';

export const usePermissions = () => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState({
    canManageProducts: false,
    canAccessAdminDashboard: false,
    canCreateProducts: false,
    canEditProducts: false,
    canDeleteProducts: false,
    canViewProducts: true,
    canAddToCart: true,
    role: 'guest'
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState('guest');
  const [loading, setLoading] = useState(true);

  // Cargar permisos de forma asíncrona
  useEffect(() => {
    const loadPermissions = async () => {
      if (!user) {
        setPermissions(permissionService.getUserPermissionsSync(null));
        setIsAdmin(false);
        setUserRole('guest');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Obtener permisos asíncronos
        const asyncPermissions = await permissionService.getUserPermissions(user);
        const asyncIsAdmin = await permissionService.isAdmin(user);
        const asyncUserRole = await permissionService.getUserRole(user);
        
        setPermissions(asyncPermissions);
        setIsAdmin(asyncIsAdmin);
        setUserRole(asyncUserRole);
      } catch (error) {
        console.error('Error al cargar permisos:', error);
        
        // Fallback a permisos síncronos
        const syncPermissions = permissionService.getUserPermissionsSync(user);
        const syncIsAdmin = permissionService.isAdminSync(user);
        
        setPermissions(syncPermissions);
        setIsAdmin(syncIsAdmin);
        setUserRole(syncIsAdmin ? 'admin' : 'visitor');
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, [user]);

  return {
    // Permisos específicos
    canManageProducts: permissions.canManageProducts,
    canAccessAdminDashboard: permissions.canAccessAdminDashboard,
    canCreateProducts: permissions.canCreateProducts,
    canEditProducts: permissions.canEditProducts,
    canDeleteProducts: permissions.canDeleteProducts,
    canViewProducts: permissions.canViewProducts,
    canAddToCart: permissions.canAddToCart,

    // Información del usuario
    isAdmin,
    userRole,
    user,
    loading,

    // Funciones de verificación
    hasPermission: (permission) => {
      return permissions[permission] || false;
    },

    // Verificar si el usuario puede realizar una acción específica
    can: (action) => {
      switch (action) {
        case 'manage_products':
          return permissions.canManageProducts;
        case 'access_admin':
          return permissions.canAccessAdminDashboard;
        case 'create_products':
          return permissions.canCreateProducts;
        case 'edit_products':
          return permissions.canEditProducts;
        case 'delete_products':
          return permissions.canDeleteProducts;
        case 'view_products':
          return permissions.canViewProducts;
        case 'add_to_cart':
          return permissions.canAddToCart;
        default:
          return false;
      }
    },

    // Función para verificar si es propietario
    isOwner: () => {
      return permissionService.isOwner(user);
    },

    // Función para recargar permisos
    reloadPermissions: async () => {
      if (!user) return;
      
      try {
        const asyncPermissions = await permissionService.getUserPermissions(user);
        const asyncIsAdmin = await permissionService.isAdmin(user);
        const asyncUserRole = await permissionService.getUserRole(user);
        
        setPermissions(asyncPermissions);
        setIsAdmin(asyncIsAdmin);
        setUserRole(asyncUserRole);
      } catch (error) {
        console.error('Error al recargar permisos:', error);
      }
    }
  };
}; 
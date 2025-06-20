import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { permissionService } from '../services/permissionService';

export const usePermissions = () => {
  const { user, loading: authLoading } = useAuth();
  
  const guestPermissions = {
    canManageProducts: false,
    canAccessAdminDashboard: false,
    canCreateProducts: false,
    canEditProducts: false,
    canDeleteProducts: false,
    canViewProducts: true,
    canAddToCart: true,
    role: 'guest',
  };

  const [permissions, setPermissions] = useState(guestPermissions);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [userRole, setUserRole] = useState('guest');
  const [loading, setLoading] = useState(true);

  const loadPermissions = useCallback(async () => {
    if (authLoading) {
      setLoading(true);
      return;
    }

    if (!user) {
      setPermissions(guestPermissions);
      setIsAdmin(false);
      setIsOwner(false);
      setUserRole('guest');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userPermissions = await permissionService.getUserPermissions(user);
      
      setPermissions(userPermissions);
      const adminStatus = userPermissions.role === 'admin' || userPermissions.role === 'owner';
      const ownerStatus = userPermissions.role === 'owner';
      setIsAdmin(adminStatus);
      setIsOwner(ownerStatus);
      setUserRole(userPermissions.role);

    } catch (error) {
      console.error('Error al cargar permisos:', error);
      setPermissions(guestPermissions);
      setIsAdmin(false);
      setIsOwner(false);
      setUserRole('guest');
    } finally {
      setLoading(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  return {
    ...permissions,
    isAdmin,
    isOwner,
    userRole,
    user,
    loading,
    reloadPermissions: loadPermissions,
    can: (action) => {
        // El propietario siempre tiene permiso para todo.
        if (userRole === 'owner') return true;

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
  };
}; 
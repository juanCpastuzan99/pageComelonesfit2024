// Servicio para manejar permisos y roles de usuario
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { appConfig, configUtils } from '../config/appConfig';

const OWNER_EMAIL = appConfig.owner.email;

export const permissionService = {
  // Verificar si un usuario es propietario
  isOwner(user) {
    if (!user || !user.email) return false;
    return configUtils.isOwner(user.email);
  },

  // Verificar si un usuario es administrador (incluye propietario)
  async isAdmin(user) {
    if (!user) return false;
    if (user.email === OWNER_EMAIL) {
      return true;
    }
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const isAdminResult = userData.role === 'admin' || userData.role === 'owner';
        return isAdminResult;
      }
      return false;
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  },

  // Verificar si un usuario puede administrar productos
  async canManageProducts(user) {
    return await this.isAdmin(user);
  },

  // Verificar si un usuario puede ver el dashboard administrativo
  async canAccessAdminDashboard(user) {
    return await this.isAdmin(user);
  },

  // Verificar si un usuario puede crear productos
  async canCreateProducts(user) {
    return await this.isAdmin(user);
  },

  // Verificar si un usuario puede editar productos
  async canEditProducts(user) {
    return await this.isAdmin(user);
  },

  // Verificar si un usuario puede eliminar productos
  async canDeleteProducts(user) {
    return await this.isAdmin(user);
  },

  // Obtener el rol del usuario desde Firestore
  async getUserRole(user) {
    if (!user) return 'visitor';
    if (user.email === OWNER_EMAIL) {
      return 'owner';
    }
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userRole = userDoc.data().role || 'visitor';
        if (userRole === 'owner' && user.email !== OWNER_EMAIL) {
          return 'visitor';
        }
        const finalRole = userRole;
        return finalRole;
      }
      return 'visitor';
    } catch (error) {
      console.error("Error getting user role:", error);
      return 'visitor';
    }
  },

  // Obtener permisos específicos del usuario
  async getUserPermissions(user) {
    if (!user) {
      return { canManageProducts: false, canViewDashboard: false };
    }
    try {
      const userRole = await this.getUserRole(user);

      const permissions = {
        isAdmin: userRole === 'admin' || userRole === 'owner',
        isOwner: userRole === 'owner',
        userEmail: user.email,
        role: userRole,
        canAccessAdminDashboard: ['admin', 'owner'].includes(userRole),
        canCreateProducts: ['admin', 'owner'].includes(userRole),
        canEditProducts: ['admin', 'owner'].includes(userRole),
        canDeleteProducts: ['admin', 'owner'].includes(userRole),
        canManageUsers: ['owner'].includes(userRole),
        canManageSettings: ['owner'].includes(userRole),
        canViewOrders: ['admin', 'owner'].includes(userRole),
      };
      return permissions;
    } catch (error) {
      console.error("Error getting user permissions:", error);
      return { canManageProducts: false, canViewDashboard: false };
    }
  },

  // Verificar permisos de forma síncrona (solo para el propietario)
  isAdminSync(user) {
    return this.isOwner(user);
  },

  // Obtener permisos de forma síncrona
  getUserPermissionsSync(user) {
    const isAdmin = this.isAdminSync(user);
    
    return {
      canManageProducts: isAdmin,
      canAccessAdminDashboard: isAdmin,
      canCreateProducts: isAdmin,
      canEditProducts: isAdmin,
      canDeleteProducts: isAdmin,
      canViewProducts: true,
      canAddToCart: true,
      role: isAdmin ? 'admin' : 'visitor'
    };
  }
}; 
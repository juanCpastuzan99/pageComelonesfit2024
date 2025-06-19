// Servicio para manejar permisos y roles de usuario
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { appConfig, configUtils } from '../config/appConfig';

export const permissionService = {
  // Email del propietario principal
  OWNER_EMAIL: appConfig.owner.email,

  // Verificar si un usuario es propietario
  isOwner(user) {
    if (!user || !user.email) return false;
    return configUtils.isOwner(user.email);
  },

  // Verificar si un usuario es administrador (incluye propietario)
  async isAdmin(user) {
    if (!user || !user.email) return false;
    
    // El propietario siempre es admin
    if (this.isOwner(user)) return true;
    
    try {
      // Verificar en la colección de configuración de admin emails
      const adminConfigRef = doc(db, appConfig.firebase.config.adminEmails, 'adminEmails');
      const adminConfigDoc = await getDoc(adminConfigRef);
      
      if (adminConfigDoc.exists()) {
        const adminEmails = adminConfigDoc.data().emails || [];
        return adminEmails.includes(user.email.toLowerCase());
      }
      
      // Si no existe la configuración, crear con el propietario
      return false;
    } catch (error) {
      console.error('Error al verificar permisos de admin:', error);
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
    if (!user) return 'guest';
    
    try {
      const userRef = doc(db, appConfig.firebase.collections.users, user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return userDoc.data().role || 'visitor';
      }
      
      // Si no existe en Firestore, verificar si es admin
      if (await this.isAdmin(user)) {
        return 'admin';
      }
      
      return 'visitor';
    } catch (error) {
      console.error('Error al obtener rol del usuario:', error);
      return 'visitor';
    }
  },

  // Obtener permisos específicos del usuario
  async getUserPermissions(user) {
    if (!user) {
      return {
        canManageProducts: false,
        canAccessAdminDashboard: false,
        canCreateProducts: false,
        canEditProducts: false,
        canDeleteProducts: false,
        canViewProducts: true, // Todos pueden ver productos
        canAddToCart: true,    // Todos pueden agregar al carrito
        role: 'guest'
      };
    }
    
    const isAdmin = await this.isAdmin(user);
    const role = await this.getUserRole(user);
    
    return {
      canManageProducts: isAdmin,
      canAccessAdminDashboard: isAdmin,
      canCreateProducts: isAdmin,
      canEditProducts: isAdmin,
      canDeleteProducts: isAdmin,
      canViewProducts: true, // Todos pueden ver productos
      canAddToCart: true,    // Todos pueden agregar al carrito
      role: role
    };
  },

  // Verificar permisos de forma síncrona (para casos donde no se puede usar async)
  isAdminSync(user) {
    if (!user || !user.email) return false;
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
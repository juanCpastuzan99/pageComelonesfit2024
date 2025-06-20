// Configuración centralizada de la aplicación
export const appConfig = {
  // Información del propietario de la aplicación
  owner: {
    name: 'Juan Carlos Pastuzan',
    email: 'pastuzanjuancarlos@gmail.com', // Correo del propietario con acceso total
  },

  // Configuración de roles
  roles: {
    owner: {
      name: 'Propietario',
      permissions: ['all'],
      color: 'purple',
      icon: '👑'
    },
    admin: {
      name: 'Administrador',
      permissions: ['manage_products', 'access_admin', 'create_products', 'edit_products', 'delete_products'],
      color: 'red',
      icon: '👑'
    },
    visitor: {
      name: 'Visitante',
      permissions: ['view_products', 'add_to_cart'],
      color: 'blue',
      icon: '👤'
    },
    guest: {
      name: 'Invitado',
      permissions: ['view_products'],
      color: 'gray',
      icon: '👤'
    }
  },

  // Configuración de la aplicación
  app: {
    name: 'ComelonesFit',
    version: '1.0.0',
    description: 'Sistema de gestión de productos y usuarios',
    contact: {
      email: 'pastuzanjuancarlos@gmail.com',
      phone: '+57 300 123 4567'
    }
  },

  // Configuración de Firebase
  firebase: {
    collections: {
      users: 'users',
      products: 'products',
      config: 'config',
      orders: 'orders',
      metrics: 'userMetrics'
    },
    config: {
      adminEmails: 'adminEmails',
      appSettings: 'appSettings'
    }
  },

  // Configuración de paginación
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 50
  },

  // Configuración de validación
  validation: {
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Ingresa un email válido'
    },
    phone: {
      pattern: /^\+?[\d\s\-\(\)]+$/,
      message: 'Ingresa un número de teléfono válido'
    },
    password: {
      minLength: 6,
      message: 'La contraseña debe tener al menos 6 caracteres'
    }
  },

  // Configuración de notificaciones
  notifications: {
    duration: 5000, // 5 segundos
    position: 'top-right'
  },

  // Configuración de temas
  themes: {
    light: {
      primary: '#3B82F6',
      secondary: '#6B7280',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444'
    },
    dark: {
      primary: '#60A5FA',
      secondary: '#9CA3AF',
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171'
    }
  }
};

// Funciones de utilidad para la configuración
export const configUtils = {
  // Obtener información del rol
  getRoleInfo(role) {
    return appConfig.roles[role] || appConfig.roles.guest;
  },

  // Verificar si un usuario tiene un permiso específico
  hasPermission(userRole, permission) {
    const roleInfo = this.getRoleInfo(userRole);
    return roleInfo.permissions.includes('all') || roleInfo.permissions.includes(permission);
  },

  // Obtener el color del rol
  getRoleColor(role) {
    return this.getRoleInfo(role).color;
  },

  // Obtener el icono del rol
  getRoleIcon(role) {
    return this.getRoleInfo(role).icon;
  },

  // Verificar si es el propietario
  isOwner(email) {
    return email?.toLowerCase() === appConfig.owner.email.toLowerCase();
  },

  // Validar email
  validateEmail(email) {
    return appConfig.validation.email.pattern.test(email);
  },

  // Validar teléfono
  validatePhone(phone) {
    return appConfig.validation.phone.pattern.test(phone);
  }
}; 
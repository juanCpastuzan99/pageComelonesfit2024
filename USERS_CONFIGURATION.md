# Configuración de Usuarios - ComelonesFit

## Descripción General

Este documento describe la configuración y gestión del sistema de usuarios en ComelonesFit, incluyendo roles, permisos y funcionalidades administrativas.

## Estructura del Sistema

### Roles de Usuario

El sistema maneja los siguientes roles:

1. **Propietario (Owner)**
   - Email: `pastuzanjuancarlos@gmail.com`
   - Permisos: Todos los permisos del sistema
   - No puede ser eliminado ni modificado
   - Color: Púrpura
   - Icono: 👑

2. **Administrador (Admin)**
   - Permisos: Gestión completa de productos y usuarios
   - Puede acceder al panel de administración
   - Color: Rojo
   - Icono: 👑

3. **Visitante (Visitor)**
   - Permisos: Ver productos y agregar al carrito
   - Usuario registrado estándar
   - Color: Azul
   - Icono: 👤

4. **Invitado (Guest)**
   - Permisos: Solo ver productos
   - Usuario no registrado
   - Color: Gris
   - Icono: 👤

## Configuración Centralizada

### Archivo de Configuración: `app/config/appConfig.js`

```javascript
export const appConfig = {
  owner: {
    email: 'pastuzanjuancarlos@gmail.com',
    name: 'Juan Carlos Pastuzón',
    role: 'owner'
  },
  roles: {
    owner: { permissions: ['all'], color: 'purple', icon: '👑' },
    admin: { permissions: ['manage_products', 'access_admin', ...], color: 'red', icon: '👑' },
    visitor: { permissions: ['view_products', 'add_to_cart'], color: 'blue', icon: '👤' },
    guest: { permissions: ['view_products'], color: 'gray', icon: '👤' }
  }
}
```

## Servicios del Sistema

### 1. Servicio de Permisos (`app/services/permissionService.js`)

Maneja la verificación de permisos y roles de usuario:

- `isAdmin(user)`: Verifica si un usuario es administrador
- `isOwner(user)`: Verifica si un usuario es el propietario
- `getUserRole(user)`: Obtiene el rol del usuario desde Firestore
- `getUserPermissions(user)`: Obtiene todos los permisos del usuario

### 2. Servicio de Usuarios (`app/services/userService.js`)

Gestiona las operaciones CRUD de usuarios:

- `getAllUsers()`: Obtiene todos los usuarios
- `createUser(userData)`: Crea un nuevo usuario
- `updateUser(userId, userData)`: Actualiza un usuario
- `deleteUser(userId)`: Elimina un usuario
- `changeUserRole(userId, newRole)`: Cambia el rol de un usuario
- `addAdminEmail(email)`: Agrega un email a la lista de administradores
- `removeAdminEmail(email)`: Remueve un email de la lista de administradores

### 3. Hook de Permisos (`app/hooks/usePermissions.js`)

Proporciona permisos reactivos en componentes:

```javascript
const { isAdmin, userRole, can, hasPermission } = usePermissions();
```

## Panel de Administración

### Ubicación: `app/admin/users/page.jsx`

#### Funcionalidades Principales:

1. **Dashboard de Estadísticas**
   - Total de usuarios
   - Usuarios administradores
   - Usuarios visitantes
   - Nuevos usuarios (últimos 7 días)

2. **Gestión de Usuarios**
   - Lista de usuarios con información detallada
   - Búsqueda por email, nombre o apellido
   - Filtros por rol
   - Exportación a CSV

3. **Acciones por Usuario**
   - Ver detalles expandibles
   - Editar información del usuario
   - Cambiar rol (admin/visitor)
   - Eliminar usuario (con confirmación)

4. **Gestión de Emails Administradores**
   - Agregar emails a la lista de administradores
   - Remover emails de la lista
   - Promoción automática de usuarios existentes

#### Características de Seguridad:

- El propietario no puede ser modificado ni eliminado
- Los usuarios no pueden eliminarse a sí mismos
- Confirmación requerida para eliminación
- Validación de emails antes de agregar administradores

## Estructura de Datos en Firestore

### Colección: `users`

```javascript
{
  id: "user_uid",
  email: "usuario@ejemplo.com",
  nombre: "Juan",
  apellido: "Pérez",
  telefono: "+57 300 123 4567",
  whatsapp: "+57 300 123 4567",
  direccion: "Calle 123 #45-67",
  role: "visitor", // "admin", "visitor"
  createdAt: Timestamp,
  updatedAt: Timestamp,
  lastLogin: Timestamp
}
```

### Colección: `config`

#### Documento: `adminEmails`

```javascript
{
  emails: [
    "pastuzanjuancarlos@gmail.com",
    "admin1@ejemplo.com",
    "admin2@ejemplo.com"
  ]
}
```

## Flujo de Autenticación

1. **Registro de Usuario**
   - Se crea el documento en Firestore con rol "visitor"
   - Si el email está en la lista de administradores, se asigna rol "admin"

2. **Inicio de Sesión**
   - Se verifica el rol desde Firestore
   - Se actualiza `lastLogin`
   - Se cargan los permisos correspondientes

3. **Verificación de Permisos**
   - Se verifica si es propietario
   - Se verifica si está en la lista de administradores
   - Se obtiene el rol desde Firestore

## Funcionalidades Avanzadas

### Búsqueda y Filtros

- Búsqueda en tiempo real por email, nombre o apellido
- Filtros por rol (todos, administradores, visitantes)
- Contador de resultados mostrados

### Exportación de Datos

- Exportación a CSV con información completa
- Incluye: email, nombre, apellido, rol, fecha de registro, último acceso

### Gestión de Administradores

- Lista dinámica de emails administradores
- Promoción automática de usuarios existentes
- Protección del propietario

## Configuración de Desarrollo

### Variables de Entorno

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

### Reglas de Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios pueden leer su propio documento
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Solo administradores pueden acceder a la configuración
    match /config/{document=**} {
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Mantenimiento

### Tareas Regulares

1. **Revisión de Usuarios**
   - Verificar usuarios inactivos
   - Limpiar usuarios duplicados
   - Actualizar información de contacto

2. **Gestión de Administradores**
   - Revisar lista de emails administradores
   - Remover administradores inactivos
   - Agregar nuevos administradores según necesidad

3. **Backup de Datos**
   - Exportar usuarios regularmente
   - Mantener copias de seguridad de configuración

### Monitoreo

- Revisar logs de autenticación
- Monitorear intentos de acceso no autorizado
- Verificar integridad de datos de usuarios

## Soporte

Para problemas o consultas sobre la configuración de usuarios:

- **Email**: pastuzanjuancarlos@gmail.com
- **Documentación**: Este archivo y comentarios en el código
- **Logs**: Consola del navegador y Firebase Console 
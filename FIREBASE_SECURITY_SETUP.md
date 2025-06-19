# Configuración de Seguridad de Firebase

## Problema Resuelto

Se ha corregido el error al cambiar la foto de perfil implementando las siguientes mejoras:

### 1. Correcciones en el Código

- **Importaciones duplicadas**: Se eliminó la importación duplicada de `updateProfile`
- **Validación mejorada**: Se agregó validación de tamaño de archivo (máximo 5MB) y tipo de imagen
- **Manejo de errores**: Se implementó un manejo de errores más específico con mensajes claros
- **Nombres de archivo únicos**: Se agregó timestamp para evitar conflictos de nombres
- **Limpieza de estado**: Se limpia el estado al cerrar el modal

### 2. Reglas de Seguridad de Firebase Storage

Para que el cambio de foto de perfil funcione correctamente, necesitas configurar las reglas de seguridad en Firebase Console:

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto `comelonesfit-3f45a`
3. Ve a **Storage** en el menú lateral
4. Haz clic en **Rules**
5. Reemplaza las reglas existentes con el contenido del archivo `firebase-storage.rules`

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permitir a usuarios autenticados subir sus fotos de perfil
    match /profile_photos/{userId}/{fileName} {
      allow read: if true; // Cualquiera puede ver las fotos de perfil
      allow write: if request.auth != null && 
                   request.auth.uid == userId &&
                   request.resource.size < 5 * 1024 * 1024 && // Máximo 5MB
                   request.resource.contentType.matches('image/.*'); // Solo imágenes
    }
    
    // Otras reglas...
  }
}
```

### 3. Reglas de Seguridad de Firestore

También necesitas configurar las reglas de Firestore:

1. Ve a **Firestore Database** en Firebase Console
2. Haz clic en **Rules**
3. Reemplaza las reglas existentes con el contenido del archivo `firestore.rules`

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios pueden leer y escribir su propio documento
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    // Otras reglas...
  }
}
```

## Funcionalidades Mejoradas

### Validaciones Implementadas

- ✅ **Tamaño de archivo**: Máximo 5MB
- ✅ **Tipo de archivo**: Solo imágenes (JPG, PNG, GIF, etc.)
- ✅ **URL válida**: Para enlaces externos
- ✅ **Usuario autenticado**: Verificación de autenticación
- ✅ **Longitud de URL**: Máximo 2048 caracteres

### Manejo de Errores Específicos

- `storage/unauthorized`: "No tienes permisos para subir archivos"
- `storage/quota-exceeded`: "Se ha excedido el límite de almacenamiento"
- `auth/requires-recent-login`: "Necesitas volver a iniciar sesión"
- `auth/network-request-failed`: "Error de conexión. Verifica tu internet"

### Mejoras en la UI

- ✅ **Vista previa**: Muestra la imagen antes de guardar
- ✅ **Indicador de carga**: Spinner durante la subida
- ✅ **Botones deshabilitados**: Cuando no hay archivo seleccionado
- ✅ **Mensajes informativos**: Guías para el usuario
- ✅ **Limpieza automática**: Estado se resetea al cerrar

## Pasos para Implementar

1. **Actualizar el código**: Los cambios ya están aplicados en `components/AddMetricsModal.jsx`
2. **Configurar reglas de Storage**: Usar el archivo `firebase-storage.rules`
3. **Configurar reglas de Firestore**: Usar el archivo `firestore.rules`
4. **Probar la funcionalidad**: Intentar cambiar la foto de perfil

## Verificación

Para verificar que todo funciona:

1. Inicia sesión en la aplicación
2. Ve a tu perfil
3. Intenta cambiar la foto de perfil
4. Verifica que no aparezcan errores en la consola del navegador
5. Confirma que la foto se actualiza correctamente

## Soporte

Si sigues teniendo problemas:

1. Revisa la consola del navegador para errores específicos
2. Verifica que las reglas de Firebase estén correctamente configuradas
3. Asegúrate de que el usuario esté autenticado
4. Contacta al administrador del sistema

---

**Nota**: Las reglas de seguridad son fundamentales para el funcionamiento correcto. Sin ellas, Firebase bloqueará las operaciones de escritura por seguridad. 
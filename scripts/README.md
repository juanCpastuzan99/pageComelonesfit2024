# Scripts de Administración - ComelonesFit

Este directorio contiene scripts y herramientas para gestionar el acceso administrativo del sistema.

## 🔒 Herramientas Disponibles

### 1. Panel de Seguridad Web (RECOMENDADO)
**URL:** `/admin/security`

La forma más fácil y segura de verificar y limpiar el acceso administrativo es usar el panel web integrado.

**Cómo acceder:**
1. Inicia sesión con tu cuenta de administrador (`pastuzanjuancarlos@gmail.com`)
2. Ve a la URL: `http://localhost:3000/admin/security` (o tu dominio)
3. Usa los botones para verificar y limpiar el acceso

**Ventajas:**
- ✅ No requiere configuración adicional
- ✅ Respeta las reglas de seguridad de Firestore
- ✅ Interfaz visual intuitiva
- ✅ Verificación en tiempo real

### 2. Scripts de Línea de Comandos (AVANZADO)

#### Verificar Acceso Administrativo
**Archivo:** `verifyAdminAccess.js`

```bash
node scripts/verifyAdminAccess.js
```

**Nota:** Este script puede fallar debido a las reglas de seguridad de Firestore.

#### Limpiar Acceso Administrativo
**Archivo:** `cleanupAdminAccess.js`

```bash
# Para limpiar el acceso
node scripts/cleanupAdminAccess.js

# Para solo verificar el estado actual
node scripts/cleanupAdminAccess.js --check
```

**Nota:** Este script puede fallar debido a las reglas de seguridad de Firestore.

## 🎯 Propósito

Estas herramientas aseguran que **SOLO** `pastuzanjuancarlos@gmail.com` tenga acceso administrativo al sistema, eliminando cualquier otro usuario que pueda haber obtenido permisos de administrador.

## ⚠️ Advertencias

- **Usar el panel web:** Es la opción más segura y confiable
- **Ejecutar con precaución:** Los cambios son irreversibles
- **Hacer backup:** Recomendamos hacer una copia de seguridad antes de ejecutar
- **Verificar primero:** Siempre verificar el estado antes de limpiar

## 📋 Pasos Recomendados

### Opción 1: Panel Web (RECOMENDADO)
1. **Acceder al panel:** Ve a `/admin/security`
2. **Verificar estado:** Usa el botón "Verificar Estado"
3. **Si hay problemas:** Usa el botón "Limpiar Acceso"
4. **Confirmar:** Verifica que el estado sea seguro

### Opción 2: Scripts (AVANZADO)
1. **Verificar estado actual:**
   ```bash
   node scripts/verifyAdminAccess.js
   ```

2. **Si hay problemas de seguridad, limpiar:**
   ```bash
   node scripts/cleanupAdminAccess.js
   ```

3. **Verificar que la limpieza fue exitosa:**
   ```bash
   node scripts/verifyAdminAccess.js
   ```

## 🔧 Configuración

Los scripts usan la configuración de Firebase del proyecto:
- **Proyecto:** comelonesfit-3f45a
- **Propietario:** pastuzanjuancarlos@gmail.com

## 📊 Resultado Esperado

Después de ejecutar la limpieza, deberías ver:

```
✅ ✅ SISTEMA SEGURO: Solo pastuzanjuancarlos@gmail.com tiene acceso administrativo
```

## 🚨 Problemas Comunes

### Error de Permisos en Scripts
Si ves el error `Missing or insufficient permissions`, es normal. Las reglas de seguridad de Firestore bloquean el acceso directo desde scripts.

**Solución:** Usa el panel web en `/admin/security`

### Error de Importación
Si hay errores de importación, verifica que:
1. Todas las dependencias estén instaladas
2. Las rutas de importación sean correctas
3. El proyecto esté configurado correctamente

## 🎯 Recomendación Principal

**Usa el panel web en `/admin/security`** - Es la forma más fácil, segura y confiable de gestionar el acceso administrativo.

## 📞 Soporte

Para problemas técnicos, contactar a: pastuzanjuancarlos@gmail.com 
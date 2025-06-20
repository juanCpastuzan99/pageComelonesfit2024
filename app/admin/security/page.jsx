"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import { userService } from '../../services/userService';
import { appConfig, configUtils } from '../../config/appConfig';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

const OWNER_EMAIL = 'pastuzanjuancarlos@gmail.com';

export default function SecurityPage() {
  const { user } = useAuth();
  const { isAdmin } = usePermissions();
  const [loading, setLoading] = useState(false);
  const [securityStatus, setSecurityStatus] = useState(null);
  const [adminEmails, setAdminEmails] = useState([]);
  const [users, setUsers] = useState([]);
  const [actionResult, setActionResult] = useState(null);

  // Verificar estado de seguridad
  const checkSecurityStatus = async () => {
    setLoading(true);
    setActionResult(null);
    
    try {
      // 1. Verificar emails admin
      const adminConfigRef = doc(db, 'config', 'adminEmails');
      const adminConfigDoc = await getDoc(adminConfigRef);
      
      let currentAdminEmails = [];
      if (adminConfigDoc.exists()) {
        currentAdminEmails = adminConfigDoc.data().emails || [];
      }
      setAdminEmails(currentAdminEmails);

      // 2. Verificar usuarios
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const allUsers = [];
      const adminUsers = [];
      const ownerUsers = [];
      
      usersSnapshot.docs.forEach(doc => {
        const userData = doc.data();
        allUsers.push({
          id: doc.id,
          ...userData
        });
        
        if (userData.role === 'admin') {
          adminUsers.push(userData.email);
        } else if (userData.role === 'owner') {
          ownerUsers.push(userData.email);
        }
      });
      setUsers(allUsers);

      // 3. Determinar estado de seguridad
      const onlyOwnerInAdminList = currentAdminEmails.length === 1 && 
        currentAdminEmails[0] === OWNER_EMAIL.toLowerCase();
      
      const onlyOwnerHasAdminRole = ownerUsers.length === 1 && 
        ownerUsers[0] === OWNER_EMAIL && 
        adminUsers.length === 0;

      setSecurityStatus({
        isSecure: onlyOwnerInAdminList && onlyOwnerHasAdminRole,
        adminEmails: currentAdminEmails,
        adminUsers,
        ownerUsers,
        totalUsers: allUsers.length,
        onlyOwnerInAdminList,
        onlyOwnerHasAdminRole
      });

    } catch (error) {
      console.error('Error verificando seguridad:', error);
      setActionResult({
        type: 'error',
        message: 'Error al verificar el estado de seguridad: ' + error.message
      });
    } finally {
      setLoading(false);
    }
  };

  // Limpiar acceso administrativo
  const cleanupAdminAccess = async () => {
    if (!confirm('¿Estás seguro de que quieres limpiar el acceso administrativo? Esta acción es irreversible.')) {
      return;
    }

    setLoading(true);
    setActionResult(null);
    
    try {
      let changes = 0;

      // 1. Limpiar lista de emails admin
      const adminConfigRef = doc(db, 'config', 'adminEmails');
      await setDoc(adminConfigRef, {
        emails: [OWNER_EMAIL.toLowerCase()]
      });
      changes++;

      // 2. Cambiar roles de usuarios no autorizados
      for (const userData of users) {
        const userEmail = userData.email;
        const currentRole = userData.role;
        
        // Si es el propietario, asegurar que tenga rol 'owner'
        if (userEmail === OWNER_EMAIL) {
          if (currentRole !== 'owner') {
            await updateDoc(doc(db, 'users', userData.id), {
              role: 'owner',
              updatedAt: new Date()
            });
            changes++;
          }
        } 
        // Si no es el propietario pero tiene rol admin o owner, cambiar a visitor
        else if (currentRole === 'admin' || currentRole === 'owner') {
          await updateDoc(doc(db, 'users', userData.id), {
            role: 'visitor',
            updatedAt: new Date()
          });
          changes++;
        }
      }

      setActionResult({
        type: 'success',
        message: `Limpieza completada exitosamente. ${changes} cambios realizados.`
      });

      // Verificar estado después de la limpieza
      await checkSecurityStatus();

    } catch (error) {
      console.error('Error durante la limpieza:', error);
      setActionResult({
        type: 'error',
        message: 'Error durante la limpieza: ' + error.message
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      checkSecurityStatus();
    }
  }, [isAdmin]);

  // Verificar permisos
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Solo los administradores pueden acceder a esta página.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🔒 Panel de Seguridad
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Verifica y gestiona el acceso administrativo del sistema
          </p>
        </div>

        {/* Estado de Seguridad */}
        {securityStatus && (
          <div className="mb-8">
            <div className={`p-6 rounded-lg border-2 ${
              securityStatus.isSecure 
                ? 'bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800' 
                : 'bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-800'
            }`}>
              <div className="flex items-center mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  securityStatus.isSecure ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {securityStatus.isSecure ? '✅' : '❌'}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Estado de Seguridad
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">📧 Emails Administradores</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {securityStatus.adminEmails.length} email(s) configurado(s)
                  </p>
                  <ul className="mt-2 space-y-1">
                    {securityStatus.adminEmails.map((email, index) => (
                      <li key={index} className="text-sm">
                        {email} {email === OWNER_EMAIL ? '👑 (Propietario)' : '👑 (Admin)'}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">👥 Usuarios con Roles Admin</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {securityStatus.ownerUsers.length} owner(s), {securityStatus.adminUsers.length} admin(s)
                  </p>
                  <ul className="mt-2 space-y-1">
                    {securityStatus.ownerUsers.map((email, index) => (
                      <li key={index} className="text-sm">
                        {email} {email === OWNER_EMAIL ? '✅ (Autorizado)' : '❌ (NO AUTORIZADO)'}
                      </li>
                    ))}
                    {securityStatus.adminUsers.map((email, index) => (
                      <li key={index} className="text-sm">
                        {email} ❌ (NO AUTORIZADO)
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="text-center">
                {securityStatus.isSecure ? (
                  <div className="text-green-700 dark:text-green-300 font-medium">
                    ✅ SISTEMA SEGURO: Solo pastuzanjuancarlos@gmail.com tiene acceso administrativo
                  </div>
                ) : (
                  <div className="text-red-700 dark:text-red-300 font-medium">
                    ❌ SISTEMA INSEGURO: Hay otros usuarios con acceso administrativo
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🔍 Verificar Estado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Verifica el estado actual de seguridad del sistema
            </p>
            <button
              onClick={checkSecurityStatus}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
            >
              {loading ? 'Verificando...' : 'Verificar Estado'}
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🧹 Limpiar Acceso
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Limpia el acceso administrativo dejando solo al propietario
            </p>
            <button
              onClick={cleanupAdminAccess}
              disabled={loading || (securityStatus?.isSecure)}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors duration-200"
            >
              {loading ? 'Limpiando...' : 'Limpiar Acceso'}
            </button>
          </div>
        </div>

        {/* Resultado de acciones */}
        {actionResult && (
          <div className={`p-4 rounded-lg mb-6 ${
            actionResult.type === 'success' 
              ? 'bg-green-50 border border-green-200 dark:bg-green-900/30 dark:border-green-800' 
              : 'bg-red-50 border border-red-200 dark:bg-red-900/30 dark:border-red-800'
          }`}>
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
                actionResult.type === 'success' ? 'bg-green-500' : 'bg-red-500'
              }`}>
                {actionResult.type === 'success' ? '✅' : '❌'}
              </div>
              <span className={`font-medium ${
                actionResult.type === 'success' 
                  ? 'text-green-800 dark:text-green-200' 
                  : 'text-red-800 dark:text-red-200'
              }`}>
                {actionResult.message}
              </span>
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
            ℹ️ Información de Seguridad
          </h3>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
            <p>• <strong>Propietario:</strong> {OWNER_EMAIL} (acceso total)</p>
            <p>• <strong>Administradores:</strong> Solo emails en la lista config/adminEmails</p>
            <p>• <strong>Visitantes:</strong> Usuarios registrados sin permisos administrativos</p>
            <p>• <strong>Verificación automática:</strong> Los roles se verifican al iniciar sesión</p>
          </div>
        </div>
      </div>
    </div>
  );
} 
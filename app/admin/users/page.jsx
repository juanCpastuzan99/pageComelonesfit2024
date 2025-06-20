"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../../app/context/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import { userService } from '../../services/userService';
import { collection, getDocs, query, where, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../app/firebase/firebaseConfig';
import { appConfig, configUtils } from '../../config/appConfig';
import { useToast } from '../../hooks/useToast';

// Componente para mostrar estadísticas
const StatCard = ({ title, value }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
    <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
  </div>
);

// Componente para la tarjeta de usuario
const UserCard = ({ user, onRoleChange, onDeleteUser, onEditUser, currentUser }) => {
  const [isChangingRole, setIsChangingRole] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleRoleChange = async (newRole) => {
    if (!window.confirm(`¿Estás seguro de que quieres cambiar el rol de "${user.email}" a "${newRole}"?`)) {
      return;
    }
    setIsChangingRole(true);
    try {
      await onRoleChange(user.id, newRole);
    } catch (error) {
      console.error('Error al cambiar rol:', error);
    } finally {
      setIsChangingRole(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar al usuario "${user.email}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    try {
      await onDeleteUser(user.id);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert('Error al eliminar usuario');
    }
  };

  const isCurrentUser = currentUser?.uid === user.id;
  const isOwner = configUtils.isOwner(user.email);

  // Forzar rol de visualización a 'owner' si es el propietario, para consistencia visual.
  const displayRole = isOwner ? 'owner' : user.role;

  const roleInfoMap = {
    owner: { name: 'Propietario', color: 'text-purple-600', icon: '👑', avatarColor: 'bg-purple-500' },
    admin: { name: 'Administrador', color: 'text-red-600', icon: '👑', avatarColor: 'bg-red-500' },
    visitor: { name: 'Visitante', color: 'text-blue-600', icon: '👤', avatarColor: 'bg-blue-500' },
  };

  const currentRoleInfo = roleInfoMap[displayRole] || roleInfoMap.visitor;

  return (
    <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg border ${isOwner ? 'border-purple-300 dark:border-purple-700' : 'border-gray-200 dark:border-gray-700'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${currentRoleInfo.avatarColor}`}>
              {user.email ? user.email[0].toUpperCase() : '?'}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs ${currentRoleInfo.avatarColor}`}>
              {currentRoleInfo.icon}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {user.email}
              </h3>
              {isCurrentUser && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full dark:bg-green-900 dark:text-green-200">
                  Tú
                </span>
              )}
              {isOwner && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full dark:bg-purple-900 dark:text-purple-200">
                  Propietario
                </span>
              )}
            </div>
            
            <div className="mt-1 space-y-1">
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span>Rol: 
                  <span className={`ml-1 font-medium ${currentRoleInfo.color}`}>
                    {currentRoleInfo.name}
                  </span>
                </span>
                {user.nombre && user.apellido && (
                  <span>Nombre: {user.nombre} {user.apellido}</span>
                )}
              </div>
              
              {user.createdAt && (
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Registrado: {new Date(user.createdAt?.toDate ? user.createdAt.toDate() : user.createdAt).toLocaleDateString()}
                </p>
              )}
              
              {user.lastLogin && (
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Último acceso: {new Date(user.lastLogin.toDate()).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!isOwner && !isCurrentUser && (
            <>
              <div className="flex items-center space-x-2">
                <label htmlFor={`role-select-${user.id}`} className="text-sm font-medium text-gray-600 dark:text-gray-400">Rol:</label>
                <select
                  id={`role-select-${user.id}`}
                  value={user.role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  disabled={isChangingRole}
                  className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="visitor">Visitante</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="w-px h-6 bg-gray-200 dark:bg-gray-600"></div>
              <button
                onClick={handleDelete}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md transition-colors duration-200"
                title="Eliminar usuario"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </>
          )}
          {isOwner && (
            <div className="text-sm font-semibold text-purple-600 dark:text-purple-400">
              (Propietario)
            </div>
          )}
          {isCurrentUser && !isOwner && (
            <div className="text-sm font-semibold text-green-600 dark:text-green-400">
              (Tú)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EditUserModal = ({ user, isOpen, onClose, onSave, currentUser }) => {
  const [form, setForm] = useState(user || {});
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => { setForm(user || {}); setNewPassword(''); }, [user]);
  if (!isOpen || !user) return null;
  const isCurrentUser = currentUser?.uid === user.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(form);
      // Si el usuario editado es el actual y hay nueva contraseña
      if (isCurrentUser && newPassword) {
        // Cambiar la contraseña usando Firebase Auth
        await currentUser.updatePassword(newPassword);
        alert('Contraseña actualizada correctamente');
      }
      setNewPassword('');
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      alert('Error al guardar los cambios');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Editar usuario</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email (solo lectura) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={form.email || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400"
            />
            <p className="text-xs text-gray-500 mt-1">El email no se puede modificar</p>
          </div>
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={form.nombre || ''}
              onChange={e => setForm({ ...form, nombre: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Nombre del usuario"
            />
          </div>
          {/* Apellido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Apellido
            </label>
            <input
              type="text"
              value={form.apellido || ''}
              onChange={e => setForm({ ...form, apellido: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Apellido del usuario"
            />
          </div>
          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              value={form.telefono || ''}
              onChange={e => setForm({ ...form, telefono: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="+57 300 123 4567"
            />
          </div>
          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              WhatsApp
            </label>
            <input
              type="tel"
              value={form.whatsapp || ''}
              onChange={e => setForm({ ...form, whatsapp: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="+57 300 123 4567"
            />
          </div>
          {/* Dirección */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Dirección
            </label>
            <textarea
              value={form.direccion || ''}
              onChange={e => setForm({ ...form, direccion: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Dirección completa del usuario"
            />
          </div>
          {/* Campo para cambiar contraseña solo si es el usuario actual */}
          {isCurrentUser && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nueva contraseña
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Dejar vacío para no cambiar"
                minLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">Solo puedes cambiar tu propia contraseña.</p>
            </div>
          )}
          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
            >
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente principal
export default function AdminPage() {
  // Hooks SIEMPRE al inicio
  const { user } = useAuth();
  const { isOwner, loading: permissionsLoading } = usePermissions();
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    visitorUsers: 0,
    recentUsers: 0
  });
  const [ownerRoleIsCorrect, setOwnerRoleIsCorrect] = useState(true);

  useEffect(() => {
    const unsubscribe = userService.onUsersChange((usersData) => {
      setUsers(usersData);

      const ownerUser = usersData.find(u => configUtils.isOwner(u.email));
      if (ownerUser && ownerUser.role !== 'owner') {
        setOwnerRoleIsCorrect(false);
      } else {
        setOwnerRoleIsCorrect(true);
      }

      const totalUsers = usersData.length;
      
      // Corregido: Contar al propietario como administrador para las estadísticas.
      const adminUsersCount = usersData.filter(u => u.role === 'admin' || configUtils.isOwner(u.email)).length;
      
      // Corregido: Asegurarse de no contar al propietario como visitante.
      const visitorUsersCount = usersData.filter(u => u.role === 'visitor' && !configUtils.isOwner(u.email)).length;

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recentUsers = usersData.filter(u => {
        if (!u.createdAt) return false;
        const createdAtDate = u.createdAt.toDate ? u.createdAt.toDate() : new Date(u.createdAt);
        return createdAtDate > weekAgo;
      }).length;
      setStats({ totalUsers, adminUsers: adminUsersCount, visitorUsers: visitorUsersCount, recentUsers });
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (permissionsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Solo el propietario del sistema puede acceder a esta página.
          </p>
        </div>
      </div>
    );
  }

  // Cambiar rol de usuario
  const handleRoleChange = async (userId, newRole) => {
    try {
      await userService.changeUserRole(userId, newRole);
      console.log(`Rol de usuario ${userId} cambiado a ${newRole}`);
      showToast('success', `Rol de usuario cambiado a ${newRole}`);
    } catch (error) {
      console.error('Error al cambiar rol:', error);
      showToast('error', 'Error al cambiar el rol del usuario');
      throw error;
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async (userId) => {
    try {
      await userService.deleteUser(userId);
      console.log(`Usuario ${userId} eliminado`);
      showToast('success', 'Usuario eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      showToast('error', 'Error al eliminar el usuario');
      throw error;
    }
  };

  const handleEdit = user => {
    setSelected(user);
    setModalOpen(true);
  };
  
  const handleSave = async updated => {
    try {
      await userService.updateUser(updated.id, updated);
      setModalOpen(false);
      showToast('success', 'Usuario actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      showToast('error', 'Error al actualizar el usuario');
      throw error;
    }
  };

  // Filtrar usuarios basado en búsqueda y filtros
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.apellido?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const displayRole = configUtils.isOwner(user.email) ? 'owner' : user.role;
    let matchesRole;
    if (roleFilter === 'all') {
      matchesRole = true;
    } else if (roleFilter === 'admin') {
      // Corregido: Incluir al propietario cuando se filtra por "Administradores".
      matchesRole = (displayRole === 'admin' || displayRole === 'owner');
    } else {
      matchesRole = (displayRole === roleFilter);
    }
    
    return matchesSearch && matchesRole;
  });

  // Función para exportar usuarios
  const exportUsers = () => {
    const csvContent = [
      ['Email', 'Nombre', 'Apellido', 'Rol', 'Fecha de Registro', 'Último Acceso'],
      ...filteredUsers.map(user => [
        user.email || '',
        user.nombre || '',
        user.apellido || '',
        user.role === 'admin' ? 'Administrador' : 'Visitante',
        user.createdAt ? new Date(user.createdAt.toDate()).toLocaleDateString() : '',
        user.lastLogin ? new Date(user.lastLogin.toDate()).toLocaleDateString() : ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `usuarios_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Panel de Administración
          </h1>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            👑 Solo Admin
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Gestiona usuarios, roles y permisos del sistema ComelonesFit
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Usuarios Totales"
          value={stats.totalUsers}
        />
        <StatCard
          title="Administradores"
          value={stats.adminUsers}
        />
        <StatCard
          title="Visitantes"
          value={stats.visitorUsers}
        />
        <StatCard
          title="Nuevos (7 días)"
          value={stats.recentUsers}
        />
      </div>

      {/* Lista de usuarios */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Gestión de Usuarios
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Administra roles y permisos de usuarios registrados
          </p>
        </div>

        <div className="p-6">
          {/* Controles de búsqueda y filtros */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Búsqueda */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Buscar usuarios
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por email, nombre o apellido..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              {/* Filtro por rol */}
              <div className="sm:w-48">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Filtrar por rol
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">Todos los roles</option>
                  <option value="owner">Propietario</option>
                  <option value="admin">Administradores</option>
                  <option value="visitor">Visitantes</option>
                </select>
              </div>
              
              {/* Botón de exportar */}
              <div className="sm:w-auto">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  &nbsp;
                </label>
                <button
                  onClick={exportUsers}
                  className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Exportar CSV</span>
                </button>
              </div>
            </div>
            
            {/* Información de resultados */}
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>
                Mostrando {filteredUsers.length} de {users.length} usuarios
              </span>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Limpiar búsqueda
                </button>
              )}
            </div>
          </div>

          {users.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No hay usuarios registrados
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Los usuarios aparecerán aquí cuando se registren en el sistema
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((userData) => (
                <UserCard
                  key={userData.id}
                  user={userData}
                  onRoleChange={handleRoleChange}
                  onDeleteUser={handleDeleteUser}
                  onEditUser={handleEdit}
                  currentUser={user}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Panel de información */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Información sobre la gestión de usuarios
            </h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Propietario:</strong> Acceso total al sistema. No puede ser modificado.</li>
                <li><strong>Administradores:</strong> Pueden gestionar productos y usuarios.</li>
                <li><strong>Visitantes:</strong> Solo pueden ver y explorar productos.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Gestor de emails admin */}
      <AdminEmailsManager />

      <EditUserModal user={selected} isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} currentUser={user} />
    </div>
  );
}

// Componente para gestionar emails admin
const AdminEmailsManager = () => {
  const [adminEmails, setAdminEmails] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Cargar emails admin desde Firestore
  useEffect(() => {
    const loadAdminEmails = async () => {
      try {
        const adminConfigRef = doc(db, 'config', 'adminEmails');
        const adminConfigDoc = await getDoc(adminConfigRef);
        
        if (adminConfigDoc.exists()) {
          setAdminEmails(adminConfigDoc.data().emails || []);
        } else {
          // Crear documento inicial con tu email
          const initialEmails = [appConfig.owner.email];
          await setDoc(adminConfigRef, { emails: initialEmails });
          setAdminEmails(initialEmails);
        }
      } catch (error) {
        console.error('Error al cargar emails admin:', error);
      }
    };

    loadAdminEmails();
  }, []);

  // Agregar nuevo email admin
  const handleAddEmail = async (e) => {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.includes('@')) {
      alert('Ingresa un email válido');
      return;
    }

    if (adminEmails.includes(newEmail)) {
      alert('Este email ya es administrador');
      return;
    }

    setLoading(true);
    try {
      await userService.addAdminEmail(newEmail.trim());
      
      // Actualizar estado local
      setAdminEmails([...adminEmails, newEmail.trim()]);
      setNewEmail('');
      
      // Si el usuario ya existe, cambiar su rol automáticamente
      const usersQuery = query(collection(db, 'users'), where('email', '==', newEmail.trim()));
      const userSnapshot = await getDocs(usersQuery);
      
      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        await userService.changeUserRole(userDoc.id, 'admin');
        alert(`Email agregado y usuario existente promovido a admin`);
      } else {
        alert(`Email agregado. Será admin cuando se registre.`);
      }
    } catch (error) {
      console.error('Error al agregar email admin:', error);
      alert('Error al agregar email admin');
    } finally {
      setLoading(false);
    }
  };

  // Remover email admin
  const handleRemoveEmail = async (emailToRemove) => {
    if (configUtils.isOwner(emailToRemove)) {
      alert('No puedes remover al propietario');
      return;
    }

    if (!confirm(`¿Remover "${emailToRemove}" de la lista de administradores?`)) {
      return;
    }

    try {
      await userService.removeAdminEmail(emailToRemove);
      
      // Actualizar estado local
      setAdminEmails(adminEmails.filter(email => email !== emailToRemove));
      
      // Si el usuario existe, cambiar su rol a visitor
      const usersQuery = query(collection(db, 'users'), where('email', '==', emailToRemove));
      const userSnapshot = await getDocs(usersQuery);
      
      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        await userService.changeUserRole(userDoc.id, 'visitor');
      }
      
      alert('Email removido de administradores');
    } catch (error) {
      console.error('Error al remover email admin:', error);
      alert('Error al remover email admin');
    }
  };

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Gestionar Emails Administradores
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Agrega o remueve emails que tendrán permisos de administrador automáticamente
        </p>
      </div>

      <div className="p-6">
        {/* Formulario para agregar email */}
        <form onSubmit={handleAddEmail} className="mb-6">
          <div className="flex gap-3">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="email@ejemplo.com"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
            >
              {loading ? 'Agregando...' : 'Agregar Admin'}
            </button>
          </div>
        </form>

        {/* Lista de emails admin */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Emails Administradores ({adminEmails.length})
          </h3>
          
          {adminEmails.map((email) => (
            <div key={email} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {email[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{email}</p>
                  {configUtils.isOwner(email) && (
                    <p className="text-xs text-purple-600 dark:text-purple-400">Propietario</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full dark:bg-red-900 dark:text-red-200">
                  Admin
                </span>
                {!configUtils.isOwner(email) && (
                  <button
                    onClick={() => handleRemoveEmail(email)}
                    className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors duration-200"
                    title="Remover admin"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Información */}
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start">
            <svg className="h-5 w-5 text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Importante:
              </h4>
              <ul className="mt-1 text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>• Los emails agregados serán automáticamente administradores al registrarse</li>
                <li>• Si el usuario ya existe, su rol cambiará inmediatamente</li>
                <li>• Tu email de propietario no puede ser removido</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
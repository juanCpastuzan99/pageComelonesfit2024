"use client";
import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { usePermissions } from '../hooks/usePermissions';
import { MdAdminPanelSettings, MdPerson, MdStar } from 'react-icons/md';

const EditUserModal = ({ user, isOpen, onClose, onSave }) => {
  const [form, setForm] = useState(user || {});
  useEffect(() => { setForm(user || {}); }, [user]);
  if (!isOpen || !user) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-lg">
        <h2 className="text-xl font-bold mb-4">Editar usuario</h2>
        <form onSubmit={e => { e.preventDefault(); onSave(form); }}>
          {['nombre','apellido','email','telefono','whatsapp','direccion'].map(field => (
            <div className="mb-3" key={field}>
              <label className="block text-sm font-medium mb-1">{field.charAt(0).toUpperCase()+field.slice(1)}</label>
              <input
                className="form-input w-full border rounded px-3 py-2"
                value={form[field] || ''}
                onChange={e => setForm({ ...form, [field]: e.target.value })}
                disabled={field==='email'}
                required={field==='email'}
              />
            </div>
          ))}
          <div className="flex gap-2 mt-4">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Guardar</button>
            <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const roleStyles = {
  admin: {
    label: 'Administrador',
    color: 'bg-red-600 text-white',
    icon: <MdAdminPanelSettings className="inline mr-1 align-text-bottom" />,
  },
  visitor: {
    label: 'Visitante',
    color: 'bg-blue-600 text-white',
    icon: <MdPerson className="inline mr-1 align-text-bottom" />,
  },
  owner: {
    label: 'Propietario',
    color: 'bg-purple-700 text-white',
    icon: <MdStar className="inline mr-1 align-text-bottom" />,
  },
};

export default function ClientesPage() {
  const { isAdmin } = usePermissions();
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchUsers = async () => {
      setLoading(true);
      const snap = await getDocs(collection(db, 'users'));
      setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchUsers();
  }, [isAdmin]);

  const handleEdit = user => {
    setSelected(user);
    setModalOpen(true);
  };
  const handleSave = async updated => {
    await updateDoc(doc(db, 'users', updated.id), updated);
    setUsers(users.map(u => u.id === updated.id ? updated : u));
    setModalOpen(false);
  };
  const handleDelete = async (user) => {
    if (window.confirm(`¿Seguro que deseas eliminar a ${user.nombre} ${user.apellido}?`)) {
      await updateDoc(doc(db, 'users', user.id), { eliminado: true }); // O usa deleteDoc si quieres borrado real
      setUsers(users.filter(u => u.id !== user.id));
    }
  };
  const handleRoleChange = async (user, newRole) => {
    await updateDoc(doc(db, 'users', user.id), { role: newRole });
    setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole } : u));
  };

  if (!isAdmin) return <div className="p-8 text-red-600">Acceso restringido</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Clientes / Usuarios</h1>
      {loading ? <div>Cargando...</div> : (
        <table className="w-full border rounded-xl overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Nombre</th>
              <th className="p-2">Apellido</th>
              <th className="p-2">Email</th>
              <th className="p-2">Teléfono</th>
              <th className="p-2">WhatsApp</th>
              <th className="p-2">Dirección</th>
              <th className="p-2">Rol</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t">
                <td className="p-2">{user.nombre}</td>
                <td className="p-2">{user.apellido}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.telefono}</td>
                <td className="p-2">{user.whatsapp}</td>
                <td className="p-2">{user.direccion}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 ${roleStyles[user.role]?.color || 'bg-gray-100 text-gray-700'}`}>
                    {roleStyles[user.role]?.icon}
                    {roleStyles[user.role]?.label || user.role}
                  </span>
                  {isAdmin && user.role !== 'owner' && (
                    <select
                      value={user.role}
                      onChange={e => handleRoleChange(user, e.target.value)}
                      className="ml-2 px-2 py-1 border rounded text-xs"
                    >
                      <option value="visitor">Visitante</option>
                      <option value="admin">Administrador</option>
                    </select>
                  )}
                </td>
                <td className="p-2">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2" onClick={() => handleEdit(user)}>Editar</button>
                  <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleDelete(user)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <EditUserModal user={selected} isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} />
    </div>
  );
} 
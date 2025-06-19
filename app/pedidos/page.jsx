"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { MdDelete, MdCheckCircle } from "react-icons/md";

export default function PedidosPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, "orders"));
        setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (e) {
        // Manejo de error opcional
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  // Eliminar pedido
  const handleDelete = async (order) => {
    if (window.confirm("¿Seguro que deseas eliminar este pedido?")) {
      await deleteDoc(doc(db, "orders", order.id));
      setOrders(orders.filter(o => o.id !== order.id));
    }
  };

  // Marcar como entregado
  const handleMarkDelivered = async (order) => {
    await updateDoc(doc(db, "orders", order.id), { status: "delivered" });
    setOrders(orders.map(o => o.id === order.id ? { ...o, status: "delivered" } : o));
  };

  // Cambiar estado manualmente
  const handleChangeStatus = async (order, newStatus) => {
    await updateDoc(doc(db, "orders", order.id), { status: newStatus });
    setOrders(orders.map(o => o.id === order.id ? { ...o, status: newStatus } : o));
  };

  const statusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Gestión de Pedidos</h1>
      <div className="bg-white shadow-lg rounded-xl p-6">
        {loading ? (
          <div className="text-center text-lg">Cargando...</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-500">No hay pedidos registrados.</div>
        ) : (
          <table className="w-full border rounded-xl overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Usuario</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-left">Fecha</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3 font-mono text-xs">{order.id}</td>
                  <td className="p-3">{order.userId || "-"}</td>
                  <td className="p-3 font-semibold">${order.total || 0}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${statusColor(order.status)}`}>
                      {order.status || "pendiente"}
                    </span>
                    <select
                      className="ml-2 px-2 py-1 border rounded text-xs"
                      value={order.status || "pending"}
                      onChange={e => handleChangeStatus(order, e.target.value)}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="delivered">Entregado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </td>
                  <td className="p-3">
                    {order.createdAt
                      ? new Date(order.createdAt.seconds * 1000).toLocaleString()
                      : "-"}
                  </td>
                  <td className="p-3 flex gap-2 justify-center">
                    {order.status !== "delivered" && (
                      <button
                        title="Marcar como entregado"
                        onClick={() => handleMarkDelivered(order)}
                        className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-full transition"
                      >
                        <MdCheckCircle size={20} />
                      </button>
                    )}
                    <button
                      title="Eliminar pedido"
                      onClick={() => handleDelete(order)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-full transition"
                    >
                      <MdDelete size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 
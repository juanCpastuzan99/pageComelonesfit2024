"use client";
import React, { useEffect, useState } from "react";
import { paymentService } from "../../services/paymentService";
import { useAuth } from "../../context/AuthContext";
import { usePermissions } from "../../hooks/usePermissions";
import { formatCurrency } from '../../../utils/priceFormatter';

export default function AdminPedidosPage() {
  const { user, loading } = useAuth();
  const { isAdmin } = usePermissions();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [filter, setFilter] = useState({ status: "", method: "", search: "" });

  useEffect(() => {
    if (isAdmin) {
      setOrdersLoading(true);
      paymentService.getAllOrders()
        .then(setOrders)
        .finally(() => setOrdersLoading(false));
    }
  }, [isAdmin]);

  if (loading) return <div className="container py-5 text-center">Cargando...</div>;
  if (!isAdmin) return <div className="container py-5 text-center text-danger">Acceso restringido solo para administradores.</div>;

  // Filtros
  const filteredOrders = orders.filter(order => {
    if (filter.status && order.status !== filter.status) return false;
    if (filter.method && order.paymentMethod !== filter.method) return false;
    if (filter.search && !(
      order.customerEmail?.toLowerCase().includes(filter.search.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(filter.search.toLowerCase()) ||
      order.id?.toLowerCase().includes(filter.search.toLowerCase())
    )) return false;
    return true;
  });

  // Cambiar estado del pedido
  const handleChangeStatus = async (orderId, newStatus) => {
    await paymentService.updateOrderStatus(orderId, newStatus);
    setOrders(orders => orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Administración de Pedidos</h2>
      <div className="mb-3 row g-2 align-items-center">
        <div className="col-auto">
          <select className="form-select" value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}>
            <option value="">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="pending_verification">Pendiente de verificación</option>
            <option value="completed">Pagado</option>
            <option value="failed">Fallido</option>
          </select>
        </div>
        <div className="col-auto">
          <select className="form-select" value={filter.method} onChange={e => setFilter(f => ({ ...f, method: e.target.value }))}>
            <option value="">Todos los métodos</option>
            <option value="nequi">Nequi</option>
            <option value="bancolombia">Bancolombia</option>
            <option value="bbva">BBVA</option>
          </select>
        </div>
        <div className="col-auto">
          <input className="form-control" placeholder="Buscar por email, nombre o ID" value={filter.search} onChange={e => setFilter(f => ({ ...f, search: e.target.value }))} />
        </div>
      </div>
      {ordersLoading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-success" role="status"></div>
          <p className="mt-2 text-muted">Cargando pedidos...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <p className="text-muted">No hay pedidos que coincidan con los filtros.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Fecha</th>
                <th>Total</th>
                <th>Método</th>
                <th>Estado</th>
                <th>Usuario</th>
                <th>Email</th>
                <th>Productos</th>
                <th>Comprobante</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : new Date(order.createdAt).toLocaleString()}</td>
                  <td>{formatCurrency(order.total)}</td>
                  <td>{order.paymentMethod === 'nequi' ? 'Nequi' : order.paymentMethod === 'bancolombia' ? 'Bancolombia' : order.paymentMethod === 'bbva' ? 'BBVA' : 'Otro'}</td>
                  <td>
                    {order.status === 'pending' && <span className="badge bg-warning text-dark">Pendiente</span>}
                    {order.status === 'pending_verification' && <span className="badge bg-info text-dark">Pendiente de verificación</span>}
                    {order.status === 'completed' && <span className="badge bg-success">Pagado</span>}
                    {order.status === 'failed' && <span className="badge bg-danger">Fallido</span>}
                  </td>
                  <td>{order.customerName}</td>
                  <td>{order.customerEmail}</td>
                  <td>
                    <ul className="mb-0 ps-3">
                      {order.items?.map(item => (
                        <li key={item.id}>{item.name} x{item.quantity}</li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    {order.receiptUrl ? (
                      <a href={order.receiptUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">Ver</a>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td>
                    {order.status !== 'completed' && (
                      <button className="btn btn-sm btn-success me-2" onClick={() => handleChangeStatus(order.id, 'completed')}>Marcar como Pagado</button>
                    )}
                    {order.status !== 'failed' && (
                      <button className="btn btn-sm btn-danger" onClick={() => handleChangeStatus(order.id, 'failed')}>Marcar como Fallido</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 
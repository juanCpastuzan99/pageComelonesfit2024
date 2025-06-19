"use client";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { updateUserProfile, calculateIMC, fetchUserMetrics, addUserMetrics } from "../../store/slices/userMetricsSlice";
import { paymentService } from "../services/paymentService";
import { formatCurrency } from '../../utils/priceFormatter';
import { useAuth } from '../context/AuthContext';
import AddMetricsModal from '../../components/AddMetricsModal';
import { ChangeProfilePhotoModal } from '../../components/AddMetricsModal';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export default function PerfilPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const userMetrics = useSelector((state) => state.userMetrics);
  const dispatch = useDispatch();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [showAddMetricsModal, setShowAddMetricsModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(user?.photoURL || '/default-avatar.png');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/");
    } else if (user?.uid) {
      setOrdersLoading(true);
      paymentService.getUserOrders(user.uid)
        .then(setOrders)
        .finally(() => setOrdersLoading(false));
      
      // Cargar métricas del usuario
      dispatch(fetchUserMetrics(user.uid));
    }
  }, [isAuthenticated, authLoading, router, user?.uid, dispatch]);

  useEffect(() => {
    const fetchPhotoFromFirestore = async () => {
      if (!user?.uid) return;
      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data().photoURL) {
          setPhotoUrl(userSnap.data().photoURL);
        } else {
          setPhotoUrl(user?.photoURL || '/default-avatar.png');
        }
      } catch (err) {
        setPhotoUrl(user?.photoURL || '/default-avatar.png');
      }
    };
    fetchPhotoFromFirestore();
  }, [user?.uid, user?.photoURL]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateUserProfile({ [name]: value }));
  };

  const handleCalculateIMC = () => {
    if (userMetrics.profile.height && userMetrics.profile.weight) {
      dispatch(calculateIMC({ height: userMetrics.profile.height, weight: userMetrics.profile.weight }));
    }
  };

  const handleSaveMetrics = async () => {
    if (userMetrics.profile.height && userMetrics.profile.weight) {
      try {
        const metricsData = {
          weight: parseFloat(userMetrics.profile.weight),
          height: parseFloat(userMetrics.profile.height),
          calories: 0, // Se puede agregar un campo para calorías
          bodyFat: 0, // Se puede agregar un campo para grasa corporal
          muscleMass: 0, // Se puede agregar un campo para masa muscular
          date: new Date().toISOString().split('T')[0]
        };

        await dispatch(addUserMetrics({ userId: user.uid, metricsData })).unwrap();
        
        // Recargar métricas después de agregar
        dispatch(fetchUserMetrics(user.uid));
        
        // Calcular IMC automáticamente después de guardar
        handleCalculateIMC();
        
        alert('Métricas guardadas exitosamente');
      } catch (error) {
        console.error('Error guardando métricas:', error);
        alert('Error al guardar las métricas: ' + error.message);
      }
    } else {
      alert('Por favor, ingresa altura y peso antes de guardar');
    }
  };

  const handleMetricsSuccess = () => {
    setShowAddMetricsModal(false);
    // Recargar métricas después de agregar desde el modal
    if (user?.uid) {
      dispatch(fetchUserMetrics(user.uid));
    }
  };

  // Mostrar loading mientras se verifica autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-muted">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-4">
          <div className="card mx-auto mb-4">
            <div className="card-body text-center">
              <img
                src={photoUrl}
                alt={user?.displayName || user?.email}
                className="rounded-circle mb-3"
                style={{ width: 100, height: 100, objectFit: "cover" }}
              />
              <h3 className="mb-1">{user?.displayName || "Usuario"}</h3>
              <p className="text-muted mb-2">{user?.email}</p>
              <button className="btn btn-primary mt-3" onClick={() => setShowPhotoModal(true)}>
                Personalizar imagen
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="card-title mb-0">Datos de Salud y Progreso</h4>
                <button 
                  className="btn btn-success btn-sm"
                  onClick={() => setShowAddMetricsModal(true)}
                >
                  + Agregar Métricas
                </button>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Altura (cm)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="height"
                    value={userMetrics.profile.height}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Peso (kg)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="weight"
                    value={userMetrics.profile.weight}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Edad</label>
                  <input
                    type="number"
                    className="form-control"
                    name="age"
                    value={userMetrics.profile.age}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Género</label>
                  <select
                    className="form-select"
                    name="gender"
                    value={userMetrics.profile.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar</option>
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nivel de Actividad</label>
                  <select
                    className="form-select"
                    name="activityLevel"
                    value={userMetrics.profile.activityLevel}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar</option>
                    <option value="sedentary">Sedentario</option>
                    <option value="light">Ligero</option>
                    <option value="moderate">Moderado</option>
                    <option value="active">Activo</option>
                    <option value="very_active">Muy Activo</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Objetivo</label>
                  <select
                    className="form-select"
                    name="goal"
                    value={userMetrics.profile.goal}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar</option>
                    <option value="lose">Perder peso</option>
                    <option value="maintain">Mantener peso</option>
                    <option value="gain">Ganar peso</option>
                  </select>
                </div>
              </div>

              <div className="d-flex gap-2">
                <button 
                  className="btn btn-primary"
                  onClick={handleCalculateIMC}
                >
                  Calcular IMC
                </button>
                <button 
                  className="btn btn-success"
                  onClick={handleSaveMetrics}
                >
                  Guardar Métricas
                </button>
              </div>

              {userMetrics.imc > 0 && (
                <div className="mt-3">
                  <h5>Tu IMC: {userMetrics.imc}</h5>
                  <p className="text-muted">
                    {userMetrics.imc < 18.5 ? "Bajo peso" :
                     userMetrics.imc < 25 ? "Peso normal" :
                     userMetrics.imc < 30 ? "Sobrepeso" :
                     "Obesidad"}
                  </p>
                </div>
              )}

              {/* Estadísticas de métricas */}
              {!userMetrics.loading && userMetrics.stats && (
                <div className="mt-4">
                  <h5>Estadísticas de Progreso</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h6 className="card-title">Esta Semana</h6>
                          <p className="mb-1">Peso promedio: {userMetrics.stats.weekly.averageWeight} kg</p>
                          <p className="mb-1">Calorías totales: {userMetrics.stats.weekly.weeklyCalories}</p>
                          <p className="mb-0">IMC: {userMetrics.stats.weekly.imc}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h6 className="card-title">General</h6>
                          <p className="mb-1">Peso promedio: {userMetrics.stats.overall.averageWeight} kg</p>
                          <p className="mb-1">Total registros: {userMetrics.stats.overall.totalEntries}</p>
                          <p className="mb-0">IMC: {userMetrics.stats.overall.imc}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Lista de métricas recientes */}
              {!userMetrics.loading && userMetrics.metrics && userMetrics.metrics.length > 0 && (
                <div className="mt-4">
                  <h5>Métricas Recientes</h5>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Fecha</th>
                          <th>Peso (kg)</th>
                          <th>Altura (cm)</th>
                          <th>Calorías</th>
                          <th>IMC</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userMetrics.metrics.slice(0, 5).map((metric) => {
                          const imc = metric.weight && metric.height 
                            ? (metric.weight / Math.pow(metric.height / 100, 2)).toFixed(2)
                            : '-';
                          return (
                            <tr key={metric.id}>
                              <td>{new Date(metric.date).toLocaleDateString()}</td>
                              <td>{metric.weight || '-'}</td>
                              <td>{metric.height || '-'}</td>
                              <td>{metric.calories || '-'}</td>
                              <td>{imc}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {userMetrics.error && (
                <div className="alert alert-danger mt-3">
                  Error al cargar métricas: {userMetrics.error}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-12 mt-5">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-4">Historial de Pedidos</h4>
              {ordersLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-success" role="status"></div>
                  <p className="mt-2 text-muted">Cargando pedidos...</p>
                </div>
              ) : orders.length === 0 ? (
                <p className="text-muted">No tienes pedidos registrados.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Fecha</th>
                        <th>Total</th>
                        <th>Método</th>
                        <th>Estado</th>
                        <th>Productos</th>
                        <th>Comprobante</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para agregar métricas */}
      <AddMetricsModal
        isOpen={showAddMetricsModal}
        onClose={() => setShowAddMetricsModal(false)}
        onSuccess={handleMetricsSuccess}
      />

      <ChangeProfilePhotoModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        onSuccess={(url) => setPhotoUrl(url)}
      />
    </div>
  );
} 
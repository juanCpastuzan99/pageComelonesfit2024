"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchUserMetrics } from "../../store/slices/userMetricsSlice";
import { useAuth } from "../context/AuthContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Link from "next/link";

const UserMetricsReport = () => {
    const { user, loading: authLoading, isAuthenticated } = useAuth();
    const dispatch = useDispatch();
    const router = useRouter();
    const { metrics, loading: metricsLoading, error } = useSelector((state) => state.userMetrics);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.replace("/");
        } else if (user?.uid) {
            dispatch(fetchUserMetrics(user.uid));
        }
    }, [isAuthenticated, authLoading, router, user?.uid, dispatch]);

    if (authLoading || metricsLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="text-muted">Cargando datos del reporte...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    if (error) {
        return <div className="text-center py-12 text-red-500">Error al cargar las métricas: {error}</div>;
    }

    const formattedMetrics = metrics.map(m => ({
        ...m,
        date: new Date(m.date).toLocaleDateString(),
        imc: m.weight && m.height ? (m.weight / Math.pow(m.height / 100, 2)).toFixed(2) : 0
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <div className="container py-5">
             <div className="mb-4 d-flex justify-content-between align-items-center">
                <h2 className="mb-0">Reporte de Progreso</h2>
                <Link href="/perfil" className="btn btn-outline-secondary">
                    &larr; Volver al Perfil
                </Link>
            </div>

            {formattedMetrics.length === 0 ? (
                 <div className="text-center py-12 text-gray-500">
                    <h3 className="text-lg font-semibold">No hay datos suficientes</h3>
                    <p>Aún no has registrado métricas para generar un reporte.</p>
                    <Link href="/perfil" className="btn btn-primary mt-3">
                        Agregar mis primeras métricas
                    </Link>
                </div>
            ) : (
                <div className="row">
                    <div className="col-lg-12 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Progreso de Peso (kg)</h5>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={formattedMetrics}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="weight" name="Peso (kg)" stroke="#8884d8" activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-12 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Progreso de IMC</h5>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={formattedMetrics}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="imc" name="Índice de Masa Corporal" fill="#82ca9d" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMetricsReport; 
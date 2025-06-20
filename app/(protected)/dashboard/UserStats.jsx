"use client";
import React, { useState } from 'react';
import { FaWeight, FaRulerVertical, FaFire, FaChartLine, FaPlus, FaExclamationCircle } from 'react-icons/fa';
import AddMetricsModal from '../../../components/AddMetricsModal'; 
import { useUserMetrics } from '../../hooks/useUserMetrics';

const StatCard = ({ icon, title, value, unit, bgColor, textColor, trendIcon }) => (
    <div className={`p-4 rounded-lg shadow-md flex items-center justify-between ${bgColor} ${textColor}`}>
        <div className="flex items-center">
            {icon}
            <div className="ml-4">
                <p className="text-sm font-medium">{title}</p>
                <p className="text-2xl font-bold">{value} <span className="text-sm font-light">{unit}</span></p>
            </div>
        </div>
        {trendIcon && <div className="text-lg">{trendIcon}</div>}
    </div>
);

const UserStats = () => {
    const { stats, loading, error, getImcCategory, getImcColor, getTrendIcon, getTrendText, hasData, refresh } = useUserMetrics();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleMetricsAdded = () => {
        refresh();
        handleCloseModal();
    };

    if (loading) {
        return (
            <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Cargando tus métricas...</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <FaExclamationCircle className="text-red-500 text-3xl mx-auto mb-4" />
                <p className="text-red-700 dark:text-red-300 font-semibold mb-2">Error al cargar las métricas</p>
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
        );
    }

    if (!hasData) {
        return (
            <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400 mb-4">Aún no has registrado tus métricas. ¡Empieza ahora!</p>
                <button 
                    onClick={handleOpenModal} 
                    className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center mx-auto"
                >
                    <FaPlus className="mr-2" />
                    Añadir Métricas
                </button>
                <AddMetricsModal isOpen={isModalOpen} onClose={handleCloseModal} onMetricsAdded={handleMetricsAdded} />
            </div>
        );
    }

    const { weekly, overall, trend } = stats;
    const imcCategory = getImcCategory(weekly.imc);
    const imcColor = getImcColor(weekly.imc);

    const TrendIndicator = () => {
        const icon = getTrendIcon(trend);
        const text = getTrendText(trend);
        return (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                {icon}
                <span className="ml-2">{text}</span>
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Resumen Semanal</h2>
                    <p className="text-gray-500 dark:text-gray-400">Tus métricas de los últimos 7 días.</p>
                </div>
                <button 
                    onClick={handleOpenModal} 
                    className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center"
                >
                    <FaPlus className="mr-2" />
                    Añadir
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard 
                    icon={<FaWeight className="text-3xl" />} 
                    title="Peso Promedio" 
                    value={weekly.averageWeight.toFixed(1)} 
                    unit="kg"
                    bgColor="bg-blue-100 dark:bg-blue-900/50"
                    textColor="text-blue-800 dark:text-blue-200"
                />
                <StatCard 
                    icon={<FaRulerVertical className="text-3xl" />} 
                    title="Altura" 
                    value={weekly.averageHeight.toFixed(2)} 
                    unit="m"
                    bgColor="bg-purple-100 dark:bg-purple-900/50"
                    textColor="text-purple-800 dark:text-purple-200"
                />
                <StatCard 
                    icon={<FaFire className="text-3xl" />} 
                    title="Calorías Semanales" 
                    value={Math.round(weekly.weeklyCalories)} 
                    unit="kcal"
                    bgColor="bg-yellow-100 dark:bg-yellow-900/50"
                    textColor="text-yellow-800 dark:text-yellow-200"
                />
                <div className={`p-4 rounded-lg shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between ${imcColor}`}>
                    <div className="flex items-center mb-2 sm:mb-0">
                        <FaChartLine className="text-3xl" />
                        <div className="ml-3">
                            <p className="text-sm font-medium">IMC Promedio</p>
                            <p className="text-xl font-bold">{weekly.imc.toFixed(1)}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end">
                        <TrendIndicator />
                        <p className="text-xs font-semibold uppercase tracking-wider mt-1">{imcCategory}</p>
                    </div>
                </div>
            </div>
            
            <AddMetricsModal isOpen={isModalOpen} onClose={handleCloseModal} onMetricsAdded={handleMetricsAdded} />
        </div>
    );
};

export default UserStats; 
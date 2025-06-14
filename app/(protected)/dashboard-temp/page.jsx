"use client";
import { useSelector } from 'react-redux';

export default function DashboardPage() {
  const userMetrics = useSelector((state) => state.userMetrics || {});
  const imc = userMetrics.imc ?? 0;
  const weeklyCalories = userMetrics.weeklyCalories ?? 0;
  const averageHeight = userMetrics.averageHeight ?? 0;
  const averageWeight = userMetrics.averageWeight ?? 0;
  const { isDarkMode } = useSelector((state) => state.theme);

  const getImcCategory = (imc) => {
    if (imc < 18.5) return 'Bajo peso';
    if (imc < 25) return 'Peso normal';
    if (imc < 30) return 'Sobrepeso';
    return 'Obesidad';
  };

  return (
    <div className={`container-fluid ${isDarkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <h2 className="mb-4">Dashboard</h2>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Tu IMC</h5>
              <p className="card-text">Valor: {imc.toFixed(2)}</p>
              <p className="card-text">Categoría: {getImcCategory(imc)}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Calorías Semanales</h5>
              <p className="card-text">{weeklyCalories} kcal</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Estatura Promedio</h5>
              <p className="card-text">{averageHeight.toFixed(2)} cm</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Peso Promedio</h5>
              <p className="card-text">{averageWeight.toFixed(2)} kg</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
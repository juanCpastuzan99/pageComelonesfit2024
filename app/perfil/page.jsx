"use client";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { updateUserProfile, calculateIMC } from "../../store/slices/userMetricsSlice";

export default function PerfilPage() {
  const user = useSelector((state) => state.user.user);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const userMetrics = useSelector((state) => state.userMetrics);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateUserProfile({ [name]: value }));
  };

  const handleCalculateIMC = () => {
    if (userMetrics.profile.height && userMetrics.profile.weight) {
      dispatch(calculateIMC(userMetrics.profile.height, userMetrics.profile.weight));
    }
  };

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
                src={user?.photoURL || "/default-avatar.png"}
                alt={user?.displayName || user?.email}
                className="rounded-circle mb-3"
                style={{ width: 100, height: 100, objectFit: "cover" }}
              />
              <h3 className="mb-1">{user?.displayName || "Usuario"}</h3>
              <p className="text-muted mb-2">{user?.email}</p>
              <button className="btn btn-primary mt-3">Personalizar imagen</button>
            </div>
          </div>
        </div>
        
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-4">Datos de Salud y Progreso</h4>
              
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

              <button 
                className="btn btn-primary mt-3"
                onClick={handleCalculateIMC}
              >
                Calcular IMC
              </button>

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
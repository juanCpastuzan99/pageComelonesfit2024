"use client";

import { useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "../firebase/firebaseConfig";
import { useRouter } from "next/navigation";

const auth = getAuth(app);
const db = getFirestore(app);

// SVG para decoración
const SignupDecoration = () => {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="60" fill="#E8F5E9"/>
      <path d="M40 65C40 51 55 48 60 48C65 48 80 51 80 65C80 79 65 82 60 82C55 82 40 79 40 65Z" fill="#4CAF50"/>
      <path d="M40 55L80 55" stroke="white" strokeWidth="2"/>
      <path d="M40 65L80 65" stroke="white" strokeWidth="2"/>
      <path d="M40 75L80 75" stroke="white" strokeWidth="2"/>
      <path d="M60 48L60 82" stroke="white" strokeWidth="2"/>
      <circle cx="60" cy="39" r="8" fill="#4CAF50"/>
      <path d="M55 38L59 42L65 36" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  
  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Validar la contraseña mientras se escribe
    if (name === "password") {
      calculatePasswordStrength(value);
    }
    
    // Limpiar errores específicos cuando el usuario empieza a corregir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };
  
  // Calcular la fortaleza de la contraseña
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  };
  
  // Validar el formulario antes de enviar
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "El nombre es requerido";
    if (!formData.lastName.trim()) newErrors.lastName = "El apellido es requerido";
    
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El correo electrónico no es válido";
    }
    
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setGeneralError("");
    
    try {
      // Crear usuario con Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      // Actualizar el perfil con nombre y apellido
      await updateProfile(userCredential.user, {
        displayName: `${formData.firstName} ${formData.lastName}`
      });

      // Guardar datos adicionales en Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        createdAt: new Date().toISOString(),
        role: "user"
      });
      
      console.log("Usuario registrado:", userCredential.user);
      
      // Redireccionar a la página principal o de bienvenida
      router.push('/');
      
    } catch (error) {
      console.error("Error al registrar:", error);
      
      // Manejar errores específicos de Firebase
      switch (error.code) {
        case 'auth/email-already-in-use':
          setErrors({...errors, email: "Este correo ya está registrado"});
          break;
        case 'auth/invalid-email':
          setErrors({...errors, email: "Formato de correo inválido"});
          break;
        case 'auth/weak-password':
          setErrors({...errors, password: "La contraseña es demasiado débil"});
          break;
        default:
          setGeneralError("Error al crear la cuenta. Intenta nuevamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Inicializar canvas decorativo
  useEffect(() => {
    const initCanvasDecoration = () => {
      const canvas = document.getElementById('signup-decoration');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Limpiar el canvas
        ctx.clearRect(0, 0, width, height);
        
        // Dibujar círculos decorativos
        for (let i = 0; i < 12; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const radius = Math.random() * 15 + 5;
          
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(76, 175, 80, ${Math.random() * 0.15 + 0.05})`;
          ctx.fill();
        }
        
        // Dibujar líneas decorativas
        for (let i = 0; i < 5; i++) {
          const startX = Math.random() * width;
          const startY = Math.random() * height;
          const endX = startX + (Math.random() - 0.5) * 200;
          const endY = startY + (Math.random() - 0.5) * 200;
          
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.strokeStyle = `rgba(76, 175, 80, ${Math.random() * 0.1 + 0.05})`;
          ctx.lineWidth = Math.random() * 2 + 1;
          ctx.stroke();
        }
      }
    };
    
    initCanvasDecoration();
  }, []);
  
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <canvas 
        id="signup-decoration" 
        width="1000" 
        height="1000" 
        className="position-absolute w-100 h-100" 
        style={{pointerEvents: 'none'}}
      />
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card shadow-lg border-0 rounded-lg overflow-hidden">
              <div className="card-header bg-white text-center py-4 border-0">
                <div className="mb-3 d-flex justify-content-center">
                  <SignupDecoration />
                </div>
                <h2 className="fw-bold text-success mb-1">Crea tu cuenta</h2>
                <p className="text-muted mb-0">Únete a la comunidad de ComelonesFit</p>
              </div>
              
              <div className="card-body p-4 p-lg-5">
                {generalError && (
                  <div className="alert alert-danger" role="alert">
                    {generalError}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <div className="form-floating">
                        <input
                          type="text"
                          className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                          id="firstName"
                          name="firstName"
                          placeholder="Nombre"
                          value={formData.firstName}
                          onChange={handleChange}
                        />
                        <label htmlFor="firstName">Nombre</label>
                        {errors.firstName && (
                          <div className="invalid-feedback">
                            {errors.firstName}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                          id="lastName"
                          name="lastName"
                          placeholder="Apellido"
                          value={formData.lastName}
                          onChange={handleChange}
                        />
                        <label htmlFor="lastName">Apellido</label>
                        {errors.lastName && (
                          <div className="invalid-feedback">
                            {errors.lastName}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      placeholder="nombre@ejemplo.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <label htmlFor="email">Correo electrónico</label>
                    {errors.email && (
                      <div className="invalid-feedback">
                        {errors.email}
                      </div>
                    )}
                  </div>
                  
                  <div className="form-floating mb-3">
                    <input
                      type="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      id="password"
                      name="password"
                      placeholder="Contraseña"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <label htmlFor="password">Contraseña</label>
                    {errors.password && (
                      <div className="invalid-feedback">
                        {errors.password}
                      </div>
                    )}
                  </div>
                  
                  {/* Indicador de fortaleza de contraseña */}
                  {formData.password && (
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <small className="text-muted">Fortaleza de la contraseña:</small>
                        <small className={`${
                          passwordStrength === 0 ? 'text-danger' : 
                          passwordStrength === 1 ? 'text-warning' :
                          passwordStrength === 2 ? 'text-info' :
                          passwordStrength === 3 ? 'text-primary' : 'text-success'
                        }`}>
                          {passwordStrength === 0 ? 'Muy débil' : 
                           passwordStrength === 1 ? 'Débil' :
                           passwordStrength === 2 ? 'Media' :
                           passwordStrength === 3 ? 'Fuerte' : 'Muy fuerte'}
                        </small>
                      </div>
                      <div className="progress" style={{height: '5px'}}>
                        <div 
                          className={`progress-bar ${
                            passwordStrength === 0 ? 'bg-danger' : 
                            passwordStrength === 1 ? 'bg-warning' :
                            passwordStrength === 2 ? 'bg-info' :
                            passwordStrength === 3 ? 'bg-primary' : 'bg-success'
                          }`}
                          role="progressbar" 
                          style={{width: `${passwordStrength * 25}%`}} 
                          aria-valuenow={passwordStrength * 25} 
                          aria-valuemin="0" 
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="form-floating mb-4">
                    <input
                      type="password"
                      className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Confirmar contraseña"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <label htmlFor="confirmPassword">Confirmar contraseña</label>
                    {errors.confirmPassword && (
                      <div className="invalid-feedback">
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>
                  
                  <div className="form-check mb-4">
                    <input className="form-check-input" type="checkbox" id="termsAgree" required />
                    <label className="form-check-label" htmlFor="termsAgree">
                      Acepto los <a href="/terms" className="text-success">términos y condiciones</a> y la <a href="/privacy" className="text-success">política de privacidad</a>
                    </label>
                  </div>
                  
                  <div className="d-grid">
                    <button 
                      type="submit" 
                      className="btn btn-success py-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creando cuenta...
                        </>
                      ) : "Crear cuenta"}
                    </button>
                  </div>
                </form>
              </div>
              
              <div className="card-footer text-center py-3 bg-light border-0">
                <div className="text-muted">
                  ¿Ya tienes una cuenta? <a href="/login" className="text-success text-decoration-none">Iniciar sesión</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
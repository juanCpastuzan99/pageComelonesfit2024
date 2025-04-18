"use client";

import { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase/firebaseConfig"; 
import { useRouter } from "next/navigation"; 

const auth = getAuth(app);

// SVG de logo para la página de login
const LoginLogo = () => {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="60" fill="#E8F5E9"/>
      <path d="M40 60C40 49.5 47.5 41 59 41C70.5 41 80 49.5 80 60C80 70.5 70.5 79 59 79C47.5 79 40 70.5 40 60Z" fill="#4CAF50"/>
      <path d="M59 52C61.5 52 67 54.5 67 60C67 65.5 63 67 59 67C55 67 51 65.5 51 60C51 54.5 56.5 52 59 52Z" fill="white"/>
      <path d="M75 45L84 36" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round"/>
      <path d="M75 75L84 84" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 45L36 36" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 75L36 84" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
};

// SVG para el botón de Google
const GoogleIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.8 9.2C17.8 8.6 17.7 8 17.6 7.4H9.2V10.8H14.1C13.9 11.8 13.3 12.7 12.3 13.3V15.4H15.2C16.9 13.9 17.8 11.7 17.8 9.2Z" fill="#4285F4"/>
      <path d="M9.2 18C11.6 18 13.7 17.2 15.2 15.4L12.3 13.3C11.5 13.9 10.4 14.2 9.2 14.2C6.9 14.2 5 12.7 4.3 10.7H1.3V12.9C2.7 15.9 5.8 18 9.2 18Z" fill="#34A853"/>
      <path d="M4.3 10.7C4.1 10.2 4 9.6 4 9C4 8.4 4.1 7.8 4.3 7.3V5.1H1.3C0.7 6.3 0.3 7.6 0.3 9C0.3 10.4 0.7 11.7 1.3 12.9L4.3 10.7Z" fill="#FBBC05"/>
      <path d="M9.2 3.8C10.5 3.8 11.7 4.3 12.6 5.1L15.2 2.5C13.7 1.1 11.6 0.2 9.2 0.2C5.8 0.2 2.7 2.3 1.3 5.3L4.3 7.5C5 5.5 6.9 3.8 9.2 3.8Z" fill="#EA4335"/>
    </svg>
  );
};

// Componente principal de la página de login
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Manejar iniciar sesión con email y contraseña
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Usuario autenticado:", user);
      router.push('/');
    } catch (err) {
      setError(getErrorMessage(err.code));
      console.error("Error de autenticación:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar iniciar sesión con Google
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Usuario autenticado con Google:", user);
      router.push('/');
    } catch (err) {
      setError(getErrorMessage(err.code));
      console.error("Error de autenticación con Google:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener mensajes de error amigables
  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'El formato del correo electrónico no es válido.';
      case 'auth/user-disabled':
        return 'Esta cuenta ha sido deshabilitada.';
      case 'auth/user-not-found':
        return 'No existe una cuenta con este correo electrónico.';
      case 'auth/wrong-password':
        return 'La contraseña es incorrecta.';
      case 'auth/invalid-credential':
        return 'Credenciales inválidas. Por favor verifica tu correo y contraseña.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos fallidos. Intenta de nuevo más tarde.';
      default:
        return 'Error al iniciar sesión. Por favor intenta de nuevo.';
    }
  };

  // Inicializar canvas decorativo
  useEffect(() => {
    const initCanvasDecoration = () => {
      const canvas = document.getElementById('login-decoration');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Dibuja elementos decorativos
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const size = Math.random() * 15 + 5;
          
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(76, 175, 80, ${Math.random() * 0.2 + 0.1})`;
          ctx.fill();
        }
        
        // Dibuja líneas
        for (let i = 0; i < 10; i++) {
          const startX = Math.random() * width;
          const startY = Math.random() * height;
          const endX = startX + (Math.random() - 0.5) * 150;
          const endY = startY + (Math.random() - 0.5) * 150;
          
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
        id="login-decoration" 
        width="1000" 
        height="1000" 
        className="position-absolute w-100 h-100" 
        style={{pointerEvents: 'none'}}
      />
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow-lg border-0 rounded-lg overflow-hidden">
              
              <div className="card-header bg-white text-center py-4 border-0">
                <div className="mb-3 d-flex justify-content-center">
                  <LoginLogo />
                </div>
                <h2 className="fw-bold text-success mb-1">Bienvenido</h2>
                <p className="text-muted mb-0">Accede a tu cuenta de ComelonesFit</p>
              </div>
              
              <div className="card-body p-4 p-lg-5">
                {error && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-triangle-fill me-2" viewBox="0 0 16 16">
                      <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                    </svg>
                    <div>{error}</div>
                  </div>
                )}
                
                <div className="mb-4">
                  <button 
                    onClick={handleGoogleLogin} 
                    className="btn btn-outline-secondary w-100 d-flex justify-content-center align-items-center py-2"
                    disabled={isLoading}
                  >
                    <GoogleIcon />
                    <span className="ms-2">Continuar con Google</span>
                  </button>
                </div>
                
                <div className="divider d-flex align-items-center my-4">
                  <p className="text-center fw-bold mx-3 mb-0 text-muted">O</p>
                </div>
                
                <form onSubmit={handleEmailLogin}>
                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className="form-control"
                      id="emailInput"
                      placeholder="nombre@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <label htmlFor="emailInput">Correo electrónico</label>
                  </div>
                  
                  <div className="form-floating mb-3">
                    <input
                      type="password"
                      className="form-control"
                      id="passwordInput"
                      placeholder="Contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <label htmlFor="passwordInput">Contraseña</label>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-4">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="rememberMe" />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Recordarme
                      </label>
                    </div>
                    <a href="/forgot-password" className="text-success text-decoration-none">¿Olvidaste tu contraseña?</a>
                  </div>
                  
                  <div className="d-grid">
                    <button 
                      type="submit" 
                      className="btn btn-success py-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      ) : null}
                      Iniciar Sesión
                    </button>
                  </div>
                </form>
              </div>
              
              <div className="card-footer text-center py-3 bg-light border-0">
                <div className="text-muted">
                  ¿No tienes una cuenta? <a href="../signUp" className="text-success text-decoration-none">Regístrate</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
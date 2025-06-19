"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/firebaseConfig';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

export default function LoginForm({ initialMode = 'login' }) {
  const { login, signup, loginAnonymously, loginWithGoogle, error, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [loading, setLoading] = useState(false);
  // Nuevos estados para el registro
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetMethod, setResetMethod] = useState('email');
  const [resetEmail, setResetEmail] = useState('');
  const [resetPhone, setResetPhone] = useState('');
  const [resetMsg, setResetMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleQuickAccess = async () => {
    setLoading(true);
    try {
      await loginAnonymously();
    } catch (error) {
      console.error('Error acceso rápido:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!nombre || !apellido || !telefono || !direccion) {
          throw new Error('Por favor completa todos los campos');
        }
        await signup(email, password, { nombre, apellido, telefono, direccion });
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem('firebase:authUser');
        }
        setIsLogin(true);
        setSuccessMsg('Usuario creado, por favor inicia sesión.');
        setShowSuccessModal(true);
        setEmail(''); setPassword(''); setNombre(''); setApellido(''); setTelefono(''); setDireccion('');
      }
    } catch (error) {
      console.error('Error de autenticación:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Error login con Google:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setResetMsg('');
    if (resetMethod === 'email') {
      try {
        await resetPassword(resetEmail);
        setResetMsg('Revisa tu correo para restablecer la contraseña.');
      } catch {
        setResetMsg('No se pudo enviar el correo de recuperación.');
      }
    } else if (resetMethod === 'whatsapp') {
      try {
        await addDoc(collection(db, 'password_resets'), {
          whatsapp: resetPhone,
          email: resetEmail || '',
          requestedAt: new Date().toISOString()
        });
        // Actualizar o crear usuario en 'users'
        if (resetEmail) {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('email', '==', resetEmail));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            // Actualizar usuario existente
            const userDoc = querySnapshot.docs[0];
            await updateDoc(doc(db, 'users', userDoc.id), {
              telefono: resetPhone,
              whatsapp: resetPhone
            });
          } else {
            // Crear nuevo usuario con ese email y número
            await setDoc(doc(usersRef), {
              email: resetEmail,
              telefono: resetPhone,
              whatsapp: resetPhone,
              createdAt: new Date().toISOString()
            });
          }
        }
        setResetMsg('Tu solicitud fue registrada. El soporte te contactará por WhatsApp.');
      } catch {
        setResetMsg('No se pudo registrar tu solicitud. Intenta de nuevo.');
      }
    }
  };

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => setShowSuccessModal(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  return (
    <>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <button
        onClick={handleQuickAccess}
        disabled={loading}
        className="btn btn-success w-100 mb-4 py-3"
        style={{ fontSize: '1.1rem' }}
      >
        {loading ? (
          <span className="spinner-border spinner-border-sm" role="status"></span>
        ) : (
          '🚀 Acceso Rápido'
        )}
      </button>

      <div className="text-center mb-3">
        <small className="text-muted">O usa tu cuenta</small>
      </div>

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="btn btn-outline-dark w-100 mb-3"
      >
        {loading ? (
          <span className="spinner-border spinner-border-sm" role="status"></span>
        ) : (
          '🔑 Continuar con Google'
        )}
      </button>

      {showReset ? (
        <form onSubmit={handleReset} className="mb-4">
          <div className="mb-3">
            <label className="form-label">¿Cómo quieres recuperar tu cuenta?</label>
            <select
              className="form-select"
              value={resetMethod}
              onChange={e => setResetMethod(e.target.value)}
              disabled={loading}
            >
              <option value="email">Correo electrónico</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>
          {resetMethod === 'email' && (
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                required
                placeholder="Tu correo"
                disabled={loading}
              />
            </div>
          )}
          {resetMethod === 'whatsapp' && (
            <div className="mb-3">
              <input
                type="tel"
                className="form-control"
                value={resetPhone}
                onChange={e => setResetPhone(e.target.value)}
                required
                placeholder="Tu número de WhatsApp"
                disabled={loading}
              />
            </div>
          )}
          <button type="submit" className="btn btn-primary w-100 mb-2" disabled={loading}>
            Recuperar cuenta
          </button>
          <button type="button" className="btn btn-link w-100" onClick={() => setShowReset(false)}>
            Volver al login
          </button>
          {resetMsg && <div className="alert alert-info mt-2">{resetMsg}</div>}
        </form>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required={!isLogin}
                    disabled={loading}
                    placeholder="Nombre"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    required={!isLogin}
                    disabled={loading}
                    placeholder="Apellido"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="tel"
                    className="form-control"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    required={!isLogin}
                    disabled={loading}
                    placeholder="Teléfono"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    required={!isLogin}
                    disabled={loading}
                    placeholder="Dirección"
                  />
                </div>
              </>
            )}
            
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="Email"
              />
            </div>
            
            <div className="mb-3 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="Contraseña"
                minLength={6}
              />
              <button
                type="button"
                tabIndex={-1}
                className="btn btn-sm btn-link position-absolute end-0 top-50 translate-middle-y me-2"
                style={{ zIndex: 2 }}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <MdVisibilityOff size={22} /> : <MdVisibility size={22} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100 mb-3"
            >
              {loading ? 'Cargando...' : (isLogin ? 'Entrar' : 'Registrarse')}
            </button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="btn btn-link text-decoration-none p-0"
              disabled={loading}
            >
              {isLogin ? 'Crear cuenta nueva' : 'Ya tengo cuenta'}
            </button>
          </div>
          <div className="text-center">
            <button
              type="button"
              className="btn btn-link"
              onClick={() => setShowReset(true)}
              disabled={loading}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          {successMsg && (
            <div className="alert alert-success" role="alert">
              {successMsg}
            </div>
          )}
        </>
      )}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-green-500 text-white rounded-xl shadow-lg p-8 max-w-sm w-full flex flex-col items-center animate-fade-in">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="green" />
              <path stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 12l2 2l4-4" />
            </svg>
            <h2 className="text-2xl font-bold mb-2">¡Usuario creado!</h2>
            <p className="mb-6 text-center">Usuario creado, por favor inicia sesión.</p>
            <button
              className="bg-white text-green-600 font-semibold px-6 py-2 rounded-lg shadow hover:bg-green-100 transition"
              onClick={() => setShowSuccessModal(false)}
            >
              Ir a iniciar sesión
            </button>
          </div>
        </div>
      )}
    </>
  );
} 
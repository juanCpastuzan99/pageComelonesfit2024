"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import { auth } from '../firebase/firebaseConfig'
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut,
    signInAnonymously,
    signInWithPopup,
    GoogleAuthProvider,
    getAdditionalUserInfo,
    updateProfile,
    sendPasswordResetEmail
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/firebaseConfig'
import { appConfig } from '../config/appConfig'
import { userService } from '../services/userService'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Limpiar errores automáticamente
    const clearError = () => {
        if (error) {
            setTimeout(() => setError(null), 5000)
        }
    }

    // Función para iniciar sesión con email y contraseña
    const login = async (email, password) => {
        try {
            setError(null)
            setLoading(true) // Agregar loading durante la operación
            const result = await signInWithEmailAndPassword(auth, email, password)
            console.log('Login exitoso con email:', result.user.email)
            return result.user
        } catch (error) {
            let errorMessage = 'Error al iniciar sesión'
            
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'No existe una cuenta con este email'
                    break
                case 'auth/wrong-password':
                    errorMessage = 'Contraseña incorrecta'
                    break
                case 'auth/invalid-email':
                    errorMessage = 'Email inválido'
                    break
                case 'auth/user-disabled':
                    errorMessage = 'Esta cuenta ha sido deshabilitada'
                    break
                case 'auth/too-many-requests':
                    errorMessage = 'Demasiados intentos. Intenta más tarde'
                    break
                case 'auth/invalid-credential':
                    errorMessage = 'Credenciales inválidas'
                    break
                default:
                    errorMessage = error.message
            }
            
            setError(errorMessage)
            clearError()
            console.error('Error en login:', error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    // Función para registrar usuario
    const signup = async (email, password, userData = {}) => {
        try {
            setError(null)
            setLoading(true)
            const result = await createUserWithEmailAndPassword(auth, email, password)
            
            // Determinar el rol inicial del usuario
            let initialRole = 'visitor';
            
            // Verificar si es el propietario
            if (email === appConfig.owner.email) {
                initialRole = 'owner';
            }
            // Verificar si está en la lista de emails admin
            else if (await userService.isEmailAdmin(email)) {
                initialRole = 'admin';
            }
            
            // Actualizar el perfil del usuario con los datos adicionales
            if (Object.keys(userData).length > 0) {
                await updateProfile(result.user, {
                    displayName: `${userData.nombre} ${userData.apellido}`,
                    // Otros campos se pueden guardar en Firestore
                })
                
                // Guardar datos adicionales en Firestore con el rol correcto
                const userRef = doc(db, 'users', result.user.uid)
                await setDoc(userRef, {
                    email: email,
                    nombre: userData.nombre,
                    apellido: userData.apellido,
                    telefono: userData.telefono,
                    direccion: userData.direccion,
                    role: initialRole,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                })
            }
            
            console.log(`Usuario registrado: ${result.user.email} con rol: ${initialRole}`)
            return result.user
        } catch (error) {
            let errorMessage = 'Error al registrar usuario'
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Este email ya está registrado'
                    break
                case 'auth/invalid-email':
                    errorMessage = 'Email inválido'
                    break
                case 'auth/operation-not-allowed':
                    errorMessage = 'Registro con email no habilitado'
                    break
                case 'auth/weak-password':
                    errorMessage = 'La contraseña es muy débil'
                    break
                default:
                    errorMessage = error.message
            }
            
            setError(errorMessage)
            clearError()
            console.error('Error en registro:', error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    // Función para iniciar sesión anónima
    const loginAnonymously = async () => {
        try {
            setError(null)
            setLoading(true)
            const result = await signInAnonymously(auth)
            console.log('Usuario anónimo creado:', result.user.uid)
            return result.user
        } catch (error) {
            let errorMessage = 'Error al acceder como invitado'
            
            if (error.code === 'auth/operation-not-allowed') {
                errorMessage = 'Acceso anónimo no habilitado'
            }
            
            setError(errorMessage)
            clearError()
            console.error('Error en login anónimo:', error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    // Función para iniciar sesión con Google
    const loginWithGoogle = async () => {
        try {
            setError(null)
            setLoading(true)
            
            // Configurar el proveedor de Google
            const provider = new GoogleAuthProvider()
            
            // Agregar scopes para obtener información del perfil
            provider.addScope('email')
            provider.addScope('profile')
            
            // Configuraciones adicionales
            provider.setCustomParameters({
                prompt: 'select_account'
            })
            
            const result = await signInWithPopup(auth, provider)
            
            // Obtener información adicional sobre el usuario
            const additionalInfo = getAdditionalUserInfo(result)
            const isNewUser = additionalInfo?.isNewUser
            
            console.log('Usuario Google autenticado:', {
                uid: result.user.uid,
                email: result.user.email,
                name: result.user.displayName,
                photo: result.user.photoURL,
                isNewUser,
                provider: 'Google'
            })
            
            return result.user
        } catch (error) {
            let errorMessage = 'Error al iniciar sesión con Google'
            
            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    errorMessage = 'Ventana de Google cerrada. Intenta de nuevo'
                    break
                case 'auth/popup-blocked':
                    errorMessage = 'Popup bloqueado. Permite popups para este sitio'
                    break
                case 'auth/cancelled-popup-request':
                    errorMessage = 'Solo una ventana de Google puede estar abierta a la vez'
                    break
                case 'auth/account-exists-with-different-credential':
                    errorMessage = 'Ya existe una cuenta con este email usando otro método'
                    break
                case 'auth/auth-domain-config-required':
                    errorMessage = 'Configuración de Google no completada'
                    break
                case 'auth/operation-not-allowed':
                    errorMessage = 'Inicio de sesión con Google no habilitado'
                    break
                case 'auth/unauthorized-domain':
                    errorMessage = 'Dominio no autorizado para Google Sign-In'
                    break
                default:
                    errorMessage = `Error de Google: ${error.message}`
            }
            
            setError(errorMessage)
            clearError()
            console.error('Error en login con Google:', error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    // Función para cerrar sesión
    const logout = async () => {
        try {
            setError(null)
            await signOut(auth)
            console.log('Sesión cerrada exitosamente')
        } catch (error) {
            const errorMessage = 'Error al cerrar sesión'
            setError(errorMessage)
            clearError()
            console.error('Error en logout:', error)
            throw error
        }
    }

    // Función para recuperación de contraseña por correo
    const resetPassword = async (email) => {
        try {
            setError(null);
            setLoading(true);
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            setError('No se pudo enviar el correo de recuperación.');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Escuchar cambios en el estado de autenticación
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userRef = doc(db, 'users', user.uid);
                
                // Sincronizar rol de propietario si el email coincide con la configuración
                if (user.email === appConfig.owner.email) {
                    try {
                        const userSnap = await getDoc(userRef);
                        if (!userSnap.exists() || userSnap.data().role !== 'owner') {
                            await setDoc(userRef, { 
                                role: 'owner', 
                                email: user.email,
                                updatedAt: serverTimestamp()
                            }, { merge: true });
                            console.log(`Rol de 'propietario' asegurado para ${user.email}`);
                        }
                    } catch (syncError) {
                        console.error("Error sincronizando el rol de propietario:", syncError);
                    }
                }
                // Verificar si el usuario debe tener rol de admin (pero no es propietario)
                else if (user.email !== appConfig.owner.email) {
                    try {
                        const userSnap = await getDoc(userRef);
                        if (userSnap.exists()) {
                            const userData = userSnap.data();
                            const isAdminEmail = await userService.isEmailAdmin(user.email);
                            
                            // Si está en la lista de admin pero no tiene rol admin, actualizar
                            if (isAdminEmail && userData.role !== 'admin') {
                                await updateDoc(userRef, {
                                    role: 'admin',
                                    updatedAt: serverTimestamp()
                                });
                                console.log(`Usuario ${user.email} promovido a admin`);
                            }
                            // Si no está en la lista de admin pero tiene rol admin, degradar
                            else if (!isAdminEmail && userData.role === 'admin') {
                                await updateDoc(userRef, {
                                    role: 'visitor',
                                    updatedAt: serverTimestamp()
                                });
                                console.log(`Usuario ${user.email} degradado a visitor`);
                            }
                        }
                    } catch (syncError) {
                        console.error("Error sincronizando roles de admin:", syncError);
                    }
                }

                // Cargar datos adicionales del usuario
                try {
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists() && userSnap.data().photoURL) {
                        setUser({ ...user, ...userSnap.data() }); // Combinar auth user con datos de firestore
                    } else {
                        setUser(user);
                    }
                } catch {
                    setUser(user);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Función para obtener información del proveedor actual
    const getCurrentProvider = () => {
        if (!user) return null
        if (user.isAnonymous) return 'anonymous'
        
        const providerData = user.providerData[0]
        return providerData?.providerId || 'unknown'
    }

    // Función para verificar si el usuario es nuevo
    const isNewUser = () => {
        if (!user) return false
        const creationTime = new Date(user.metadata.creationTime)
        const now = new Date()
        const timeDiff = now - creationTime
        return timeDiff < 60000 // Menos de 1 minuto = usuario nuevo
    }

    const value = {
        user,
        loading,
        error,
        login,
        signup,
        logout,
        loginAnonymously,
        loginWithGoogle,
        isAuthenticated: !!user,
        getCurrentProvider,
        isNewUser,
        clearError: () => setError(null),
        resetPassword
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de AuthProvider')
    }
    return context
}
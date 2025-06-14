import { 
  getAuth, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  setPersistence, 
  browserLocalPersistence,
  signOut 
} from "firebase/auth";
import { app } from "../firebase/firebaseConfig";

const auth = getAuth(app);

export const authService = {
  // Login con email y contraseña
  loginWithEmail: async (email, password, rememberMe) => {
    try {
      if (rememberMe) {
        await setPersistence(auth, browserLocalPersistence);
      }
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL
      };
    } catch (error) {
      throw error;
    }
  },

  // Login con Google
  loginWithGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        return {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL
        };
      }
      throw new Error("No se pudo autenticar con Google.");
    } catch (error) {
      throw error;
    }
  },

  // Cerrar sesión
  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  },

  // Obtener el usuario actual
  getCurrentUser: () => {
    return auth.currentUser;
  },

  // Suscribirse a cambios en el estado de autenticación
  onAuthStateChanged: (callback) => {
    return auth.onAuthStateChanged(callback);
  }
}; 
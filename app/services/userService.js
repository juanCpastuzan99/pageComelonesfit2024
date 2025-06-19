import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { appConfig } from '../config/appConfig';

export const userService = {
  // Obtener todos los usuarios
  async getAllUsers() {
    try {
      const q = query(collection(db, appConfig.firebase.collections.users), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data()
        });
      });
      return users;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  },

  // Obtener usuario por ID
  async getUserById(userId) {
    try {
      const userRef = doc(db, appConfig.firebase.collections.users, userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return {
          id: userDoc.id,
          ...userDoc.data()
        };
      }
      return null;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      throw error;
    }
  },

  // Crear nuevo usuario
  async createUser(userData) {
    try {
      const userRef = await addDoc(collection(db, appConfig.firebase.collections.users), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        role: userData.role || 'visitor'
      });
      return userRef.id;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  },

  // Actualizar usuario
  async updateUser(userId, userData) {
    try {
      const userRef = doc(db, appConfig.firebase.collections.users, userId);
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  },

  // Eliminar usuario
  async deleteUser(userId) {
    try {
      await deleteDoc(doc(db, appConfig.firebase.collections.users, userId));
      return true;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  },

  // Cambiar rol de usuario
  async changeUserRole(userId, newRole) {
    try {
      const userRef = doc(db, appConfig.firebase.collections.users, userId);
      await updateDoc(userRef, {
        role: newRole,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error al cambiar rol:', error);
      throw error;
    }
  },

  // Buscar usuarios por email
  async searchUsersByEmail(email) {
    try {
      const q = query(
        collection(db, appConfig.firebase.collections.users), 
        where('email', '>=', email),
        where('email', '<=', email + '\uf8ff')
      );
      const querySnapshot = await getDocs(q);
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data()
        });
      });
      return users;
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
      throw error;
    }
  },

  // Obtener estadísticas de usuarios
  async getUserStats() {
    try {
      const users = await this.getAllUsers();
      
      const totalUsers = users.length;
      const adminUsers = users.filter(u => u.role === 'admin').length;
      const visitorUsers = users.filter(u => u.role === 'visitor').length;
      
      // Usuarios registrados en los últimos 7 días
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recentUsers = users.filter(u => 
        u.createdAt && u.createdAt.toDate() > weekAgo
      ).length;
      
      return {
        totalUsers,
        adminUsers,
        visitorUsers,
        recentUsers
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  },

  // Escuchar cambios en usuarios en tiempo real
  onUsersChange(callback) {
    const q = query(collection(db, appConfig.firebase.collections.users), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(users);
    });
  },

  // Verificar si un email es administrador
  async isEmailAdmin(email) {
    try {
      const adminConfigRef = doc(db, appConfig.firebase.collections.config, appConfig.firebase.config.adminEmails);
      const adminConfigDoc = await getDoc(adminConfigRef);
      
      if (adminConfigDoc.exists()) {
        const adminEmails = adminConfigDoc.data().emails || [];
        return adminEmails.includes(email.toLowerCase());
      }
      return false;
    } catch (error) {
      console.error('Error al verificar email admin:', error);
      return false;
    }
  },

  // Agregar email a la lista de administradores
  async addAdminEmail(email) {
    try {
      const adminConfigRef = doc(db, appConfig.firebase.collections.config, appConfig.firebase.config.adminEmails);
      const adminConfigDoc = await getDoc(adminConfigRef);
      
      let adminEmails = [];
      if (adminConfigDoc.exists()) {
        adminEmails = adminConfigDoc.data().emails || [];
      }
      
      if (!adminEmails.includes(email.toLowerCase())) {
        adminEmails.push(email.toLowerCase());
        await updateDoc(adminConfigRef, { emails: adminEmails });
      }
      
      return true;
    } catch (error) {
      console.error('Error al agregar email admin:', error);
      throw error;
    }
  },

  // Remover email de la lista de administradores
  async removeAdminEmail(email) {
    try {
      const adminConfigRef = doc(db, appConfig.firebase.collections.config, appConfig.firebase.config.adminEmails);
      const adminConfigDoc = await getDoc(adminConfigRef);
      
      if (adminConfigDoc.exists()) {
        let adminEmails = adminConfigDoc.data().emails || [];
        adminEmails = adminEmails.filter(e => e !== email.toLowerCase());
        await updateDoc(adminConfigRef, { emails: adminEmails });
      }
      
      return true;
    } catch (error) {
      console.error('Error al remover email admin:', error);
      throw error;
    }
  }
}; 
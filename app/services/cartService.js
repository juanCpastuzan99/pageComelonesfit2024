import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export const cartService = {
  // Guardar carrito en la base de datos
  async saveCart(userId, cartData) {
    try {
      const cartRef = doc(db, 'carts', userId);
      await setDoc(cartRef, {
        userId,
        items: cartData.items,
        total: cartData.total,
        itemCount: cartData.itemCount,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Error saving cart:', error);
      throw error;
    }
  },

  // Obtener carrito de la base de datos
  async getCart(userId) {
    try {
      const cartRef = doc(db, 'carts', userId);
      const cartDoc = await getDoc(cartRef);
      
      if (cartDoc.exists()) {
        return cartDoc.data();
      } else {
        // Si no existe, crear un carrito vacío
        const emptyCart = {
          userId,
          items: [],
          total: 0,
          itemCount: 0,
          updatedAt: new Date()
        };
        await this.saveCart(userId, emptyCart);
        return emptyCart;
      }
    } catch (error) {
      console.error('Error getting cart:', error);
      throw error;
    }
  },

  // Actualizar carrito en la base de datos
  async updateCart(userId, cartData) {
    try {
      const cartRef = doc(db, 'carts', userId);
      await updateDoc(cartRef, {
        items: cartData.items,
        total: cartData.total,
        itemCount: cartData.itemCount,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  },

  // Eliminar carrito de la base de datos
  async deleteCart(userId) {
    try {
      const cartRef = doc(db, 'carts', userId);
      await deleteDoc(cartRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting cart:', error);
      throw error;
    }
  },

  // Agregar item al carrito
  async addItemToCart(userId, product) {
    try {
      const currentCart = await this.getCart(userId);
      const existingItem = currentCart.items.find(item => item.id === product.id);
      
      let updatedItems;
      if (existingItem) {
        // Si el item ya existe, aumentar la cantidad
        updatedItems = currentCart.items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Si es un item nuevo, agregarlo
        const newItem = { ...product, quantity: 1 };
        updatedItems = [...currentCart.items, newItem];
      }
      
      const updatedCart = {
        userId,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + ((item.price ?? item.precio ?? 0) * item.quantity), 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        updatedAt: new Date()
      };
      
      await this.updateCart(userId, updatedCart);
      return updatedCart;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  },

  // Remover item del carrito
  async removeItemFromCart(userId, productId) {
    try {
      const currentCart = await this.getCart(userId);
      const updatedItems = currentCart.items.filter(item => item.id !== productId);
      
      const updatedCart = {
        userId,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + ((item.price ?? item.precio ?? 0) * item.quantity), 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        updatedAt: new Date()
      };
      
      await this.updateCart(userId, updatedCart);
      return updatedCart;
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw error;
    }
  },

  // Actualizar cantidad de un item
  async updateItemQuantity(userId, productId, quantity) {
    try {
      const currentCart = await this.getCart(userId);
      
      if (quantity <= 0) {
        // Si la cantidad es 0 o menor, remover el item
        return await this.removeItemFromCart(userId, productId);
      }
      
      const updatedItems = currentCart.items.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      
      const updatedCart = {
        userId,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + ((item.price ?? item.precio ?? 0) * item.quantity), 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        updatedAt: new Date()
      };
      
      await this.updateCart(userId, updatedCart);
      return updatedCart;
    } catch (error) {
      console.error('Error updating item quantity:', error);
      throw error;
    }
  },

  // Limpiar carrito
  async clearCart(userId) {
    try {
      const emptyCart = {
        userId,
        items: [],
        total: 0,
        itemCount: 0,
        updatedAt: new Date()
      };
      
      await this.updateCart(userId, emptyCart);
      return emptyCart;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },

  // Sincronizar carrito local con la base de datos
  async syncCartWithDatabase(userId, localCart) {
    try {
      const dbCart = await this.getCart(userId);
      // Convertir ambos updatedAt a Date para comparar correctamente
      const localUpdatedAt = new Date(localCart.updatedAt);
      const dbUpdatedAt = new Date(dbCart.updatedAt);
      // Si el carrito local tiene más items o es más reciente, actualizar la BD
      if (localCart.itemCount > dbCart.itemCount || localUpdatedAt > dbUpdatedAt) {
        await this.updateCart(userId, localCart);
        return localCart;
      } else {
        // Si la BD tiene datos más recientes, usar esos
        return dbCart;
      }
    } catch (error) {
      console.error('Error syncing cart:', error);
      throw error;
    }
  }
}; 
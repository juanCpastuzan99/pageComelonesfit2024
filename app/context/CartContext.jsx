import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { cartService } from '../services/cartService';
import { useProducts } from '../hooks/useProducts';

// Estado inicial del carrito
const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  loading: false,
  error: null
};

// Tipos de acciones
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SYNC_CART: 'SYNC_CART',
  REMOVE_DELETED_PRODUCTS: 'REMOVE_DELETED_PRODUCTS'
};

// Reducer del carrito
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case CART_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case CART_ACTIONS.LOAD_CART:
      return {
        ...state,
        ...action.payload,
        loading: false,
        error: null
      };

    case CART_ACTIONS.ADD_ITEM: {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        // Si el item ya existe, aumentar la cantidad
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + ((item.price ?? item.precio ?? 0) * item.quantity), 0),
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          error: null
        };
      } else {
        // Si es un item nuevo, agregarlo
        const newItem = { ...action.payload, quantity: 1 };
        const updatedItems = [...state.items, newItem];
        
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + ((item.price ?? item.precio ?? 0) * item.quantity), 0),
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          error: null
        };
      }
    }
    
    case CART_ACTIONS.REMOVE_ITEM: {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + ((item.price ?? item.precio ?? 0) * item.quantity), 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        error: null
      };
    }
    
    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Si la cantidad es 0 o menor, remover el item
        return cartReducer(state, { type: CART_ACTIONS.REMOVE_ITEM, payload: id });
      }
      
      const updatedItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + ((item.price ?? item.precio ?? 0) * item.quantity), 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        error: null
      };
    }
    
    case CART_ACTIONS.CLEAR_CART:
      return {
        ...initialState,
        loading: false
      };
      
    case CART_ACTIONS.SYNC_CART:
      return {
        ...state,
        ...action.payload,
        error: null
      };
      
    case CART_ACTIONS.REMOVE_DELETED_PRODUCTS: {
      const { deletedProductIds } = action.payload;
      const updatedItems = state.items.filter(item => !deletedProductIds.includes(item.id));
      
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + ((item.price ?? item.precio ?? 0) * item.quantity), 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        error: null
      };
    }
      
    default:
      return state;
  }
};

// Crear el contexto
const CartContext = createContext();

// Hook personalizado para usar el contexto
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

// Provider del carrito
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuth();
  const { products } = useProducts();

  // Función para cargar carrito desde la base de datos
  const loadCartFromDatabase = async () => {
    if (!user) return;

    dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
    try {
      const cartData = await cartService.getCart(user.uid);
      dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cartData });
    } catch (error) {
      console.error('Error loading cart from database:', error);
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Error al cargar el carrito' });
    }
  };

  // Cargar carrito desde la base de datos cuando el usuario se autentica
  useEffect(() => {
    if (user) {
      loadCartFromDatabase();
    }
  }, [user, loadCartFromDatabase]);

  // Cargar carrito desde localStorage al inicializar (para usuarios no autenticados)
  useEffect(() => {
    if (!user) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          dispatch({ type: CART_ACTIONS.LOAD_CART, payload: parsedCart });
        } catch (error) {
          console.error('Error al cargar el carrito local:', error);
        }
      }
    }
  }, [user]);

  // Guardar carrito en localStorage cuando cambie (solo para usuarios no autenticados)
  useEffect(() => {
    if (!user && !state.loading) {
      localStorage.setItem('cart', JSON.stringify({
        items: state.items,
        total: state.total,
        itemCount: state.itemCount
      }));
    }
  }, [state.items, state.total, state.itemCount, user, state.loading]);

  // Limpieza automática de productos eliminados
  useEffect(() => {
    if (state.items.length > 0 && products.length > 0) {
      const productIds = products.map(p => p.id);
      const deletedProductIds = state.items
        .filter(item => !productIds.includes(item.id))
        .map(item => item.id);
      
      if (deletedProductIds.length > 0) {
        console.log('🧹 Limpieza automática de productos eliminados:', deletedProductIds);
        dispatch({ type: CART_ACTIONS.REMOVE_DELETED_PRODUCTS, payload: { deletedProductIds } });
        
        // Si el usuario está autenticado, actualizar en la base de datos
        if (user) {
          deletedProductIds.forEach(async (productId) => {
            try {
              await cartService.removeItemFromCart(user.uid, productId);
            } catch (error) {
              console.error('Error removing deleted product from database:', error);
            }
          });
        }
      }
    }
  }, [state.items, products, user]);

  // Función para sincronizar carrito con la base de datos
  const syncCartWithDatabase = async () => {
    if (!user) return;

    try {
      const currentCart = {
        items: state.items,
        total: state.total,
        itemCount: state.itemCount,
        updatedAt: new Date()
      };
      
      const syncedCart = await cartService.syncCartWithDatabase(user.uid, currentCart);
      dispatch({ type: CART_ACTIONS.SYNC_CART, payload: syncedCart });
    } catch (error) {
      console.error('Error syncing cart with database:', error);
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Error al sincronizar el carrito' });
    }
  };

  // Funciones del carrito
  const addToCart = async (product) => {
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: product });
    
    // Si el usuario está autenticado, guardar en la base de datos
    if (user) {
      try {
        await cartService.addItemToCart(user.uid, product);
      } catch (error) {
        console.error('Error saving to database:', error);
        dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Error al guardar en la base de datos' });
      }
    }
  };

  const removeFromCart = async (productId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: productId });
    
    // Si el usuario está autenticado, actualizar en la base de datos
    if (user) {
      try {
        await cartService.removeItemFromCart(user.uid, productId);
      } catch (error) {
        console.error('Error removing from database:', error);
        dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Error al eliminar de la base de datos' });
      }
    }
  };

  const updateQuantity = async (productId, quantity) => {
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { id: productId, quantity } });
    
    // Si el usuario está autenticado, actualizar en la base de datos
    if (user) {
      try {
        await cartService.updateItemQuantity(user.uid, productId, quantity);
      } catch (error) {
        console.error('Error updating quantity in database:', error);
        dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Error al actualizar cantidad en la base de datos' });
      }
    }
  };

  const clearCart = async () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
    
    // Si el usuario está autenticado, limpiar en la base de datos
    if (user) {
      try {
        await cartService.clearCart(user.uid);
      } catch (error) {
        console.error('Error clearing cart in database:', error);
        dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Error al limpiar el carrito en la base de datos' });
      }
    }
  };

  const isInCart = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const removeDeletedProducts = async (deletedProductIds) => {
    dispatch({ type: CART_ACTIONS.REMOVE_DELETED_PRODUCTS, payload: { deletedProductIds } });
    
    // Si el usuario está autenticado, actualizar en la base de datos
    if (user) {
      try {
        // Remover productos eliminados de la base de datos
        for (const productId of deletedProductIds) {
          await cartService.removeItemFromCart(user.uid, productId);
        }
      } catch (error) {
        console.error('Error removing deleted products from database:', error);
        dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Error al limpiar productos eliminados' });
      }
    }
  };

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
    syncCartWithDatabase,
    loadCartFromDatabase,
    removeDeletedProducts
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 
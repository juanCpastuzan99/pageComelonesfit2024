"use client";
import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from './AuthContext';
import {
  loadCart,
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  clearCart,
  loadGuestCart,
  addItemToGuestCart,
  removeItemFromGuestCart,
  updateGuestCartQuantity,
  clearGuestCart,
} from '../../store/slices/cartSlice';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const cartState = useSelector((state) => state.cart) || {};

  useEffect(() => {
    if (user) {
      dispatch(loadCart(user.uid));
    } else {
      const savedCart = localStorage.getItem('guestCart');
      if (savedCart) {
        dispatch(loadGuestCart(JSON.parse(savedCart)));
      }
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (!user) {
      const { items, itemCount, total } = cartState;
      localStorage.setItem('guestCart', JSON.stringify({ items, itemCount, total }));
    }
  }, [cartState, user]);

  const handleAddToCart = (product) => {
    if (user) {
      dispatch(addItemToCart({ userId: user.uid, product }));
    } else {
      dispatch(addItemToGuestCart(product));
    }
  };

  const handleRemoveFromCart = (productId) => {
    if (user) {
      dispatch(removeItemFromCart({ userId: user.uid, productId }));
    } else {
      dispatch(removeItemFromGuestCart(productId));
    }
  };

  const handleUpdateQuantity = (productId, quantity) => {
    if (user) {
      dispatch(updateItemQuantity({ userId: user.uid, productId, quantity }));
    } else {
      dispatch(updateGuestCartQuantity({ id: productId, quantity }));
    }
  };

  const handleClearCart = () => {
    if (user) {
      dispatch(clearCart(user.uid));
    } else {
      dispatch(clearGuestCart());
    }
  };

  const value = {
    ...cartState,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}; 
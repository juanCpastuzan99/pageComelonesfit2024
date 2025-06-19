"use client";
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { useSelector } from 'react-redux';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function ThemeWrapper({ children }) {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
      document.body.classList.toggle('dark-mode', isDarkMode);
    }
  }, [isDarkMode]);

  return <>{children}</>;
}

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <CartProvider>
          <ThemeWrapper>
            {children}
          </ThemeWrapper>
        </CartProvider>
      </AuthProvider>
    </Provider>
  );
}
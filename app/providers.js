"use client";
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

function ThemeWrapper({ children }) {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }, [isDarkMode]);

  return children;
}

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <ThemeWrapper>{children}</ThemeWrapper>
    </Provider>
  );
} 
"use client";
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from './context/AuthContext';
import Navbar from "../components/Navbar";
import ToastContainer from '../components/ToastContainer';
import { useToast } from './hooks/useToast';
import Hero from '../components/Hero';
import Features from '../components/Features';
import LoginForm from './components/auth/LoginForm';
import Footer from '../components/Footer';
import { useRouter } from 'next/navigation';
import ProductosDestacados from '../components/ProductosDestacados';

function AppContent() {
  const { user, loading } = useAuth();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const [showLogin, setShowLogin] = useState(false);
  const { toasts, removeToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Redirigir al dashboard si el usuario está autenticado
  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleLoginRequest = () => {
      setShowLogin(true);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user && showLogin) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <LoginForm onLoginSuccess={() => setShowLogin(false)} />
            </div>
        </div>
    );
  }

  // Si el usuario está autenticado, mostrar loading mientras se redirige
  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-900 ${isDarkMode ? 'dark' : ''}`}>
      <Navbar onShowLogin={handleLoginRequest} />
      <main>
        <Hero onShowLogin={handleLoginRequest} />
        <Features />
        <ProductosDestacados />
      </main>
      <Footer />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default function Home() {
  return <AppContent />;
}
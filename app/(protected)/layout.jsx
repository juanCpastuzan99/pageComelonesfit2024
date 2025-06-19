"use client";

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { SidebarProvider } from '../context/SidebarContext';
import ContentWithDynamicPadding from './ContentWithDynamicPadding';

export default function ProtectedLayout({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    // Mostrar loading mientras se verifica autenticación
    if (loading) {
        return (
            <div className="min-h-screen d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="text-muted">Verificando autenticación...</p>
                </div>
            </div>
        );
    }

    // Si no hay usuario, no mostrar nada (será redirigido)
    if (!user) {
        return null;
    }

    return (
        <SidebarProvider>
            <Navbar className="fixed top-0 left-0 w-full z-40" />
            <Sidebar />
            <ContentWithDynamicPadding>{children}</ContentWithDynamicPadding>
        </SidebarProvider>
    );
} 
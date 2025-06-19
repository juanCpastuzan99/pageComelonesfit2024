"use client";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../store/slices/themeSlice";
import { auth } from "../app/firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import LogoutButton from "./LogoutButton";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { useAuth } from '../app/context/AuthContext';
import CartIcon from './CartIcon';
import PermissionIndicator from './PermissionIndicator';

const Navbar = ({ onShowLogin, setLoginMode }) => {
    const dispatch = useDispatch();
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);
    const [imageError, setImageError] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const { user, loading, logout } = useAuth();

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isSidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.navbar-toggler')) {
                setIsSidebarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isSidebarOpen]);

    // Prevent body scroll when sidebar is open
    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isSidebarOpen]);

    // Add this after the existing useEffect hooks
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDropdownOpen && !event.target.closest('.user-dropdown')) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);

    // Verificar si el componente está montado
    useEffect(() => {
        setMounted(true);
    }, []);

    // No renderizar hasta que esté montado
    if (!mounted) return null;

    // No renderizar si está cargando
    if (loading) {
        return (
            <nav className={`w-full ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-lg fixed top-0 z-50`}>
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-center">
                        <div className="animate-spin h-6 w-6 border-2 border-primary-600 border-t-transparent rounded-full"></div>
                    </div>
                </div>
            </nav>
        );
    }

    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleThemeToggle = () => {
        dispatch(toggleTheme());
    };

    return (
        <>
            <nav className={`w-full ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-lg fixed top-0 z-50 transition-all duration-300`}>
                <div className="container mx-auto px-4 lg:px-6">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href="/" className="text-2xl font-bold flex items-center space-x-1 hover:scale-105 transition-transform duration-200 no-underline">
                            <span className="text-blue-600">Comelones</span>
                            <span className="text-blue-600">fit</span>
                        </Link>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-4">
                            {/* Permission Indicator - Solo para usuarios autenticados */}
                            {user && <PermissionIndicator />}

                            {/* Cart Icon - Visible for all users */}
                            <CartIcon />

                            {/* Theme Toggle */}
                            <button
                                className={`p-2 rounded-full ${
                                    isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                                } transition-colors duration-200`}
                                onClick={handleThemeToggle}
                                aria-label={`Cambiar a modo ${isDarkMode ? 'claro' : 'oscuro'}`}
                            >
                                {isDarkMode ? (
                                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                    </svg>
                                )}
                            </button>

                            {/* Botones para usuarios no autenticados */}
                            {!user && (
                                <>
                                    <button
                                        onClick={() => {
                                            if (typeof onShowLogin === 'function') {
                                                onShowLogin(true);
                                                if (typeof setLoginMode === 'function') setLoginMode('login');
                                            }
                                        }}
                                        className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                                    >
                                        Comenzar ahora
                                    </button>
                                    <button
                                        onClick={() => { onShowLogin(true); setLoginMode('register'); }}
                                        className="px-4 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors duration-200 shadow-sm"
                                    >
                                        Registrar cuenta
                                    </button>
                                </>
                            )}

                            {/* User Section */}
                            {user && (
                                <div className="hidden lg:flex items-center space-x-3">
                                    <div className="relative user-dropdown">
                                        <div 
                                            className="flex items-center space-x-3 cursor-pointer"
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        >
                                            <div className="relative">
                                                {user.photoURL && !imageError ? (
                                                    <Image
                                                        src={user.photoURL}
                                                        alt={`Foto de perfil de ${user.displayName}`}
                                                        width={40}
                                                        height={40}
                                                        className="rounded-full object-cover border-2 border-green-500"
                                                        onError={() => setImageError(true)}
                                                        priority
                                                    />
                                                ) : (
                                                    <div 
                                                        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 border-green-500 ${
                                                            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                                                        }`}
                                                    >
                                                        <span className="text-sm font-medium text-green-600">
                                                            {getInitials(user.displayName)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm max-w-[120px] truncate" title={user.displayName}>
                                                    {user.displayName || user.email?.split('@')[0]}
                                                </span>
                                            </div>
                                            <svg 
                                                className={`h-5 w-5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                                                fill="none" 
                                                viewBox="0 0 24 24" 
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                        
                                        {/* Dropdown Menu */}
                                        {isDropdownOpen && (
                                            <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 ${
                                                isDarkMode ? 'bg-gray-800' : 'bg-white'
                                            } ring-1 ring-black ring-opacity-5 z-50`}>
                                                <Link 
                                                    href="/perfil"
                                                    className={`block px-4 py-2 text-sm ${
                                                        isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                                                    }`}
                                                    onClick={() => setIsDropdownOpen(false)}
                                                >
                                                    Mi Perfil
                                                </Link>
                                                <Link 
                                                    href="/configuracion"
                                                    className={`block px-4 py-2 text-sm ${
                                                        isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                                                    }`}
                                                    onClick={() => setIsDropdownOpen(false)}
                                                >
                                                    Configuración
                                                </Link>
                                                <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                                                <LogoutButton 
                                                    className={`block w-full text-left px-4 py-2 text-sm ${
                                                        isDarkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'
                                                    }`}
                                                    onClick={() => {
                                                        logout();
                                                        setIsDropdownOpen(false);
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
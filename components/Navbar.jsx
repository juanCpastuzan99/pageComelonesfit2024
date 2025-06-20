"use client";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../store/slices/themeSlice";
import { auth } from "../app/firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { useAuth } from '../app/context/AuthContext';
import { usePermissions } from '../app/hooks/usePermissions';
import CartIcon from './CartIcon';
import PermissionIndicator from './PermissionIndicator';
import LogoutButton from "./LogoutButton";
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';

const NavLink = ({ href, children }) => (
    <Link href={href} className="no-underline">
        <span className="text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-300 font-medium">
            {children}
        </span>
    </Link>
);

const Navbar = ({ onShowLogin, setLoginMode }) => {
    const dispatch = useDispatch();
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);
    const [imageError, setImageError] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const pathname = usePathname();
    const { user, loading, logout } = useAuth();
    const { isAdmin } = usePermissions();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isSidebarOpen && !event.target.closest('.mobile-sidebar') && !event.target.closest('.navbar-toggler')) {
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

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDropdownOpen && !event.target.closest('.user-dropdown')) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);

    // Check if component is mounted
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Don't render until mounted
    if (!mounted) return null;

    // Don't render if loading
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

    const handleLogout = async () => {
        if (isLoggingOut) return;
        
        setIsLoggingOut(true);
        try {
            await logout();
            setIsSidebarOpen(false);
            setIsDropdownOpen(false);
            console.log('Logout exitoso');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    const handleLoginClick = () => {
        if (typeof onShowLogin === 'function') {
            onShowLogin(true);
            if (typeof setLoginMode === 'function') setLoginMode('login');
        }
        closeSidebar();
    };

    const handleRegisterClick = () => {
        if (typeof onShowLogin === 'function') {
            onShowLogin(true);
            if (typeof setLoginMode === 'function') setLoginMode('register');
        }
        closeSidebar();
    };

    const UserAvatar = () => {
        if (loading) return <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />;

        if (!user) return null;

        return (
            <div className="relative">
                <Image
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=random`}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="rounded-full cursor-pointer"
                />
            </div>
        );
    };

    return (
        <>
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={closeSidebar}></div>
            )}

            {/* Mobile Sidebar */}
            <div className={`mobile-sidebar fixed top-0 left-0 h-full w-[280px] ${
                isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
            } shadow-xl z-50 transform ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } transition-transform duration-300 ease-in-out md:hidden flex flex-col`}>
                
                {/* Sidebar Header */}
                <div className={`flex items-center justify-between px-4 py-4 border-b ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                    <Link href="/" className="text-xl font-bold flex items-center space-x-1 no-underline" onClick={closeSidebar}>
                        <span className="text-blue-600">Comelones</span>
                        <span className="text-blue-600">fit</span>
                    </Link>
                    <button 
                        onClick={closeSidebar} 
                        className={`p-2 rounded-lg ${
                            isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                        } transition-colors duration-200`}
                        aria-label="Cerrar menú"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Sidebar Content */}
                <div className="flex-1 flex flex-col p-4 overflow-y-auto">
                    {/* User Info / Permission Indicator */}
                    {user && (
                        <div className="mb-4">
                            <PermissionIndicator />
                        </div>
                    )}

                    {/* Navigation Links */}
                    <div className="space-y-2 mb-4">
                        <Link 
                            href="/" 
                            className={`flex items-center py-3 px-4 rounded-lg ${
                                isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-blue-50'
                            } transition-colors duration-200 no-underline`}
                            onClick={closeSidebar}
                        >
                            <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Inicio
                        </Link>
                        
                        <Link 
                            href="/pedidos" 
                            className={`flex items-center py-3 px-4 rounded-lg ${
                                isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-blue-50'
                            } transition-colors duration-200 no-underline`}
                            onClick={closeSidebar}
                        >
                            <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Pedidos
                        </Link>
                        
                        <Link 
                            href="/perfil" 
                            className={`flex items-center py-3 px-4 rounded-lg ${
                                isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-blue-50'
                            } transition-colors duration-200 no-underline`}
                            onClick={closeSidebar}
                        >
                            <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Perfil
                        </Link>
                        
                        <Link 
                            href="/configuracion" 
                            className={`flex items-center py-3 px-4 rounded-lg ${
                                isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-blue-50'
                            } transition-colors duration-200 no-underline`}
                            onClick={closeSidebar}
                        >
                            <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Configuración
                        </Link>
                    </div>

                    {/* Cart Icon */}
                    <div className="mb-4">
                        {!isAdmin && <CartIcon />}
                    </div>

                    {/* Theme Toggle */}
                    <button
                        className={`flex items-center justify-center p-3 rounded-lg mb-4 ${
                            isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                        } transition-colors duration-200`}
                        onClick={handleThemeToggle}
                        aria-label={`Cambiar a modo ${isDarkMode ? 'claro' : 'oscuro'}`}
                    >
                        {isDarkMode ? (
                            <svg className="h-5 w-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="h-5 w-5 text-gray-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                            </svg>
                        )}
                        {isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
                    </button>

                    {/* Auth Buttons */}
                    {!user && (
                        <div className="space-y-3 mt-auto">
                            <button
                                onClick={handleLoginClick}
                                className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                            >
                                Comenzar ahora
                            </button>
                            <button
                                onClick={handleRegisterClick}
                                className="w-full px-4 py-3 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors duration-200 shadow-sm"
                            >
                                Registrar cuenta
                            </button>
                        </div>
                    )}

                    {/* Logout Button */}
                    {user && (
                        <div className="mt-auto">
                            <button 
                                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg ${
                                    isDarkMode 
                                        ? 'text-red-400 hover:bg-gray-800' 
                                        : 'text-red-600 hover:bg-red-50'
                                } transition-colors duration-200 ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                            >
                                {isLoggingOut ? (
                                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                )}
                                {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Navbar */}
            <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-md' : 'bg-white dark:bg-gray-800'}`}>
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center">
                            <Link href="/" className="text-2xl font-bold text-gray-800 dark:text-white no-underline">
                                Comelones<span className="text-green-500">Fit</span>
                            </Link>
                        </div>

                        <div className="hidden md:flex items-center space-x-8">
                            {!user &&
                                <>
                                    <NavLink href="/#features">Características</NavLink>
                                    <NavLink href="/contacto">Contacto</NavLink>
                                </>
                            }
                        </div>

                        <div className="flex items-center space-x-4">
                            <button onClick={handleThemeToggle} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                {isDarkMode ? <FaSun /> : <FaMoon />}
                            </button>
                            
                            {!isAdmin && <CartIcon />}

                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <UserAvatar />
                                    <LogoutButton />
                                </div>
                            ) : (
                                !loading && (
                                    <div className="hidden md:flex items-center space-x-2">
                                        <button onClick={() => onShowLogin()} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                            Ingresar
                                        </button>
                                        <button onClick={() => onShowLogin()} className="px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors">
                                            Registrar cuenta
                                        </button>
                                    </div>
                                )
                            )}
                            
                            <div className="md:hidden">
                                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-gray-500 dark:text-gray-400">
                                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-800 py-4">
                    <div className="flex flex-col items-center space-y-4">
                        {!user && !loading && (
                            <>
                                <NavLink href="/#features">Características</NavLink>
                                <NavLink href="/contacto">Contacto</NavLink>
                                <hr className="w-full border-t border-gray-200 dark:border-gray-700 my-2"/>
                                <button onClick={() => { onShowLogin(); setIsMenuOpen(false); }} className="w-full text-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                    Ingresar
                                </button>
                                <button onClick={() => { onShowLogin(); setIsMenuOpen(false); }} className="w-full text-center px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors">
                                    Registrar cuenta
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
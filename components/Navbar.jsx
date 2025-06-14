"use client";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../store/slices/themeSlice";
import { auth } from "../app/firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import LogoutButton from "./LogoutButton";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);
    const [user, setUser] = useState(null);
    const [imageError, setImageError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const privateRoutes = ['/dashboard', '/perfil', '/menu'];

        const handlePopState = () => {
            if (user && !privateRoutes.includes(window.location.pathname)) {
                router.replace('/dashboard');
            }
        };

        window.addEventListener('popstate', handlePopState);

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setImageError(false);
            setIsLoading(false);

            if (user && !privateRoutes.includes(window.location.pathname)) {
                router.push('/dashboard');
            }
        }, (error) => {
            console.error("Auth state change error:", error);
            setIsLoading(false);
        });

        if (user && !privateRoutes.includes(window.location.pathname)) {
            router.push('/dashboard');
        }

        return () => {
            unsubscribe();
            window.removeEventListener('popstate', handlePopState);
        };
    }, [user, router]);

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

    if (isLoading) {
        return (
            <nav className={`navbar navbar-expand-lg ${isDarkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}>
                <div className="container">
                    <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <>
            <nav 
                className={`navbar navbar-expand-lg ${isDarkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}
                role="navigation"
                aria-label="Main navigation"
            >
                <div className="container">
                    <Link href="/" className="navbar-brand" aria-label="Home">
                        Comelonesfit
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        aria-controls="navbarNav"
                        aria-expanded={isSidebarOpen}
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto">
                            {!user && (
                                <li className="nav-item">
                                    <Link href="/" className="nav-link" aria-label="Home page">
                                        Inicio
                                    </Link>
                                </li>
                            )}
                            {user && (
                                <li className="nav-item">
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="position-relative" style={{ width: '32px', height: '32px' }}>
                                            {user.photoURL && !imageError ? (
                                                <Image
                                                    src={user.photoURL}
                                                    alt={`${user.displayName}'s profile picture`}
                                                    width={32}
                                                    height={32}
                                                    style={{ borderRadius: '50%', objectFit: 'cover' }}
                                                    onError={() => setImageError(true)}
                                                    priority
                                                />
                                            ) : (
                                                <div 
                                                    className="d-flex align-items-center justify-content-center"
                                                    style={{
                                                        width: '32px',
                                                        height: '32px',
                                                        borderRadius: '50%',
                                                        backgroundColor: isDarkMode ? '#6c757d' : '#e9ecef',
                                                        color: isDarkMode ? '#fff' : '#000',
                                                        fontSize: '14px',
                                                        fontWeight: 'bold'
                                                    }}
                                                    role="img"
                                                    aria-label={`${user.displayName}'s initials`}
                                                >
                                                    {getInitials(user.displayName)}
                                                </div>
                                            )}
                                        </div>
                                        <span 
                                            className="text-truncate" 
                                            style={{ maxWidth: '150px' }}
                                            title={user.displayName}
                                        >
                                            {user.displayName}
                                        </span>
                                        <LogoutButton />
                                    </div>
                                </li>
                            )}
                        </ul>
                        <div className="d-flex align-items-center gap-2">
                            {!user && (
                                <>
                                    <Link href="/login" className="btn btn-success rounded-pill px-4" aria-label="Login page">
                                        Comenzar Ahora
                                    </Link>
                                    <Link href="/register" className="btn btn-outline-success rounded-pill px-4" aria-label="Register page">
                                        Registrar Cuenta
                                    </Link>
                                </>
                            )}
                            <button
                                className={`btn ${isDarkMode ? 'btn-light' : 'btn-dark'}`}
                                onClick={handleThemeToggle}
                                aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                            >
                                {isDarkMode ? '☀️' : '🌙'}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar */}
            <div 
                className={`sidebar ${isSidebarOpen ? 'open' : ''} ${isDarkMode ? 'bg-dark' : 'bg-light'}`}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: isSidebarOpen ? 0 : '-100%',
                    height: '100vh',
                    width: '280px',
                    zIndex: 1000,
                    transition: 'left 0.3s ease-in-out',
                    padding: '1.5rem',
                    boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
                    overflowY: 'auto'
                }}
            >
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className={`mb-0 ${isDarkMode ? 'text-light' : 'text-dark'}`}>Menú Principal</h5>
                    <button 
                        className="btn-close" 
                        onClick={() => setIsSidebarOpen(false)}
                        aria-label="Close sidebar"
                    ></button>
                </div>

                {/* User Profile Section */}
                {user && (
                    <div className="mb-4 p-3 border-bottom">
                        <div className="d-flex align-items-center gap-3">
                            <div className="position-relative" style={{ width: '48px', height: '48px' }}>
                                {user.photoURL && !imageError ? (
                                    <Image
                                        src={user.photoURL}
                                        alt={`${user.displayName}'s profile picture`}
                                        width={48}
                                        height={48}
                                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                                        onError={() => setImageError(true)}
                                        priority
                                    />
                                ) : (
                                    <div 
                                        className="d-flex align-items-center justify-content-center"
                                        style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '50%',
                                            backgroundColor: isDarkMode ? '#6c757d' : '#e9ecef',
                                            color: isDarkMode ? '#fff' : '#000',
                                            fontSize: '18px',
                                            fontWeight: 'bold'
                                        }}
                                        role="img"
                                        aria-label={`${user.displayName}'s initials`}
                                    >
                                        {getInitials(user.displayName)}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h6 className={`mb-1 ${isDarkMode ? 'text-light' : 'text-dark'}`}>{user.displayName}</h6>
                                <small className={`${isDarkMode ? 'text-light-50' : 'text-dark-50'}`}>{user.email}</small>
                            </div>
                        </div>
                    </div>
                )}

                <ul className="nav flex-column">
                    <li className="nav-item mb-2">
                        <Link 
                            href="/" 
                            className={`nav-link d-flex align-items-center gap-2 ${isDarkMode ? 'text-light' : 'text-dark'}`}
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <i className="bi bi-house-door"></i>
                            Inicio
                        </Link>
                    </li>
                    <li className="nav-item mb-2">
                        <Link 
                            href="/menu" 
                            className={`nav-link d-flex align-items-center gap-2 ${isDarkMode ? 'text-light' : 'text-dark'}`}
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <i className="bi bi-card-list"></i>
                            Menú Semanal
                        </Link>
                    </li>
                    <li className="nav-item mb-2">
                        <Link 
                            href="/recetas" 
                            className={`nav-link d-flex align-items-center gap-2 ${isDarkMode ? 'text-light' : 'text-dark'}`}
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <i className="bi bi-book"></i>
                            Recetas
                        </Link>
                    </li>
                    <li className="nav-item mb-2">
                        <Link 
                            href="/calculadora" 
                            className={`nav-link d-flex align-items-center gap-2 ${isDarkMode ? 'text-light' : 'text-dark'}`}
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <i className="bi bi-calculator"></i>
                            Calculadora de Calorías
                        </Link>
                    </li>
                    <li className="nav-item mb-2">
                        <Link 
                            href="/blog" 
                            className={`nav-link d-flex align-items-center gap-2 ${isDarkMode ? 'text-light' : 'text-dark'}`}
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <i className="bi bi-newspaper"></i>
                            Blog
                        </Link>
                    </li>
                    <li className="nav-item mb-2">
                        <Link 
                            href="/contacto" 
                            className={`nav-link d-flex align-items-center gap-2 ${isDarkMode ? 'text-light' : 'text-dark'}`}
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <i className="bi bi-envelope"></i>
                            Contacto
                        </Link>
                    </li>

                    {!user && (
                        <>
                            <li className="nav-item mb-2">
                                <Link 
                                    href="/login" 
                                    className={`nav-link d-flex align-items-center gap-2 ${isDarkMode ? 'text-light' : 'text-dark'}`}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <i className="bi bi-box-arrow-in-right"></i>
                                    Comenzar Ahora
                                </Link>
                            </li>
                            <li className="nav-item mb-2">
                                <Link 
                                    href="/register" 
                                    className={`nav-link d-flex align-items-center gap-2 ${isDarkMode ? 'text-light' : 'text-dark'}`}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <i className="bi bi-person-plus"></i>
                                    Registrar Cuenta
                                </Link>
                            </li>
                        </>
                    )}

                    <li className="nav-item mt-4">
                        <button
                            className={`btn w-100 d-flex align-items-center justify-content-center gap-2 ${isDarkMode ? 'btn-light' : 'btn-dark'}`}
                            onClick={handleThemeToggle}
                            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                        >
                            {isDarkMode ? (
                                <>
                                    <i className="bi bi-sun"></i>
                                    Modo Claro
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-moon"></i>
                                    Modo Oscuro
                                </>
                            )}
                        </button>
                    </li>
                </ul>
            </div>

            {/* Overlay */}
            {isSidebarOpen && (
                <div 
                    className="overlay"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 999
                    }}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </>
    );
};

export default Navbar;
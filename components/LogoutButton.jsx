"use client";
import { useAuth } from '../app/context/AuthContext';
import { useRouter } from 'next/navigation';

const LogoutButton = ({ className, onClick, children }) => {
    const router = useRouter();
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const handleClick = (e) => {
        if (onClick) {
            onClick(e);
        } else {
            handleLogout();
        }
    };

    return (
        <button 
            className={className || "btn btn-danger w-100"}
            onClick={handleClick}
        >
            {children || "Cerrar Sesión"}
        </button>
    );
};

export default LogoutButton; 
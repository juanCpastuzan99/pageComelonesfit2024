"use client";
import { signOut } from 'firebase/auth';
import { auth } from '../app/firebase/firebaseConfig';
import { useRouter } from 'next/navigation';

const LogoutButton = () => {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <button 
            className="btn btn-danger w-100"
            onClick={handleLogout}
        >
            Cerrar Sesión
        </button>
    );
};

export default LogoutButton; 
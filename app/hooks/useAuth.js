import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { clearUser, setLoading, setError } from '../../store/slices/userSlice';
import { authService } from '../services/authService';

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = async () => {
    try {
      dispatch(setLoading(true));
      await authService.logout();
      dispatch(clearUser());
      setIsAuthenticated(false);
      router.push("/login");
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      if (!user) {
        dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return { 
    handleLogout,
    isAuthenticated,
    getCurrentUser: authService.getCurrentUser
  };
}; 
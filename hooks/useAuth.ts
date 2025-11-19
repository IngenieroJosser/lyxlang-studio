// hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { 
  registerUser, 
  loginUser, 
  getCurrentUser, 
  validateToken,
  storeToken,
  removeToken,
} from '@/services/auth-services';
import { LoginData, AuthResponse, UserProfile, RegisterData, AuthUser } from '@/lib/type';

interface UseAuthReturn {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const { valid, user: currentUser } = await validateToken();
      if (valid && currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        removeToken();
      }
    } catch (err: any) {
      setUser(null);
      removeToken();
      console.error('Auth check failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAuth = async (authFunction: () => Promise<AuthResponse>) => {
    setLoading(true);
    clearError();
    try {
      const response = await authFunction();
      storeToken(response.token);
      // Get full user profile after auth
      const fullUser = await getCurrentUser();
      setUser(fullUser);
    } catch (err: any) {
      setError(err.message || 'Error durante la autenticación');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (data: LoginData): Promise<void> => {
    await handleAuth(() => loginUser(data));
  }, [clearError]);

  const register = useCallback(async (data: RegisterData): Promise<void> => {
    await handleAuth(() => registerUser(data));
  }, [clearError]);

  const logout = useCallback(() => {
    setUser(null);
    removeToken();
    setError(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar información del usuario');
      throw err;
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
    clearError,
  };
}
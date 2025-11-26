import { apiRequest } from '@/shared/api';
import { AuthResponse, RegisterData, LoginData, UserProfile } from '@/lib/type';

export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  const userData = { ...data };
  return await apiRequest<AuthResponse>('POST', '/auth/register', userData);
}

export async function loginUser(data: LoginData): Promise<AuthResponse> {
  return await apiRequest<AuthResponse>('POST', '/auth/login', data);
}

export async function getCurrentUser(): Promise<UserProfile> {
  return await apiRequest<UserProfile>('GET', 'auth/profile');
}

export async function validateToken(): Promise<{ valid: boolean; user?: UserProfile }> {
  try {
    const token = getStoredToken();
    
    // Si no hay token, no es válido
    if (!token) {
      return { valid: false };
    }

    const user = await getCurrentUser();
    return { valid: true, user };
  } catch (error: any) {
    
    // Limpiar token inválido
    if (error.message.includes('No autorizado') || 
        error.message.includes('401') ||
        error.message.includes('token') ||
        error.message.includes('jwt')) {
      removeToken();
    }
    
    return { valid: false };
  }
}

export function storeToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
}

export function getStoredToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

export function removeToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
}

export function isAuthenticated(): boolean {
  return !!getStoredToken();
}
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
  return await apiRequest<UserProfile>('GET', '/users/profile');
}

export async function validateToken(): Promise<{ valid: boolean; user?: UserProfile }> {
  try {
    const user = await getCurrentUser();
    return { valid: true, user };
  } catch (error) {
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
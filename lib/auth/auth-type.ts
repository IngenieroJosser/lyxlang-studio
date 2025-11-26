export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface UserProfile extends AuthUser {
  locale?: string;
  timezone?: string;
  plan?: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    maxStorage: string;
    maxProjects: number;
    maxCompilationsPerMonth: number;
    maxCollaboratorsPerProject: number;
    priceMonthly?: number;
    priceYearly?: number;
  };
  organization?: {
    id: string;
    name: string;
    slug: string;
    avatar?: string;
  };
  storageUsed: string;
  compilationsThisMonth: number;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser; // Usa AuthUser en lugar de UserProfile para las respuestas de auth
}

export interface RegisterData {
  email: string;
  name: string;
  password: string;
  avatar?: string;
}

export interface LoginData {
  email: string;
  password: string;
}


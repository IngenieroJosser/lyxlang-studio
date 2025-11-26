import { apiRequest } from '@/shared/api';

export interface Project {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  organizationId?: string;
  slug: string;
  typescriptConfig?: any;
  rootFolderId?: string;
  visibility: 'PRIVATE' | 'PUBLIC' | 'ORGANIZATION';
  createdAt: string;
  updatedAt: string;
  lastOpenedAt?: string;
  owner?: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  organization?: any;
  _count?: {
    files: number;
    folders: number;
    collaborators: number;
  };
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  typescriptConfig?: any;
  visibility?: 'PRIVATE' | 'PUBLIC' | 'ORGANIZATION';
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  typescriptConfig?: any;
  visibility?: 'PRIVATE' | 'PUBLIC' | 'ORGANIZATION';
}

// Obtener todos los proyectos del usuario
export async function getProjects(organizationId?: string): Promise<Project[]> {
  const params = organizationId ? `?organizationId=${organizationId}` : '';
  return await apiRequest<Project[]>('GET', `/projects${params}`);
}

// Obtener un proyecto específico
export async function getProject(projectId: string): Promise<Project> {
  return await apiRequest<Project>('GET', `/projects/${projectId}`);
}

// Crear un nuevo proyecto
export async function createProject(createProjectDto: CreateProjectDto): Promise<Project> {
  // Establecer valor por defecto para visibility
  const projectData = {
    ...createProjectDto,
    visibility: createProjectDto.visibility || 'PRIVATE'
  };
  
  return await apiRequest<Project>('POST', '/projects', projectData);
}

// Actualizar un proyecto
export async function updateProject(projectId: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
  return await apiRequest<Project>('PATCH', `/projects/${projectId}`, updateProjectDto);
}

// Eliminar un proyecto (soft delete)
export async function deleteProject(projectId: string): Promise<{ message: string }> {
  return await apiRequest('DELETE', `/projects/${projectId}`);
}

export interface Project_ {
  id: string;
  name: string;
  description?: string;
  slug: string;
  ownerId: string;
  organizationId?: string;
  visibility: 'PRIVATE' | 'PUBLIC' | 'ORGANIZATION';
  isTemplate: boolean;
  typescriptConfig?: any;
  createdAt: string;
  updatedAt: string;
  lastOpenedAt?: string;
  rootFolder?: any;
  collaborators?: any[];
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
  visibility?: 'PRIVATE' | 'PUBLIC' | 'ORGANIZATION'; // ← Agregar este campo
}

export interface UpdateProjectData extends Partial<CreateProjectDto> {}

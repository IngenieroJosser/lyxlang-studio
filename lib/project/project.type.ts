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

export interface CreateProjectData {
  name: string;
  description?: string;
  visibility?: 'PRIVATE' | 'PUBLIC' | 'ORGANIZATION';
  isTemplate?: boolean;
  typescriptConfig?: any;
}

export interface UpdateProjectData extends Partial<CreateProjectData> {}

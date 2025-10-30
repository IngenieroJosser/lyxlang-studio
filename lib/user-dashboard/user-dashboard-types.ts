export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  locale: string;
  timezone: string;
  planId: string | null;
  plan: Plan | null;
  planExpiresAt: string | null;
  storageUsed: bigint;
  compilationsThisMonth: number;
  organizationId: string | null;
  organization: Organization | null;
  projects: Project[];
  collaboratedProjects: ProjectCollaborators[];
  editorConfig: EditorConfig | null;
  auditLogs: AuditLog[];
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
  deletedAt: string | null;
}

export interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  maxStorage: bigint;
  maxProjects: number;
  maxCompilationsPerMonth: number;
  maxCollaboratorsPerProject: number;
  features: any;
  priceMonthly: number | null;
  priceYearly: number | null;
  isActive: boolean;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  avatar: string | null;
  planId: string | null;
  plan: Plan | null;
  members: User[];
  projects: Project[];
  storageUsed: bigint;
  compilationsThisMonth: number;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  ownerId: string;
  owner: User;
  organizationId: string | null;
  organization: Organization | null;
  collaborators: ProjectCollaborators[];
  files: File[];
  folders: Folder[];
  config: ProjectConfig | null;
  githubSync: GitHubSync | null;
  typescriptConfig: any;
  visibility: 'PRIVATE' | 'PUBLIC' | 'ORGANIZATION';
  isTemplate: boolean;
  snapshots: Snapshot[];
  compilationLogs: CompilationLog[];
  structureCache: any;
  createdAt: string;
  updatedAt: string;
  lastOpenedAt: string | null;
  deletedAt: string | null;
}

export interface ProjectCollaborators {
  id: string;
  projectId: string;
  userId: string;
  role: 'VIEWER' | 'COLLABORATOR' | 'MAINTAINER' | 'OWNER';
  permissions: any;
  invitedBy: string | null;
  invitedAt: string;
  joinedAt: string | null;
  project: Project;
  user: User;
}

export interface File {
  id: string;
  name: string;
  path: string;
  fullPath: string;
  content: string | null;
  storageKey: string | null;
  size: bigint;
  isBinary: boolean;
  isLargeFile: boolean;
  contentHash: string | null;
  projectId: string;
  project: Project;
  folderId: string | null;
  folder: Folder | null;
  history: FileHistory[];
  language: string;
  mimeType: string | null;
  githubSha: string | null;
  syncedWithGitHub: boolean;
  lastCompiledAt: string | null;
  compilationCache: string | null;
  createdAt: string;
  updatedAt: string;
  lastModifiedBy: string | null;
  version: number;
}

export interface Folder {
  id: string;
  name: string;
  path: string;
  materializedPath: string[];
  fullPath: string;
  projectId: string;
  project: Project;
  projectAsRoot: Project | null;
  parentId: string | null;
  parent: Folder | null;
  children: Folder[];
  files: File[];
  fileCount: number;
  totalSize: bigint;
  createdAt: string;
  updatedAt: string;
}

export interface EditorConfig {
  id: string;
  userId: string;
  user: User;
  theme: string | null;
  fontSize: number | null;
  tabSize: number | null;
  wordWrap: boolean | null;
  minimapEnabled: boolean | null;
  lineNumbers: boolean | null;
  keybindings: any;
  typescriptPreferences: any;
}

export interface GitHubSync {
  id: string;
  projectId: string;
  project: Project;
  githubRepoId: number | null;
  githubRepoName: string;
  githubRepoOwner: string;
  githubRepoUrl: string;
  accessToken: string | null;
  refreshToken: string | null;
  webhookId: number | null;
  autoSync: boolean;
  syncBranch: string;
  lastSyncAt: string | null;
  lastSyncStatus: 'PENDING' | 'SYNCING' | 'SUCCESS' | 'ERROR' | 'CONFLICT' | null;
  lastSyncError: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CompilationLog {
  id: string;
  projectId: string;
  project: Project;
  filePath: string;
  success: boolean;
  output: string | null;
  errors: any;
  warnings: any;
  duration: number | null;
  cacheHit: boolean;
  timestamp: string;
  compiledBy: string | null;
}

export interface Snapshot {
  id: string;
  name: string | null;
  description: string | null;
  projectId: string;
  project: Project;
  projectState: any;
  storageKey: string | null;
  createdAt: string;
  createdBy: string;
  version: number | null;
  isAutoSave: boolean;
}

export interface FileHistory {
  id: string;
  fileId: string;
  file: File;
  version: number;
  content: string | null;
  storageKey: string | null;
  contentHash: string | null;
  changeType: 'CREATE' | 'UPDATE' | 'DELETE' | 'RENAME';
  diff: string | null;
  createdAt: string;
  createdBy: string;
  description: string | null;
}

export interface AuditLog {
  id: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  userId: string | null;
  user: User | null;
  userAgent: string | null;
  ipAddress: string | null;
  oldData: any;
  newData: any;
  differences: any;
  createdAt: string;
}

export interface ProjectConfig {
  id: string;
  projectId: string;
  project: Project;
  nodeVersion: string | null;
  packageManager: string | null;
  buildScript: string | null;
  devScript: string | null;
  startScript: string | null;
  testScript: string | null;
  environmentVariables: any;
  editorSettings: any;
  permissions: any;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  progress: number;
  achieved: boolean;
  category: 'productivity' | 'mastery' | 'collaboration' | 'special' | 'storage' | 'github';
  requirements: {
    metric: string;
    current: number;
    target: number;
    unit?: string;
  }[];
}

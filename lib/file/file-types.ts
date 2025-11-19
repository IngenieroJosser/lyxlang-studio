export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path?: string;
  fullPath?: string;
  content?: string;
  children?: FileNode[];
  language?: string;
  size?: string;
  lastModifiedBy?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface CreateFileData {
  name: string;
  path: string;
  content?: string;
  projectId: string;
  folderId?: string;
  language?: string;
}

export interface UpdateFileData extends Partial<CreateFileData> {}

export interface CreateFolderData {
  name: string;
  path: string;
  projectId: string;
  parentId?: string;
  materializedPath?: string[];
}

export interface FileHistory_ {
  id: string;
  fileId: string;
  version: number;
  content?: string;
  changeType: 'CREATE' | 'UPDATE' | 'DELETE' | 'RENAME';
  createdAt: string;
  createdBy: string;
  description?: string;
}
import { apiRequest } from '@/shared/api';

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
  isOpen?: boolean;
  path?: string;
  fullPath?: string;
  language?: string;
  projectId?: string;
  folderId?: string;
  size?: string;
  lastModifiedBy?: string;
  updatedAt?: string;
  createdAt?: string;
}

export interface CreateFileDto {
  projectId: string;
  name: string;
  path: string;
  folderId?: string;
  content?: string;
  language?: string;
}

export interface UpdateFileDto {
  name?: string;
  content?: string;
  path?: string;
  language?: string;
}

export interface CreateFolderDto {
  projectId: string;
  name: string;
  path: string;
  parentId?: string;
}

// Obtener la estructura completa del proyecto
export async function getProjectStructure(projectId: string): Promise<FileNode[]> {
  try {
    console.log('📡 Fetching project structure for:', projectId);
    const structure = await apiRequest<FileNode[]>('GET', `/files/project/${projectId}/structure`);
    console.log('✅ Project structure received:', structure);
    return structure;
  } catch (error: any) {
    console.error('❌ Error fetching project structure:', error);
    
    // Proporcionar estructura por defecto si hay error
    if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
      console.warn('🔄 Using default file structure due to server error');
      return getDefaultFileStructure();
    }
    
    throw error;
  }
}

// Estructura por defecto en caso de error
function getDefaultFileStructure(): FileNode[] {
  return [
    {
      id: 'root',
      name: 'proyecto',
      type: 'folder',
      isOpen: true,
      path: '/',
      children: [
        {
          id: 'src',
          name: 'src',
          type: 'folder',
          isOpen: true,
          path: '/src',
          children: [
            {
              id: 'main-ts',
              name: 'main.ts',
              type: 'file',
              path: '/src/main.ts',
              content: `// Archivo principal TypeScript\nconsole.log("¡Bienvenido a LyxLang Studio!");\n\n// Tu código TypeScript aquí\nclass HolaMundo {\n  constructor(private mensaje: string) {}\n  \n  saludar(): string {\n    return this.mensaje;\n  }\n}\n\nconst saludo = new HolaMundo("¡Hola desde TypeScript!");\nconsole.log(saludo.saludar());`
            }
          ]
        },
        {
          id: 'package-json',
          name: 'package.json',
          type: 'file',
          path: '/package.json',
          content: `{\n  "name": "mi-proyecto",\n  "version": "1.0.0",\n  "description": "Proyecto TypeScript en LyxLang Studio",\n  "main": "dist/main.js",\n  "scripts": {\n    "build": "tsc",\n    "dev": "ts-node src/main.ts"\n  },\n  "dependencies": {},\n  "devDependencies": {\n    "typescript": "^5.0.0"\n  }\n}`
        }
      ]
    }
  ];
}

// Obtener contenido de un archivo específico
export async function getFileContent(fileId: string): Promise<{
  id: string;
  name: string;
  content: string;
  path: string;
  fullPath: string;
  language: string;
  size: string;
  lastModifiedBy: string;
  updatedAt: string;
}> {
  return await apiRequest('GET', `/files/file/${fileId}`);
}

// Crear un nuevo archivo
export async function createFile(createFileDto: CreateFileDto): Promise<FileNode> {
  return await apiRequest<FileNode>('POST', '/files/file', createFileDto);
}

// Actualizar un archivo
export async function updateFile(fileId: string, updateFileDto: UpdateFileDto): Promise<FileNode> {
  return await apiRequest<FileNode>('PATCH', `/files/file/${fileId}`, updateFileDto);
}

// Eliminar un archivo
export async function deleteFile(fileId: string): Promise<{ message: string }> {
  return await apiRequest('DELETE', `/files/file/${fileId}`);
}

// Crear una nueva carpeta
export async function createFolder(createFolderDto: CreateFolderDto): Promise<FileNode> {
  return await apiRequest<FileNode>('POST', '/files/folder', createFolderDto);
}

// Eliminar una carpeta
export async function deleteFolder(folderId: string): Promise<{ message: string }> {
  return await apiRequest('DELETE', `/files/folder/${folderId}`);
}

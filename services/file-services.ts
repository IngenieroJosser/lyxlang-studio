import { apiRequest } from "@/shared/api";
import { FileNode, CreateFileData, UpdateFileData, CreateFolderData, FileHistory_ } from "@/lib/type";

export async function getFileStructure(projectId: string): Promise<FileNode[]> {
  return await apiRequest<FileNode[]>('GET', `/files/project/${projectId}/structure`);
}

export async function createFile(data: CreateFileData): Promise<FileNode> {
  return await apiRequest<FileNode>('POST', '/files/file', data);
}

export async function updateFile(fileId: string, data: UpdateFileData): Promise<FileNode> {
  return await apiRequest<FileNode>('PATCH', `/files/file/${fileId}`, data);
}

export async function getFileContent(fileId: string): Promise<FileNode> {
  return await apiRequest<FileNode>('GET', `/files/file/${fileId}`);
}

export async function deleteFile(fileId: string): Promise<{ message: string }> {
  return await apiRequest<{ message: string }>('DELETE', `/files/file/${fileId}`);
}

export async function createFolder(data: CreateFolderData): Promise<FileNode> {
  return await apiRequest<FileNode>('POST', '/files/folder', data);
}

export async function deleteFolder(folderId: string): Promise<{ message: string }> {
  return await apiRequest<{ message: string }>('DELETE', `/files/folder/${folderId}`);
}

export async function renameFile(fileId: string, newName: string): Promise<FileNode> {
  return await apiRequest<FileNode>('PATCH', `/files/file/${fileId}/rename`, { name: newName });
}

export async function renameFolder(folderId: string, newName: string): Promise<FileNode> {
  return await apiRequest<FileNode>('PATCH', `/files/folder/${folderId}/rename`, { name: newName });
}

export async function getFileHistory(fileId: string, limit?: number): Promise<FileHistory_[]> {
  const query = limit ? `?limit=${limit}` : '';
  return await apiRequest<FileHistory_[]>('GET', `/files/file/${fileId}/history${query}`);
}

export async function restoreFileVersion(fileId: string, version: number): Promise<FileNode> {
  return await apiRequest<FileNode>('POST', `/files/file/${fileId}/restore/${version}`);
}

export async function searchFiles(projectId: string, query: string, fileType?: string): Promise<any[]> {
  const searchQuery = fileType ? `?query=${query}&fileType=${fileType}` : `?query=${query}`;
  return await apiRequest<any[]>('GET', `/files/project/${projectId}/search${searchQuery}`);
}

export async function getRecentFiles(projectId: string, limit: number = 10): Promise<any[]> {
  return await apiRequest<any[]>('GET', `/files/project/${projectId}/recent?limit=${limit}`);
}
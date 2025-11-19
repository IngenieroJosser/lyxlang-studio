import { useState, useCallback, useEffect } from 'react';
import { 
  getFileStructure, 
  createFile, 
  updateFile, 
  deleteFile, 
  createFolder, 
  deleteFolder,
  renameFile,
  renameFolder,
  getFileContent
} from '@/services/file-services';
import { useAuth } from './useAuth';
import { FileNode } from '@/lib/type';

interface UseBackendFilesProps {
  projectId: string;
}

export function useBackendFiles({ projectId }: UseBackendFilesProps) {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadFileStructure = useCallback(async () => {
    if (!projectId || !user) return;
    
    setLoading(true);
    setError(null);
    try {
      const structure = await getFileStructure(projectId);
      setFiles(structure);
    } catch (err: any) {
      setError(err.message || 'Error loading file structure');
      console.error('Error loading file structure:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId, user]);

  const handleCreateFile = useCallback(async (fileData: any) => {
    if (!projectId || !user) return;
    
    try {
      const newFile = await createFile({
        ...fileData,
        projectId
      });
      await loadFileStructure(); // Recargar estructura
      return newFile;
    } catch (err: any) {
      setError(err.message || 'Error creating file');
      throw err;
    }
  }, [projectId, user, loadFileStructure]);

  const handleUpdateFile = useCallback(async (fileId: string, fileData: any) => {
    if (!user) return;
    
    try {
      const updatedFile = await updateFile(fileId, fileData);
      await loadFileStructure(); // Recargar estructura
      return updatedFile;
    } catch (err: any) {
      setError(err.message || 'Error updating file');
      throw err;
    }
  }, [user, loadFileStructure]);

  const handleDeleteFile = useCallback(async (fileId: string) => {
    if (!user) return;
    
    try {
      await deleteFile(fileId);
      await loadFileStructure(); // Recargar estructura
    } catch (err: any) {
      setError(err.message || 'Error deleting file');
      throw err;
    }
  }, [user, loadFileStructure]);

  const handleCreateFolder = useCallback(async (folderData: any) => {
    if (!projectId || !user) return;
    
    try {
      const newFolder = await createFolder({
        ...folderData,
        projectId
      });
      await loadFileStructure(); // Recargar estructura
      return newFolder;
    } catch (err: any) {
      setError(err.message || 'Error creating folder');
      throw err;
    }
  }, [projectId, user, loadFileStructure]);

  const handleDeleteFolder = useCallback(async (folderId: string) => {
    if (!user) return;
    
    try {
      await deleteFolder(folderId);
      await loadFileStructure(); // Recargar estructura
    } catch (err: any) {
      setError(err.message || 'Error deleting folder');
      throw err;
    }
  }, [user, loadFileStructure]);

  const handleRenameFile = useCallback(async (fileId: string, newName: string) => {
    if (!user) return;
    
    try {
      const renamedFile = await renameFile(fileId, newName);
      await loadFileStructure(); // Recargar estructura
      return renamedFile;
    } catch (err: any) {
      setError(err.message || 'Error renaming file');
      throw err;
    }
  }, [user, loadFileStructure]);

  const handleRenameFolder = useCallback(async (folderId: string, newName: string) => {
    if (!user) return;
    
    try {
      const renamedFolder = await renameFolder(folderId, newName);
      await loadFileStructure(); // Recargar estructura
      return renamedFolder;
    } catch (err: any) {
      setError(err.message || 'Error renaming folder');
      throw err;
    }
  }, [user, loadFileStructure]);

  const handleGetFileContent = useCallback(async (fileId: string) => {
    if (!user) return null;
    
    try {
      return await getFileContent(fileId);
    } catch (err: any) {
      setError(err.message || 'Error getting file content');
      throw err;
    }
  }, [user]);

  // Cargar estructura inicial
  useEffect(() => {
    loadFileStructure();
  }, [loadFileStructure]);

  return {
    files,
    loading,
    error,
    actions: {
      createFile: handleCreateFile,
      updateFile: handleUpdateFile,
      deleteFile: handleDeleteFile,
      createFolder: handleCreateFolder,
      deleteFolder: handleDeleteFolder,
      renameFile: handleRenameFile,
      renameFolder: handleRenameFolder,
      getFileContent: handleGetFileContent,
      refresh: loadFileStructure
    }
  };
}
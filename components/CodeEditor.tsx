// components/AdvancedCodeEditor.tsx
'use client';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  FiFolder,
  FiFile,
  FiChevronRight,
  FiChevronDown,
  FiPlus,
  FiTrash2,
  FiSave,
  FiEdit2,
  FiSearch,
  FiPlay,
  FiTerminal,
  FiFolderPlus,
  FiFilePlus,
  FiHome,
  FiCode,
  FiMoon,
  FiSun,
  FiGitBranch,
  FiUser,
  FiMenu,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiAlertTriangle,
  FiInfo,
  FiDownload,
  FiUpload,
  FiPackage,
  FiServer,
  FiCpu,
  FiHardDrive,
  FiLogOut,
  FiFolderMinus
} from 'react-icons/fi';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

// Servicios del backend
import {
  getProjectStructure,
  createFile,
  updateFile,
  deleteFile,
  createFolder,
  deleteFolder,
  getFileContent,
} from '@/services/file-services';
import {
  getProjects,
  createProject,
} from '@/services/project-services';
import { compileCode } from '@/services/compiler-services';

// Carga diferida de Monaco Editor
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-3xl blur-xl bg-blue-500/20 animate-pulse" />
        <div className="relative w-20 h-20 bg-gradient-to-br rounded-3xl flex items-center justify-center shadow-2xl ring-2 ring-white/10">
          <Image 
            src='/lyxlang-lyxlang-studio-with-text-removebg-preview.png'
            alt='Logo de LyxLang Studio'
            width={50}
            height={50}
            className='rounded-4xl object-cover'
          />
        </div>
      </div>
      <div className="relative mb-6">
        <div className="w-16 h-16 border-4 border-blue-400/20 rounded-full" />
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-blue-400 border-r-blue-400/30 border-b-blue-400/30 border-l-blue-400/30 rounded-full animate-spin" />
      </div>
      <div className="text-center space-y-3">
        <h3 className="text-xl font-semibold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          LyxLang Studio
        </h3>
        <p className="text-gray-400 text-sm">Cargando entorno de desarrollo...</p>
        <div className="w-64 h-1.5 bg-gray-700 rounded-full overflow-hidden mt-4">
          <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full animate-shimmer" />
        </div>
      </div>
    </div>
  ),
});

// Interfaces
interface FileNode {
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
}

interface Project {
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
}

interface Tab {
  id: string;
  file: FileNode;
  isDirty: boolean;
  isActive: boolean;
}

// Memoización de componentes
const MemoizedFileIcon = React.memo(({ type }: { type: 'file' | 'folder' }) => (
  type === 'folder' ?
    <FiFolder className="text-blue-400 mr-2 shrink-0" size={16} /> :
    <FiFile className="text-gray-400 mr-4 ml-1 shrink-0" size={14} />
));

const MemoizedChevron = React.memo(({ isOpen }: { isOpen: boolean }) => (
  isOpen ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />
));

// Servicio de compilación TypeScript
class TypeScriptCompiler {
  private ts: any = null;
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    try {
      if (typeof window !== 'undefined' && (window as any).ts) {
        this.ts = (window as any).ts;
        this.initialized = true;
        return;
      }
      await this.loadTypeScriptFromCDN();
    } catch (error) {
      console.error('Error initializing TypeScript compiler:', error);
    }
  }

  private loadTypeScriptFromCDN(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ts) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/typescript@latest/lib/typescript.js';
      script.async = true;

      script.onload = () => {
        this.ts = (window as any).ts;
        this.initialized = true;
        resolve();
      };

      script.onerror = () => {
        reject(new Error('Failed to load TypeScript compiler'));
      };

      document.head.appendChild(script);
    });
  }

  compile(code: string): { success: boolean; output?: string; error?: string } {
    if (!this.ts || !this.initialized) {
      return {
        success: false,
        error: 'TypeScript compiler not initialized'
      };
    }

    try {
      if (code.length > 100000) {
        return {
          success: false,
          error: 'El archivo es demasiado grande para compilar'
        };
      }

      const result = this.ts.transpileModule(code, {
        compilerOptions: {
          target: this.ts.ScriptTarget.ES2020,
          module: this.ts.ModuleKind.ESNext,
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true,
        }
      });

      return {
        success: true,
        output: result.outputText
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Unknown compilation error'
      };
    }
  }
}

// Servicio de ejecución de comandos
class CommandExecutor {
  private fileSystem: FileNode[];
  private setFiles: React.Dispatch<React.SetStateAction<FileNode[]>>;
  private setTerminalOutput: React.Dispatch<React.SetStateAction<string[]>>;
  private commandCache: Map<string, { output: string; icon: React.ReactNode }> = new Map();

  constructor(
    fileSystem: FileNode[],
    setFiles: React.Dispatch<React.SetStateAction<FileNode[]>>,
    setTerminalOutput: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    this.fileSystem = fileSystem;
    this.setFiles = setFiles;
    this.setTerminalOutput = setTerminalOutput;
  }

  private addOutput(message: string, icon?: React.ReactNode) {
    this.setTerminalOutput(prev => {
      const newOutput = [...prev, `${new Date().toLocaleTimeString()} ${icon ? `${icon} ` : ''}${message}`];
      return newOutput.slice(-1000);
    });
  }

  async executeCommand(fullCommand: string): Promise<string> {
    const trimmedCommand = fullCommand.trim();
    if (!trimmedCommand) return '';

    const args = trimmedCommand.split(' ').filter(arg => arg.length > 0);
    const command = args[0].toLowerCase();

    this.addOutput(`$ ${trimmedCommand}`, <FiTerminal className="text-green-400 inline mr-1" size={12} />);

    await new Promise(resolve => setTimeout(resolve, 50));

    try {
      let result: { output: string; icon: React.ReactNode } = { output: '', icon: null };

      if (command === 'npm') {
        result = this.executeNpmCommand(args.slice(1));
      } else if (command === 'git') {
        result = this.executeGitCommand(args.slice(1));
      } else {
        result = this.executeSystemCommand(args);
      }

      if (result.output) {
        const lines = result.output.split('\n');
        for (let i = 0; i < lines.length; i++) {
          this.addOutput(lines[i], result.icon);
          if (i % 5 === 0) await new Promise(resolve => setTimeout(resolve, 0));
        }
      }

      return result.output;
    } catch (error: any) {
      const errorMessage = `Error ejecutando comando: ${error.message}`;
      this.addOutput(errorMessage, <FiAlertCircle className="text-red-400 inline mr-1" size={12} />);
      return errorMessage;
    }
  }

  private executeNpmCommand(args: string[]): { output: string; icon: React.ReactNode } {
    const cacheKey = `npm-${args.join('-')}`;
    if (this.commandCache.has(cacheKey)) {
      return this.commandCache.get(cacheKey)!;
    }

    const command = args[0];
    let result: { output: string; icon: React.ReactNode };

    switch (command) {
      case 'install':
        result = {
          output: args.length === 1
            ? 'Instalando dependencias del package.json...\n Dependencias instaladas correctamente'
            : `Instalando paquete: ${args.slice(1).join(' ')}\n Paquete instalado correctamente`,
          icon: <FiPackage className="text-blue-400 inline mr-1" size={12} />
        };
        break;
      case 'start':
        result = {
          output: 'Iniciando servidor de desarrollo...\n Servidor corriendo en http://localhost:3000',
          icon: <FiServer className="text-green-400 inline mr-1" size={12} />
        };
        break;
      case 'run':
        const script = args[1];
        result = {
          output: `Ejecutando script: ${script}\n Script ejecutado correctamente`,
          icon: <FiPlay className="text-blue-400 inline mr-1" size={12} />
        };
        break;
      default:
        result = {
          output: `Comando npm '${command}' no reconocido`,
          icon: <FiAlertTriangle className="text-red-400 inline mr-1" size={12} />
        };
    }

    this.commandCache.set(cacheKey, result);
    return result;
  }

  private executeGitCommand(args: string[]): { output: string; icon: React.ReactNode } {
    const cacheKey = `git-${args.join('-')}`;
    if (this.commandCache.has(cacheKey)) {
      return this.commandCache.get(cacheKey)!;
    }

    const command = args[0];
    let result: { output: string; icon: React.ReactNode };

    switch (command) {
      case 'init':
        result = {
          output: 'Inicializando repositorio Git...\nRepositorio Git inicializado',
          icon: <FiGitBranch className="text-orange-400 inline mr-1" size={12} />
        };
        break;
      case 'status':
        result = {
          output: 'Estado del repositorio:\n M src/main.ts\n?? nuevo_archivo.ts\n Working tree clean',
          icon: <FiInfo className="text-blue-400 inline mr-1" size={12} />
        };
        break;
      case 'add':
        result = {
          output: args[1] === '.'
            ? 'Añadiendo todos los archivos al staging...\n Archivos añadidos correctamente'
            : `Añadiendo archivo: ${args[1]}\n Archivo añadido al staging`,
          icon: <FiPlus className="text-green-400 inline mr-1" size={12} />
        };
        break;
      case 'commit':
        const message = args.slice(1).join(' ').replace(/-m\s*['"]?/, '').replace(/['"]?$/, '');
        result = {
          output: `Haciendo commit: ${message || "Sin mensaje"}\nCommit realizado correctamente`,
          icon: <FiCheck className="text-green-400 inline mr-1" size={12} />
        };
        break;
      default:
        result = {
          output: `Comando git '${command}' no reconocido`,
          icon: <FiAlertTriangle className="text-red-400 inline mr-1" size={12} />
        };
    }

    this.commandCache.set(cacheKey, result);
    return result;
  }

  private executeSystemCommand(args: string[]): { output: string; icon: React.ReactNode } {
    const cacheKey = `sys-${args.join('-')}`;
    if (this.commandCache.has(cacheKey)) {
      return this.commandCache.get(cacheKey)!;
    }

    const command = args[0];
    let result: { output: string; icon: React.ReactNode };

    switch (command) {
      case 'ls':
        result = {
          output: 'Contenido del directorio:\n src/\n package.json\n README.md\n tsconfig.json',
          icon: <FiFolder className="text-blue-400 inline mr-1" size={12} />
        };
        break;
      case 'pwd':
        result = {
          output: `Directorio actual: ${window.location.pathname}`,
          icon: <FiHardDrive className="text-gray-400 inline mr-1" size={12} />
        };
        break;
      case 'echo':
        result = {
          output: args.slice(1).join(' '),
          icon: <FiFile className="text-gray-400 inline mr-1" size={12} />
        };
        break;
      case 'clear':
        this.setTerminalOutput([]);
        return { output: '', icon: null };
      case 'mkdir':
        result = {
          output: `Creando directorio: ${args[1]}\n Directorio creado correctamente`,
          icon: <FiFolderPlus className="text-green-400 inline mr-1" size={12} />
        };
        break;
      case 'touch':
        result = {
          output: `Creando archivo: ${args[1]}\n Archivo creado correctamente`,
          icon: <FiFilePlus className="text-green-400 inline mr-1" size={12} />
        };
        break;
      default:
        result = {
          output: `Comando '${command}' no encontrado`,
          icon: <FiAlertCircle className="text-red-400 inline mr-1" size={12} />
        };
    }

    this.commandCache.set(cacheKey, result);
    return result;
  }
}

// Componente de pestañas
const TabComponent = React.memo(({
  tab,
  onTabClick,
  onTabClose,
  isActive
}: {
  tab: Tab;
  onTabClick: (tab: Tab) => void;
  onTabClose: (tabId: string) => void;
  isActive: boolean;
}) => {
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTabClose(tab.id);
  };

  return (
    <div
      className={`
        flex items-center gap-2 px-4 py-2 min-w-0 max-w-48 cursor-pointer border-r border-gray-700/50
        transition-all duration-200 group relative
        ${isActive
          ? 'bg-gray-800/80 border-t-2 border-t-blue-400'
          : 'bg-gray-800/40 hover:bg-gray-700/60'
        }
      `}
      onClick={() => onTabClick(tab)}
    >
      {tab.isDirty && (
        <div className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />
      )}

      <FiFile className="text-blue-400 flex-shrink-0" size={14} />

      <span className="text-sm text-gray-200 truncate flex-1">
        {tab.file.name}
      </span>

      <button
        onClick={handleClose}
        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-600/50 rounded transition-all duration-200 flex-shrink-0"
      >
        <FiX size={12} className="text-gray-400 hover:text-white" />
      </button>

      {isActive && (
        <div className="absolute inset-0 bg-blue-500/5 rounded-t pointer-events-none" />
      )}
    </div>
  );
});

// Componente de árbol de archivos
const VirtualizedFileTree = React.memo(({
  nodes,
  selectedFile,
  onFileSelect,
  onToggleFolder,
  onAddNewItem,
  onDeleteItem,
  level = 0
}: {
  nodes: FileNode[];
  selectedFile: FileNode | null;
  onFileSelect: (file: FileNode) => void;
  onToggleFolder: (id: string) => void;
  onAddNewItem: (parentId?: string, type?: 'file' | 'folder') => void;
  onDeleteItem: (id: string) => void;
  level?: number;
}) => {
  return (
    <>
      {nodes.map(node => (
        <FileTreeNode
          key={node.id}
          node={node}
          selectedFile={selectedFile}
          onFileSelect={onFileSelect}
          onToggleFolder={onToggleFolder}
          onAddNewItem={onAddNewItem}
          onDeleteItem={onDeleteItem}
          level={level}
        />
      ))}
    </>
  );
});

const FileTreeNode = React.memo(({
  node,
  selectedFile,
  onFileSelect,
  onToggleFolder,
  onAddNewItem,
  onDeleteItem,
  level = 0
}: {
  node: FileNode;
  selectedFile: FileNode | null;
  onFileSelect: (file: FileNode) => void;
  onToggleFolder: (id: string) => void;
  onAddNewItem: (parentId?: string, type?: 'file' | 'folder') => void;
  onDeleteItem: (id: string) => void;
  level?: number;
}) => {
  return (
    <div className="select-none group">
      <div
        className={`flex items-center px-3 py-2 hover:bg-blue-500/10 cursor-pointer transition-all duration-200 rounded-lg mx-2 border-l-2 ${selectedFile?.id === node.id
          ? 'bg-blue-500/20 border-blue-400'
          : 'border-transparent hover:border-blue-400/30'
          }`}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
      >
        {node.type === 'folder' ? (
          <>
            <button
              onClick={() => onToggleFolder(node.id)}
              className="mr-2 text-blue-400 hover:text-white transition-colors shrink-0"
            >
              <MemoizedChevron isOpen={!!node.isOpen} />
            </button>
            <MemoizedFileIcon type="folder" />
          </>
        ) : (
          <MemoizedFileIcon type="file" />
        )}

        <span
          className="flex-1 text-sm text-gray-200 hover:text-white transition-colors truncate"
          onClick={() => onFileSelect(node)}
        >
          {node.name}
        </span>

        <div className="ml-auto flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => onAddNewItem(node.id, 'file')}
            className="p-1 hover:bg-gray-600/50 rounded transition-colors"
            title="Nuevo archivo"
          >
            <FiFilePlus size={12} className="text-green-400" />
          </button>
          {node.type === 'folder' && (
            <button
              onClick={() => onAddNewItem(node.id, 'folder')}
              className="p-1 hover:bg-gray-600/50 rounded transition-colors"
              title="Nueva carpeta"
            >
              <FiFolderPlus size={12} className="text-yellow-400" />
            </button>
          )}
          <button
            onClick={() => onDeleteItem(node.id)}
            className="p-1 hover:bg-gray-600/50 rounded transition-colors"
            title="Eliminar"
          >
            <FiTrash2 size={12} className="text-red-400" />
          </button>
        </div>
      </div>
      {node.type === 'folder' && node.isOpen && node.children && (
        <div className="animate-fadeIn">
          <VirtualizedFileTree
            nodes={node.children}
            selectedFile={selectedFile}
            onFileSelect={onFileSelect}
            onToggleFolder={onToggleFolder}
            onAddNewItem={onAddNewItem}
            onDeleteItem={onDeleteItem}
            level={level + 1}
          />
        </div>
      )}
    </div>
  );
});

// Hook personalizado para gestión de estado
const useOptimizedState = <T,>(initialState: T) => {
  const [state, setState] = useState(initialState);

  const setOptimizedState = useCallback((newState: T | ((prev: T) => T)) => {
    setState(prev => {
      const nextState = typeof newState === 'function'
        ? (newState as (prev: T) => T)(prev)
        : newState;

      if (JSON.stringify(prev) === JSON.stringify(nextState)) {
        return prev;
      }
      return nextState;
    });
  }, []);

  return [state, setOptimizedState] as const;
};

const AdvancedCodeEditor = () => {
  // Integración con el backend de autenticación
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();

  // Estados principales
  const [files, setFiles] = useOptimizedState<FileNode[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados de pestañas y archivos
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [code, setCode] = useState<string>('');
  const [currentPath, setCurrentPath] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [terminalInput, setTerminalInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Estados de ejecución
  const [isRunning, setIsRunning] = useState(false);
  const [showRunPanel, setShowRunPanel] = useState(false);
  const [runLogs, setRunLogs] = useState<Array<{ level: 'log' | 'warn' | 'error' | 'info'; message: string; time: string }>>([]);
  const workerRef = useRef<Worker | null>(null);

  // Memoización de servicios
  const compiler = useMemo(() => new TypeScriptCompiler(), []);
  const commandExecutor = useMemo(() => new CommandExecutor(files, setFiles, setTerminalOutput), [files, setFiles]);

  const terminalInputRef = useRef<HTMLInputElement>(null);

  // Obtener archivo activo actual
  const activeFile = useMemo(() => {
    const activeTab = tabs.find(tab => tab.id === activeTabId);
    return activeTab?.file || null;
  }, [tabs, activeTabId]);

  // Obtener pestaña activa
  const activeTab = useMemo(() =>
    tabs.find(tab => tab.id === activeTabId) || null,
    [tabs, activeTabId]);

  // Efectos de responsive
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);

      if (width >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize, { passive: true });

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Cargar proyectos al iniciar
  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
    }
  }, [isAuthenticated]);

  // Cargar estructura de archivos cuando se selecciona un proyecto
  useEffect(() => {
    if (currentProject) {
      loadProjectStructure(currentProject.id);
    }
  }, [currentProject]);

  // Funciones para interactuar con el backend
  const loadProjects = async () => {
    try {
      setLoading(true);
      const projectsData = await getProjects();
      setProjects(projectsData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar proyectos');
    } finally {
      setLoading(false);
    }
  };

  const loadProjectStructure = async (projectId: string) => {
    try {
      setLoading(true);
      const structure = await getProjectStructure(projectId);
      setFiles(structure);
    } catch (err: any) {
      setError(err.message || 'Error al cargar la estructura del proyecto');
      // Usar estructura por defecto
      setFiles(getDefaultFileStructure());
    } finally {
      setLoading(false);
    }
  };

  const createNewProject = async () => {
    try {
      setLoading(true);
      const newProject = await createProject({
        name: 'Nuevo Proyecto',
        description: 'Proyecto creado desde LyxLang Studio',
        visibility: 'PRIVATE'
      });
      setCurrentProject(newProject);
      setProjects(prev => [newProject, ...prev]);
    } catch (err: any) {
      setError(err.message || 'Error al crear proyecto');
    } finally {
      setLoading(false);
    }
  };

  const loadFileContent = async (fileId: string): Promise<string> => {
    try {
      const fileContent = await getFileContent(fileId);
      return fileContent.content || '';
    } catch (err: any) {
      setError(err.message || 'Error al cargar el archivo');
      return '';
    }
  };

  const saveFileToBackend = async (fileId: string, content: string) => {
    try {
      await updateFile(fileId, { content });
    } catch (err: any) {
      setError(err.message || 'Error al guardar el archivo');
      throw err;
    }
  };

  const createNewFile = async (projectId: string, parentId?: string, name: string = 'nuevo_archivo.ts') => {
    try {
      const newFile = await createFile({
        projectId,
        name,
        path: '/',
        folderId: parentId,
        content: '// Escribe tu código aquí\nconsole.log("¡Hola Mundo!");',
        language: 'typescript'
      });
      return newFile;
    } catch (err: any) {
      setError(err.message || 'Error al crear archivo');
      throw err;
    }
  };

  const createNewFolder = async (projectId: string, parentId?: string, name: string = 'nueva_carpeta') => {
    try {
      const newFolder = await createFolder({
        projectId,
        name,
        path: '/',
        parentId
      });
      return newFolder;
    } catch (err: any) {
      setError(err.message || 'Error al crear carpeta');
      throw err;
    }
  };

  const deleteFileFromBackend = async (fileId: string) => {
    try {
      await deleteFile(fileId);
    } catch (err: any) {
      setError(err.message || 'Error al eliminar archivo');
      throw err;
    }
  };

  const deleteFolderFromBackend = async (folderId: string) => {
    try {
      await deleteFolder(folderId);
    } catch (err: any) {
      setError(err.message || 'Error al eliminar carpeta');
      throw err;
    }
  };

  // Función para estructura por defecto
  const getDefaultFileStructure = (): FileNode[] => {
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
  };

  // Callbacks para gestión de pestañas
  const openFileInTab = useCallback(async (file: FileNode) => {
    if (file.type !== 'file') return;

    setTabs(prevTabs => {
      const existingTab = prevTabs.find(tab => tab.file.id === file.id);

      if (existingTab) {
        setActiveTabId(existingTab.id);
        setCode(existingTab.file.content || '');
        setCurrentPath(file.path || '');
        return prevTabs;
      }

      const newTab: Tab = {
        id: `tab-${file.id}-${Date.now()}`,
        file: { ...file },
        isDirty: false,
        isActive: true
      };

      const updatedTabs = prevTabs.map(tab => ({ ...tab, isActive: false }));
      updatedTabs.push(newTab);

      setActiveTabId(newTab.id);
      setCode(file.content || '');
      setCurrentPath(file.path || '');

      return updatedTabs;
    });

    // Si el archivo no tiene contenido, cargarlo desde el backend
    if (!file.content && file.id) {
      try {
        const content = await loadFileContent(file.id);
        setCode(content);
        
        // Actualizar el archivo en el estado local
        setFiles(prevFiles => {
          const updateFileContent = (nodes: FileNode[]): FileNode[] => {
            return nodes.map(node => {
              if (node.id === file.id) {
                return { ...node, content };
              }
              if (node.children) {
                return { ...node, children: updateFileContent(node.children) };
              }
              return node;
            });
          };
          return updateFileContent(prevFiles);
        });
      } catch (err) {
        console.error('Error loading file content:', err);
      }
    }
  }, [setFiles]);

  const closeTab = useCallback((tabId: string) => {
    setTabs(prevTabs => {
      const tabIndex = prevTabs.findIndex(tab => tab.id === tabId);
      if (tabIndex === -1) return prevTabs;

      const newTabs = prevTabs.filter(tab => tab.id !== tabId);

      if (tabId === activeTabId) {
        if (newTabs.length > 0) {
          const newActiveTab = tabIndex < newTabs.length
            ? newTabs[tabIndex]
            : newTabs[newTabs.length - 1];

          setActiveTabId(newActiveTab.id);
          setCode(newActiveTab.file.content || '');
          setCurrentPath(newActiveTab.file.path || '');
        } else {
          setActiveTabId(null);
          setCode('');
          setCurrentPath('');
        }
      }

      return newTabs;
    });
  }, [activeTabId]);

  const switchTab = useCallback((tab: Tab) => {
    setActiveTabId(tab.id);
    setCode(tab.file.content || '');
    setCurrentPath(tab.file.path || '');

    setTabs(prevTabs =>
      prevTabs.map(t => ({
        ...t,
        isActive: t.id === tab.id
      }))
    );
  }, []);

  const markTabAsDirty = useCallback((tabId: string, isDirty: boolean) => {
    setTabs(prevTabs =>
      prevTabs.map(tab =>
        tab.id === tabId ? { ...tab, isDirty } : tab
      )
    );
  }, []);

  // Callbacks para gestión de archivos
  const toggleFolder = useCallback((id: string) => {
    setFiles(prevFiles => {
      const updateNode = (nodes: FileNode[]): FileNode[] => {
        return nodes.map(node => {
          if (node.id === id) {
            return { ...node, isOpen: !node.isOpen };
          }
          if (node.children) {
            return { ...node, children: updateNode(node.children) };
          }
          return node;
        });
      };
      return updateNode(prevFiles);
    });
  }, [setFiles]);

  const handleFileSelect = useCallback((file: FileNode) => {
    if (file.type === 'file') {
      openFileInTab(file);
      if (isMobile) {
        setSidebarOpen(false);
      }
    } else {
      toggleFolder(file.id);
    }
  }, [isMobile, openFileInTab, toggleFolder]);

  const addNewItem = useCallback(async (parentId?: string, type: 'file' | 'folder' = 'file') => {
    if (!currentProject) {
      setError('Selecciona un proyecto primero');
      return;
    }

    try {
      let newItem: FileNode;

      if (type === 'file') {
        newItem = await createNewFile(currentProject.id, parentId);
      } else {
        newItem = await createNewFolder(currentProject.id, parentId);
      }

      // Actualizar estado local
      setFiles(prevFiles => {
        const addNode = (nodes: FileNode[]): FileNode[] => {
          return nodes.map(node => {
            if (node.id === parentId || (!parentId && node.type === 'folder')) {
              const newChildren = [...(node.children || []), newItem];
              return {
                ...node,
                children: newChildren,
                isOpen: true
              };
            }
            if (node.children) {
              return { ...node, children: addNode(node.children) };
            }
            return node;
          });
        };
        return addNode(prevFiles);
      });
    } catch (err) {
      // Error ya manejado en la función
    }
  }, [currentProject, setFiles]);

  const deleteItem = useCallback(async (id: string) => {
    const itemToDelete = findItemById(files, id);
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === 'file') {
        await deleteFileFromBackend(id);
      } else {
        await deleteFolderFromBackend(id);
      }

      // Actualizar estado local
      setFiles(prevFiles => {
        const removeNode = (nodes: FileNode[]): FileNode[] => {
          return nodes.filter(node => {
            if (node.id === id) return false;
            if (node.children) {
              node.children = removeNode(node.children);
            }
            return true;
          });
        };
        return removeNode(prevFiles);
      });

      // Cerrar pestaña si está abierta
      const tabToClose = tabs.find(tab => tab.file.id === id);
      if (tabToClose) {
        closeTab(tabToClose.id);
      }
    } catch (err) {
      // Error ya manejado en la función
    }
  }, [files, tabs, closeTab, setFiles]);

  // Función auxiliar para buscar item por ID
  const findItemById = (nodes: FileNode[], id: string): FileNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findItemById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Callbacks para terminal
  const executeTerminalCommand = useCallback(async (command: string) => {
    if (!command.trim()) return;

    setTerminalInput('');
    await commandExecutor.executeCommand(command);

    setTimeout(() => {
      terminalInputRef.current?.focus();
    }, 100);
  }, [commandExecutor]);

  const handleTerminalKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeTerminalCommand(terminalInput);
    }
  }, [executeTerminalCommand, terminalInput]);

  const clearTerminal = useCallback(() => {
    setTerminalOutput([]);
  }, []);

  // Callbacks para editor
  const handleEditorChange = useCallback((value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);

    if (activeTab && activeTab.file.content !== newCode) {
      markTabAsDirty(activeTab.id, true);
    }
  }, [activeTab, markTabAsDirty]);

  const handleEditorMount = useCallback((editor: any, monaco: any) => {
    try {
      monaco.editor.defineTheme('lyx-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#0f172a',
          'editor.foreground': '#e5e7eb',
          'editor.lineHighlightBackground': '#1e293b55',
          'editorLineNumber.foreground': '#94a3b8',
          'editorGutter.background': '#0f172a',
          'editorCursor.foreground': '#93c5fd',
          'editor.selectionBackground': '#2563eb40',
          'editor.inactiveSelectionBackground': '#2563eb20',
          'editorWhitespace.foreground': '#475569',
          'scrollbarSlider.background': '#33415580',
          'scrollbarSlider.hoverBackground': '#47556999',
          'scrollbarSlider.activeBackground': '#64748b99',
          'minimap.background': '#0f172a',
        },
      });
      monaco.editor.setTheme('lyx-dark');
    } catch (e) {
      // noop if monaco not ready
    }
  }, []);

  // Callbacks para ejecución
  const appendRunLog = useCallback((level: 'log' | 'warn' | 'error' | 'info', message: string) => {
    setRunLogs(prev => [...prev, { level, message, time: new Date().toLocaleTimeString() }].slice(-500));
  }, []);

  const stopRun = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    setIsRunning(false);
    appendRunLog('info', 'Ejecución detenida');
  }, [appendRunLog]);

  const clearRun = useCallback(() => {
    setRunLogs([]);
  }, []);

  const runCode = useCallback(async () => {
    if (!activeFile || !currentProject) return;
    setShowRunPanel(true);
    setIsRunning(true);
    clearRun();

    try {
      // Usar compilación del backend
      const result = await compileCode(currentProject.id, {
        code,
        filePath: activeFile.path || activeFile.name
      });

      if (!result.success) {
        setIsRunning(false);
        appendRunLog('error', result.error || 'Error de compilación desconocido');
        return;
      }

      // Ejecutar el código compilado en un worker
      const workerSource = `
        const send = (level, args) => {
          try { postMessage({ type: 'log', level, message: args.map(a => {
            try { return (typeof a === 'object' && a !== null) ? JSON.stringify(a) : String(a); }
            catch(e){ return String(a); }
          }).join(' ') }); } catch(e) {}
        };
        console.log = (...args) => send('log', args);
        console.info = (...args) => send('info', args);
        console.warn = (...args) => send('warn', args);
        console.error = (...args) => send('error', args);
        self.onmessage = (ev) => {
          if (ev.data && ev.data.type === 'exec') {
            const code = ev.data.payload;
            try {
              const fn = new Function(code);
              fn();
              postMessage({ type: 'done' });
            } catch (err) {
              postMessage({ type: 'log', level: 'error', message: (err && err.stack) ? String(err.stack) : String(err) });
              postMessage({ type: 'done' });
            }
          }
        };
      `;

      const blob = new Blob([workerSource], { type: 'application/javascript' });
      const worker = new Worker(URL.createObjectURL(blob));
      workerRef.current = worker;

      const timeoutId = setTimeout(() => {
        try { worker.terminate(); } catch { }
        workerRef.current = null;
        appendRunLog('warn', 'Tiempo de ejecución agotado (3s)');
        setIsRunning(false);
      }, 3000);

      worker.onmessage = (ev: MessageEvent) => {
        const data: any = ev.data;
        if (data?.type === 'log') {
          appendRunLog(data.level || 'log', data.message);
        } else if (data?.type === 'done') {
          clearTimeout(timeoutId);
          try { worker.terminate(); } catch { }
          workerRef.current = null;
          setIsRunning(false);
          appendRunLog('info', 'Ejecución finalizada');
        }
      };

      worker.onerror = (e) => {
        clearTimeout(timeoutId);
        appendRunLog('error', e.message || 'Error en ejecución');
        try { worker.terminate(); } catch { }
        workerRef.current = null;
        setIsRunning(false);
      };

      worker.postMessage({ type: 'exec', payload: result.output });
    } catch (err: any) {
      setIsRunning(false);
      appendRunLog('error', err?.message || 'Fallo al ejecutar');
    }
  }, [appendRunLog, clearRun, code, activeFile, currentProject]);

  const saveFile = useCallback(async () => {
    if (!activeTab || !currentProject) return;

    try {
      await saveFileToBackend(activeTab.file.id, code);

      // Actualizar estado local
      setFiles(prevFiles => {
        const updateFileContent = (nodes: FileNode[]): FileNode[] => {
          return nodes.map(node => {
            if (node.id === activeTab.file.id) {
              return { ...node, content: code };
            }
            if (node.children) {
              return { ...node, children: updateFileContent(node.children) };
            }
            return node;
          });
        };
        return updateFileContent(prevFiles);
      });

      setTabs(prevTabs =>
        prevTabs.map(tab =>
          tab.id === activeTab.id
            ? {
              ...tab,
              file: { ...tab.file, content: code },
              isDirty: false
            }
            : tab
        )
      );

      if (activeFile) {
        setCurrentPath(activeFile.path || '');
      }
    } catch (err) {
      // Error ya manejado en saveFileToBackend
    }
  }, [activeTab, activeFile, code, currentProject, setFiles]);

  // Inicializar compilador
  useEffect(() => {
    compiler.initialize().catch(() => { });
  }, [compiler]);

  // Filtrado de archivos
  const filteredFiles = useMemo(() => {
    if (!searchTerm) return files;

    const filterNodes = (nodes: FileNode[]): FileNode[] => {
      return nodes.filter(node => {
        if (node.name.toLowerCase().includes(searchTerm.toLowerCase())) return true;
        if (node.children) {
          const filteredChildren = filterNodes(node.children);
          return filteredChildren.length > 0;
        }
        return false;
      });
    };

    return filterNodes(files);
  }, [files, searchTerm]);

  const lineCount = useMemo(() => (code ? code.split('\n').length : 0), [code]);

  // Si está cargando la autenticación, mostrar loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar mensaje
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center p-8 bg-gray-800/80 rounded-2xl border border-gray-700/80 backdrop-blur-lg">
          <div className="mb-6">
            <Image
              src="/lyxlang-lyxlang-studio-with-text-removebg-preview.png"
              alt="LyxLang Studio"
              width={120}
              height={40}
              className="mx-auto"
            />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Acceso Requerido</h2>
          <p className="text-gray-300 mb-6">Debes iniciar sesión para usar LyxLang Studio</p>
          <button
            onClick={() => window.location.href = '/iniciar-sesion'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Ir a Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  // Si no hay proyecto seleccionado, mostrar selector de proyectos
  if (!currentProject) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Image
                src="/lyxlang-lyxlang-studio-with-text-removebg-preview.png"
                alt="LyxLang Studio"
                width={160}
                height={50}
                className="mx-auto"
              />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">LyxLang Studio</h1>
            <p className="text-gray-400">Selecciona un proyecto para comenzar</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center space-x-3">
              <FiAlertCircle className="text-red-400 flex-shrink-0" size={20} />
              <p className="text-red-300 flex-1">{error}</p>
              <button onClick={() => setError(null)}>
                <FiX className="text-red-400 hover:text-red-300" size={16} />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {projects.map(project => (
              <div
                key={project.id}
                className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 cursor-pointer group hover:bg-gray-800/70"
                onClick={() => setCurrentProject(project)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <FiFolderMinus className="text-blue-400 group-hover:text-blue-300" size={24} />
                  <h3 className="text-white font-semibold truncate">{project.name}</h3>
                </div>
                <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                  {project.description || 'Sin descripción'}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Creado: {new Date(project.createdAt).toLocaleDateString()}</span>
                  <span>{project.slug}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={createNewProject}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creando proyecto...
                </>
              ) : (
                <>
                  <FiPlus size={20} />
                  Nuevo Proyecto
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
      {/* Sidebar */}
      <div className={`
        fixed lg:relative z-50 h-full bg-gray-800/95 backdrop-blur-lg border-r border-gray-700/80 flex flex-col shadow-2xl transition-all duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-80 lg:w-72
      `}>
        <div className="p-4 border-b border-gray-700/80 bg-gradient-to-r from-gray-800 to-gray-700/40">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl blur-md bg-blue-500/20" />
                <Image
                  src="/favicon.ico"
                  alt="LyxLang logo"
                  width={32}
                  height={32}
                  className="relative object-cover rounded-2xl ring-1 ring-white/10"
                  loading="eager"
                />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white tracking-wide">EXPLORADOR</h2>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-400 truncate max-w-[120px]">{currentProject.name}</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-400/20">BETA</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 hover:bg-gray-700/70 rounded-lg transition-colors border border-white/5"
                title="Tema"
              >
                {darkMode ? <FiSun size={16} className="text-yellow-400" /> : <FiMoon size={16} className="text-blue-400" />}
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-gray-700/70 rounded-lg transition-colors border border-white/5"
                title="Ocultar"
              >
                <FiX size={16} />
              </button>
            </div>
          </div>

          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Buscar archivos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900/70 border border-gray-700/70 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-3">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
            </div>
          ) : (
            <VirtualizedFileTree
              nodes={filteredFiles}
              selectedFile={activeFile}
              onFileSelect={handleFileSelect}
              onToggleFolder={toggleFolder}
              onAddNewItem={addNewItem}
              onDeleteItem={deleteItem}
            />
          )}
        </div>

        {/* Información del usuario en el sidebar */}
        <div className="p-4 border-t border-gray-700/80 bg-gray-800/60">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <FiUser className="text-white" size={16} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400 hover:text-red-300"
              title="Cerrar sesión"
            >
              <FiLogOut size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Área principal */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Header */}
        <div className="bg-gray-800/80 backdrop-blur-lg border-b border-gray-700/80 px-4 lg:px-6 py-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 lg:space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-700/70 rounded-lg transition-colors border border-white/5"
              >
                <FiMenu size={18} />
              </button>
              <div className="flex items-center text-sm text-gray-300 bg-gray-700/50 px-3 py-1 rounded-lg max-w-[200px] lg:max-w-none border border-white/5">
                <FiHome className="mr-2 shrink-0" size={14} />
                <span className="font-mono text-xs truncate">{currentPath || `/${currentProject.name}`}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 lg:space-x-2">
              <button
                onClick={saveFile}
                disabled={!activeTab?.isDirty}
                className={`flex items-center px-2 lg:px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border border-white/5 ${activeTab?.isDirty
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-500/25'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
              >
                <FiSave className="mr-1 lg:mr-1.5 shrink-0" size={14} />
                <span className="hidden sm:inline">Guardar</span>
              </button>
              <button
                onClick={isRunning ? stopRun : runCode}
                disabled={!activeFile}
                className={`flex items-center px-2 lg:px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border border-white/5 ${activeFile
                  ? isRunning
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-red-500/25'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
              >
                <FiPlay className={`mr-1 lg:mr-1.5 shrink-0 ${isRunning ? 'rotate-90' : ''}`} size={14} />
                <span className="hidden sm:inline">{isRunning ? 'Detener' : 'Ejecutar'}</span>
              </button>
              <button
                onClick={() => setTerminalOpen(!terminalOpen)}
                className={`p-2 rounded-lg transition-colors border border-white/5 ${terminalOpen ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-gray-700/70'}`}
              >
                <FiTerminal size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Barra de pestañas */}
        {tabs.length > 0 && (
          <div className="bg-gray-800/60 border-b border-gray-700/80 flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            <div className="flex min-w-0 flex-1">
              {tabs.map((tab) => (
                <TabComponent
                  key={tab.id}
                  tab={tab}
                  onTabClick={switchTab}
                  onTabClose={closeTab}
                  isActive={tab.id === activeTabId}
                />
              ))}
            </div>
          </div>
        )}

        {/* Editor */}
        <div className="flex-1 flex min-h-0 p-2 lg:p-4">
          {activeFile ? (
            <div className="flex-1 flex bg-gray-900 rounded-2xl border border-gray-700/80 shadow-2xl overflow-hidden">
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700/70 bg-gray-800/60">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_2px_rgba(96,165,250,0.5)]" />
                    <span className="text-sm text-gray-200 truncate max-w-[40vw] lg:max-w-[50vw]">{activeFile?.name}</span>
                    {activeTab?.isDirty && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-300 border border-yellow-400/20">
                        Sin guardar
                      </span>
                    )}
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-400/20 hidden sm:inline">TypeScript</span>
                  </div>
                </div>
                <MonacoEditor
                  height="100%"
                  language="typescript"
                  theme="lyx-dark"
                  value={code}
                  onChange={handleEditorChange}
                  onMount={handleEditorMount}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 12,
                    fontFamily: `Tinos, 'Space Mono', 'Courier New', monospace`,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    insertSpaces: true,
                    renderLineHighlight: 'none',
                    renderControlCharacters: false,
                    renderWhitespace: 'none',
                    occurrencesHighlight: 'off',
                    selectionHighlight: false,
                    suggestOnTriggerCharacters: false,
                    quickSuggestions: false,
                    parameterHints: { enabled: false },
                    bracketPairColorization: { enabled: false },
                    guides: { bracketPairs: false },
                    overviewRulerBorder: false,
                    hideCursorInOverviewRuler: true,
                  }}
                  loading={<div className="flex items-center justify-center h-full">Cargando editor...</div>}
                />
                <div className="flex items-center justify-between text-[11px] text-gray-400 px-3 py-2 border-t border-gray-700/70 bg-gray-800/60">
                  <div className="flex items-center gap-4">
                    <span>Ln {lineCount}</span>
                    <span>UTF-8</span>
                    <span>LF</span>
                    <span>TS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Tema</span>
                    <span className="text-blue-300">lyx-dark</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
              <div className="relative group text-center w-full max-w-4xl p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-slate-900/95 to-slate-800/90 border border-slate-700/60 rounded-xl backdrop-blur-2xl shadow-2xl transition-all duration-500">

                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 blur-xl transition-all duration-700"></div>

                <div className="relative mb-6 lg:mb-8">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                    LyxLang Studio
                  </h1>
                  <p className="text-slate-400 text-sm sm:text-base">Bienvenido, {user?.name}</p>
                </div>

                <div className="hidden lg:block">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">

                    <div className="space-y-4">
                      <h3 className="text-slate-300 font-semibold text-lg border-b border-slate-700 pb-2">Proyecto</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 group/item">
                          <div className="w-4 h-4 rounded border border-slate-600"></div>
                          <span className="text-slate-300 group-hover/item:text-white transition-colors text-sm">Proyecto actual: {currentProject.name}</span>
                        </div>
                        <div className="flex items-center gap-3 group/item">
                          <div className="w-4 h-4 rounded border border-slate-600"></div>
                          <span className="text-slate-300 group-hover/item:text-white transition-colors text-sm">Abrir archivo existente</span>
                        </div>
                        <div className="flex items-center gap-3 group/item">
                          <div className="w-4 h-4 rounded border border-slate-600"></div>
                          <span className="text-slate-300 group-hover/item:text-white transition-colors text-sm">Crear nuevo archivo</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-slate-300 font-semibold text-lg border-b border-slate-700 pb-2">Acciones Rápidas</h3>
                      <div className="space-y-3">
                        {[
                          "Ejecutar código (Ctrl+Enter)",
                          "Guardar archivo (Ctrl+S)",
                          "Abrir terminal (Ctrl+`)",
                          "Buscar en archivos (Ctrl+Shift+F)"
                        ].map((action, index) => (
                          <div key={index} className="flex items-center gap-3 group/item">
                            <div className="w-4 h-4 rounded border border-slate-600"></div>
                            <span className="text-slate-300 group-hover/item:text-white transition-colors text-sm">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-slate-300 font-semibold text-lg border-b border-slate-700 pb-2">Estadísticas</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 group/item">
                          <div className="w-4 h-4 rounded border border-slate-600"></div>
                          <span className="text-slate-300 group-hover/item:text-white transition-colors text-sm">Archivos abiertos: {tabs.length}</span>
                        </div>
                        <div className="flex items-center gap-3 group/item">
                          <div className="w-4 h-4 rounded border border-slate-600"></div>
                          <span className="text-slate-300 group-hover/item:text-white transition-colors text-sm">Proyecto: {currentProject.name}</span>
                        </div>
                        <div className="flex items-center gap-3 group/item">
                          <div className="w-4 h-4 rounded border border-slate-600"></div>
                          <span className="text-slate-300 group-hover/item:text-white transition-colors text-sm">Usuario: {user?.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-700/50">
                    <div className="flex items-center justify-center gap-6 text-slate-500 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>Listo</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiCode className="text-slate-400" />
                        <span>TypeScript</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>Conectado</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:hidden text-center space-y-4 mt-6">
                  <div className="text-slate-300 text-sm">
                    Abre un archivo para comenzar a programar
                  </div>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => addNewItem()}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <FiFilePlus size={16} />
                      Nuevo archivo
                    </button>
                    <button
                      onClick={() => addNewItem(undefined, 'folder')}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <FiFolderPlus size={16} />
                      Nueva carpeta
                    </button>
                  </div>
                  <div className="text-slate-500 text-xs mt-4">
                    Usa el menú lateral para navegar por los archivos
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Terminal */}
        {terminalOpen && (
          <div className="bg-gray-900 border-t border-gray-700 backdrop-blur-lg transition-all duration-300 flex flex-col shrink-0 h-64">
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800/90 border-b border-gray-700/80 shrink-0">
                <div className="flex items-center space-x-2">
                  <FiTerminal className="text-blue-400" size={14} />
                  <span className="text-sm font-medium text-white">TERMINAL</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={clearTerminal}
                    className="px-2 py-1 text-xs rounded-md border border-white/5 hover:bg-gray-700/70 text-gray-300"
                  >
                    Limpiar
                  </button>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto text-xs lg:text-sm bg-gray-900 min-h-0 terminal-output">
                {terminalOutput.slice(-100).map((line, index) => (
                  <div key={index} className="mb-1 text-gray-200">
                    {line}
                  </div>
                ))}

                <div className="flex items-center text-gray-300 font-mono mt-2">
                  <span className="text-green-400 mr-2">$</span>
                  <input
                    ref={terminalInputRef}
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    onKeyPress={handleTerminalKeyPress}
                    className="flex-1 bg-transparent border-none outline-none text-gray-100"
                    placeholder="Escribe un comando..."
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Panel de ejecución */}
        {showRunPanel && (
          <div className="bg-gray-900/95 border-t border-gray-700/80 backdrop-blur-lg transition-all duration-300 flex flex-col shrink-0">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800/90 border-b border-gray-700/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="text-sm font-medium text-white">EJECUCIÓN</span>
                {isRunning && <span className="text-xs text-blue-300">Corriendo…</span>}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearRun}
                  className="px-2 py-1 text-xs rounded-md border border-white/5 hover:bg-gray-700/70 text-gray-300"
                >
                  Limpiar
                </button>
                <button
                  onClick={() => setShowRunPanel(false)}
                  className="px-2 py-1 text-xs rounded-md border border-white/5 hover:bg-gray-700/70 text-gray-300"
                >
                  Ocultar
                </button>
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto p-3 text-xs lg:text-sm space-y-1">
              {runLogs.length === 0 && (
                <div className="text-gray-500">No hay salida aún. Ejecuta el archivo seleccionado.</div>
              )}
              {runLogs.map((l, i) => (
                <div key={i} className="font-mono">
                  <span className="text-gray-500 mr-2">{l.time}</span>
                  <span className={
                    l.level === 'error' ? 'text-red-300' : l.level === 'warn' ? 'text-yellow-300' : l.level === 'info' ? 'text-blue-300' : 'text-gray-200'
                  }>
                    {l.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(AdvancedCodeEditor);

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
  FiSettings,
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
  FiRefreshCw,
  FiPackage,
  FiServer,
  FiCpu,
  FiHardDrive
} from 'react-icons/fi';
import Image from 'next/image';
// Prism removed: not used and breaks SSR prerender

// Carga diferida de Monaco Editor con configuración optimizada
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-gray-400">Cargando editor...</div>
    </div>
  )
});

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
  isOpen?: boolean;
  path?: string;
}

// Memoización de componentes para evitar re-renders innecesarios
const MemoizedFileIcon = React.memo(({ type }: { type: 'file' | 'folder' }) => (
  type === 'folder' ? 
    <FiFolder className="text-blue-400 mr-2 shrink-0" size={16} /> : 
    <FiFile className="text-gray-400 mr-4 ml-1 shrink-0" size={14} />
));

const MemoizedChevron = React.memo(({ isOpen }: { isOpen: boolean }) => (
  isOpen ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />
));

// Servicio de compilación TypeScript con lazy loading
class TypeScriptCompiler {
  private ts: any = null;
  private initialized = false;
  private initializationPromise: Promise<void> | null = null;

  async initialize() {
    if (this.initialized) return;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = this.loadTypeScript();
    await this.initializationPromise;
  }

  private async loadTypeScript(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      if (!(window as any).ts) {
        return this.initializeWithScript();
      }
      this.ts = (window as any).ts;
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing TypeScript compiler:', error);
    }
  }

  private initializeWithScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/typescript@latest/lib/typescript.js';
      script.async = true;
      
      script.onload = () => {
        this.ts = (window as any).ts;
        this.initialized = true;
        resolve();
      };
      
      script.onerror = reject;
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
      // Limitar el tamaño del código a compilar
      if (code.length > 100000) { // 100KB límite
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

// Servicio de ejecución de comandos optimizado
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
    // Limitar el tamaño del output de la terminal
    this.setTerminalOutput(prev => {
      const newOutput = [...prev, `${new Date().toLocaleTimeString()} ${icon ? `${icon} ` : ''}${message}`];
      // Mantener máximo 1000 líneas en la terminal
      return newOutput.slice(-1000);
    });
  }

  private findFile(path: string): FileNode | null {
    const search = (nodes: FileNode[], currentPath: string): FileNode | null => {
      for (const node of nodes) {
        if (node.path === currentPath) return node;
        if (node.children) {
          const found = search(node.children, currentPath);
          if (found) return found;
        }
      }
      return null;
    };
    return search(this.fileSystem, path);
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
        if (args.length === 1) {
          result = {
            output: 'Instalando dependencias del package.json...\n Dependencias instaladas correctamente',
            icon: <FiPackage className="text-blue-400 inline mr-1" size={12} />
          };
        } else {
          result = {
            output: `Instalando paquete: ${args.slice(1).join(' ')}\n Paquete instalado correctamente`,
            icon: <FiPackage className="text-blue-400 inline mr-1" size={12} />
          };
        }
        break;
      
      case 'start':
        result = {
          output: 'Iniciando servidor de desarrollo...\n Servidor corriendo en http://localhost:3000',
          icon: <FiServer className="text-green-400 inline mr-1" size={12} />
        };
        break;
      
      case 'run':
        const script = args[1];
        switch (script) {
          case 'dev':
            result = {
              output: 'Ejecutando script dev...\n Servidor de desarrollo iniciado',
              icon: <FiPlay className="text-green-400 inline mr-1" size={12} />
            };
            break;
          case 'build':
            result = {
              output: 'Ejecutando build...\n Build completado exitosamente',
              icon: <FiCpu className="text-yellow-400 inline mr-1" size={12} />
            };
            break;
          case 'test':
            result = {
              output: 'Ejecutando tests...\n Todos los tests pasaron',
              icon: <FiCheck className="text-green-400 inline mr-1" size={12} />
            };
            break;
          default:
            result = {
              output: `Ejecutando script: ${script}\n Script ejecutado correctamente`,
              icon: <FiPlay className="text-blue-400 inline mr-1" size={12} />
            };
        }
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
        if (args[1] === '.') {
          result = {
            output: 'Añadiendo todos los archivos al staging...\n Archivos añadidos correctamente',
            icon: <FiPlus className="text-green-400 inline mr-1" size={12} />
          };
        } else {
          result = {
            output: `Añadiendo archivo: ${args[1]}\n Archivo añadido al staging`,
            icon: <FiPlus className="text-green-400 inline mr-1" size={12} />
          };
        }
        break;
      
      case 'commit':
        const message = args.slice(1).join(' ').replace(/-m\s*['"]?/, '').replace(/['"]?$/, '');
        result = {
          output: `Haciendo commit: ${message || "Sin mensaje"}\nCommit realizado correctamente`,
          icon: <FiCheck className="text-green-400 inline mr-1" size={12} />
        };
        break;
      
      case 'push':
        result = {
          output: 'Enviendo cambios al repositorio remoto...\n Cambios enviados correctamente',
          icon: <FiUpload className="text-blue-400 inline mr-1" size={12} />
        };
        break;
      
      case 'pull':
        result = {
          output: 'Obteniendo cambios del repositorio remoto...\n Cambios obtenidos correctamente',
          icon: <FiDownload className="text-blue-400 inline mr-1" size={12} />
        };
        break;
      
      case 'branch':
        result = {
          output: 'Ramas disponibles:\n* main\n  development\n  feature/nueva-funcionalidad',
          icon: <FiGitBranch className="text-purple-400 inline mr-1" size={12} />
        };
        break;
      
      case 'checkout':
        result = {
          output: `Cambiando a rama: ${args[1]}\n Cambio de rama exitoso`,
          icon: <FiGitBranch className="text-yellow-400 inline mr-1" size={12} />
        };
        break;
      
      case 'clone':
        result = {
          output: `Clonando repositorio: ${args[1]}\n Repositorio clonado correctamente`,
          icon: <FiDownload className="text-green-400 inline mr-1" size={12} />
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
      
      case 'cat':
        if (args[1]) {
          const file = this.findFile(args[1]);
          result = {
            output: file?.content || `Archivo no encontrado: ${args[1]}`,
            icon: <FiFile className="text-blue-400 inline mr-1" size={12} />
          };
        } else {
          result = {
            output: 'Especifica un archivo para mostrar',
            icon: <FiAlertCircle className="text-yellow-400 inline mr-1" size={12} />
          };
        }
        break;
      
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
      
      case 'rm':
        result = {
          output: `Eliminando: ${args[1]}\n Eliminado correctamente`,
          icon: <FiTrash2 className="text-red-400 inline mr-1" size={12} />
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

  async executeCommand(fullCommand: string): Promise<string> {
    const trimmedCommand = fullCommand.trim();
    if (!trimmedCommand) return '';

    const args = trimmedCommand.split(' ').filter(arg => arg.length > 0);
    const command = args[0].toLowerCase();

    this.addOutput(`$ ${trimmedCommand}`, <FiTerminal className="text-green-400 inline mr-1" size={12} />);

    // Debounce para comandos rápidos
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
        // Procesar en lote para mejor rendimiento
        for (let i = 0; i < lines.length; i++) {
          this.addOutput(lines[i], result.icon);
          // Pequeño delay para no bloquear la UI
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
}

// Componente de árbol de archivos virtualizado para mejor rendimiento
const VirtualizedFileTree = React.memo(({ 
  nodes, 
  selectedFile, 
  onFileSelect, 
  onToggleFolder,
  onStartRename,
  onAddNewItem,
  onDeleteItem,
  level = 0 
}: {
  nodes: FileNode[];
  selectedFile: FileNode | null;
  onFileSelect: (file: FileNode) => void;
  onToggleFolder: (id: string) => void;
  onStartRename: (node: FileNode) => void;
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
          onStartRename={onStartRename}
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
  onStartRename,
  onAddNewItem,
  onDeleteItem,
  level = 0
}: {
  node: FileNode;
  selectedFile: FileNode | null;
  onFileSelect: (file: FileNode) => void;
  onToggleFolder: (id: string) => void;
  onStartRename: (node: FileNode) => void;
  onAddNewItem: (parentId?: string, type?: 'file' | 'folder') => void;
  onDeleteItem: (id: string) => void;
  level?: number;
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');

  const handleRename = useCallback(() => {
    onStartRename(node);
    setIsRenaming(true);
    setRenameValue(node.name);
  }, [node, onStartRename]);

  const handleSaveRename = useCallback(() => {
    // Implementar rename
    setIsRenaming(false);
  }, []);

  return (
    <div className="select-none group">
      <div
        className={`flex items-center px-3 py-2 hover:bg-blue-500/10 cursor-pointer transition-all duration-200 rounded-lg mx-2 border-l-2 ${
          selectedFile?.id === node.id
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

        {/* Contenido del nodo */}
        <span
          className="flex-1 text-sm text-gray-200 hover:text-white transition-colors truncate"
          onClick={() => onFileSelect(node)}
          onDoubleClick={handleRename}
        >
          {node.name}
        </span>

        <div className="ml-auto flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={handleRename}
            className="p-1 hover:bg-gray-600/50 rounded transition-colors"
            title="Renombrar"
          >
            <FiEdit2 size={12} className="text-gray-400" />
          </button>
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
            onStartRename={onStartRename}
            onAddNewItem={onAddNewItem}
            onDeleteItem={onDeleteItem}
            level={level + 1}
          />
        </div>
      )}
    </div>
  );
});

// Hook personalizado para gestión de estado optimizada
const useOptimizedState = <T,>(initialState: T) => {
  const [state, setState] = useState(initialState);
  
  const setOptimizedState = useCallback((newState: T | ((prev: T) => T)) => {
    setState(prev => {
      const nextState = typeof newState === 'function' 
        ? (newState as (prev: T) => T)(prev) 
        : newState;
      
      // Evitar re-renders si el estado es igual
      if (JSON.stringify(prev) === JSON.stringify(nextState)) {
        return prev;
      }
      return nextState;
    });
  }, []);

  return [state, setOptimizedState] as const;
};

const AdvancedCodeEditor = () => {
  // Estados optimizados
  const [files, setFiles] = useOptimizedState<FileNode[]>([
    {
      id: '1',
      name: 'proyecto',
      type: 'folder',
      isOpen: true,
      path: '/proyecto',
      children: [
        {
          id: '2',
          name: 'src',
          type: 'folder',
          isOpen: true,
          path: '/proyecto/src',
          children: [
            {
              id: '3',
              name: 'main.ts',
              type: 'file',
              content: `// Aplicación principal TypeScript
interface User {
  name: string;
  age: number;
}

class Greeter {
  constructor(private user: User) {}

  greet(): string {
    return \`Hello, \${this.user.name}! You are \${this.user.age} years old.\`;
  }
}

const user: User = { name: "John", age: 25 };
const greeter = new Greeter(user);
console.log(greeter.greet());

// Función con tipos genéricos
function identity<T>(arg: T): T {
  return arg;
}

const result = identity<string>("TypeScript is awesome!");
console.log(result);`
            },
            {
              id: '4',
              name: 'utils.ts',
              type: 'file',
              content: `// Utilidades TypeScript
export const add = (a: number, b: number): number => a + b;

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('es-ES');
};

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url);
  const data = await response.json();
  
  return {
    data,
    status: response.status,
    message: 'Success'
  };
}`
            }
          ]
        },
        {
          id: '5',
          name: 'package.json',
          type: 'file',
          content: `{
  "name": "mi-proyecto-typescript",
  "version": "1.0.0",
  "description": "Un proyecto TypeScript con características modernas",
  "main": "dist/main.js",
  "scripts": {
    "build": "tsc",
    "dev": "ts-node src/main.ts",
    "test": "jest"
  },
  "dependencies": {
    "typescript": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0"
  }
}`
        }
      ]
    }
  ]);

  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [code, setCode] = useState<string>('');
  const [currentPath, setCurrentPath] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [terminalInput, setTerminalInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [terminalHeight, setTerminalHeight] = useState(300);
  const [isResizing, setIsResizing] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const lineCount = useMemo(() => (code ? code.split('\n').length : 0), [code]);

  // Estado de ejecución
  const [isRunning, setIsRunning] = useState(false);
  const [showRunPanel, setShowRunPanel] = useState(false);
  const [runLogs, setRunLogs] = useState<Array<{ level: 'log' | 'warn' | 'error' | 'info'; message: string; time: string }>>([]);
  const workerRef = useRef<Worker | null>(null);

  // Memoización de valores costosos
  const compiler = useMemo(() => new TypeScriptCompiler(), []);
  const commandExecutor = useMemo(() => new CommandExecutor(files, setFiles, setTerminalOutput), [files, setFiles]);

  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInputRef = useRef<HTMLInputElement>(null);
  const globalSearchRef = useRef<HTMLInputElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  // Throttle para eventos de resize
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      
      if (width >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkScreenSize, 100);
    };

    checkScreenSize();
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Debounce para búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Lógica de búsqueda optimizada
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Callbacks memoizados para evitar re-renders
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
      setSelectedFile(file);
      setCode(file.content || '');
      setCurrentPath(file.path || '');
      if (isMobile) {
        setSidebarOpen(false);
      }
    } else {
      toggleFolder(file.id);
    }
  }, [isMobile, toggleFolder]);

  const addNewItem = useCallback((parentId?: string, type: 'file' | 'folder' = 'file') => {
    const newItem: FileNode = {
      id: Date.now().toString(),
      name: type === 'file' ? 'nuevo_archivo.ts' : 'nueva_carpeta',
      type,
      content: type === 'file' ? '// Escribe tu código aquí\nconsole.log("¡Hola Mundo!");' : '',
      children: type === 'folder' ? [] : undefined,
      isOpen: true
    };

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
  }, [setFiles]);

  const deleteItem = useCallback((id: string) => {
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
    
    if (selectedFile?.id === id) {
      setSelectedFile(null);
      setCode('');
      setCurrentPath('');
    }
  }, [selectedFile, setFiles]);

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

  // Filtrado memoizado de archivos
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

  // Determinar el ancho del minimap basado en el dispositivo
  const getMinimapWidth = useCallback(() => {
    if (isMobile) return '0px';
    if (isTablet) return '24px';
    return '32px';
  }, [isMobile, isTablet]);

  const handleEditorChange = useCallback((value: string | undefined) => {
    setCode(value || '');
  }, []);

  const handleEditorMount = useCallback((editor: any, monaco: any) => {
    try {
      // Define custom theme to match site background
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

  const clearTerminal = useCallback(() => {
    setTerminalOutput([]);
  }, []);

  // Inicializar compilador en cliente
  useEffect(() => {
    compiler.initialize().catch(() => {});
  }, [compiler]);

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
    if (!selectedFile) return;
    setShowRunPanel(true);
    setIsRunning(true);
    clearRun();

    try {
      const result = compiler.compile(code);
      if (!result.success || !result.output) {
        setIsRunning(false);
        appendRunLog('error', result.error || 'Error de compilación desconocido');
        return;
      }

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
        try { worker.terminate(); } catch {}
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
          try { worker.terminate(); } catch {}
          workerRef.current = null;
          setIsRunning(false);
          appendRunLog('info', 'Ejecución finalizada');
        }
      };

      worker.onerror = (e) => {
        clearTimeout(timeoutId);
        appendRunLog('error', e.message || 'Error en ejecución');
        try { worker.terminate(); } catch {}
        workerRef.current = null;
        setIsRunning(false);
      };

      worker.postMessage({ type: 'exec', payload: result.output });
    } catch (err: any) {
      setIsRunning(false);
      appendRunLog('error', err?.message || 'Fallo al ejecutar');
    }
  }, [appendRunLog, clearRun, code, compiler, selectedFile]);

  const saveFile = useCallback(() => {
    if (!selectedFile) return;

    setFiles(prevFiles => {
      const updateFileContent = (nodes: FileNode[]): FileNode[] => {
        return nodes.map(node => {
          if (node.id === selectedFile.id) {
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
    
    setSelectedFile(prev => prev ? { ...prev, content: code } : null);
  }, [selectedFile, code, setFiles]);

  const compileCode = useCallback(async () => {
    if (!selectedFile) return;

    try {
      const result = compiler.compile(code);
      // Lógica de compilación...
    } catch (error) {
      console.error('Error compiling:', error);
    }
  }, [selectedFile, code, compiler]);

  return (
    <div className="flex h-screen bg-linear-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
      {/* Estilos optimizados */}
      <style jsx global>{`
        /* Estilos críticos inline, el resto cargar via CSS */
        .editor-background {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%) !important;
        }
        
        /* Virtual scrolling para la terminal */
        .terminal-output {
          contain: strict;
          will-change: transform;
        }
      `}</style>

      {/* Sidebar optimizado */}
      <div className={`
        fixed lg:relative z-50 h-full bg-gray-800/95 backdrop-blur-lg border-r border-gray-700/80 flex flex-col shadow-2xl transition-all duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-80 lg:w-72
      `}>
        <div className="p-4 border-b border-gray-700/80 bg-linear-to-r from-gray-800 to-gray-700/40">
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
                  <p className="text-xs text-gray-400">Proyecto Activo</p>
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
          <VirtualizedFileTree
            nodes={filteredFiles}
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
            onToggleFolder={toggleFolder}
            onStartRename={() => {}}
            onAddNewItem={addNewItem}
            onDeleteItem={deleteItem}
          />
        </div>
      </div>

      {/* Área principal optimizada */}
      <div className="flex-1 flex flex-col min-w-0 h-full editor-background">
        {/* Header optimizado */}
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
                <span className="font-mono text-xs truncate">{currentPath || '/proyecto'}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 lg:space-x-2">
              <button
                onClick={saveFile}
                className="flex items-center px-2 lg:px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-green-500/25 border border-white/5"
              >
                <FiSave className="mr-1 lg:mr-1.5 shrink-0" size={14} />
                <span className="hidden sm:inline">Guardar</span>
              </button>
              <button
                onClick={isRunning ? stopRun : runCode}
                className={`flex items-center px-2 lg:px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border border-white/5 ${isRunning ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-red-500/25' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25'}`}
                title={isRunning ? 'Detener ejecución' : 'Ejecutar'}
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

        {/* Editor con configuración optimizada */}
        <div className="flex-1 flex min-h-0 p-2 lg:p-4">
          {selectedFile ? (
            <div className="flex-1 flex bg-gray-900 rounded-2xl border border-gray-700/80 shadow-2xl overflow-hidden">
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700/70 bg-gray-800/60">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_2px_rgba(96,165,250,0.5)]" />
                    <span className="text-sm text-gray-200 truncate max-w-[40vw] lg:max-w-[50vw]">{selectedFile?.name}</span>
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
                    minimap: { enabled: false } as { enabled: boolean },
                    fontSize: 12,
                    fontFamily: `Tinos, 'Space Mono', 'Courier New', monospace`,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    insertSpaces: true,
                    // Optimizaciones de rendimiento
                    renderLineHighlight: 'none',
                    renderControlCharacters: false,
                    renderWhitespace: 'none',
                    occurrencesHighlight: 'off',
                    selectionHighlight: false,
                    // Configuración corregida para sugerencias
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
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md w-full p-6 lg:p-8 bg-gray-800/50 rounded-2xl border border-gray-700 backdrop-blur-lg">
                <FiCode className="text-3xl text-blue-400 mb-4 mx-auto" />
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">Editor de Código</h3>
                <p className="text-gray-400 mb-6">Selecciona un archivo para empezar</p>
              </div>
            </div>
          )}
        </div>

        {/* Terminal optimizada */}
        {terminalOpen && (
          <div
            ref={terminalRef}
            className="bg-gray-900 border-t border-gray-700 backdrop-blur-lg transition-all duration-300 flex flex-col shrink-0"
            style={{ height: `${terminalHeight}px` }}
          >
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
              
              <div
                ref={terminalRef}
                className="flex-1 p-4 overflow-y-auto text-xs lg:text-sm bg-gray-900 min-h-0 terminal-output"
              >
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
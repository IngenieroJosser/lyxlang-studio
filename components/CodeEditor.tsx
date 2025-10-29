'use client';
import React, { useState, useEffect, useRef } from 'react';
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
  FiCopy,
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
  FiX
} from 'react-icons/fi';
import Image from 'next/image';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-tomorrow.css';

// Carga dinámica de Monaco Editor para evitar problemas de SSR
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

// Servicio de compilación TypeScript
class TypeScriptCompiler {
  private ts: any = null;
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    try {
      if (typeof window !== 'undefined' && !(window as any).ts) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/typescript@latest/lib/typescript.js';
        script.async = true;
        document.head.appendChild(script);

        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      this.ts = (window as any).ts;
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing TypeScript compiler:', error);
    }
  }

  compile(code: string): { success: boolean; output?: string; error?: string } {
    if (!this.ts || !this.initialized) {
      return {
        success: false,
        error: 'TypeScript compiler not initialized'
      };
    }

    try {
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

  constructor(
    fileSystem: FileNode[], 
    setFiles: React.Dispatch<React.SetStateAction<FileNode[]>>,
    setTerminalOutput: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    this.fileSystem = fileSystem;
    this.setFiles = setFiles;
    this.setTerminalOutput = setTerminalOutput;
  }

  private addOutput(message: string) {
    this.setTerminalOutput(prev => [...prev, `${new Date().toLocaleTimeString()} ${message}`]);
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

  private executeNpmCommand(args: string[]): string {
    const command = args[0];
    
    switch (command) {
      case 'install':
        if (args.length === 1) {
          return 'Instalando dependencias del package.json...\n Dependencias instaladas correctamente';
        } else {
          return `Instalando paquete: ${args.slice(1).join(' ')}\n Paquete instalado correctamente`;
        }
      
      case 'start':
        return 'Iniciando servidor de desarrollo...\n Servidor corriendo en http://localhost:3000';
      
      case 'run':
        const script = args[1];
        switch (script) {
          case 'dev':
            return 'Ejecutando script dev...\n Servidor de desarrollo iniciado';
          case 'build':
            return 'Ejecutando build...\n Build completado exitosamente';
          case 'test':
            return 'Ejecutando tests...\n Todos los tests pasaron';
          default:
            return `Ejecutando script: ${script}\n Script ejecutado correctamente`;
        }
      
      case 'init':
        return 'Inicializando proyecto npm...\n package.json creado exitosamente';
      
      case 'update':
        return 'Actualizando dependencias...\n Dependencias actualizadas correctamente';
      
      case 'audit':
        return 'Realizando auditoría de seguridad...\n No se encontraron vulnerabilidades';
      
      default:
        return `Comando npm '${command}' no reconocido`;
    }
  }

  private executeGitCommand(args: string[]): string {
    const command = args[0];
    
    switch (command) {
      case 'init':
        return 'Inicializando repositorio Git...\nRepositorio Git inicializado';
      
      case 'status':
        return 'Estado del repositorio:\n M src/main.ts\n?? nuevo_archivo.ts\n Working tree clean';
      
      case 'add':
        if (args[1] === '.') {
          return 'Añadiendo todos los archivos al staging...\n Archivos añadidos correctamente';
        } else {
          return `Añadiendo archivo: ${args[1]}\n Archivo añadido al staging`;
        }
      
      case 'commit':
        const message = args.slice(1).join(' ').replace(/-m\s*['"]?/, '').replace(/['"]?$/, '');
        return `Haciendo commit: ${message || "Sin mensaje"}\nCommit realizado correctamente`;
      
      case 'push':
        return 'Enviando cambios al repositorio remoto...\n Cambios enviados correctamente';
      
      case 'pull':
        return 'Obteniendo cambios del repositorio remoto...\n Cambios obtenidos correctamente';
      
      case 'branch':
        return 'Ramas disponibles:\n* main\n  development\n  feature/nueva-funcionalidad';
      
      case 'checkout':
        return `Cambiando a rama: ${args[1]}\n Cambio de rama exitoso`;
      
      case 'clone':
        return `Clonando repositorio: ${args[1]}\n Repositorio clonado correctamente`;
      
      default:
        return `Comando git '${command}' no reconocido`;
    }
  }

  private executeSystemCommand(args: string[]): string {
    const command = args[0];
    
    switch (command) {
      case 'ls':
        return 'Contenido del directorio:\n src/\n package.json\n README.md\n tsconfig.json';
      
      case 'pwd':
        return `Directorio actual: ${window.location.pathname}`;
      
      case 'echo':
        return args.slice(1).join(' ');
      
      case 'clear':
        this.setTerminalOutput([]);
        return '';
      
      case 'cat':
        if (args[1]) {
          const file = this.findFile(args[1]);
          return file?.content || `Archivo no encontrado: ${args[1]}`;
        }
        return 'Especifica un archivo para mostrar';
      
      case 'mkdir':
        return `Creando directorio: ${args[1]}\n Directorio creado correctamente`;
      
      case 'touch':
        return `Creando archivo: ${args[1]}\n Archivo creado correctamente`;
      
      case 'rm':
        return `Eliminando: ${args[1]}\n Eliminado correctamente`;
      
      default:
        return `Comando '${command}' no encontrado`;
    }
  }

  async executeCommand(fullCommand: string): Promise<string> {
    const trimmedCommand = fullCommand.trim();
    if (!trimmedCommand) return '';

    const args = trimmedCommand.split(' ').filter(arg => arg.length > 0);
    const command = args[0].toLowerCase();

    this.addOutput(`$ ${trimmedCommand}`);

    // Pequeño delay para simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      let output = '';

      // Comandos npm
      if (command === 'npm') {
        output = this.executeNpmCommand(args.slice(1));
      }
      // Comandos git
      else if (command === 'git') {
        output = this.executeGitCommand(args.slice(1));
      }
      // Comandos del sistema
      else {
        output = this.executeSystemCommand(args);
      }

      if (output) {
        const lines = output.split('\n');
        lines.forEach(line => this.addOutput(line));
      }

      return output;
    } catch (error: any) {
      const errorMessage = `Error ejecutando comando: ${error.message}`;
      this.addOutput(errorMessage);
      return errorMessage;
    }
  }
}

// Componente de resaltado de sintaxis con PrismJS
const CodeHighlighter = ({ code, language }: { code: string; language: string }) => {
  const highlightedCode = React.useMemo(() => {
    if (!code) return '';

    try {
      const grammar = Prism.languages[language] || Prism.languages.typescript;
      return Prism.highlight(code, grammar, language);
    } catch (error) {
      return code;
    }
  }, [code, language]);

  return (
    <pre
      className="text-sm leading-6 whitespace-pre text-gray-100 prism-highlight"
      style={{ fontFamily: 'var(--font-mono, "Fira Code", monospace)' }}
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
    />
  );
};

// Componente para el minimap con PrismJS
const CodeMinimap = ({ code, scrollTop, scrollLeft, onScrollClick, language }: {
  code: string;
  scrollTop: number;
  scrollLeft: number;
  onScrollClick: (percentageX: number, percentageY: number) => void;
  language: string;
}) => {
  const minimapRef = useRef<HTMLDivElement>(null);

  const highlightedCode = React.useMemo(() => {
    if (!code) return '';

    try {
      const grammar = Prism.languages[language] || Prism.languages.typescript;
      return Prism.highlight(code, grammar, language);
    } catch (error) {
      return code;
    }
  }, [code, language]);

  const handleClick = (e: React.MouseEvent) => {
    if (!minimapRef.current) return;

    const rect = minimapRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const percentageX = clickX / rect.width;
    const percentageY = clickY / rect.height;
    onScrollClick(percentageX, percentageY);
  };

  return (
    <div
      ref={minimapRef}
      className="w-full h-full bg-gray-800/30 overflow-hidden cursor-pointer relative border-l border-gray-600"
      onClick={handleClick}
    >
      <div
        className="absolute inset-0 text-[2px] leading-px whitespace-pre prism-highlight"
        style={{ fontFamily: 'var(--font-mono, "Fira Code", monospace)' }}
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
      {/* Indicador de área visible */}
      <div
        className="absolute bg-blue-500/30 border border-blue-400/50 transition-all duration-100"
        style={{
          top: `${(scrollTop / (minimapRef.current?.scrollHeight || 1)) * 100}%`,
          left: `${(scrollLeft / (minimapRef.current?.scrollWidth || 1)) * 100}%`,
          width: '100%',
          height: '30%'
        }}
      />
    </div>
  );
};

const AdvancedCodeEditor = () => {
  const [files, setFiles] = useState<FileNode[]>([
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
  const [isRenaming, setIsRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [compiler] = useState(() => new TypeScriptCompiler());
  const [commandExecutor] = useState(() => new CommandExecutor(files, setFiles, setTerminalOutput));

  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInputRef = useRef<HTMLInputElement>(null);
  const globalSearchRef = useRef<HTMLInputElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  // Inicializar el compilador
  useEffect(() => {
    compiler.initialize();
  }, [compiler]);

  // Detectar cambios en el tamaño de la pantalla
  useEffect(() => {
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

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Persistir configuración en localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('editor-darkMode');
    const savedTerminalHeight = localStorage.getItem('editor-terminalHeight');
    
    if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
    if (savedTerminalHeight) setTerminalHeight(JSON.parse(savedTerminalHeight));
  }, []);

  // Guardar configuración en localStorage
  useEffect(() => {
    localStorage.setItem('editor-darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('editor-terminalHeight', JSON.stringify(terminalHeight));
  }, [terminalHeight]);

  // Auto-scroll de la terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  // Focus en input de terminal cuando se abre
  useEffect(() => {
    if (terminalOpen && terminalInputRef.current) {
      setTimeout(() => {
        terminalInputRef.current?.focus();
      }, 100);
    }
  }, [terminalOpen]);

  // Efecto para los atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        setShowGlobalSearch(true);
        setTimeout(() => globalSearchRef.current?.focus(), 100);
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setSidebarOpen(prev => !prev);
      }

      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        setTerminalOpen(prev => !prev);
      }

      if (e.key === 'Escape' && showGlobalSearch) {
        setShowGlobalSearch(false);
      }

      // Guardar con Ctrl+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveFile();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showGlobalSearch, selectedFile, code]);

  // Efecto para el redimensionamiento de la terminal
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newHeight = window.innerHeight - e.clientY;
      if (newHeight > 100 && newHeight < window.innerHeight - 200) {
        setTerminalHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  useEffect(() => {
    if (selectedFile) {
      setCode(selectedFile.content || '');
      setCurrentPath(selectedFile.path || '');
      setScrollTop(0);
      setScrollLeft(0);
    }
  }, [selectedFile]);

  const getLanguageFromFileName = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts': return 'typescript';
      case 'js': return 'javascript';
      case 'json': return 'json';
      case 'html': return 'html';
      case 'css': return 'css';
      default: return 'typescript';
    }
  };

  // Manejar cambios en el editor Monaco
  const handleEditorChange = (value: string | undefined) => {
    setCode(value || '');
  };

  // Manejar clic en el minimap para navegación
  const handleMinimapScroll = (percentageX: number, percentageY: number) => {
    // Esta función se manejará internamente por Monaco
  };

  const toggleFolder = (id: string) => {
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
    setFiles(updateNode(files));
  };

  const handleFileSelect = (file: FileNode) => {
    if (file.type === 'file') {
      setSelectedFile(file);
      if (isMobile) {
        setSidebarOpen(false);
      }
    } else {
      toggleFolder(file.id);
    }
  };

  const addNewItem = (parentId?: string, type: 'file' | 'folder' = 'file') => {
    const newItem: FileNode = {
      id: Date.now().toString(),
      name: type === 'file' ? 'nuevo_archivo.ts' : 'nueva_carpeta',
      type,
      content: type === 'file' ? '// Escribe tu código aquí\nconsole.log("¡Hola Mundo!");' : '',
      children: type === 'folder' ? [] : undefined,
      isOpen: true
    };

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

    setFiles(addNode(files));

    if (type === 'file') {
      setTimeout(() => {
        const findNewFile = (nodes: FileNode[]): FileNode | null => {
          for (const node of nodes) {
            if (node.id === newItem.id) return node;
            if (node.children) {
              const found = findNewFile(node.children);
              if (found) return found;
            }
          }
          return null;
        };
        const newFile = findNewFile(files);
        if (newFile) setSelectedFile(newFile);
      }, 100);
    }
  };

  const startRename = (node: FileNode) => {
    setIsRenaming(node.id);
    setRenameValue(node.name);
  };

  const saveRename = (id: string) => {
    const updateNodeName = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === id) {
          return { ...node, name: renameValue };
        }
        if (node.children) {
          return { ...node, children: updateNodeName(node.children) };
        }
        return node;
      });
    };
    setFiles(updateNodeName(files));
    setIsRenaming(null);
    setRenameValue('');
  };

  const cancelRename = () => {
    setIsRenaming(null);
    setRenameValue('');
  };

  const saveFile = () => {
    if (!selectedFile) return;

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

    setFiles(updateFileContent(files));
    setSelectedFile({ ...selectedFile, content: code });
    addTerminalOutput('📁 Archivo guardado correctamente');
  };

  const deleteItem = (id: string) => {
    const removeNode = (nodes: FileNode[]): FileNode[] => {
      return nodes.filter(node => {
        if (node.id === id) return false;
        if (node.children) {
          node.children = removeNode(node.children);
        }
        return true;
      });
    };
    setFiles(removeNode(files));
    if (selectedFile?.id === id) {
      setSelectedFile(null);
      setCode('');
      setCurrentPath('');
    }
  };

  const compileCode = async () => {
    if (!selectedFile) return;

    addTerminalOutput('🔨 Compilando código TypeScript...');

    try {
      const result = compiler.compile(code);

      if (result.success && result.output) {
        addTerminalOutput('✅ Compilación completada exitosamente');
        addTerminalOutput('📦 Código JavaScript generado:');
        addTerminalOutput(result.output);

        // Ejecutar el código compilado
        try {
          addTerminalOutput('🚀 Ejecutando código...');
          const consoleLog = console.log;
          const capturedOutput: string[] = [];
          console.log = (...args: any[]) => {
            const output = args.map(arg =>
              typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' ');
            capturedOutput.push(output);
            addTerminalOutput(`📝 ${output}`);
          };

          eval(result.output);

          console.log = consoleLog;

          if (capturedOutput.length === 0) {
            addTerminalOutput('ℹ️ El código se ejecutó sin salida en la consola');
          }
        } catch (execError: any) {
          addTerminalOutput(`❌ Error durante la ejecución: ${execError.message}`);
        }
      } else {
        addTerminalOutput(`❌ Error de compilación: ${result.error}`);
      }
    } catch (error: any) {
      addTerminalOutput(`💥 Error inesperado: ${error.message}`);
    }

    setTerminalOpen(true);
  };

  const addTerminalOutput = (message: string) => {
    setTerminalOutput(prev => [...prev, `${new Date().toLocaleTimeString()} ${message}`]);
  };

  // Ejecutar comandos en la terminal
  const executeTerminalCommand = async (command: string) => {
    if (!command.trim()) return;

    setTerminalInput('');
    await commandExecutor.executeCommand(command);
    
    // Focus de vuelta al input
    setTimeout(() => {
      terminalInputRef.current?.focus();
    }, 100);
  };

  const handleTerminalKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeTerminalCommand(terminalInput);
    }
  };

  const filteredFiles = (nodes: FileNode[]): FileNode[] => {
    if (!searchTerm) return nodes;

    return nodes.filter(node => {
      if (node.name.toLowerCase().includes(searchTerm.toLowerCase())) return true;
      if (node.children) {
        node.children = filteredFiles(node.children);
        return node.children.length > 0;
      }
      return false;
    });
  };

  const renderFileTree = (nodes: FileNode[], level = 0) => {
    return filteredFiles(nodes).map(node => (
      <div key={node.id} className="select-none group">
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
                onClick={() => toggleFolder(node.id)}
                className="mr-2 text-blue-400 hover:text-white transition-colors shrink-0"
              >
                {node.isOpen ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
              </button>
              <FiFolder className="text-blue-400 mr-2 shrink-0" size={16} />
            </>
          ) : (
            <FiFile className="text-gray-400 mr-4 ml-1 shrink-0" size={14} />
          )}

          {isRenaming === node.id ? (
            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveRename(node.id);
                if (e.key === 'Escape') cancelRename();
              }}
              onBlur={cancelRename}
              className="flex-1 bg-gray-700/50 text-white px-2 py-1 rounded text-sm border border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              autoFocus
            />
          ) : (
            <span
              className="flex-1 text-sm text-gray-200 hover:text-white transition-colors truncate"
              onClick={() => handleFileSelect(node)}
              onDoubleClick={() => startRename(node)}
            >
              {node.name}
            </span>
          )}

          <div className="ml-auto flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={() => startRename(node)}
              className="p-1 hover:bg-gray-600/50 rounded transition-colors"
              title="Renombrar"
            >
              <FiEdit2 size={12} className="text-gray-400" />
            </button>
            <button
              onClick={() => addNewItem(node.id, 'file')}
              className="p-1 hover:bg-gray-600/50 rounded transition-colors"
              title="Nuevo archivo"
            >
              <FiFilePlus size={12} className="text-green-400" />
            </button>
            {node.type === 'folder' && (
              <button
                onClick={() => addNewItem(node.id, 'folder')}
                className="p-1 hover:bg-gray-600/50 rounded transition-colors"
                title="Nueva carpeta"
              >
                <FiFolderPlus size={12} className="text-yellow-400" />
              </button>
            )}
            <button
              onClick={() => deleteItem(node.id)}
              className="p-1 hover:bg-gray-600/50 rounded transition-colors"
              title="Eliminar"
            >
              <FiTrash2 size={12} className="text-red-400" />
            </button>
          </div>
        </div>
        {node.type === 'folder' && node.isOpen && node.children && (
          <div className="animate-fadeIn">{renderFileTree(node.children, level + 1)}</div>
        )}
      </div>
    ));
  };

  // Determinar el ancho del minimap basado en el dispositivo
  const getMinimapWidth = () => {
    if (isMobile) return '0px'; // Ocultar en móvil
    if (isTablet) return '24px'; // Más estrecho en tablet
    return '32px'; // Ancho normal en desktop
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
      {/* Estilos personalizados */}
      <style jsx global>{`
        /* Personalización del scrollbar */
        ::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.1);
          border-radius: 2px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.4);
          border-radius: 2px;
          transition: all 0.2s ease;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.6);
        }

        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(100, 116, 139, 0.4) rgba(15, 23, 42, 0.1);
        }

        /* Estilos para PrismJS */
        .prism-highlight {
          color: #f8f8f2;
          background: transparent !important;
        }

        .prism-highlight .token.comment,
        .prism-highlight .token.prolog,
        .prism-highlight .token.doctype,
        .prism-highlight .token.cdata {
          color: #6a9955;
        }

        .prism-highlight .token.punctuation {
          color: #d4d4d4;
        }

        .prism-highlight .token.property,
        .prism-highlight .token.tag,
        .prism-highlight .token.constant,
        .prism-highlight .token.symbol,
        .prism-highlight .token.deleted {
          color: #f44747;
        }

        .prism-highlight .token.boolean,
        .prism-highlight .token.number {
          color: #b5cea8;
        }

        .prism-highlight .token.selector,
        .prism-highlight .token.attr-name,
        .prism-highlight .token.string,
        .prism-highlight .token.char,
        .prism-highlight .token.builtin,
        .prism-highlight .token.inserted {
          color: #ce9178;
        }

        .prism-highlight .token.operator,
        .prism-highlight .token.entity,
        .prism-highlight .token.url,
        .prism-highlight .language-css .token.string,
        .prism-highlight .style .token.string,
        .prism-highlight .token.variable {
          color: #d4d4d4;
        }

        .prism-highlight .token.atrule,
        .prism-highlight .token.attr-value,
        .prism-highlight .token.function,
        .prism-highlight .token.class-name {
          color: #dcdcaa;
        }

        .prism-highlight .token.keyword {
          color: #569cd6;
        }

        .prism-highlight .token.regex,
        .prism-highlight .token.important {
          color: #d16969;
        }

        /* Estilos para la terminal con tipografía del sitio */
        .terminal-output {
          font-family: var(--font-family, 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif) !important;
          line-height: 1.5;
          letter-spacing: -0.01em;
        }

        /* Tema personalizado para Monaco Editor con fondo persistente */
        .monaco-editor {
          background-color: transparent !important;
        }

        .monaco-editor .margin {
          background-color: transparent !important;
        }

        .editor-background {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%) !important;
        }
      `}</style>

      {/* Buscador Global */}
      {showGlobalSearch && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
          <div className="bg-gray-800 rounded-xl border border-gray-600 shadow-2xl w-full max-w-2xl mx-4">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-white">Buscar en el proyecto</h3>
                <button
                  onClick={() => setShowGlobalSearch(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  ref={globalSearchRef}
                  type="text"
                  placeholder="Buscar archivos o contenido... (Presiona ESC para cerrar)"
                  value={globalSearchTerm}
                  onChange={(e) => setGlobalSearchTerm(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-600 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-colors"
                />
              </div>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="text-gray-400 text-sm">
                Resultados de búsqueda aparecerán aquí...
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay para móvil */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Izquierdo - Explorador */}
      <div className={`
        fixed lg:relative z-50 h-full bg-gray-800/95 backdrop-blur-lg border-r border-gray-700 flex flex-col shadow-xl transition-all duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-80 lg:w-72
      `}>
        {/* Header del Sidebar */}
        <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2">
                <Image
                  src="/favicon.ico"
                  alt="LyxLang logo"
                  width={30}
                  height={30}
                  className='object-cover rounded-4xl'
                />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">EXPLORADOR</h2>
                <p className="text-xs text-gray-400">Proyecto Activo</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                {darkMode ? <FiSun size={16} className="text-yellow-400" /> : <FiMoon size={16} className="text-blue-400" />}
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FiX size={16} />
              </button>
            </div>
          </div>

          {/* Barra de búsqueda */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Buscar archivos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900/70 border border-gray-600 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30 transition-colors"
            />
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="p-3 border-b border-gray-700 bg-gray-900/30">
          <div className="flex space-x-2">
            <button
              onClick={() => addNewItem(undefined, 'file')}
              className="flex-1 flex items-center justify-center p-2 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 rounded-lg transition-all duration-200 group"
            >
              <FiFilePlus className="text-blue-400 group-hover:scale-110 transition-transform" size={14} />
            </button>
            <button
              onClick={() => addNewItem(undefined, 'folder')}
              className="flex-1 flex items-center justify-center p-2 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 rounded-lg transition-all duration-200 group"
            >
              <FiFolderPlus className="text-blue-400 group-hover:scale-110 transition-transform" size={14} />
            </button>
            <button
              onClick={compileCode}
              className="flex-1 flex items-center justify-center p-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-all duration-200 group"
            >
              <FiPlay className="text-blue-400 group-hover:scale-110 transition-transform" size={14} />
            </button>
          </div>
        </div>

        {/* Árbol de archivos */}
        <div className="flex-1 overflow-y-auto py-3">
          <div className="space-y-0.5">
            {renderFileTree(files)}
          </div>
        </div>

        {/* Footer del Sidebar */}
        <div className="p-3 border-t border-gray-700 bg-gray-900/30">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-2">
              <FiGitBranch size={12} />
              <span>main</span>
            </div>
            <div className="flex items-center space-x-2">
              <FiUser size={12} />
              <span>Developer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Área Principal */}
      <div className="flex-1 flex flex-col min-w-0 h-full editor-background">
        {/* Header del Editor */}
        <div className="bg-gray-800/80 backdrop-blur-lg border-b border-gray-700 px-4 lg:px-6 py-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Botón menú móvil */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FiMenu size={18} />
              </button>

              <div className="flex items-center text-sm text-gray-300 bg-gray-700/50 px-3 py-1 rounded-lg max-w-[200px] lg:max-w-none">
                <FiHome className="mr-2 shrink-0" size={14} />
                <span className="font-mono text-xs truncate">{currentPath || '/proyecto'}</span>
              </div>

              {selectedFile && (
                <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-blue-500/20 rounded-lg border border-blue-500/30">
                  <FiFile className="text-blue-400 shrink-0" size={14} />
                  <span className="text-sm font-medium truncate max-w-[120px] lg:max-w-none">{selectedFile.name}</span>
                  <span className="text-xs text-gray-400 bg-gray-700/50 px-1.5 py-0.5 rounded hidden lg:block">
                    {getLanguageFromFileName(selectedFile.name)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-1 lg:space-x-2">
              <button
                onClick={saveFile}
                className="flex items-center px-2 lg:px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-green-500/25"
              >
                <FiSave className="mr-1 lg:mr-1.5 shrink-0" size={14} />
                <span className="hidden sm:inline">Guardar</span>
              </button>
              <button
                onClick={() => setTerminalOpen(!terminalOpen)}
                className={`p-2 rounded-lg transition-colors ${terminalOpen ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-gray-700'}`}
              >
                <FiTerminal size={16} />
              </button>
              <button
                onClick={() => setShowGlobalSearch(true)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title="Buscar (Ctrl+T)"
              >
                <FiSearch size={16} />
              </button>
              <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors hidden lg:block">
                <FiSettings size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Editor de Código */}
        <div className="flex-1 flex min-h-0 bg-gradient-to-br from-gray-900 to-gray-800/80 p-2 lg:p-4">
          {selectedFile ? (
            <div className="flex-1 flex bg-gray-900 rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
              {/* Editor principal con Monaco */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* Header del archivo */}
                <div className="bg-gray-800/50 px-3 lg:px-4 py-2 border-b border-gray-700 shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <div className="flex items-center space-x-2 min-w-0">
                        <FiFile className="text-blue-400 shrink-0" size={16} />
                        <span className="font-mono text-sm font-medium truncate">{selectedFile.name}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs shrink-0">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-gray-400 hidden sm:inline">Guardado</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded hidden sm:block">
                      {code.split('\n').length} líneas • {getLanguageFromFileName(selectedFile.name)}
                    </div>
                  </div>
                </div>

                {/* Área del editor con Monaco */}
                <div className="flex-1 min-h-0" ref={editorContainerRef}>
                  <MonacoEditor
                    height="100%"
                    language={getLanguageFromFileName(selectedFile.name)}
                    theme="vs-dark"
                    value={code}
                    onChange={handleEditorChange}
                    beforeMount={(monaco) => {
                      monaco.editor.defineTheme('custom-dark', {
                        base: 'vs-dark',
                        inherit: true,
                        rules: [
                          { token: 'comment', foreground: '6A9955' },
                          { token: 'keyword', foreground: '569CD6' },
                          { token: 'number', foreground: 'B5CEA8' },
                          { token: 'string', foreground: 'CE9178' },
                          { token: 'type', foreground: '4EC9B0' },
                        ],
                        colors: {
                          'editor.background': '#00000000',
                          'editor.foreground': '#D4D4D4',
                          'editorLineNumber.foreground': '#6E7681',
                          'editorLineNumber.activeForeground': '#CCCCCC',
                          'editorCursor.foreground': '#FFFFFF',
                          'editor.selectionBackground': '#264F78',
                          'editor.inactiveSelectionBackground': '#3A3D41',
                        }
                      });
                    }}
                    onMount={(editor) => {
                      editor.updateOptions({
                        theme: 'custom-dark'
                      });
                      
                      const container = editor.getContainerDomNode();
                      container.style.backgroundColor = 'transparent';
                      
                      const monacoElements = container.querySelectorAll('.monaco-editor');
                      monacoElements.forEach((element: any) => {
                        element.style.backgroundColor = 'transparent';
                      });
                    }}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 12,
                      fontFamily: `'Fira Code', 'Courier New', monospace`,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      insertSpaces: true,
                      detectIndentation: true,
                      roundedSelection: false,
                      scrollbar: {
                        vertical: 'visible',
                        horizontal: 'visible',
                        useShadows: false
                      },
                      wordWrap: 'on',
                      suggestOnTriggerCharacters: true,
                      quickSuggestions: true,
                      parameterHints: { enabled: true },
                      bracketPairColorization: { enabled: true },
                      guides: { bracketPairs: true },
                      overviewRulerBorder: false,
                      hideCursorInOverviewRuler: true,
                    }}
                  />
                </div>
              </div>

              {/* Minimap personalizado con PrismJS - Responsive */}
              {!isMobile && (
                <div 
                  className="border-l border-gray-700 flex flex-col shrink-0 transition-all duration-300"
                  style={{ width: getMinimapWidth() }}
                >
                  <div className="bg-gray-800/50 px-2 py-1 border-b border-gray-700 text-xs text-gray-400 text-center shrink-0 truncate">
                    {isTablet ? 'MAP' : 'MINIMAP'}
                  </div>
                  <div className="flex-1 min-h-0">
                    <CodeMinimap
                      code={code}
                      scrollTop={scrollTop}
                      scrollLeft={scrollLeft}
                      onScrollClick={handleMinimapScroll}
                      language={getLanguageFromFileName(selectedFile.name)}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center max-w-md w-full p-6 lg:p-8 bg-gray-800/50 rounded-2xl border border-gray-700 backdrop-blur-lg">
                <div className="inline-flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 bg-blue-500/20 rounded-2xl mb-4 lg:mb-6 border border-blue-500/30">
                  <FiCode className="text-xl lg:text-3xl text-blue-400" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 lg:mb-3">Editor de Código</h3>
                <p className="text-gray-400 mb-4 lg:mb-6 leading-relaxed text-sm lg:text-base">
                  Selecciona un archivo del explorador o crea uno nuevo para empezar a programar en TypeScript.
                </p>
                <div className="grid grid-cols-2 gap-2 lg:gap-3">
                  <button
                    onClick={() => addNewItem(undefined, 'file')}
                    className="flex flex-col items-center p-3 lg:p-4 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 rounded-xl transition-all duration-200 hover:border-blue-400/30 group"
                  >
                    <FiFilePlus className="mb-1 lg:mb-2 text-blue-400 group-hover:scale-110 transition-transform" size={18} />
                    <span className="text-xs lg:text-sm font-medium">Nuevo Archivo</span>
                  </button>
                  <button
                    onClick={() => addNewItem(undefined, 'folder')}
                    className="flex flex-col items-center p-3 lg:p-4 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 rounded-xl transition-all duration-200 hover:border-blue-400/30 group"
                  >
                    <FiFolderPlus className="mb-1 lg:mb-2 text-blue-400 group-hover:scale-110 transition-transform" size={18} />
                    <span className="text-xs lg:text-sm font-medium">Nueva Carpeta</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Terminal redimensionable */}
        {terminalOpen && (
          <div
            ref={terminalRef}
            className="bg-gray-900 border-t border-gray-700 backdrop-blur-lg transition-all duration-300 flex flex-col shrink-0"
            style={{ height: `${terminalHeight}px` }}
          >
            {/* Barra de redimensionamiento */}
            <div
              className="h-2 cursor-row-resize bg-gray-700 hover:bg-blue-500 transition-colors flex items-center justify-center shrink-0"
              onMouseDown={() => setIsResizing(true)}
            >
              <div className="w-8 h-1 bg-gray-500 rounded-full"></div>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700 shrink-0">
                <div className="flex items-center space-x-2">
                  <FiTerminal className="text-blue-400" size={14} />
                  <span className="text-sm font-medium text-white">TERMINAL</span>
                  <span className="text-xs text-gray-400">(Ctrl+` para toggle)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setTerminalOutput([])}
                    className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                  >
                    Limpiar
                  </button>
                  <button
                    onClick={() => setTerminalOpen(false)}
                    className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-700 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              {/* Output de la terminal */}
              <div
                ref={terminalRef}
                className="flex-1 p-4 overflow-y-auto text-xs lg:text-sm bg-gray-900 min-h-0 terminal-output"
                style={{
                  fontFamily: 'var(--font-family, "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
                  lineHeight: '1.5',
                  letterSpacing: '-0.01em'
                }}
              >
                {terminalOutput.map((line, index) => (
                  <div 
                    key={index} 
                    className={`mb-1 ${
                      line.includes('❌') ? 'text-red-400' :
                      line.includes('✅') ? 'text-green-400' :
                      line.includes('🚀') ? 'text-yellow-400' :
                      line.includes('📦') ? 'text-blue-400' :
                      line.includes('🔨') ? 'text-orange-400' :
                      line.includes('💾') ? 'text-purple-400' :
                      line.startsWith('$') ? 'text-gray-300 font-mono' :
                      'text-gray-200'
                    }`}
                  >
                    {line}
                  </div>
                ))}
                
                {/* Input de la terminal */}
                <div className="flex items-center text-gray-300 font-mono mt-2">
                  <span className="text-green-400 mr-2">$</span>
                  <input
                    ref={terminalInputRef}
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    onKeyPress={handleTerminalKeyPress}
                    className="flex-1 bg-transparent border-none outline-none text-gray-100 placeholder-gray-500"
                    placeholder="Escribe un comando (npm, git, ls, etc.)..."
                    autoComplete="off"
                    spellCheck="false"
                  />
                </div>
              </div>

              {/* Ayuda rápida de comandos */}
              <div className="bg-gray-800/50 border-t border-gray-700 p-2 shrink-0">
                <div className="flex flex-wrap gap-1 text-xs text-gray-400">
                  <span className="px-2 py-1 bg-gray-700/50 rounded">npm install</span>
                  <span className="px-2 py-1 bg-gray-700/50 rounded">npm run dev</span>
                  <span className="px-2 py-1 bg-gray-700/50 rounded">git status</span>
                  <span className="px-2 py-1 bg-gray-700/50 rounded">git add .</span>
                  <span className="px-2 py-1 bg-gray-700/50 rounded">ls</span>
                  <span className="px-2 py-1 bg-gray-700/50 rounded">clear</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedCodeEditor;
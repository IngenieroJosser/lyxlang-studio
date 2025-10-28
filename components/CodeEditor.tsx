'use client';
import { useState, useEffect, useRef } from 'react';
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

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
  isOpen?: boolean;
  path?: string;
}

// Componente mejorado para el resaltado de sintaxis
const CodeHighlighter = ({ code, language }: { code: string; language: string }) => {
  const highlightSyntax = (text: string) => {
    if (!text) return '';
    
    // Primero escapamos caracteres HTML para evitar inyección
    const escapedText = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    const keywords = [
      'class', 'interface', 'extends', 'implements', 'constructor', 'public', 'private',
      'protected', 'readonly', 'static', 'async', 'await', 'function', 'return', 'const',
      'let', 'var', 'if', 'else', 'for', 'while', 'switch', 'case', 'break', 'continue',
      'try', 'catch', 'throw', 'import', 'export', 'from', 'default', 'type', 'namespace',
      'declare', 'any', 'string', 'number', 'boolean', 'void', 'null', 'undefined', 'this'
    ];

    // Patrones mejorados para evitar conflictos
    const patterns = {
      // Comentarios - más específicos
      comment: /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g,
      // Strings - maneja escapes correctamente
      string: /('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/g,
      // Números - más preciso
      number: /\b(-?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?)\b/g,
      // Keywords - solo palabras completas
      keyword: new RegExp(`\\b(${keywords.join('|')})\\b`, 'g'),
      // Funciones - más específico
      function: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*\()/g,
      // Tipos - después de dos puntos
      type: /:\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g,
      // Decoradores - al inicio de línea con @
      decorator: /^(\s*@[a-zA-Z_$][a-zA-Z0-9_$]*)/gm
    };

    let highlighted = escapedText;

    // Aplicar resaltado en orden de especificidad
    highlighted = highlighted.replace(
      patterns.comment,
      '<span class="text-green-400 italic">$1</span>'
    );

    highlighted = highlighted.replace(
      patterns.string,
      '<span class="text-yellow-300">$1</span>'
    );

    highlighted = highlighted.replace(
      patterns.number,
      '<span class="text-purple-400">$1</span>'
    );

    highlighted = highlighted.replace(
      patterns.keyword,
      '<span class="text-blue-400 font-medium">$1</span>'
    );

    highlighted = highlighted.replace(
      patterns.function,
      '<span class="text-cyan-400">$1</span>'
    );

    highlighted = highlighted.replace(
      patterns.type,
      ': <span class="text-teal-400">$1</span>'
    );

    highlighted = highlighted.replace(
      patterns.decorator,
      '<span class="text-pink-400 italic">$1</span>'
    );

    return highlighted;
  };

  return (
    <pre 
      className="text-sm leading-6 whitespace-pre text-gray-100 font-mono"
      dangerouslySetInnerHTML={{ __html: highlightSyntax(code) }} 
    />
  );
};

// Componente para el minimap
const CodeMinimap = ({ code, scrollTop, scrollLeft, onScrollClick }: { 
  code: string; 
  scrollTop: number; 
  scrollLeft: number;
  onScrollClick: (percentageX: number, percentageY: number) => void 
}) => {
  const minimapRef = useRef<HTMLDivElement>(null);
  
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
      <div className="absolute inset-0 font-mono text-[2px] leading-[1px] text-gray-400 whitespace-pre">
        {code}
      </div>
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
              content: '' // Archivo vacío
            },
            {
              id: '4',
              name: 'utils.ts',
              type: 'file',
              content: '' // Archivo vacío
            }
          ]
        },
        {
          id: '5',
          name: 'package.json',
          type: 'file',
          content: '' // Archivo vacío
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [terminalHeight, setTerminalHeight] = useState(300);
  const [isResizing, setIsResizing] = useState(false);
  const [isRenaming, setIsRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const globalSearchRef = useRef<HTMLInputElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Detectar cambios en el tamaño de la pantalla
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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

  // Sincronizar scroll
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const newScrollTop = scrollContainerRef.current.scrollTop;
        const newScrollLeft = scrollContainerRef.current.scrollLeft;
        setScrollTop(newScrollTop);
        setScrollLeft(newScrollLeft);
        
        if (textareaRef.current) {
          textareaRef.current.scrollTop = newScrollTop;
          textareaRef.current.scrollLeft = newScrollLeft;
        }
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [selectedFile]);

  useEffect(() => {
    if (selectedFile) {
      setCode(selectedFile.content || '');
      setCurrentPath(selectedFile.path || '');
      setScrollTop(0);
      setScrollLeft(0);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
        scrollContainerRef.current.scrollLeft = 0;
      }
    }
  }, [selectedFile]);

  // Función para manejar la indentación con Tab
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;

      const newValue = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newValue);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 2;
          textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  // Manejar cambios en el textarea
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  // Manejar clic en el minimap para navegación
  const handleMinimapScroll = (percentageX: number, percentageY: number) => {
    if (scrollContainerRef.current) {
      const maxScrollTop = scrollContainerRef.current.scrollHeight - scrollContainerRef.current.clientHeight;
      const maxScrollLeft = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth;
      
      const newScrollTop = maxScrollTop * percentageY;
      const newScrollLeft = maxScrollLeft * percentageX;
      
      scrollContainerRef.current.scrollTop = newScrollTop;
      scrollContainerRef.current.scrollLeft = newScrollLeft;
      setScrollTop(newScrollTop);
      setScrollLeft(newScrollLeft);
    }
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
      content: '', // Siempre archivos vacíos
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
    addTerminalOutput('Archivo guardado correctamente');
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

  const compileCode = () => {
    addTerminalOutput('Compilando código TypeScript...');
    addTerminalOutput('Generando archivos JavaScript...');
    addTerminalOutput('Compilación completada exitosamente');
    setTerminalOpen(true);
  };

  const addTerminalOutput = (message: string) => {
    setTerminalOutput(prev => [...prev, `> ${message}`]);
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
                className="mr-2 text-blue-400 hover:text-white transition-colors"
              >
                {node.isOpen ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
              </button>
              <FiFolder className="text-blue-400 mr-2" size={16} />
            </>
          ) : (
            <FiFile className="text-gray-400 mr-4 ml-1" size={14} />
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

          <div className="ml-auto flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
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

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
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
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Header del Editor */}
        <div className="bg-gray-800/80 backdrop-blur-lg border-b border-gray-700 px-4 lg:px-6 py-3 flex-shrink-0">
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
                <FiHome className="mr-2 flex-shrink-0" size={14} />
                <span className="font-mono text-xs truncate">{currentPath || '/proyecto'}</span>
              </div>

              {selectedFile && (
                <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-blue-500/20 rounded-lg border border-blue-500/30">
                  <FiFile className="text-blue-400 flex-shrink-0" size={14} />
                  <span className="text-sm font-medium truncate max-w-[120px] lg:max-w-none">{selectedFile.name}</span>
                  <span className="text-xs text-gray-400 bg-gray-700/50 px-1.5 py-0.5 rounded hidden lg:block">
                    {selectedFile.name.split('.').pop()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-1 lg:space-x-2">
              <button
                onClick={saveFile}
                className="flex items-center px-2 lg:px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-green-500/25"
              >
                <FiSave className="mr-1 lg:mr-1.5 flex-shrink-0" size={14} />
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
              {/* Editor principal */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* Header del archivo */}
                <div className="bg-gray-800/50 px-3 lg:px-4 py-2 border-b border-gray-700 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <div className="flex items-center space-x-2 min-w-0">
                        <FiFile className="text-blue-400 flex-shrink-0" size={16} />
                        <span className="font-mono text-sm font-medium truncate">{selectedFile.name}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs flex-shrink-0">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-gray-400 hidden sm:inline">Guardado</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded hidden sm:block">
                      {code.split('\n').length} líneas • TypeScript
                    </div>
                  </div>
                </div>

                {/* Área del editor con números de línea */}
                <div className="flex-1 flex min-h-0 bg-gray-900 relative" ref={editorContainerRef}>
                  {/* Números de línea */}
                  <div 
                    className="bg-gray-800/30 text-gray-500 text-right py-4 px-2 lg:px-3 font-mono text-xs select-none border-r border-gray-700 flex-shrink-0"
                    style={{ minWidth: '60px' }}
                  >
                    {code.split('\n').map((_, index) => (
                      <div
                        key={index}
                        className="leading-6 hover:text-gray-300 transition-colors min-h-[24px]"
                      >
                        {index + 1}
                      </div>
                    ))}
                  </div>

                  {/* Contenedor principal con scroll */}
                  <div 
                    ref={scrollContainerRef}
                    className="flex-1 flex relative overflow-auto min-w-0"
                  >
                    {/* Textarea del código (COMPLETAMENTE TRANSPARENTE) */}
                    <textarea
                      ref={textareaRef}
                      value={code}
                      onChange={handleCodeChange}
                      onKeyDown={handleKeyDown}
                      className="w-full h-full min-h-full bg-transparent text-transparent font-mono text-sm p-3 lg:p-4 focus:outline-none resize-none leading-6 tracking-wide absolute inset-0 z-10 whitespace-pre caret-white"
                      placeholder="// Escribe tu código TypeScript aquí..."
                      spellCheck="false"
                      style={{
                        fontFamily: '"Fira Code", "Cascadia Code", "Source Code Pro", monospace',
                      }}
                    />

                    {/* Código con resaltado de sintaxis (SOLO ESTE SE VE) */}
                    <div 
                      className="w-full h-full min-h-full py-4 px-3 lg:px-4 font-mono text-sm leading-6 tracking-wide whitespace-pre pointer-events-none absolute inset-0"
                    >
                      <CodeHighlighter code={code} language="typescript" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Minimap */}
              <div className="w-32 border-l border-gray-700 flex flex-col flex-shrink-0">
                <div className="bg-gray-800/50 px-2 py-1 border-b border-gray-700 text-xs text-gray-400 text-center flex-shrink-0">
                  MINIMAP
                </div>
                <div className="flex-1 min-h-0">
                  <CodeMinimap 
                    code={code} 
                    scrollTop={scrollTop} 
                    scrollLeft={scrollLeft}
                    onScrollClick={handleMinimapScroll} 
                  />
                </div>
              </div>
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
            className="bg-gray-900 border-t border-gray-700 backdrop-blur-lg transition-all duration-300 flex flex-col flex-shrink-0"
            style={{ height: `${terminalHeight}px` }}
          >
            {/* Barra de redimensionamiento */}
            <div
              className="h-2 cursor-row-resize bg-gray-700 hover:bg-blue-500 transition-colors flex items-center justify-center flex-shrink-0"
              onMouseDown={() => setIsResizing(true)}
            >
              <div className="w-8 h-1 bg-gray-500 rounded-full"></div>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700 flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <FiTerminal className="text-blue-400" size={14} />
                  <span className="text-sm font-medium text-white">TERMINAL</span>
                </div>
                <button
                  onClick={() => setTerminalOpen(false)}
                  className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-700 transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="flex-1 p-4 overflow-y-auto font-mono text-xs lg:text-sm bg-gray-900 min-h-0">
                {terminalOutput.map((line, index) => (
                  <div key={index} className="text-green-400 mb-1">{line}</div>
                ))}
                <div className="flex items-center text-gray-300">
                  <span className="text-blue-400 mr-2">$</span>
                  <span>Listo para ejecutar comandos...</span>
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
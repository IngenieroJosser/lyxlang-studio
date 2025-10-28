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
  FiUser
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
              content: `// Bienvenido a tu compilador TypeScript
interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

class GestorUsuarios {
  private usuarios: Usuario[] = [];

  agregarUsuario(usuario: Usuario): void {
    this.usuarios.push(usuario);
    console.log(\`Usuario \${usuario.nombre} agregado correctamente\`);
  }

  listarUsuarios(): void {
    this.usuarios.forEach(usuario => {
      console.log(\`ID: \${usuario.id}, Nombre: \${usuario.nombre}\`);
    });
  }
}

// Ejemplo de uso
const gestor = new GestorUsuarios();
gestor.agregarUsuario({ id: 1, nombre: "Ana", email: "ana@ejemplo.com" });
gestor.listarUsuarios();`
            },
            {
              id: '4',
              name: 'utils.ts',
              type: 'file',
              content: `// Utilidades del proyecto
export function formatearFecha(fecha: Date): string {
  return fecha.toLocaleDateString('es-ES');
}

export function generarId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export const CONSTANTES = {
  VERSION: '1.0.0',
  AUTOR: 'Tu Nombre'
};`
            }
          ]
        },
        {
          id: '5',
          name: 'package.json',
          type: 'file',
          content: `{
  "name": "mi-proyecto-ts",
  "version": "1.0.0",
  "description": "Un proyecto increíble con TypeScript",
  "main": "dist/main.js",
  "scripts": {
    "build": "tsc",
    "dev": "ts-node src/main.ts",
    "start": "node dist/main.js"
  },
  "dependencies": {
    "typescript": "^5.0.0"
  }
}`
        }
      ]
    }
  ]);

  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [code, setCode] = useState('');
  const [currentPath, setCurrentPath] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createType, setCreateType] = useState<'file' | 'folder'>('file');
  const [isRenaming, setIsRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (selectedFile) {
      setCode(selectedFile.content || '');
      setCurrentPath(selectedFile.path || '');
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

      // Restaurar la posición del cursor
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 2;
          textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
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
    } else {
      toggleFolder(file.id);
    }
  };

  const addNewItem = (parentId?: string, type: 'file' | 'folder' = 'file') => {
    const newItem: FileNode = {
      id: Date.now().toString(),
      name: type === 'file' ? 'nuevo_archivo.ts' : 'nueva_carpeta',
      type,
      content: type === 'file' ? '// Escribe tu código aquí' : '',
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
    setIsCreating(false);

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
    addTerminalOutput('✅ Archivo guardado correctamente');
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
    addTerminalOutput('🔨 Compilando código TypeScript...');
    addTerminalOutput('📦 Generando archivos JavaScript...');
    addTerminalOutput('✅ Compilación completada exitosamente');
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
      {/* Sidebar Izquierdo - Explorador */}
      <div className="w-72 bg-gray-800/90 backdrop-blur-lg border-r border-gray-700 flex flex-col shadow-xl transition-all duration-300">
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
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              {darkMode ? <FiSun size={16} className="text-yellow-400" /> : <FiMoon size={16} className="text-blue-400" />}
            </button>
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
      <div className="flex-1 flex flex-col">
        {/* Header del Editor */}
        <div className="bg-gray-800/80 backdrop-blur-lg border-b border-gray-700 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-300 bg-gray-700/50 px-3 py-1 rounded-lg">
                <FiHome className="mr-2" size={14} />
                <span className="font-mono text-xs">{currentPath || '/proyecto'}</span>
              </div>
              {selectedFile && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-blue-500/20 rounded-lg border border-blue-500/30">
                  <FiFile className="text-blue-400" size={14} />
                  <span className="text-sm font-medium">{selectedFile.name}</span>
                  <span className="text-xs text-gray-400 bg-gray-700/50 px-1.5 py-0.5 rounded">
                    {selectedFile.name.split('.').pop()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={saveFile}
                className="flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-green-500/25"
              >
                <FiSave className="mr-1.5" size={14} />
                Guardar
              </button>
              <button
                onClick={() => setTerminalOpen(!terminalOpen)}
                className={`p-2 rounded-lg transition-colors ${terminalOpen ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-gray-700'
                  }`}
              >
                <FiTerminal size={16} />
              </button>
              <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                <FiSettings size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Editor de Código */}
        <div className="flex-1 flex bg-gradient-to-br from-gray-900 to-gray-800/80 p-4">
          {selectedFile ? (
            <div className="flex-1 flex flex-col bg-gray-900 rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
              {/* Header del archivo */}
              <div className="bg-gray-800/50 px-4 py-2 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                      <FiFile className="text-blue-400" size={16} />
                      <span className="font-mono text-sm font-medium">{selectedFile.name}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-gray-400">Guardado</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded">
                    {code.split('\n').length} líneas • TypeScript
                  </div>
                </div>
              </div>

              {/* Área del editor con números de línea */}
              <div className="flex-1 flex overflow-auto bg-gray-900">
                {/* Números de línea */}
                <div className="bg-gray-800/30 text-gray-500 text-right py-4 px-3 font-mono text-xs select-none border-r border-gray-700">
                  {code.split('\n').map((_, index) => (
                    <div
                      key={index}
                      className="leading-6 hover:text-gray-300 transition-colors"
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>

                {/* Textarea del código */}
                <textarea
                  ref={textareaRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-gray-100 font-mono text-sm p-4 focus:outline-none resize-none leading-6 tracking-wide"
                  placeholder="// Escribe tu código TypeScript aquí..."
                  spellCheck="false"
                  style={{
                    fontFamily: '"Fira Code", "Cascadia Code", "Source Code Pro", monospace',
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md p-8 bg-gray-800/50 rounded-2xl border border-gray-700 backdrop-blur-lg">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-2xl mb-6 border border-blue-500/30">
                  <FiCode className="text-3xl text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Editor de Código</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Selecciona un archivo del explorador o crea uno nuevo para empezar a programar en TypeScript.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => addNewItem(undefined, 'file')}
                    className="flex flex-col items-center p-4 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 rounded-xl transition-all duration-200 hover:border-blue-400/30 group"
                  >
                    <FiFilePlus className="mb-2 text-blue-400 group-hover:scale-110 transition-transform" size={20} />
                    <span className="text-sm font-medium">Nuevo Archivo</span>
                  </button>
                  <button
                    onClick={() => addNewItem(undefined, 'folder')}
                    className="flex flex-col items-center p-4 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 rounded-xl transition-all duration-200 hover:border-blue-400/30 group"
                  >
                    <FiFolderPlus className="mb-2 text-blue-400 group-hover:scale-110 transition-transform" size={20} />
                    <span className="text-sm font-medium">Nueva Carpeta</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Terminal */}
        {terminalOpen && (
          <div className="h-64 bg-gray-900 border-t border-gray-700 backdrop-blur-lg transition-all duration-300">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
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
            <div className="h-56 p-4 overflow-y-auto font-mono text-sm bg-gray-900">
              {terminalOutput.map((line, index) => (
                <div key={index} className="text-green-400 mb-1">{line}</div>
              ))}
              <div className="flex items-center text-gray-300">
                <span className="text-blue-400 mr-2">$</span>
                <span>Listo para ejecutar comandos...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedCodeEditor;
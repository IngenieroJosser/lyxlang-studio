'use client';
import { useState, useEffect } from 'react';
import { FiHome, FiArrowLeft, FiSearch, FiFile, FiFolder, FiCode, FiGithub } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link'

const NotFoundPage = () => {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Solo ejecutar en el cliente
  useEffect(() => {
    setIsClient(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generar elementos flotantes solo en el cliente con valores consistentes
  const floatingElements = isClient 
    ? Array.from({ length: 8 }, (_, i) => {
        // Usar un seed basado en el índice para valores consistentes
        const seed = i * 123.456; // Seed determinística
        const size = 20 + (Math.sin(seed) * 0.5 + 0.5) * 60; // Entre 20 y 80
        const posX = (Math.cos(seed * 1.5) * 0.5 + 0.5) * 100; // Entre 0 y 100
        const posY = (Math.sin(seed * 2) * 0.5 + 0.5) * 100; // Entre 0 y 100
        const delay = (Math.cos(seed) * 0.5 + 0.5) * 5; // Entre 0 y 5
        const duration = 10 + (Math.sin(seed * 0.7) * 0.5 + 0.5) * 10; // Entre 10 y 20
        
        const IconComponent = i % 3 === 0 ? FiCode : i % 3 === 1 ? FiFile : FiFolder;
        
        return (
          <div
            key={i}
            className="absolute opacity-5 text-blue-400 pointer-events-none"
            style={{
              left: `${posX}%`,
              top: `${posY}%`,
              width: `${size}px`,
              height: `${size}px`,
              animation: `float ${duration}s ease-in-out ${delay}s infinite alternate`
            }}
          >
            <IconComponent size={size} />
          </div>
        );
      })
    : null; // En el servidor, no renderizar nada

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden relative">
      {/* Efecto de partículas flotantes - Solo en cliente */}
      {isClient && (
        <div className="absolute inset-0 overflow-hidden">
          {floatingElements}
        </div>
      )}

      {/* Efecto de seguimiento del mouse - Solo en cliente */}
      {isClient && (
        <div
          className="absolute w-96 h-96 bg-blue-500/5 rounded-full blur-3xl transition-all duration-200 pointer-events-none"
          style={{
            left: `${mousePosition.x - 192}px`,
            top: `${mousePosition.y - 192}px`,
            transform: isHovered ? 'scale(1.2)' : 'scale(1)',
          }}
        />
      )}

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-center max-w-2xl mx-auto">
          {/* Logo */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/20 rounded-2xl border border-blue-500/30 mb-6">
              <Image
                src="/favicon.ico"
                alt="LyxLang logo"
                width={40}
                height={40}
                className="object-cover rounded-xl"
              />
            </div>
          </div>

          {/* Código de error estilizado */}
          <div className="mb-8 font-mono text-sm bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-left backdrop-blur-sm">
            <div className="flex items-center space-x-2 text-gray-400 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs ml-2">error.ts</span>
            </div>
            <div className="space-y-2">
              <div className="flex">
                <span className="text-gray-500 mr-4">1</span>
                <span className="text-red-400">// Error 404: Página no encontrada</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 mr-4">2</span>
                <span className="text-gray-400">const</span>
                <span className="text-blue-400 ml-2">page</span>
                <span className="text-gray-400"> =</span>
                <span className="text-yellow-400 ml-2">null</span>
                <span className="text-gray-400">;</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 mr-4">3</span>
                <span className="text-gray-400">console.</span>
                <span className="text-blue-400">error</span>
                <span className="text-gray-400">(</span>
                <span className="text-green-400">"Route not found: 404"</span>
                <span className="text-gray-400">);</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 mr-4">4</span>
                <span className="text-purple-400">return</span>
                <span className="text-red-400 ml-2">'NotFoundPage'</span>
                <span className="text-gray-400">;</span>
              </div>
            </div>
          </div>

          {/* Mensaje principal */}
          <div className="mb-8">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              404
            </h1>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Página no encontrada
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-md mx-auto">
              La ruta que estás buscando no existe o ha sido movida. 
              Revisa la URL o navega de vuelta al editor.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/"
              onClick={() => router.back()}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="flex items-center justify-center space-x-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 group"
            >
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" size={18} />
              <span>Volver Atrás</span>
            </Link>

            <button
              onClick={() => router.push('/')}
              className="flex items-center justify-center space-x-3 px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-gray-500/25 transform hover:scale-105 group"
            >
              <FiHome className="group-hover:scale-110 transition-transform" size={18} />
              <span>Ir al Editor</span>
            </button>
          </div>

          {/* Búsqueda sugerida */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm max-w-md mx-auto">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
              <FiSearch className="mr-2" size={16} />
              ¿Buscabas algo específico?
            </h3>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-2 hover:text-white transition-colors cursor-pointer">
                <FiFile size={14} />
                <span>Documentación</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-white transition-colors cursor-pointer">
                <FiCode size={14} />
                <span>Ejemplos de código</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-white transition-colors cursor-pointer">
                <FiGithub size={14} />
                <span>Repositorio GitHub</span>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Si crees que esto es un error,{' '}
              <button className="text-blue-400 hover:text-blue-300 transition-colors underline">
                contacta al soporte
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-gray-800 py-6 px-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <Image
                src="/favicon.ico"
                alt="LyxLang logo"
                width={20}
                height={20}
                className="object-cover rounded"
              />
              <span>LyxLang Editor</span>
            </div>
            <span>•</span>
            <span>v1.0.0</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="hover:text-gray-300 transition-colors">Documentación</button>
            <span>•</span>
            <button className="hover:text-gray-300 transition-colors">Soporte</button>
            <span>•</span>
            <button className="hover:text-gray-300 transition-colors">GitHub</button>
          </div>
        </div>
      </div>

      {/* Estilos para animaciones */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
          100% {
            transform: translateY(0px) rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
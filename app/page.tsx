'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiCode, 
  FiFolder, 
  FiPlay, 
  FiTerminal, 
  FiGitBranch, 
  FiStar, 
  FiGithub, 
  FiArrowRight,
  FiShield,
  FiZap,
  FiUsers,
  FiCoffee
} from 'react-icons/fi';
import Image from 'next/image';

const HomePage = () => {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: <FiCode className="text-blue-400" size={24} />,
      title: 'Editor Inteligente',
      description: 'Resaltado de sintaxis, autocompletado y formateo automático para TypeScript y JavaScript.'
    },
    {
      icon: <FiFolder className="text-green-400" size={24} />,
      title: 'Explorador de Archivos',
      description: 'Gestiona tu proyecto con un explorador de archivos intuitivo y fácil de usar.'
    },
    {
      icon: <FiTerminal className="text-yellow-400" size={24} />,
      title: 'Terminal Integrada',
      description: 'Ejecuta comandos y compila tu código sin salir del editor.'
    },
    {
      icon: <FiZap className="text-purple-400" size={24} />,
      title: 'Rápido y Eficiente',
      description: 'Construido con Next.js y React para un rendimiento óptimo.'
    },
    {
      icon: <FiShield className="text-red-400" size={24} />,
      title: 'Seguro y Confiable',
      description: 'Tu código se mantiene local, sin envío a servidores externos.'
    },
    {
      icon: <FiUsers className="text-indigo-400" size={24} />,
      title: 'Colaboración',
      description: 'Preparado para futuras características de trabajo en equipo.'
    }
  ];

  const stats = [
    { number: '100%', label: 'Open Source' },
    { number: '0ms', label: 'Sin Latencia' },
    { number: '∞', label: 'Proyectos Ilimitados' },
    { number: '24/7', label: 'Disponible' }
  ];

  // Partículas con valores determinísticos (solo en cliente)
  const floatingParticles = isClient 
    ? Array.from({ length: 12 }, (_, i) => {
        const seed = i * 123.456; // Seed determinística
        const left = (Math.sin(seed) * 0.5 + 0.5) * 100;
        const top = (Math.cos(seed * 1.5) * 0.5 + 0.5) * 100;
        const duration = 10 + (Math.sin(seed * 0.7) * 0.5 + 0.5) * 10;
        
        return (
          <div
            key={i}
            className="absolute text-blue-400/10 text-2xl"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              animation: `float ${duration}s ease-in-out infinite`
            }}
          >
            <FiCode />
          </div>
        );
      })
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-x-hidden">
      {/* Efecto de fondo animado - Solo en cliente */}
      {isClient && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute w-96 h-96 bg-blue-500/5 rounded-full blur-3xl transition-all duration-300"
            style={{
              left: `${mousePosition.x - 192}px`,
              top: `${mousePosition.y - 192}px`,
            }}
          />
          
          {/* Partículas de código flotantes - Solo en cliente */}
          {floatingParticles}
        </div>
      )}

      {/* Header/Navigation */}
      <header className="relative z-10 border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/30">
                <Image
                  src="/favicon.ico"
                  alt="LyxLang logo"
                  width={32}
                  height={32}
                  className="object-cover rounded-xl"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                LyxLang
              </span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-400 hover:text-white transition-colors">Características</a>
              <a href="#about" className="text-gray-400 hover:text-white transition-colors">Acerca de</a>
              <a href="https://github.com/IngenieroJosser/lyxlang-studio" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">GitHub</a>
            </nav>

            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/editor')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
              >
                Abrir Editor
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <div className={`max-w-4xl mx-auto transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="inline-flex items-center space-x-2 bg-gray-800/50 border border-gray-700 rounded-full px-4 py-2 mb-8">
              <FiStar className="text-yellow-400" size={16} />
              <span className="text-sm text-gray-300">Editor de Código Moderno</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Construye con{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                LyxLang
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Un editor de código moderno y elegante para TypeScript y JavaScript. 
              Potente, rápido y completamente en tu navegador.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => router.push('/editor')}
                className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 flex items-center space-x-3"
              >
                <span>Comenzar Ahora</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>

              <a href="https://github.com/IngenieroJosser/lyxlang-studio" target="_blank" rel="noopener noreferrer" className="group bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center space-x-3">
                <FiGithub size={20} />
                <span>Ver en GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-16 bg-gray-800/30 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center transition-all duration-500"
                style={{
                  transitionDelay: `${index * 100}ms`,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
                }}
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Características{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Potentes
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Diseñado para desarrolladores que valoran la eficiencia y la elegancia
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300 group hover:transform hover:scale-105"
                style={{
                  transitionDelay: `${index * 100}ms`,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
                }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-xl border border-blue-500/30 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="relative z-10 py-20 bg-gray-800/30 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Editor en{' '}
                <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                  Acción
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Experimenta la potencia de LyxLang con una vista previa interactiva
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
              {/* Editor Mockup */}
              <div className="bg-gray-800 border-b border-gray-700 p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-400 ml-2">editor.tsx</span>
                </div>
              </div>
              
              <div className="p-6 font-mono text-sm">
                <div className="text-green-400">// Bienvenido a LyxLang</div>
                <div className="text-gray-500 mt-2">class <span className="text-blue-400">Editor</span> {'{'}</div>
                <div className="text-gray-400 ml-4">
                  <div>private <span className="text-purple-400">features</span> = [</div>
                  <div className="ml-4 text-yellow-400">"Resaltado de sintaxis"</div>
                  <div className="ml-4 text-yellow-400">"Explorador de archivos"</div>
                  <div className="ml-4 text-yellow-400">"Terminal integrada"</div>
                  <div>];</div>
                </div>
                <div className="text-gray-500">{'}'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Listo para{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                comenzar?
              </span>
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Únete a miles de desarrolladores que ya usan LyxLang para sus proyectos
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => router.push('/editor')}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 flex items-center space-x-3"
              >
                <FiCoffee size={20} />
                <span>Empezar a Codificar</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center space-x-6 text-gray-500">
              <div className="flex items-center space-x-2">
                <FiZap className="text-green-400" size={16} />
                <span className="text-sm">Sin configuración requerida</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiShield className="text-blue-400" size={16} />
                <span className="text-sm">Completamente gratuito</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/30">
                <Image
                  src="/favicon.ico"
                  alt="LyxLang logo"
                  width={24}
                  height={24}
                  className="object-cover rounded-xl"
                />
              </div>
              <span className="text-lg font-bold text-white">LyxLang</span>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Documentación</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
              <a href="#" className="hover:text-white transition-colors">Soporte</a>
              <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-sm">
              Hecho con ❤️ para la comunidad de desarrolladores
            </p>
          </div>
        </div>
      </footer>

      {/* Estilos para animaciones */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
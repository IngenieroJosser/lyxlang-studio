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
  FiCoffee,
  FiAward,
  FiUser,
  FiMenu,
  FiBook
} from 'react-icons/fi';
import Image from 'next/image';

const HomePage = () => {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
      title: 'Editor Inteligente y Transparente',
      description:
        'Un entorno rápido, minimalista y listo para TypeScript, JavaScript y más. 100% en tu navegador, sin perder rendimiento.'
    },
    {
      icon: <FiGitBranch className="text-green-400" size={24} />,
      title: 'Conecta tu Repositorio',
      description:
        'Importa tus proyectos desde GitHub o GitLab y colabora en tiempo real. Tu código, tu entorno, tu control.'
    },
    {
      icon: <FiAward className="text-yellow-400" size={24} />,
      title: 'Sistema de Recompensas',
      description:
        'Desbloquea insignias, logros y niveles por tus commits, proyectos y colaboraciones dentro de LyxLang.'
    },
    {
      icon: <FiTerminal className="text-purple-400" size={24} />,
      title: 'Terminal y Ejecución en Vivo',
      description:
        'Compila, ejecuta y depura tu código sin salir del entorno. Todo sucede directamente en tu navegador.'
    },
    {
      icon: <FiZap className="text-pink-400" size={24} />,
      title: 'Rendimiento Brutal',
      description:
        'Construido con Next.js y React, optimizado con WebAssembly y monaco-editor para una experiencia fluida.'
    },
    {
      icon: <FiUsers className="text-indigo-400" size={24} />,
      title: 'Colabora, Aprende y Escala',
      description:
        'Crea equipos, comparte snippets, revisa código y forma parte de una comunidad global de developers creativos.'
    }
  ];

  const stats = [
    { number: 'Open Source', label: 'Transparente y colaborativo' },
    { number: 'Freemium', label: 'Gratis para aprender, Pro para escalar' },
    { number: '∞', label: 'Proyectos ilimitados' },
    { number: 'Beta 0.1', label: 'Evoluciona contigo' }
  ];

  // Partículas flotantes del fondo
  const floatingParticles =
    isClient &&
    Array.from({ length: 12 }, (_, i) => {
      const seed = i * 123.456;
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
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-850 to-gray-900 text-white overflow-x-hidden">
      {/* Fondo animado */}
      {isClient && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute w-96 h-96 bg-blue-500/5 rounded-full blur-3xl transition-all duration-300"
            style={{
              left: `${mousePosition.x - 192}px`,
              top: `${mousePosition.y - 192}px`
            }}
          />
          {floatingParticles}
        </div>
      )}

      {/* Header */}
      <header className="relative z-20 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image
              src="/favicon.ico"
              alt="LyxLang logo"
              width={28}
              height={28}
              className="rounded-lg"
            />
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              LyxLang Studio
            </span>
          </div>

          {/* 🔸 Menú Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-400 hover:text-white transition">
              Funciones
            </a>
            <a href="#about" className="text-gray-400 hover:text-white transition">
              Comunidad
            </a>
            <button
              onClick={() => router.push('/docs')}
              className="text-gray-400 hover:text-white transition flex items-center gap-2"
            >
              <FiBook size={16} />
              Documentación
            </button>
            <a
              href="https://github.com/IngenieroJosser/lyxlang-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
            >
              GitHub
            </a>
          </nav>

          {/* 🔸 Botones Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => router.push('/docs')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 hover:text-white transition-all duration-200"
            >
              <FiBook size={18} />
              Docs
            </button>

            <button
              onClick={() => router.push('/iniciar-sesion')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 hover:text-white transition-all duration-200"
            >
              <FiUser size={18} />
              Iniciar sesión
            </button>

            <button
              onClick={() => router.push('/editor')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
            >
              Probar
            </button>
          </div>

          {/* 🔸 Mobile Menu */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => router.push('/docs')}
              className="p-2 rounded-md bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 hover:text-white transition"
            >
              <FiBook size={20} />
            </button>

            <button
              onClick={() => router.push('/iniciar-sesion')}
              className="p-2 rounded-md bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 hover:text-white transition"
            >
              <FiUser size={20} />
            </button>

            <button
              onClick={() => router.push('/editor')}
              className="p-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition"
            >
              <FiPlay size={20} />
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 transition"
            >
              <FiMenu size={20} />
            </button>
          </div>
        </div>

        {/* 🔹 Menú desplegable móvil */}
        {menuOpen && (
          <div className="md:hidden bg-gray-900/95 border-t border-gray-800 flex flex-col items-start px-6 py-4 space-y-4">
            <a href="#features" className="text-gray-300 hover:text-white">
              Funciones
            </a>
            <a href="#about" className="text-gray-300 hover:text-white">
              Comunidad
            </a>
            <button
              onClick={() => {
                router.push('/docs');
                setMenuOpen(false);
              }}
              className="text-gray-300 hover:text-white flex items-center gap-2"
            >
              <FiBook size={16} />
              Documentación
            </button>
            <a
              href="https://github.com/IngenieroJosser/lyxlang-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white"
            >
              GitHub
            </a>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative z-10 py-20 md:py-32 text-center">
        <div className="container mx-auto px-6">
          <div
            className={`max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
          >
            <div className="inline-flex items-center space-x-2 bg-gray-800/50 border border-gray-700 rounded-full px-4 py-2 mb-8">
              <FiStar className="text-yellow-400" size={16} />
              <span className="text-sm text-gray-300">
                Desarrolla. Colabora. Gana.
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              El nuevo{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                espacio de creación
              </span>{' '}
              para developers
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Programa, comparte y crece en una plataforma que fusiona código,
              comunidad y recompensas. 100% en el navegador, 100% tuya.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => router.push('/editor')}
                className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 flex items-center space-x-3"
              >
                <span>Comenzar Gratis</span>
                <FiArrowRight
                  className="group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </button>

              <button
                onClick={() => router.push('/docs')}
                className="group bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center space-x-3"
              >
                <FiBook size={20} />
                <span>Ver Documentación</span>
              </button>

              <a
                href="https://github.com/IngenieroJosser/lyxlang-studio"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center space-x-3"
              >
                <FiGithub size={20} />
                <span>Ver en GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 py-16 bg-gray-800/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
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
              <div className="text-xl md:text-2xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-gray-400 text-sm md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Características{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                que inspiran
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Tu nuevo laboratorio digital para crear, conectar y crecer.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300 group hover:transform hover:scale-105"
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

      {/* CTA */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Empieza a{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                construir tu legado
              </span>
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Crea, colabora y alcanza tus metas mientras desbloqueas logros.
              ¡El código también puede ser una aventura!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => router.push('/editor')}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 flex items-center space-x-3"
              >
                <FiCoffee size={20} />
                <span>Probar LyxLang Studio</span>
                <FiArrowRight
                  className="group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </button>

              <button
                onClick={() => router.push('/docs')}
                className="group bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center space-x-3"
              >
                <FiBook size={20} />
                <span>Leer Documentación</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-12 text-center">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Image
                src="/favicon.ico"
                alt="LyxLang logo"
                width={24}
                height={24}
                className="rounded-lg"
              />
              <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                LyxLang Studio
              </span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              <button
                onClick={() => router.push('/docs')}
                className="text-gray-400 hover:text-white transition flex items-center gap-2"
              >
                <FiBook size={16} />
                Documentación
              </button>
              <a
                href="https://github.com/IngenieroJosser/lyxlang-studio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition flex items-center gap-2"
              >
                <FiGithub size={16} />
                GitHub
              </a>
              <button
                onClick={() => router.push('/editor')}
                className="text-gray-400 hover:text-white transition flex items-center gap-2"
              >
                <FiPlay size={16} />
                Probar Editor
              </button>
            </div>
          </div>

          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} LyxLang Studio — desarrollado con ❤️ por{' '}
            <a
              href="https://github.com/IngenieroJosser"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition"
            >
              Josser Córdoba Rivas
            </a>
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        /* 🔹 Scrollbar personalizada global */
        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }

        ::-webkit-scrollbar-track {
          background: #101829;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #3b82f6, #9333ea);
          border-radius: 10px;
          border: 2px solid rgba(17, 17, 17, 0.8);
          transition: background 0.3s ease;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #60a5fa, #a855f7);
        }

        /* 🔸 Firefox */
        * {
          scrollbar-width: thin;
          scrollbar-color: #6366f1 rgba(15, 15, 15, 0.7);
        }

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

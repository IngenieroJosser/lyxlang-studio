'use client';
import { useState, useEffect } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiGithub } from 'react-icons/fi';
import Image from 'next/image';
import { FaGoogle } from 'react-icons/fa';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Fondo dinámico estilo Home
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 overflow-hidden">
      {/* Fondo animado */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl transition-all duration-300"
          style={{
            left: `${mousePosition.x - 192}px`,
            top: `${mousePosition.y - 192}px`
          }}
        />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Card */}
      <div className="relative z-10 bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-2xl p-8 w-full max-w-md transition-all duration-300 hover:shadow-blue-500/10">
        {/* Logo y título */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/30">
              <Image
                src="/lyxlang-lyxlang-studio-with-text-removebg-preview.png"
                alt="Logo de LyxLang"
                width={40}
                height={40}
                className="object-contain rounded-lg"
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {isLogin ? 'Inicia Sesión' : 'Crea tu Cuenta'}
            </h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-800/60 rounded-lg p-1 mb-8 border border-gray-700">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
              isLogin
                ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-blue-300 border border-blue-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
              !isLogin
                ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-blue-300 border border-blue-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* Formulario */}
        <form className="space-y-5">
          {!isLogin && (
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Nombre completo</label>
              <div className="relative">
                <FiUser
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Tu nombre completo"
                  className="w-full bg-gray-950/60 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-sm text-gray-300 mb-1 block">Correo electrónico</label>
            <div className="relative">
              <FiMail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={16}
              />
              <input
                type="email"
                placeholder="tu@email.com"
                className="w-full bg-gray-950/60 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-1 block">Contraseña</label>
            <div className="relative">
              <FiLock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={16}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full bg-gray-950/60 border border-gray-700 rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/30 transform hover:scale-[1.02]"
          >
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </button>
        </form>

        {/* Social Login */}
        <div className="mt-8 space-y-3">
          <button className="w-full bg-gray-900/50 hover:bg-gray-800 border border-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3 hover:border-blue-500/30">
            <FiGithub size={20} />
            <span>Continuar con GitHub</span>
          </button>

          <button className="w-full bg-gray-900/50 hover:bg-gray-800 border border-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3 hover:border-blue-500/30">
            <FaGoogle size={20}/>
            <span>Continuar con Google</span>
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          © {new Date().getFullYear()} LyxLang Studio. Todos los derechos reservados.
        </p>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
      `}</style>
    </div>
  );
};

export default Login;

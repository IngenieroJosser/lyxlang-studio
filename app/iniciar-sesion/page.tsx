'use client';
import { useState } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiGithub } from 'react-icons/fi';
import Image from 'next/image';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/30">
                <Image 
                  src='/lyxlang-lyxlang-studio-with-text-removebg-preview.png'
                  alt='Logo de LyxLang'
                  width={30}
                  height={30}
                  className='object-contain rounded-4xl'
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </h2>
                <p className="text-sm text-gray-400">
                  {isLogin ? 'Bienvenido de vuelta' : 'Únete a LyxLang'}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-800/50 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                isLogin
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                !isLogin
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Registrarse
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Nombre completo</label>
              <div className="relative">
                <FiUser
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-colors"
                  placeholder="Tu nombre completo"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Correo electrónico</label>
            <div className="relative">
              <FiMail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="email"
                className="w-full bg-gray-950 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-colors"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Contraseña</label>
            <div className="relative">
              <FiLock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
          >
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </button>
        </div>

        {/* Social login */}
        <div className="p-6 border-t border-gray-800">
          <div className="space-y-3">
            <button
              className="w-full bg-gray-950 hover:bg-gray-800 border border-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3"
            >
              <FiGithub size={20} />
              <span>Continuar con GitHub</span>
            </button>

            <button
              className="w-full bg-gray-950 hover:bg-gray-800 border border-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3"
            >
              <span>Continuar con Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

'use client';
import { useState, useEffect } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiGithub, FiAlertCircle } from 'react-icons/fi';
import Image from 'next/image';
import { FaGoogle } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const { login, register, isAuthenticated, user, loading: authLoading, error: authError } = useAuth();
  const router = useRouter();

  // Redirección cuando se autentica
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('✅ User authenticated, redirecting to editor...');
      router.push('/editor');
    }
  }, [isAuthenticated, user, router]);

  // Fondo dinámico estilo Home
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isLogin) {
        // Login
        await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        // Register
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      }
      
      // El useEffect se encargará de la redirección
    } catch (err: any) {
      console.error('Auth error:', err);
      // El error ya está manejado en el hook useAuth
    } finally {
      setSubmitting(false);
    }
  };

  const handleSocialLogin = (provider: 'github' | 'google') => {
    // Aquí integrarías OAuth cuando esté listo
    alert(`Login con ${provider} está en desarrollo`);
  };

  // Si está cargando la verificación de autenticación
  if (authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si ya está autenticado, mostrar loading de redirección
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Redirigiendo al editor...</p>
        </div>
      </div>
    );
  }

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
            onClick={() => {
              setIsLogin(true);
            }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
              isLogin
                ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-blue-300 border border-blue-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
            }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
              !isLogin
                ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-blue-300 border border-blue-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* Mensaje de error */}
        {authError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start space-x-3">
            <FiAlertCircle className="text-red-400 mt-0.5 flex-shrink-0" size={16} />
            <p className="text-red-300 text-sm flex-1">{authError}</p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Nombre completo</label>
              <div className="relative">
                <FiUser
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  size={16}
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Tu nombre completo"
                  className="w-full bg-gray-950/60 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all"
                  required={!isLogin}
                  disabled={submitting}
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-sm text-gray-300 mb-2 block">Correo electrónico</label>
            <div className="relative">
              <FiMail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={16}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className="w-full bg-gray-950/60 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all"
                required
                disabled={submitting}
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-2 block">Contraseña</label>
            <div className="relative">
              <FiLock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={16}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-gray-950/60 border border-gray-700 rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all"
                required
                disabled={submitting}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                disabled={submitting}
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {!isLogin && (
              <p className="text-xs text-gray-500 mt-2">
                La contraseña debe tener al menos 6 caracteres
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/30 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
          >
            {submitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{isLogin ? 'Iniciando sesión...' : 'Creando cuenta...'}</span>
              </div>
            ) : (
              isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'
            )}
          </button>
        </form>

        {/* Separador */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900/80 text-gray-400">O continúa con</span>
          </div>
        </div>

        {/* Social Login */}
        <div className="space-y-3">
          <button 
            onClick={() => handleSocialLogin('github')}
            disabled={submitting}
            className="w-full bg-gray-900/50 hover:bg-gray-800 border border-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3 hover:border-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiGithub size={20} />
            <span>GitHub</span>
          </button>

          <button 
            onClick={() => handleSocialLogin('google')}
            disabled={submitting}
            className="w-full bg-gray-900/50 hover:bg-gray-800 border border-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3 hover:border-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaGoogle size={20}/>
            <span>Google</span>
          </button>
        </div>

        {/* Información adicional */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            {isLogin ? '¿No tienes una cuenta? ' : '¿Ya tienes una cuenta? '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
              }}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              disabled={submitting}
            >
              {isLogin ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          © {new Date().getFullYear()} LyxLang Studio. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default Login;
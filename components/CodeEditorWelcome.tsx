'use client'
import { useState, useEffect } from 'react';
import { FiCode, FiCpu, FiZap } from 'react-icons/fi';

const CodeEditorWelcome = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  const fullText = "¡Bienvenido al Editor!";

  // Efecto de escritura tipo máquina
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, fullText]);

  // Efecto de parpadeo del cursor
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="relative group text-center max-w-2xl w-full">
        
        {/* Efectos de fondo animados */}
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-all duration-1000 animate-pulse"></div>
        
        {/* Partículas flotantes */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.6 + 0.2
              }}
            />
          ))}
        </div>

        <div className="relative p-12 lg:p-16 bg-gray-900/90 backdrop-blur-2xl border border-gray-700/50 rounded-3xl shadow-2xl transition-all duration-700 hover:shadow-[0_0_50px_rgba(120,119,198,0.3)] hover:scale-[1.02]">
          
          {/* Ícono principal con efecto de brillo */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full animate-pulse" />
            <div className="relative">
              <FiCode className="text-6xl text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)] mx-auto animate-float" />
              {/* <FiSparkles className="absolute -top-2 -right-2 text-yellow-400 animate-spin-slow" /> */}
            </div>
          </div>

          {/* Título con efecto de máquina de escribir */}
          <h1 className="text-4xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-6 tracking-tight">
            {displayText}
            <span className={`ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>
          </h1>

          {/* Subtítulo */}
          <p className="text-xl text-gray-300 mb-8 font-light tracking-wide">
            Donde las ideas se convierten en 
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-semibold mx-2">
              código realidad
            </span>
            ✨
          </p>

          {/* Línea decorativa */}
          <div className="w-32 h-1 mx-auto bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 rounded-full mb-8 animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.5)]" />

          {/* Características */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { icon: FiCpu, text: "Rápido", color: "text-cyan-400" },
              { icon: FiZap, text: "Eficiente", color: "text-yellow-400" },
              // { icon: FiSparkles, text: "Moderno", color: "text-purple-400" },
              { icon: FiCode, text: "Flexible", color: "text-blue-400" }
            ].map((item, index) => (
              <div key={index} className="text-center group/item">
                <item.icon className={`text-2xl ${item.color} mx-auto mb-2 drop-shadow-lg transition-transform duration-300 group-hover/item:scale-125`} />
                <p className="text-gray-400 text-sm font-medium group-hover/item:text-white transition-colors">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          {/* Call to action */}
          <button className="group/btn relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]">
            <span className="relative z-10">Comenzar a Crear</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
          </button>

          {/* Texto de ayuda */}
          <p className="text-gray-500 text-sm mt-8 font-light animate-pulse">
            Selecciona un archivo o crea uno nuevo para empezar
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default CodeEditorWelcome;
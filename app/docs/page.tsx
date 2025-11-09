'use client';
import { useState, useEffect } from 'react';
import { 
  FiBook, 
  FiUsers, 
  FiFileText, 
  FiCode, 
  FiGithub, 
  FiMail,
  FiArrowLeft,
  FiStar,
  FiHeart,
  FiShield,
  FiZap,
  FiLayout,
  FiCoffee,
  FiAward,
  FiGlobe,
  FiCheck,
  FiArrowRight,
  FiFolder,
  FiTerminal,
  FiCpu
} from 'react-icons/fi';
import Image from 'next/image';

const DocumentationView = () => {
  const [activeSection, setActiveSection] = useState('code-of-conduct');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = {
    'code-of-conduct': {
      title: 'Código de Conducta',
      icon: <FiShield className="text-purple-400" />,
      badge: 'Comunidad',
      description: 'Nuestros valores y estándares comunitarios',
      gradient: 'from-purple-500 to-pink-500',
      content: `# Código de Conducta de LyxLang Studio

## Nuestra Misión

Fomentar una comunidad donde los developers puedan crear, aprender y colaborar con respeto, apertura y empatía.  
LyxLang Studio es un espacio donde todas las ideas y aportes son bienvenidos, siempre que se compartan con profesionalismo y buena actitud.

---

## Nuestros Compromisos

Como miembros, colaboradores y líderes de la comunidad, nos comprometemos a:

- Crear un ambiente seguro libre de acoso, discriminación o violencia
- Escuchar activamente y valorar las opiniones de los demás
- Aceptar críticas constructivas con humildad y respeto
- Celebrar los logros de la comunidad y de otros developers
- Promover la inclusión y el aprendizaje colaborativo

---

## Comportamientos Inaceptables

No serán tolerados los siguientes comportamientos:

- Comentarios ofensivos, discriminatorios o violentos
- Ataques personales o políticos hacia otros miembros
- Acoso, trolling o difusión de información privada sin permiso
- Spam, autopromoción excesiva o uso indebido de los canales

Cualquier miembro que incurra en estas conductas podrá ser advertido, suspendido o expulsado de la comunidad.

---

## Responsabilidades de Liderazgo

Los líderes del proyecto son responsables de:

- Revisar y responder a reportes de conducta inadecuada
- Actuar con imparcialidad, discreción y respeto
- Comunicar claramente las decisiones tomadas
- Priorizar la seguridad y bienestar de la comunidad

---

## Reportar Incidentes

Si observas un comportamiento que viole este código:

**Email:** conduct@lyxlang.dev  
**Respuesta:** Máximo 48 horas  
**Confidencialidad:** Total garantizada

Tu reporte será tratado con el máximo respeto y discreción.

---

## Aplicación y Consecuencias

El equipo revisará los incidentes y tomará medidas proporcionales:

1. Advertencia privada - Comunicación directa
2. Suspensión temporal - Acceso limitado por tiempo definido
3. Expulsión definitiva - Remoción permanente del proyecto

---

## Alcance Global

Este Código de Conducta aplica en todos los espacios de LyxLang Studio:

- Repositorios de GitHub
- Comunidades en línea (Discord, Reddit, X, etc.)
- Eventos virtuales o presenciales
- Canales oficiales del proyecto

---

## Inspiración y Base

Este documento se basa en el Contributor Covenant v2.1, adaptado a la cultura y valores de LyxLang Studio.

---

Crea con pasión, comparte con respeto, colabora con propósito.`
    },
    'contributing': {
      title: 'Guía de Contribución',
      icon: <FiZap className="text-green-400" />,
      badge: 'Desarrollo',
      description: 'Cómo contribuir al crecimiento del proyecto',
      gradient: 'from-green-500 to-cyan-500',
      content: `# Guía para Contribuir a LyxLang Studio

¡Gracias por tu interés en mejorar LyxLang Studio!  
Este proyecto es open source y depende de personas como tú para crecer, evolucionar y seguir inspirando a la comunidad developer.

---

## Filosofía del Proyecto

LyxLang Studio busca ser una plataforma abierta donde cualquier developer pueda crear, colaborar y crecer.  
Nuestro objetivo es construir una experiencia transparente, inclusiva y de alto rendimiento, directamente desde el navegador.

Cada contribución, sin importar su tamaño, ayuda a que más personas descubran el poder de construir en comunidad.

---

## Cómo Contribuir

### Preparación del Entorno
\`\`\`bash
# Fork del repositorio
git fork https://github.com/IngenieroJosser/lyxlang-studio

# Clonar localmente
git clone https://github.com/tu-usuario/lyxlang-studio

# Navegar al directorio
cd lyxlang-studio
\`\`\`

### Configuración del Desarrollo
\`\`\`bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Verificar tipos TypeScript
npm run type-check
\`\`\`

### Flujo de Trabajo
\`\`\`bash
# Crear rama feature
git checkout -b feat/nueva-funcionalidad

# Crear rama fix
git checkout -b fix/correccion-bug

# Hacer commit semántico
git commit -m "feat: agrega sistema de recompensas"
git commit -m "fix: corrige ejecución en monaco-editor"
\`\`\`

### Envío de Cambios
\`\`\`bash
# Subir cambios
git push origin feat/nueva-funcionalidad

# Crear Pull Request desde GitHub
# Esperar revisión y aprobación
\`\`\`

---

## Estilo de Código

### Tecnologías Principales
- Next.js 14 - Framework React
- TypeScript - Tipado estático
- TailwindCSS - Estilos utility-first
- Monaco Editor - Editor de código

### Convenciones de Commits
| Tipo | Uso | Ejemplo |
|------|-----|---------|
| feat: | Nueva funcionalidad | feat: add real-time collaboration |
| fix: | Corrección de bugs | fix: resolve memory leak in compiler |
| docs: | Documentación | docs: update API reference |
| style: | Formato | style: improve button hover states |
| refactor: | Reestructuración | refactor: optimize file system operations |
| test: | Pruebas | test: add unit tests for TypeScript compiler |
| chore: | Tareas | chore: update dependencies |

---

## Quality Assurance

### Ejecutar Pruebas
\`\`\`bash
# Ejecutar suite completa
npm run test

# Modo watch para desarrollo
npm run test:watch

# Generar reporte de coverage
npm run test:coverage

# Verificación de tipos
npm run type-check
\`\`\`

### Estándares de Calidad
- 100% TypeScript - Código completamente tipado
- ESLint + Prettier - Formato consistente
- Tests unitarios - Cobertura mínima del 80%
- Responsive design - Compatibilidad multiplataforma

---

## Reportar Issues

### Plantilla de Bug Report
\`\`\`markdown
## Descripción
[Descripción clara del problema]

## Pasos para Reproducir
1. [Primer paso]
2. [Segundo paso]
3. [Resultado esperado vs actual]

## Entorno
- SO: [Windows/macOS/Linux]
- Navegador: [Chrome/Firefox/Safari]
- Versión: [Versión de LyxLang Studio]

## Logs/Evidencia
[Capturas, logs de consola, etc.]
\`\`\`

---

## Comunicación y Soporte

### Canales Oficiales
- GitHub Discussions - Discusiones técnicas
- X/Twitter - @LyxLangDev
- Discord - Comunidad en tiempo real (próximamente)
- Email - community@lyxlang.dev

### Horarios de Respuesta
- Issues: 24-48 horas
- Pull Requests: 48-72 horas
- Consultas: 24 horas

---

## Reconocimientos

### Programa de Contribuidores
- Contribuidor Novato - Primera contribución aceptada
- Contribuidor Activo - 5+ PRs mergeados
- Contribuidor Destacado - 15+ PRs con impacto significativo
- Miembro del Core Team - Invitación al equipo central

### Beneficios
- Reconocimiento público en nuestro hall of fame
- Acceso early a nuevas features
- Oportunidades de mentoring
- Referencias profesionales

---

La magia sucede cuando developers apasionados se unen para construir algo extraordinario.

Crea. Colabora. Transforma. — LyxLang Studio Team`
    },
    'license': {
      title: 'Licencia MIT',
      icon: <FiAward className="text-blue-400" />,
      badge: 'Legal',
      description: 'Términos de uso y distribución',
      gradient: 'from-blue-500 to-indigo-500',
      content: `# Licencia MIT

Copyright (c) 2025 LyxLang Studio

---

## Texto Oficial (Inglés)

\`\`\`text
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
\`\`\`

---

## Traducción No Oficial (Español)

Se concede permiso, de forma gratuita, a cualquier persona que obtenga una copia de este software y de los archivos de documentación asociados (el "Software"), para utilizar el Software sin restricción, incluyendo sin limitación los derechos de usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar, y/o vender copias del Software, y para permitir a las personas a las que se les proporcione el Software a hacer lo mismo, sujeto a las siguientes condiciones:

El aviso de copyright anterior y este aviso de permiso se incluirán en todas las copias o partes sustanciales del Software.

EL SOFTWARE SE PROPORCIONA "TAL CUAL", SIN GARANTÍA DE NINGÚN TIPO, EXPRESA O IMPLÍCITA, INCLUYENDO PERO NO LIMITADO A GARANTÍAS DE COMERCIALIZACIÓN, IDONEIDAD PARA UN PROPÓSITO PARTICULAR Y NO INFRACCIÓN. EN NINGÚN CASO LOS AUTORES O TITULARES DEL COPYRIGHT SERÁN RESPONSABLES DE NINGUNA RECLAMACIÓN, DAÑOS U OTRAS RESPONSABILIDADES, YA SEA EN UNA ACCIÓN CONTRACTUAL, AGRAVIO O CUALQUIER OTRO MOTIVO, QUE SURJA DE O EN CONEXIÓN CON EL SOFTWARE O EL USO U OTRO TIPO DE ACCIONES EN EL SOFTWARE.

---

## Interpretación Legal

### Derechos Concedidos
- Uso comercial - Libre para proyectos comerciales
- Modificación - Puedes adaptar el código
- Distribución - Puedes redistribuir el software
- Sublicencia - Puedes licenciar trabajos derivados

### Responsabilidades
- Atribución - Mantener notice de copyright
- Sin garantía - Software se provee "as-is"
- Limitación de responsabilidad - Los autores no son responsables por daños

### Compatibilidad
Esta licencia es compatible con:
- GPL v3 - Puedes incorporar en proyectos GPL
- Apache 2.0 - Compatibilidad total
- BSD - Todas las variantes
- Proprietario - Uso en software cerrado

---

## Impacto Global

### Estadísticas de la Licencia MIT
- #1 en GitHub - Licencia más popular
- 75% de proyectos - Uso predominante en open source
- Empresas Fortune 500 - Amplia adopción corporativa
- Ecosistema saludable - Fomenta la innovación abierta

---

La licencia MIT equilibra perfectamente la libertad del desarrollador con la protección del autor.

---

**Nota Legal:** Esta es una traducción no oficial al español de la licencia MIT.  
La licencia oficial es la versión en inglés; esta traducción se incluye únicamente para facilitar la comprensión.  
En caso de discrepancia o duda de interpretación, prevalece la versión original en inglés.`
    }
  };

  const MarkdownRenderer = ({ content }: { content: string }) => {
    const lines = content.split('\n');
    let inCodeBlock = false;
    let codeLanguage = '';
    let codeContent: string[] = [];

    return (
      <div className="prose prose-invert max-w-none">
        {lines.map((line, index) => {
          // Handle code blocks
          if (line.startsWith('```')) {
            if (!inCodeBlock) {
              inCodeBlock = true;
              codeLanguage = line.substring(3) || 'text';
              codeContent = [];
              return null;
            } else {
              inCodeBlock = false;
              const codeBlock = (
                <pre key={index} className="bg-gray-900/80 rounded-xl p-6 my-6 overflow-x-auto border border-gray-700/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-400 font-mono">{codeLanguage}</span>
                    <button 
                      onClick={() => navigator.clipboard.writeText(codeContent.join('\n'))}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                    >
                      <FiFileText size={12} />
                      Copiar
                    </button>
                  </div>
                  <code className="text-sm text-green-300 font-mono block">
                    {codeContent.join('\n')}
                  </code>
                </pre>
              );
              codeContent = [];
              return codeBlock;
            }
          }

          if (inCodeBlock) {
            codeContent.push(line);
            return null;
          }

          // Regular markdown parsing
          if (line.startsWith('# ')) {
            return <h1 key={index} className="text-3xl font-bold text-white mb-6 mt-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{line.substring(2)}</h1>;
          } else if (line.startsWith('## ')) {
            return <h2 key={index} className="text-2xl font-bold text-white mb-4 mt-8 border-l-4 border-blue-400 pl-4">{line.substring(3)}</h2>;
          } else if (line.startsWith('### ')) {
            return <h3 key={index} className="text-xl font-semibold text-white mb-3 mt-6">{line.substring(4)}</h3>;
          } else if (line.startsWith('---')) {
            return <hr key={index} className="my-8 border-gray-700/50" />;
          } else if (line.startsWith('> ')) {
            return (
              <blockquote key={index} className="border-l-4 border-green-400 pl-6 my-6 italic text-gray-300 bg-gray-800/30 p-4 rounded-r-xl">
                {line.substring(2)}
              </blockquote>
            );
          } else if (line.match(/^[*-] /)) {
            return (
              <li key={index} className="flex items-start my-3 text-gray-200 group">
                <FiCheck className="text-green-400 mr-3 mt-1 flex-shrink-0" size={16} />
                <span className="flex-1">{line.substring(2)}</span>
              </li>
            );
          } else if (line.match(/^\d+\. /)) {
            return (
              <li key={index} className="flex items-start my-3 text-gray-200">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">
                  {line.split('.')[0]}
                </span>
                <span>{line.substring(line.indexOf(' ') + 1)}</span>
              </li>
            );
          } else if (line.includes('**') && line.includes('**')) {
            const parts = line.split('**');
            return (
              <p key={index} className="my-4 text-gray-200 leading-relaxed">
                {parts.map((part, i) => 
                  i % 2 === 1 ? 
                  <strong key={i} className="text-white font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{part}</strong> : 
                  part
                )}
              </p>
            );
          } else if (line.trim() === '') {
            return <div key={index} className="h-4" />;
          } else {
            return <p key={index} className="my-4 text-gray-200 leading-relaxed">{line}</p>;
          }
        })}
      </div>
    );
  };

  const currentSection = sections[activeSection as keyof typeof sections];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Enhanced Header with Glass Morphism */}
      <div className={`bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-2 shadow-2xl' : 'py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <a 
                href="/editor" 
                className="flex items-center space-x-3 group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 rounded-xl blur group-hover:blur-lg transition-all duration-300 opacity-20 group-hover:opacity-40"></div>
                  <div className="relative bg-gray-800 rounded-xl p-2 border border-gray-700 group-hover:border-blue-400/50 transition-colors">
                    <FiArrowLeft className="text-blue-400 group-hover:text-blue-300 transition-colors" size={20} />
                  </div>
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors font-medium">Volver al Editor</span>
              </a>
              
              <div className="h-8 w-px bg-gradient-to-b from-gray-600 to-gray-700"></div>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 rounded-2xl blur opacity-20 animate-pulse"></div>
                  <Image 
                    src='/lyxlang-lyxlang-studio-with-text-removebg-preview.png'
                    alt='Logo de LyxLang Studio'
                    width={32}
                    height={32}
                    className='objetic-cover'
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    LyxLang Studio
                  </h1>
                  <p className="text-sm text-gray-400">Documentación Oficial</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden lg:flex items-center space-x-3 text-sm">
                <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                  <FiStar className="text-yellow-400 animate-pulse" />
                  <span className="text-gray-300">Construido para la Comunidad</span>
                </div>
              </div>
              
              <a
                href="https://github.com/IngenieroJosser/lyxlang-studio"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-3 px-4 py-2 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 border border-gray-700 hover:border-blue-400/30 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <FiGithub className="text-gray-400 group-hover:text-white transition-colors" size={20} />
                <span className="font-medium">GitHub</span>
                <FiArrowRight className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Enhanced Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-gray-800/30 rounded-2xl border border-gray-700/50 p-6 backdrop-blur-xl sticky top-24">
              <div className="mb-8">
                <h2 className="text-lg font-bold text-white mb-2">Documentación</h2>
                <p className="text-sm text-gray-400">Guías completas y recursos</p>
              </div>
              
              <div className="space-y-3">
                {Object.entries(sections).map(([key, section]) => (
                  <button
                    key={key}
                    onClick={() => setActiveSection(key)}
                    className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-300 text-left group ${
                      activeSection === key
                        ? `bg-gradient-to-r ${section.gradient} text-white shadow-xl transform scale-105`
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50 border border-transparent hover:border-gray-600'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      activeSection === key ? 'bg-white/20' : 'bg-gray-700/50 group-hover:bg-gray-600/50'
                    }`}>
                      {section.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{section.title}</div>
                      <div className="text-xs opacity-80 mt-1 truncate">{section.description}</div>
                    </div>
                    {activeSection === key && (
                      <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-700/50">
                <h3 className="text-sm font-semibold text-gray-400 mb-4">Enlaces Rápidos</h3>
                <div className="space-y-3">
                  <a
                    href="/"
                    className="flex items-center space-x-3 text-gray-300 hover:text-white transition-all duration-300 p-3 rounded-xl hover:bg-gray-700/30 group"
                  >
                    <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                      <FiLayout className="text-blue-400" size={18} />
                    </div>
                    <span className="font-medium text-sm">Ir al Editor</span>
                  </a>
                  <a
                    href="mailto:community@lyxlang.dev"
                    className="flex items-center space-x-3 text-gray-300 hover:text-white transition-all duration-300 p-3 rounded-xl hover:bg-gray-700/30 group"
                  >
                    <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                      <FiMail className="text-green-400" size={18} />
                    </div>
                    <span className="font-medium text-sm">Contactar Soporte</span>
                  </a>
                </div>
              </div>

              {/* Stats Card */}
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50">
                <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                  <FiCoffee className="text-yellow-400" />
                  <span>Estado del Proyecto</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="text-center p-2 rounded-lg bg-blue-500/10">
                    <div className="text-blue-400 font-bold">Active</div>
                    <div className="text-gray-400">Status</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-green-500/10">
                    <div className="text-green-400 font-bold">MIT</div>
                    <div className="text-gray-400">License</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Main Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-gray-800/20 rounded-2xl border border-gray-700/30 backdrop-blur-xl overflow-hidden shadow-2xl">
              {/* Dynamic Content Header */}
              <div className={`bg-gradient-to-r ${currentSection.gradient} bg-size-200 bg-pos-0 hover:bg-pos-100 transition-all duration-500 px-6 py-6 border-b border-gray-700/30`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                      {currentSection.icon}
                    </div>
                    <div>
                      <div className="flex items-center space-x-3">
                        <h1 className="text-3xl font-bold text-white">
                          {currentSection.title}
                        </h1>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
                          {currentSection.badge}
                        </span>
                      </div>
                      <p className="text-white/80 mt-1">{currentSection.description}</p>
                    </div>
                  </div>
                  <div className="hidden lg:flex items-center space-x-2 text-white/80">
                    <FiHeart className="text-red-300 animate-pulse" size={18} />
                    <span className="text-sm font-medium">LyxLang Studio Team</span>
                  </div>
                </div>
              </div>

              {/* Content Body with Enhanced Styling */}
              <div className="p-6 lg:p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/30">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-gray-800/20 rounded-2xl p-1 backdrop-blur-sm">
                    <MarkdownRenderer content={currentSection.content} />
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Footer */}
            <div className="mt-8 text-center">
              <div className="bg-gray-800/30 rounded-2xl border border-gray-700/30 p-6 backdrop-blur-xl">
                <div className="flex items-center justify-center space-x-6 mb-4">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <FiGlobe className="text-blue-400" />
                    <span>Global Community</span>
                  </div>
                  <div className="h-4 w-px bg-gray-600"></div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <FiAward className="text-green-400" />
                    <span>MIT Licensed</span>
                  </div>
                  <div className="h-4 w-px bg-gray-600"></div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <FiZap className="text-yellow-400" />
                    <span>Active Development</span>
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm mb-2">
                  ¿Necesitas ayuda?{' '}
                  <a 
                    href="mailto:community@lyxlang.dev" 
                    className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  >
                    community@lyxlang.dev
                  </a>
                </p>
                <p className="text-gray-500 text-xs">
                  © 2025 LyxLang Studio. Construido con <FiHeart className="inline text-red-400" size={12} /> para la comunidad developer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationView;
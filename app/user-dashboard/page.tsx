'use client';
import React, { useState, useEffect, useMemo } from 'react';
import {
  FiUser,
  FiFolder,
  FiCode,
  FiAward,
  FiBarChart2,
  FiCalendar,
  FiClock,
  FiCpu,
  FiDatabase,
  FiGitBranch,
  FiTrendingUp,
  FiStar,
  FiTarget,
  FiZap,
  FiUsers,
  FiPackage,
  FiShield,
  FiCheckCircle,
  FiAperture,
  FiCoffee,
  FiGitPullRequest,
  FiCloud,
  FiHardDrive,
  FiLayers,
  FiRefreshCw,
  FiEye,
  FiLock,
  FiGlobe,
  FiDownload,
  FiUpload,
  FiActivity,
  FiBook,
  FiTool,
  FiMenu,
  FiX
} from 'react-icons/fi';
import Image from 'next/image';
import {
  User,
  Plan,
  Organization,
  Project,
  ProjectCollaborators,
  File,
  Folder,
  EditorConfig,
  GitHubSync,
  CompilationLog,
  Snapshot,
  FileHistory,
  AuditLog,
  ProjectConfig,
  Badge
} from '@/lib/type';

// Componente de métrica mejorado
const MetricCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'blue',
  onClick,
  interactive = false
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  color?: string;
  onClick?: () => void;
  interactive?: boolean;
}) => (
  <div
    onClick={onClick}
    className={`
      bg-linear-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-4 sm:p-6 backdrop-blur-sm 
      hover:border-gray-600/50 transition-all duration-300 group
      ${interactive ? 'cursor-pointer hover:scale-105' : ''}
    `}
  >
    <div className="flex items-center justify-between mb-3 sm:mb-4">
      <div className={`p-2 sm:p-3 rounded-lg bg-${color}-500/10 border border-${color}-400/20 group-hover:border-${color}-400/30 transition-colors`}>
        {icon}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${trend.isPositive
            ? 'bg-green-500/10 text-green-400 border border-green-400/20'
            : 'bg-red-500/10 text-red-400 border border-red-400/20'
          }`}>
          <FiTrendingUp className={trend.isPositive ? '' : 'rotate-180'} size={12} />
          <span>{Math.abs(trend.value)}%</span>
        </div>
      )}
    </div>
    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{value}</h3>
    <p className="text-gray-300 font-medium text-sm">{title}</p>
    {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
  </div>
);

// Componente de progreso de plan CORREGIDO
const PlanProgress = ({ user }: { user: User }) => {
  const plan = user.plan;
  const storageUsedMB = Number(user.storageUsed) / (1024 * 1024);
  const storageMaxMB = Number(plan?.maxStorage || 1) / (1024 * 1024);
  const storagePercentage = (storageUsedMB / storageMaxMB) * 100;
  const compilationsPercentage = (user.compilationsThisMonth / (plan?.maxCompilationsPerMonth || 1)) * 100;
  const projectsPercentage = (user.projects.length / (plan?.maxProjects || 1)) * 100;

  return (
    <div className="bg-linear-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-lg font-semibold text-white">Límites del Plan {plan?.name}</h3>
        <div className="flex items-center gap-2 px-2 sm:px-3 py-1 bg-blue-500/10 rounded-full border border-blue-400/20">
          <FiShield className="text-blue-400" size={14} />
          <span className="text-blue-400 text-sm font-medium">{plan?.name}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-300">Almacenamiento</span>
            <span className="text-gray-400">
              {storageUsedMB.toFixed(1)}MB / {storageMaxMB.toFixed(1)}MB
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3">
            <div
              className="bg-blue-500 h-2 sm:h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(storagePercentage, 100)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-300">Compilaciones este mes</span>
            <span className="text-gray-400">
              {user.compilationsThisMonth} / {plan?.maxCompilationsPerMonth}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3">
            <div
              className="bg-green-500 h-2 sm:h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(compilationsPercentage, 100)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-300">Proyectos activos</span>
            <span className="text-gray-400">
              {user.projects.length} / {plan?.maxProjects}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3">
            <div
              className="bg-purple-500 h-2 sm:h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(projectsPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {user.planExpiresAt && (
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Plan expira</span>
            <span className="text-yellow-400">
              {new Date(user.planExpiresAt).toLocaleDateString('es-ES')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente de actividad reciente
const RecentActivity = ({ auditLogs }: { auditLogs: AuditLog[] }) => {
  const getActionIcon = (action: string) => {
    if (action.includes('project')) return <FiFolder className="text-blue-400" size={16} />;
    if (action.includes('file')) return <FiCode className="text-green-400" size={16} />;
    if (action.includes('compile')) return <FiCpu className="text-purple-400" size={16} />;
    if (action.includes('user')) return <FiUser className="text-yellow-400" size={16} />;
    return <FiActivity className="text-gray-400" size={16} />;
  };

  const formatAction = (action: string) => {
    return action.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim() || action;
  };

  return (
    <div className="bg-linear-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Actividad Reciente</h3>
      <div className="space-y-3">
        {auditLogs.slice(0, 5).map(log => (
          <div key={log.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors">
            {getActionIcon(log.action)}
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">
                {formatAction(log.action)}
              </div>
              <div className="text-gray-400 text-xs truncate">
                {log.resourceType} • {new Date(log.createdAt).toLocaleDateString('es-ES')}
              </div>
            </div>
            <div className="text-gray-500 text-xs shrink-0">
              {new Date(log.createdAt).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente de estadísticas de compilación
const CompilationStats = ({ compilationLogs }: { compilationLogs: CompilationLog[] }) => {
  const stats = useMemo(() => {
    const total = compilationLogs.length;
    const successful = compilationLogs.filter(log => log.success).length;
    const successRate = total > 0 ? (successful / total) * 100 : 0;
    const avgDuration = compilationLogs.reduce((sum, log) => sum + (log.duration || 0), 0) / total;
    const cacheHits = compilationLogs.filter(log => log.cacheHit).length;
    const cacheHitRate = total > 0 ? (cacheHits / total) * 100 : 0;

    const dailyStats = compilationLogs.reduce((acc, log) => {
      const date = new Date(log.timestamp).toLocaleDateString('es-ES');
      if (!acc[date]) {
        acc[date] = { total: 0, successful: 0 };
      }
      acc[date].total++;
      if (log.success) acc[date].successful++;
      return acc;
    }, {} as Record<string, { total: number; successful: number }>);

    return {
      total,
      successRate,
      avgDuration,
      cacheHitRate,
      dailyStats: Object.entries(dailyStats).slice(-7)
    };
  }, [compilationLogs]);

  return (
    <div className="bg-linear-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Estadísticas de Compilación</h3>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="text-center p-3 bg-gray-700/30 rounded-lg">
          <div className="text-xl sm:text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-gray-400 text-xs">Total</div>
        </div>
        <div className="text-center p-3 bg-gray-700/30 rounded-lg">
          <div className="text-xl sm:text-2xl font-bold text-green-400">{stats.successRate.toFixed(1)}%</div>
          <div className="text-gray-400 text-xs">Éxito</div>
        </div>
        <div className="text-center p-3 bg-gray-700/30 rounded-lg">
          <div className="text-xl sm:text-2xl font-bold text-blue-400">{Number.isFinite(stats?.avgDuration) ? stats.avgDuration.toFixed(0) + 'ms' : '0ms'}</div>
          <div className="text-gray-400 text-xs">Duración</div>
        </div>
        <div className="text-center p-3 bg-gray-700/30 rounded-lg">
          <div className="text-xl sm:text-2xl font-bold text-purple-400">{stats.cacheHitRate.toFixed(1)}%</div>
          <div className="text-gray-400 text-xs">Cache Hits</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Actividad (7 días)</span>
        </div>
        <div className="flex items-end justify-between gap-1 h-16 sm:h-20">
          {stats.dailyStats.map(([date, dayStats]) => (
            <div key={date} className="flex-1 flex flex-col items-center">
              <div className="flex-1 w-full flex items-end justify-center gap-1">
                <div
                  className="w-full bg-green-500/50 rounded-t transition-all duration-500"
                  style={{
                    height: `${(dayStats.successful / Math.max(...stats.dailyStats.map(([, s]) => s.total || 1))) * 80}%`
                  }}
                />
                <div
                  className="w-full bg-red-500/50 rounded-t transition-all duration-500"
                  style={{
                    height: `${((dayStats.total - dayStats.successful) / Math.max(...stats.dailyStats.map(([, s]) => s.total || 1))) * 80}%`
                  }}
                />
              </div>
              <div className="text-gray-500 text-xs mt-1 truncate">
                {new Date(date).toLocaleDateString('es-ES', { weekday: 'narrow' })}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-3 sm:gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500/50 rounded"></div>
            <span className="hidden sm:inline">Exitosas</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500/50 rounded"></div>
            <span className="hidden sm:inline">Fallidas</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de proyecto responsive
const ProjectCard = ({ project, onClick }: { project: Project; onClick?: () => void }) => {
  const fileCount = project.files.length;
  const totalSize = project.files.reduce((sum, file) => sum + Number(file.size), 0);
  const successRate = project.compilationLogs.length > 0
    ? (project.compilationLogs.filter(log => log.success).length / project.compilationLogs.length) * 100
    : 0;
  const collaboratorCount = project.collaborators.length;
  const lastModified = new Date(project.updatedAt);

  return (
    <div
      onClick={onClick}
      className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-3 sm:p-4 hover:border-gray-600/50 transition-all duration-300 group cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-400/20 group-hover:border-blue-400/30 transition-colors shrink-0">
            <FiFolder className="text-blue-400" size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-white truncate text-sm sm:text-base">{project.name}</h4>
            <p className="text-gray-400 text-xs truncate">
              {project.description || 'Sin descripción'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          {project.githubSync && (
            <div className="p-1 bg-green-500/10 rounded border border-green-400/20" title="Sincronizado con GitHub">
              <FiGitBranch className="text-green-400" size={12} />
            </div>
          )}
          <div className={`
            px-2 py-1 rounded-full text-xs border
            ${project.visibility === 'PUBLIC'
              ? 'bg-green-500/10 text-green-400 border-green-400/20'
              : project.visibility === 'ORGANIZATION'
                ? 'bg-blue-500/10 text-blue-400 border-blue-400/20'
                : 'bg-gray-500/10 text-gray-400 border-gray-400/20'
            }
          `}>
            {project.visibility === 'PUBLIC' ? 'Público' :
              project.visibility === 'ORGANIZATION' ? 'Org' : 'Privado'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center mb-3">
        <div>
          <div className="text-white font-bold text-sm">{fileCount}</div>
          <div className="text-gray-400 text-xs">Archivos</div>
        </div>
        <div>
          <div className="text-white font-bold text-sm">{(totalSize / 1024).toFixed(0)}KB</div>
          <div className="text-gray-400 text-xs">Tamaño</div>
        </div>
        <div>
          <div className="text-white font-bold text-sm">{successRate.toFixed(0)}%</div>
          <div className="text-gray-400 text-xs">Éxito</div>
        </div>
        <div>
          <div className="text-white font-bold text-sm">{collaboratorCount}</div>
          <div className="text-gray-400 text-xs">Colabs</div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
        <div className="text-gray-500 text-xs">
          Modificado {lastModified.toLocaleDateString('es-ES')}
        </div>
        <button className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors">
          Abrir →
        </button>
      </div>
    </div>
  );
};

// Componente de insignia responsive
const BadgeCard = ({ badge }: { badge: Badge }) => (
  <div className={`
    relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 group
    ${badge.achieved
      ? `bg-linear-to-br ${badge.color} border-transparent shadow-lg`
      : 'bg-gray-800/30 border-gray-700/50 hover:border-gray-600/50'
    }
  `}>
    <div className="flex items-start gap-2 sm:gap-3">
      <div className={`
        p-2 sm:p-3 rounded-lg transition-colors shrink-0
        ${badge.achieved
          ? 'bg-white/10'
          : 'bg-gray-700/50'
        }
      `}>
        {badge.icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className={`font-semibold text-sm mb-1 ${badge.achieved ? 'text-white' : 'text-gray-300'}`}>
          {badge.name}
        </h4>
        <p className={`text-xs mb-2 sm:mb-3 ${badge.achieved ? 'text-white/80' : 'text-gray-400'}`}>
          {badge.description}
        </p>

        {badge.requirements.map((req, index) => (
          <div key={index} className="mb-1 sm:mb-2 last:mb-0">
            <div className="flex justify-between text-xs mb-1">
              <span className={badge.achieved ? 'text-white/90' : 'text-gray-300'}>
                {req.metric}
              </span>
              <span className={badge.achieved ? 'text-white/90' : 'text-gray-400'}>
                {req.current}{req.unit} / {req.target}{req.unit}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: `${(req.current / req.target) * 100}%`,
                  backgroundColor: badge.achieved ? '#ffffff' : '#3b82f6'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>

    {badge.achieved && (
      <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
        <div className="bg-green-500 rounded-full p-1 shadow-lg">
          <FiCheckCircle size={12} className="text-white" />
        </div>
      </div>
    )}
  </div>
);

// Componente principal del Dashboard Mejorado y Responsive
const EnhancedUserDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'badges' | 'analytics' | 'organization'>('overview');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Datos de ejemplo (simplificados para el ejemplo)
  const [userData, setUserData] = useState<User>({
    id: '1',
    email: 'usuario@ejemplo.com',
    name: 'Juan Pérez',
    avatar: null,
    locale: 'es-ES',
    timezone: 'UTC-3',
    planId: 'pro',
    plan: {
      id: 'pro',
      name: 'Plan Pro',
      slug: 'pro',
      description: 'Plan profesional para desarrolladores',
      maxStorage: BigInt(1073741824),
      maxProjects: 50,
      maxCompilationsPerMonth: 10000,
      maxCollaboratorsPerProject: 10,
      features: {
        githubSync: true,
        advancedAnalytics: true,
        teamCollaboration: true,
        prioritySupport: true
      },
      priceMonthly: 19.99,
      priceYearly: 199.99,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z'
    },
    planExpiresAt: '2024-12-31T23:59:59Z', // ✅ Corregido: en User, no en Plan
    storageUsed: BigInt(256000000),
    compilationsThisMonth: 342,
    organizationId: 'org1',
    organization: {
      id: 'org1',
      name: 'Mi Empresa S.A.',
      slug: 'mi-empresa',
      avatar: null,
      planId: 'enterprise',
      plan: {
        id: 'enterprise',
        name: 'Enterprise',
        slug: 'enterprise',
        description: 'Plan empresarial',
        maxStorage: BigInt(5368709120),
        maxProjects: 200,
        maxCompilationsPerMonth: 50000,
        maxCollaboratorsPerProject: 50,
        features: {
          advancedSecurity: true,
          customDomains: true,
          sso: true,
          dedicatedSupport: true
        },
        priceMonthly: 99.99,
        priceYearly: 999.99,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      members: [],
      projects: [],
      storageUsed: BigInt(1024000000),
      compilationsThisMonth: 1234,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-03-15T00:00:00Z'
    },
    projects: [],
    collaboratedProjects: [],
    editorConfig: null,
    auditLogs: [],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-03-15T14:30:00Z',
    lastLoginAt: new Date().toISOString(),
    deletedAt: null
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);

  // Calcular métricas
  const metrics = useMemo(() => {
    const totalProjects = projects.length;
    const totalFiles = projects.reduce((sum, project) => sum + project.files.length, 0);
    const storageUsedMB = Number(userData.storageUsed) / (1024 * 1024);
    const storageMaxMB = Number(userData.plan?.maxStorage || 1) / (1024 * 1024);
    const storagePercentage = (storageUsedMB / storageMaxMB) * 100;

    return {
      totalProjects,
      totalFiles,
      storageUsedMB: storageUsedMB.toFixed(1),
      storageMaxMB: storageMaxMB.toFixed(1),
      storagePercentage: Math.min(storagePercentage, 100),
      compilationsUsed: userData.compilationsThisMonth,
      compilationsMax: userData.plan?.maxCompilationsPerMonth || 1,
    };
  }, [userData, projects]);

  const achievedBadges = badges.filter(badge => badge.achieved).length;
  const totalBadges = badges.length;

  // Agrupar insignias por categoría
  const badgesByCategory = useMemo(() => {
    return badges.reduce((acc, badge) => {
      if (!acc[badge.category]) {
        acc[badge.category] = [];
      }
      acc[badge.category].push(badge);
      return acc;
    }, {} as Record<string, Badge[]>);
  }, [badges]);

  // Navegación para móvil
  const MobileNavigation = () => (
    <div className="lg:hidden">
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="p-2 rounded-lg bg-gray-700/50 border border-gray-600/50"
      >
        {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-gray-800/95 backdrop-blur-lg border-b border-gray-700/50 z-50">
          <div className="p-4 space-y-2">
            {[
              { id: 'overview', label: 'Resumen', icon: FiBarChart2 },
              { id: 'projects', label: 'Proyectos', icon: FiFolder },
              { id: 'badges', label: 'Insignias', icon: FiAward },
              { id: 'analytics', label: 'Analíticas', icon: FiTrendingUp },
              ...(userData.organization ? [{ id: 'organization', label: 'Organización', icon: FiUsers }] : [])
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full p-3 rounded-lg text-left transition-colors ${activeTab === tab.id
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30'
                      : 'text-gray-300 hover:bg-gray-700/50'
                    }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header Responsive */}
      <div className="border-b border-gray-700/50 bg-gray-800/20 backdrop-blur-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <MobileNavigation />
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl blur-md bg-blue-500/20" />
                  <Image
                    src="/favicon.ico"
                    alt="LyxLang logo"
                    width={28}
                    height={28}
                    className="relative object-cover rounded-2xl ring-1 ring-white/10"
                  />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-semibold">Dashboard</h1>
                  <p className="text-sm text-gray-400">Hola, {userData.name}</p>
                </div>
                <div className="sm:hidden">
                  <h1 className="text-base font-semibold">Dashboard</h1>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {userData.organization && (
                <div className="hidden sm:flex items-center gap-2 bg-purple-500/10 rounded-lg px-3 py-1 border border-purple-400/20">
                  <FiUsers className="text-purple-400" size={14} />
                  <span className="text-purple-400 text-sm">{userData.organization.name}</span>
                </div>
              )}
              <div className="hidden xs:flex items-center gap-2 bg-gray-700/50 rounded-lg px-2 sm:px-3 py-1 border border-gray-600/50">
                <FiUser className="text-blue-400" size={14} />
                <span className="text-sm">{userData.plan?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">
                    {userData.name?.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs - Responsive */}
          <div className="hidden lg:flex space-x-8 -mb-px">
            {[
              { id: 'overview', label: 'Resumen', icon: FiBarChart2 },
              { id: 'projects', label: 'Proyectos', icon: FiFolder },
              { id: 'badges', label: 'Insignias', icon: FiAward },
              { id: 'analytics', label: 'Analíticas', icon: FiTrendingUp },
              ...(userData.organization ? [{ id: 'organization', label: 'Organización', icon: FiUsers }] : [])
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                      ? 'border-blue-400 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tabs para tablet */}
          <div className="lg:hidden flex overflow-x-auto scrollbar-hide -mx-3 px-3">
            <div className="flex space-x-4 min-w-max">
              {[
                { id: 'overview', label: 'Resumen', icon: FiBarChart2 },
                { id: 'projects', label: 'Proyectos', icon: FiFolder },
                { id: 'badges', label: 'Insignias', icon: FiAward },
                { id: 'analytics', label: 'Analíticas', icon: FiTrendingUp },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 py-3 px-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${activeTab === tab.id
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30'
                        : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/30'
                      }`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Responsive */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Metric Grid Responsive */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <MetricCard
                title="Proyectos"
                value={metrics.totalProjects.toString()}
                subtitle={`${metrics.totalProjects} de ${userData.plan?.maxProjects}`}
                icon={<FiFolder className="text-blue-400" size={18} />}
                trend={{ value: 12, isPositive: true }}
                color="blue"
                interactive
                onClick={() => setActiveTab('projects')}
              />
              <MetricCard
                title="Archivos"
                value={metrics.totalFiles.toString()}
                subtitle="Total"
                icon={<FiCode className="text-green-400" size={18} />}
                trend={{ value: 8, isPositive: true }}
                color="green"
              />
              <MetricCard
                title="Compilaciones"
                value={`${metrics.compilationsUsed}`}
                subtitle="Este mes"
                icon={<FiCpu className="text-purple-400" size={18} />}
                trend={{ value: 25, isPositive: true }}
                color="purple"
              />
              <MetricCard
                title="Almacenamiento"
                value={`${metrics.storageUsedMB}MB`}
                subtitle={`de ${metrics.storageMaxMB}MB`}
                icon={<FiDatabase className="text-orange-400" size={18} />}
                trend={{ value: -5, isPositive: false }}
                color="orange"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Proyectos Recientes */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-bold text-white">Proyectos Recientes</h2>
                  <button
                    onClick={() => setActiveTab('projects')}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    Ver todos →
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {[1, 2].map(i => (
                    <div key={i} className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 animate-pulse">
                      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/2 mb-4"></div>
                      <div className="grid grid-cols-4 gap-2">
                        {[1, 2, 3, 4].map(j => (
                          <div key={j} className="text-center">
                            <div className="h-6 bg-gray-700 rounded mb-1"></div>
                            <div className="h-3 bg-gray-700 rounded w-full"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Estadísticas de Compilación */}
                <CompilationStats compilationLogs={[]} />
              </div>

              {/* Sidebar Responsive */}
              <div className="space-y-4 sm:space-y-6">
                <PlanProgress user={userData} />

                <div className="bg-linear-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Insignias</h3>
                    <span className="text-blue-400 text-sm font-medium">
                      {achievedBadges}/{totalBadges}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className="aspect-square bg-gray-700/30 rounded-lg flex items-center justify-center">
                        <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setActiveTab('badges')}
                    className="w-full mt-4 py-2 text-sm text-gray-400 hover:text-white transition-colors border border-gray-600/30 hover:border-gray-500/50 rounded-lg"
                  >
                    Ver todas
                  </button>
                </div>

                <RecentActivity auditLogs={userData.auditLogs} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Mis Proyectos</h2>
              <div className="flex items-center gap-3">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400 w-full sm:w-auto"
                >
                  <option value="7d">7 días</option>
                  <option value="30d">30 días</option>
                  <option value="90d">90 días</option>
                </select>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                  Nuevo Proyecto
                </button>
              </div>
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total', value: '0', color: 'text-white' },
                { label: 'GitHub', value: '0', color: 'text-green-400' },
                { label: 'Colabs', value: '0', color: 'text-blue-400' },
                { label: 'Snapshots', value: '0', color: 'text-purple-400' }
              ].map((stat, i) => (
                <div key={i} className="bg-gray-800/30 rounded-lg p-3 text-center">
                  <div className={`text-lg sm:text-xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-gray-400 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 animate-pulse">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="p-2 bg-gray-700 rounded-lg shrink-0"></div>
                      <div className="min-w-0 flex-1">
                        <div className="h-4 bg-gray-700 rounded w-3/4 mb-1"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="w-12 h-6 bg-gray-700 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[1, 2, 3, 4].map(j => (
                      <div key={j} className="text-center">
                        <div className="h-6 bg-gray-700 rounded mb-1"></div>
                        <div className="h-3 bg-gray-700 rounded"></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
                    <div className="h-3 bg-gray-700 rounded w-20"></div>
                    <div className="h-3 bg-gray-700 rounded w-10"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Mis Insignias</h2>
              <div className="flex items-center gap-2 text-gray-400">
                <FiAward className="text-yellow-400" />
                <span>{achievedBadges} de {totalBadges} obtenidas</span>
              </div>
            </div>

            {/* Progreso general */}
            <div className="bg-linear-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Progreso General</h3>
                <div className="text-xl sm:text-2xl font-bold text-blue-400">
                  {Number.isFinite((achievedBadges / totalBadges) * 100)
                    ? ((achievedBadges / totalBadges) * 100).toFixed(1) + '%'
                    : '0%'}
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 sm:h-4">
                <div
                  className="h-3 sm:h-4 rounded-full bg-linear-to-r from-blue-500 to-purple-500 transition-all duration-1000"
                  style={{ width: `${(achievedBadges / totalBadges) * 100}%` }}
                />
              </div>
            </div>

            {/* Insignias por categoría */}
            {Object.entries(badgesByCategory).map(([category, categoryBadges]) => (
              <div key={category} className="space-y-4">
                <h3 className="text-lg sm:text-xl font-bold text-white capitalize">{category}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {categoryBadges.map(badge => (
                    <BadgeCard key={badge.id} badge={badge} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Analíticas</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <CompilationStats compilationLogs={[]} />

              <div className="bg-linear-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Lenguajes</h3>
                <div className="space-y-3">
                  {[
                    { language: 'TypeScript', percentage: 65, color: 'bg-blue-500' },
                    { language: 'JavaScript', percentage: 20, color: 'bg-yellow-500' },
                    { language: 'CSS/SCSS', percentage: 10, color: 'bg-purple-500' },
                    { language: 'HTML', percentage: 3, color: 'bg-red-500' },
                    { language: 'JSON', percentage: 2, color: 'bg-green-500' }
                  ].map((lang, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">{lang.language}</span>
                        <span className="text-gray-400">{lang.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`${lang.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${lang.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'organization' && userData.organization && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white">{userData.organization.name}</h2>
              <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 rounded-full border border-purple-400/20">
                <FiShield className="text-purple-400" size={14} />
                <span className="text-purple-400 text-sm font-medium">Plan {userData.organization.plan?.name}</span>
              </div>
            </div>

            {/* Métricas de la organización */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <MetricCard
                title="Miembros"
                value={userData.organization.members.length.toString()}
                icon={<FiUsers className="text-purple-400" size={18} />}
                color="purple"
              />
              <MetricCard
                title="Proyectos"
                value={userData.organization.projects.length.toString()}
                icon={<FiFolder className="text-blue-400" size={18} />}
                color="blue"
              />
              <MetricCard
                title="Almacenamiento"
                value={`${(Number(userData.organization.storageUsed) / (1024 * 1024)).toFixed(1)}MB`}
                icon={<FiDatabase className="text-green-400" size={18} />}
                color="green"
              />
              <MetricCard
                title="Compilaciones"
                value={userData.organization.compilationsThisMonth.toString()}
                icon={<FiCpu className="text-orange-400" size={18} />}
                color="orange"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedUserDashboard;
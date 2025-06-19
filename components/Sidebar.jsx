import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../app/context/AuthContext';
import { usePermissions } from '../app/hooks/usePermissions';
import { LayoutDashboard, ChefHat, Box, Users, ClipboardList, BarChart2, FileBarChart2, Settings2, Shield, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useSidebar } from '../app/context/SidebarContext';

const Sidebar = () => {
  const { user } = useAuth();
  const { isAdmin, canManageProducts } = usePermissions();
  
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const pathname = usePathname();

  // No mostrar sidebar si no hay usuario autenticado
  if (!user) {
    return null;
  }

  const menuItems = [
    {
      href: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      section: 'main'
    },
    ...(isAdmin ? [
      {
        href: '/productos',
        icon: Box,
        label: 'Gestionar Productos',
        section: 'admin'
      },
      {
        href: '/recetas',
        icon: ChefHat,
        label: 'Gestionar Recetas',
        section: 'admin'
      },
      {
        href: '/clientes',
        icon: Users,
        label: 'Gestionar Clientes',
        section: 'admin'
      },
      {
        href: '/pedidos',
        icon: ClipboardList,
        label: 'Gestionar Pedidos',
        section: 'admin'
      },
      {
        href: '/inventario',
        icon: BarChart2,
        label: 'Inventario',
        section: 'admin'
      },
      {
        href: '/reportes',
        icon: FileBarChart2,
        label: 'Reportes',
        section: 'admin'
      }
    ] : []),
    {
      href: '/perfil',
      icon: User,
      label: 'Mi Perfil',
      section: 'user'
    },
    ...(isAdmin ? [
      {
        href: '/configuracion',
        icon: Settings2,
        label: 'Configuración',
        section: 'user'
      }
    ] : [])
  ];

  const MenuItem = ({ item, isActive }) => {
    const Icon = item.icon;
    
    return (
      <li className="relative group">
        <Link
          href={item.href}
          className={`
            flex items-center relative overflow-hidden no-underline
            ${isCollapsed ? 'justify-center p-3 mx-2' : 'px-4 py-3 mx-3'} 
            rounded-xl font-medium transition-all duration-300 ease-out
            ${isActive 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white hover:shadow-md hover:transform hover:scale-[1.01]'
            }
          `}
          title={isCollapsed ? item.label : ''}
        >
          {/* Gradient overlay for active state */}
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-xl" />
          )}
          
          <Icon className={`
            ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'} 
            flex-shrink-0 transition-transform duration-300
            ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}
            ${!isCollapsed && !isActive ? 'group-hover:scale-110' : ''}
          `} />
          
          {!isCollapsed && (
            <span className={`
              transition-all duration-300 relative z-10
              ${isActive ? 'text-white font-semibold' : ''}
            `}>
              {item.label}
            </span>
          )}
          
          {/* Active indicator */}
          {isActive && !isCollapsed && (
            <div className="absolute right-3 w-2 h-2 bg-white rounded-full opacity-80" />
          )}
        </Link>
        
        {/* Tooltip for collapsed state */}
        {isCollapsed && (
          <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap shadow-xl">
            {item.label}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 dark:bg-gray-100 rotate-45" />
          </div>
        )}
      </li>
    );
  };

  const SectionHeader = ({ icon: Icon, title, color }) => {
    if (isCollapsed) return null;
    
    return (
      <div className="px-4 py-3 mx-3 mb-2">
        <div className="flex items-center space-x-2">
          <div className={`p-1 rounded-lg ${color === 'green' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
            <Icon className={`w-4 h-4 ${color === 'green' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`} />
          </div>
          <span className={`text-xs font-bold uppercase tracking-wider ${color === 'green' ? 'text-green-700 dark:text-green-400' : 'text-blue-700 dark:text-blue-400'}`}>
            {title}
          </span>
        </div>
      </div>
    );
  };

  return (
    <aside className={`
      h-screen bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl
      border-r border-gray-200/60 dark:border-gray-700/60 
      flex flex-col shadow-2xl shadow-gray-900/10 dark:shadow-black/20
      fixed left-0 top-16 z-30 transition-all duration-500 ease-out
      ${isCollapsed ? 'w-20' : 'w-72'}
    `}>
      {/* Header complementario al navbar */}
      <div className="h-16 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-gray-800/50 dark:to-gray-900/50 border-b border-gray-200/30 dark:border-gray-700/30 flex items-center px-6">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Panel</h1>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="w-full flex justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5 text-white" />
            </div>
          </div>
        )}
      </div>
      {/* Botón de toggle integrado */}
      <div className="px-4 py-3 border-b border-gray-200/30 dark:border-gray-700/30 bg-white/40 dark:bg-gray-900/40">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`
            w-full p-2.5 rounded-xl transition-all duration-300 
            bg-white dark:bg-gray-800 shadow-sm hover:shadow-md
            border border-gray-200/60 dark:border-gray-700/60
            text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white
            hover:bg-gray-50 dark:hover:bg-gray-700
            transform hover:scale-105 active:scale-95
            flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}
          `}
          title={isCollapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {!isCollapsed && <span className="text-sm font-medium">Menú</span>}
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        <ul className="space-y-1">
          {/* Dashboard */}
          <MenuItem 
            item={menuItems.find(item => item.href === '/dashboard')} 
            isActive={pathname === '/dashboard'} 
          />
          {/* Sección de Administración */}
          {isAdmin && (
            <>
              <li className="pt-6">
                <SectionHeader icon={Shield} title="Administración" color="green" />
              </li>
              {menuItems.filter(item => item.section === 'admin').map((item) => (
                <MenuItem 
                  key={item.href}
                  item={item} 
                  isActive={pathname === item.href} 
                />
              ))}
            </>
          )}
          {/* Sección de Usuario */}
          <li className="pt-6">
            <SectionHeader icon={User} title="Usuario" color="blue" />
          </li>
          {menuItems.filter(item => item.section === 'user').map((item) => (
            <MenuItem 
              key={item.href}
              item={item} 
              isActive={pathname === item.href} 
            />
          ))}
        </ul>
      </nav>
      {/* Footer con información del usuario */}
      <div className="p-4 border-t border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50">
        {isCollapsed ? (
          <div className="flex justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg">
              {user.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 shadow-sm">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg">
              {user.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                {user.email?.split('@')[0] || 'Usuario'}
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="w-3 h-3 text-gray-400" />
                <span className={`text-xs font-medium ${isAdmin ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  {isAdmin ? 'Administrador' : 'Usuario'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
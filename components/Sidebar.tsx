
import React, { useState } from 'react';
import { LinkIcon, ImageIcon, ChatIcon, LogoutIcon, CreditIcon, SearchIcon, TrendingUpIcon, TelegramIcon, ShoppingCartSendIcon, SettingsIcon, BellIcon } from './Icons';
type Page = 'dashboard' | 'admin' | 'telegram-shopee' | 'telegram' | 'whatsapp' | 'topsales' | 'search' | 'generate' | 'image' | 'chat' | 'notifications' | 'notification-demo' | 'notification-analytics' | 'notification-templates' | 'users' | 'reports';
import { useAuth } from '../hooks/useAuth';
import { ThemeToggle } from './ThemeToggle';

interface NavLinkProps {
  icon: React.ReactElement<{ className?: string }>;
  text: string;
  active?: boolean;
  disabled?: boolean;
  badge?: string | number;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ icon, text, active = false, disabled = false, badge, onClick }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg 
      transition-all duration-200 group
      ${active 
        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' 
        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
      } 
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `}
    aria-disabled={disabled}
  >
    <div className="flex items-center">
      {React.cloneElement(icon, { 
        className: `h-5 w-5 flex-shrink-0 ${active ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}` 
      })}
      <span className="ml-3 font-medium">{text}</span>
    </div>
    {badge && (
      <span className={`
        px-2 py-0.5 text-xs font-bold rounded-full
        ${active 
          ? 'bg-white/20 text-white' 
          : 'bg-primary-600 text-white'
        }
      `}>
        {badge}
      </span>
    )}
  </button>
);

interface NavSectionProps {
  title: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

const NavSection: React.FC<NavSectionProps> = ({ 
  title, 
  children, 
  collapsible = false, 
  defaultCollapsed = false 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </h3>
        {collapsible && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            <svg 
              className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>
      {!isCollapsed && (
        <nav className="space-y-1">
          {children}
        </nav>
      )}
    </div>
  );
};

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, onLogout }) => {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Simula dados de créditos e notificações
  const credits = { used: 1250, total: 5000 };
  const creditPercentage = (credits.used / credits.total) * 100;
  const unreadNotifications = 3;

  // Verifica se o usuário é admin
  const isAdmin = user?.role === 'admin';

  return (
    <aside className={`
      ${isCollapsed ? 'w-16' : 'w-64'} 
      flex-shrink-0 bg-gray-800 border-r border-gray-700 
      flex flex-col h-full transition-all duration-300 ease-in-out
    `}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ACI</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">ACI</h1>
                <p className="text-xs text-gray-400">Automações Comerciais</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <svg className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Dashboard - Sempre visível */}
        <NavSection title="Dashboard">
          <NavLink 
            icon={<span className="text-blue-400">🏠</span>} 
            text="Início" 
            active={activePage === 'dashboard'} 
            onClick={() => onNavigate('dashboard')} 
          />
        </NavSection>

        {/* Principais - Apenas para usuários autenticados */}
        <NavSection title="Automações">
          <NavLink 
            icon={<ShoppingCartSendIcon />} 
            text="Telegram + Shopee" 
            active={activePage === 'telegram-shopee'} 
            onClick={() => onNavigate('telegram-shopee')} 
          />
          <NavLink 
            icon={<TelegramIcon />} 
            text="Disparador Telegram" 
            active={activePage === 'telegram'} 
            onClick={() => onNavigate('telegram')} 
          />
          <NavLink 
            icon={<span className="text-green-400">📱</span>} 
            text="Disparador WhatsApp" 
            active={activePage === 'whatsapp'} 
            onClick={() => onNavigate('whatsapp')} 
          />
        </NavSection>

        {/* Shopee */}
        <NavSection title="Shopee" collapsible>
          <NavLink 
            icon={<TrendingUpIcon />} 
            text="Top Vendas" 
            active={activePage === 'topsales'} 
            onClick={() => onNavigate('topsales')} 
          />
          <NavLink 
            icon={<SearchIcon />} 
            text="Pesquisar Produto" 
            active={activePage === 'search'} 
            onClick={() => onNavigate('search')} 
          />
          <NavLink 
            icon={<LinkIcon />} 
            text="Gerar Link Direto" 
            active={activePage === 'generate'} 
            onClick={() => onNavigate('generate')} 
          />
        </NavSection>

        {/* IA & Conteúdo */}
        <NavSection title="IA & Conteúdo" collapsible>
          <NavLink 
            icon={<ImageIcon />} 
            text="Gerar Imagem" 
            active={activePage === 'image'} 
            onClick={() => onNavigate('image')} 
          />
          <NavLink 
            icon={<ChatIcon />} 
            text="Chat IA" 
            active={activePage === 'chat'} 
            onClick={() => onNavigate('chat')} 
          />
        </NavSection>

        {/* Notificações */}
        <NavSection title="Notificações" collapsible defaultCollapsed>
          <NavLink 
            icon={<BellIcon />} 
            text="Central" 
            active={activePage === 'notifications'} 
            onClick={() => onNavigate('notifications')}
            badge={unreadNotifications > 0 ? unreadNotifications : undefined}
          />
          <NavLink 
            icon={<span className="text-blue-400">🔔</span>} 
            text="Demo" 
            active={activePage === 'notification-demo'} 
            onClick={() => onNavigate('notification-demo')} 
          />
          <NavLink 
            icon={<span className="text-green-400">📊</span>} 
            text="Analytics" 
            active={activePage === 'notification-analytics'} 
            onClick={() => onNavigate('notification-analytics')} 
          />
          <NavLink 
            icon={<span className="text-purple-400">📋</span>} 
            text="Templates" 
            active={activePage === 'notification-templates'} 
            onClick={() => onNavigate('notification-templates')} 
          />
        </NavSection>

        {/* Administração - Apenas para admins */}
        {isAdmin && (
          <NavSection title="Administração">
            <NavLink 
              icon={<SettingsIcon />} 
              text="Configurações" 
              active={activePage === 'admin'} 
              onClick={() => onNavigate('admin')} 
            />
            <NavLink 
              icon={<span className="text-orange-400">👥</span>} 
              text="Usuários" 
              active={activePage === 'users'} 
              onClick={() => onNavigate('users')} 
            />
            <NavLink 
              icon={<span className="text-red-400">📊</span>} 
              text="Relatórios" 
              active={activePage === 'reports'} 
              onClick={() => onNavigate('reports')} 
            />
          </NavSection>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 space-y-4">
        {/* Créditos */}
        {!isCollapsed && (
          <div className="p-3 bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between text-sm mb-2">
              <div className="flex items-center text-gray-400">
                <CreditIcon className="h-4 w-4 flex-shrink-0"/>
                <span className="ml-2">Créditos</span>
              </div>
              <span className="font-semibold text-white">
                {credits.used.toLocaleString()} / {credits.total.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${creditPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {creditPercentage.toFixed(1)}% utilizado
            </p>
          </div>
        )}

        {/* User Info & Actions */}
        <div className="space-y-2">
          {!isCollapsed && user && (
            <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-700/30">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <ThemeToggle className="flex-1" />
            <button
              onClick={onLogout}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              title="Sair"
            >
              <LogoutIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

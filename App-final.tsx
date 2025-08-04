import React, { useState, useEffect } from 'react';
import { AdminPage } from './components/AdminPage-simple';
import { TelegramShopeePage } from './components/TelegramShopeePage-working';
import { AuthPage } from './components/AuthPage-complete';
import { authService, User, Session } from './services/authService';

// Componente de informações do usuário
const UserInfo: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => (
  <div className="flex items-center gap-3">
    {user.avatar_url && (
      <img
        src={user.avatar_url}
        alt={user.name || user.email}
        className="w-8 h-8 rounded-full"
      />
    )}
    <div className="flex flex-col">
      <span className="text-sm font-medium text-dark-text-primary">
        {user.name || user.email.split('@')[0]}
      </span>
      <span className="text-xs text-dark-text-secondary">
        {user.provider === 'google' ? '🔗 Google' : '📧 Email'}
      </span>
    </div>
    <button
      onClick={onLogout}
      className="ml-2 text-xs bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded transition-colors"
      title="Sair"
    >
      Sair
    </button>
  </div>
);

// Sidebar simples
const Sidebar: React.FC<{ 
  activePage: string; 
  onNavigate: (page: string) => void; 
  user: User;
  onLogout: () => void;
}> = ({ 
  activePage, 
  onNavigate, 
  user,
  onLogout 
}) => {
  const menuItems = [
    { id: 'telegram-shopee', label: 'Telegram - Ofertas Shopee', icon: '🛒' },
    { id: 'telegram', label: 'Disparador Telegram', icon: '📱' },
    { id: 'topsales', label: 'Top Vendas Shopee', icon: '📈' },
    { id: 'search', label: 'Pesquisar Produto', icon: '🔍' },
    { id: 'generate', label: 'Gerar Link Direto', icon: '🔗' },
    { id: 'image', label: 'Gerar Imagem', icon: '🖼️' },
    { id: 'chat', label: 'Chat IA', icon: '💬' },
    { id: 'admin', label: 'Admin', icon: '⚙️' }
  ];

  return (
    <div className="w-64 bg-dark-card border-r border-dark-border h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-dark-border">
        <h1 className="text-2xl font-bold text-brand-primary">ACI</h1>
      </div>

      {/* Menu Items */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activePage === item.id
                  ? 'bg-brand-primary text-white'
                  : 'text-dark-text-secondary hover:bg-slate-700/50 hover:text-dark-text-primary'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* User Info & Credits */}
      <div className="p-4 border-t border-dark-border space-y-3">
        <UserInfo user={user} onLogout={onLogout} />
        
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-dark-text-secondary">Créditos</span>
            <span className="text-sm font-bold text-brand-primary">1.250 / 5.000</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
            <div className="bg-brand-primary h-2 rounded-full" style={{ width: '25%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder para outras páginas
const PlaceholderPage: React.FC<{ title: string; description?: string }> = ({ title, description }) => {
  const getApiStatus = () => {
    const savedConfig = localStorage.getItem('aci_api_config');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        const hasGemini = !!config.geminiApiKey;
        const hasTelegram = !!config.telegramBotToken;
        const hasWhatsApp = !!config.whatsappApiKey;
        
        return {
          gemini: hasGemini,
          telegram: hasTelegram,
          whatsapp: hasWhatsApp,
          total: [hasGemini, hasTelegram, hasWhatsApp].filter(Boolean).length
        };
      } catch {
        return { gemini: false, telegram: false, whatsapp: false, total: 0 };
      }
    }
    return { gemini: false, telegram: false, whatsapp: false, total: 0 };
  };

  const apiStatus = getApiStatus();

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-dark-text-primary mb-4">{title}</h1>
        
        <div className="bg-dark-card border border-dark-border rounded-lg p-8">
          {description && (
            <p className="text-dark-text-secondary text-lg mb-6">{description}</p>
          )}
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-slate-800/50 rounded-lg px-4 py-2 mb-4">
              <span className="text-sm text-dark-text-secondary">APIs Configuradas:</span>
              <span className="text-sm font-bold text-brand-primary">{apiStatus.total}/3</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className={`p-4 rounded-lg border ${apiStatus.gemini ? 'border-green-500 bg-green-900/20' : 'border-gray-600 bg-gray-800/20'}`}>
              <div className="flex items-center gap-2">
                <span className={apiStatus.gemini ? 'text-green-400' : 'text-gray-400'}>
                  {apiStatus.gemini ? '✅' : '⚪'}
                </span>
                <span className="text-sm font-medium">Gemini AI</span>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg border ${apiStatus.telegram ? 'border-green-500 bg-green-900/20' : 'border-gray-600 bg-gray-800/20'}`}>
              <div className="flex items-center gap-2">
                <span className={apiStatus.telegram ? 'text-green-400' : 'text-gray-400'}>
                  {apiStatus.telegram ? '✅' : '⚪'}
                </span>
                <span className="text-sm font-medium">Telegram Bot</span>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg border ${apiStatus.whatsapp ? 'border-green-500 bg-green-900/20' : 'border-gray-600 bg-gray-800/20'}`}>
              <div className="flex items-center gap-2">
                <span className={apiStatus.whatsapp ? 'text-green-400' : 'text-gray-400'}>
                  {apiStatus.whatsapp ? '✅' : '⚪'}
                </span>
                <span className="text-sm font-medium">WhatsApp API</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            {apiStatus.total === 0 ? (
              <div>
                <p className="text-yellow-400 text-lg mb-4">⚠️ Nenhuma API configurada</p>
                <p className="text-dark-text-secondary mb-4">
                  Configure suas APIs no painel administrativo para começar a usar esta funcionalidade.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-green-400 text-lg mb-4">🎉 APIs configuradas com sucesso!</p>
                <p className="text-dark-text-secondary mb-4">
                  Esta funcionalidade está sendo desenvolvida e estará disponível em breve.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [activePage, setActivePage] = useState('admin');
  const [isLoading, setIsLoading] = useState(true);

  // Monitorar estado da sessão
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((newSession) => {
      setSession(newSession);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleLogin = () => {
    // O authService já gerencia o estado da sessão
    // Não precisamos fazer nada aqui
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await authService.signOut();
    setActivePage('admin');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-dark-text-secondary">Carregando...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return <AuthPage onLoginSuccess={handleLogin} />;
  }

  const user = session.user;

  const renderPage = () => {
    switch (activePage) {
      case 'admin':
        return <AdminPage />;
      case 'telegram-shopee':
        return <TelegramShopeePage />;
      case 'telegram':
        return <PlaceholderPage 
          title="Disparador Telegram" 
          description="Configure mensagens automáticas e disparos em massa para seus grupos e canais."
        />;
      case 'topsales':
        return <PlaceholderPage 
          title="Top Vendas Shopee" 
          description="Descubra os produtos mais vendidos na Shopee e encontre oportunidades de afiliação."
        />;
      case 'search':
        return <PlaceholderPage 
          title="Pesquisar Produto" 
          description="Busque produtos específicos na Shopee e obtenha informações detalhadas."
        />;
      case 'generate':
        return <PlaceholderPage 
          title="Gerar Link Direto" 
          description="Crie links de afiliado personalizados para produtos da Shopee."
        />;
      case 'image':
        return <PlaceholderPage 
          title="Gerar Imagem" 
          description="Use IA para criar imagens promocionais para seus produtos e campanhas."
        />;
      case 'chat':
        return <PlaceholderPage 
          title="Chat IA" 
          description="Converse com a IA para obter ajuda, ideias e suporte para suas campanhas."
        />;
      default:
        return <AdminPage />;
    }
  };

  return (
    <div className="flex h-screen bg-dark-bg text-dark-text-primary">
      <Sidebar 
        activePage={activePage} 
        onNavigate={setActivePage}
        user={user}
        onLogout={handleLogout} 
      />
      {renderPage()}
    </div>
  );
};

export default App;
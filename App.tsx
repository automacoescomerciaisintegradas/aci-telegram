import React, { useState, useEffect } from 'react';
import { AdminPage } from './components/AdminPage-simple';
import { TelegramShopeePage } from './components/TelegramShopeePage-working';
import { AuthSystem } from './components/AuthSystem';
import { UserSidebar } from './components/UserSidebar';
import { CreditPlans } from './components/CreditPlans';
import { CheckoutPix } from './components/CheckoutPix';

type Page = 'admin' | 'telegram-shopee' | 'telegram' | 'topsales' | 'search' | 'generate' | 'image' | 'chat';
type AuthState = 'login' | 'authenticated' | 'credits' | 'checkout';

interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  avatar: string;
}

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

// Sidebar principal da aplicação
const MainSidebar: React.FC<{ 
  activePage: Page; 
  onNavigate: (page: Page) => void; 
  onToggleUserSidebar: () => void;
  user: User;
}> = ({ 
  activePage, 
  onNavigate, 
  onToggleUserSidebar,
  user
}) => {
  const menuItems = [
    { id: 'telegram-shopee' as Page, label: 'Telegram - Ofertas Shopee', icon: '🛒' },
    { id: 'telegram' as Page, label: 'Disparador Telegram', icon: '📱' },
    { id: 'topsales' as Page, label: 'Top Vendas Shopee', icon: '📈' },
    { id: 'search' as Page, label: 'Pesquisar Produto', icon: '🔍' },
    { id: 'generate' as Page, label: 'Gerar Link Direto', icon: '🔗' },
    { id: 'image' as Page, label: 'Gerar Imagem', icon: '🖼️' },
    { id: 'chat' as Page, label: 'Chat IA', icon: '💬' },
    { id: 'admin' as Page, label: 'Admin', icon: '⚙️' }
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
      <div className="p-4 border-t border-dark-border">
        <button
          onClick={onToggleUserSidebar}
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors"
        >
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            {user.avatar}
          </div>
          <div className="flex-1 text-left">
            <div className="text-sm font-medium text-dark-text-primary">{user.name}</div>
            <div className="text-xs text-green-400">R$ {user.credits.toFixed(2)}</div>
          </div>
          <svg className="w-4 h-4 text-dark-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>('login');
  const [user, setUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState<Page>('admin');
  const [showUserSidebar, setShowUserSidebar] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setAuthState('authenticated');
  };

  const handleLogout = () => {
    setUser(null);
    setAuthState('login');
    setShowUserSidebar(false);
    setActivePage('admin');
  };

  const handleAddCredits = () => {
    setAuthState('credits');
    setShowUserSidebar(false);
  };

  const handleSelectPlan = (amount: number) => {
    setSelectedAmount(amount);
    setAuthState('checkout');
  };

  const handlePaymentConfirm = () => {
    if (user) {
      // Simular adição de créditos
      const bonus = selectedAmount * 0.2;
      const newCredits = user.credits + selectedAmount + bonus;
      
      setUser({
        ...user,
        credits: newCredits
      });
      
      setAuthState('authenticated');
      setSelectedAmount(0);
      
      // Simular notificação de sucesso
      alert(`Pagamento confirmado! R$ ${(selectedAmount + bonus).toFixed(2)} foram adicionados à sua conta.`);
    }
  };

  const handleBackToCredits = () => {
    setAuthState('credits');
  };

  const handleBackToApp = () => {
    setAuthState('authenticated');
  };

  // Tela de login
  if (authState === 'login') {
    return <AuthSystem onLogin={handleLogin} />;
  }

  // Tela de seleção de créditos
  if (authState === 'credits') {
    return (
      <CreditPlans 
        onSelectPlan={handleSelectPlan}
        onBack={handleBackToApp}
      />
    );
  }

  // Tela de checkout
  if (authState === 'checkout') {
    return (
      <CheckoutPix 
        amount={selectedAmount}
        onBack={handleBackToCredits}
        onPaymentConfirm={handlePaymentConfirm}
      />
    );
  }

  // Aplicação principal

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
      <MainSidebar 
        activePage={activePage} 
        onNavigate={setActivePage}
        onToggleUserSidebar={() => setShowUserSidebar(!showUserSidebar)}
        user={user!}
      />
      
      {showUserSidebar && (
        <UserSidebar 
          user={user!}
          onAddCredits={handleAddCredits}
          onLogout={handleLogout}
        />
      )}
      
      <div className="flex-1">
        {renderPage()}
      </div>
    </div>
  );
};

export default App;
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CreditSidebar } from './components/CreditSidebar';
import { CreditPlans } from './components/CreditPlans';
import { CheckoutPix } from './components/CheckoutPix';
import { LandingPage } from './components/LandingPage';
import { AdminCreditManager } from './components/AdminCreditManager';
import { PricingPlans } from './components/PricingPlans';
import { PlanCheckout } from './components/PlanCheckout';
import { SolutionsPage } from './components/SolutionsPage';
import { getPromotionValues } from './utils/promotionValues';
import LinkGenerator from './components/LinkGenerator';
import ProductSearch from './components/ProductSearch';
import SystemConfig from './components/SystemConfig';
import { TelegramShopeePage as TelegramShopeeFull } from './components/TelegramShopeePage';
import { CreditStatement } from './components/CreditStatement';
import { WhatsAppChannelIntegration } from './components/WhatsAppChannelIntegration';
import { BlogShopee } from './components/BlogShopee';
import { BlogPreview } from './components/BlogPreview';

// Componente de Login/Cadastro Completo
const LoginPage: React.FC<{ onLogin: (user: any) => void }> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (isLogin) {
        // Login
        if (email === 'admin@aci.com' && password === 'admin123') {
          const user = {
            id: '1',
            name: 'Administrador',
            email: 'admin@aci.com',
            role: 'admin',
            credits: 100,
            avatar: 'A'
          };
          localStorage.setItem('aci_user', JSON.stringify(user));
          onLogin(user);
        } else if (email === 'user@aci.com' && password === 'user123') {
          const user = {
            id: '2',
            name: 'Usuário Teste',
            email: 'user@aci.com',
            role: 'user',
            credits: 51.64,
            avatar: 'U'
          };
          localStorage.setItem('aci_user', JSON.stringify(user));
          onLogin(user);
        } else {
          setError('Email ou senha incorretos');
        }
      } else {
        // Cadastro - simular envio de email
        setEmailSent(true);
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const user = {
        id: 'google_' + Date.now(),
        name: 'Usuário Google',
        email: 'usuario@gmail.com',
        role: 'user',
        credits: 0,
        avatar: 'G'
      };
      localStorage.setItem('aci_user', JSON.stringify(user));
      onLogin(user);
    }, 1500);
  };

  const handleMagicLink = () => {
    // Simular clique no link mágico
    const user = {
      id: 'magic_' + Date.now(),
      name: name || 'Novo Usuário',
      email: email,
      role: 'user',
      credits: 0,
      avatar: name.charAt(0).toUpperCase()
    };
    localStorage.setItem('aci_user', JSON.stringify(user));
    onLogin(user);
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 w-full max-w-md text-center">
          <div className="text-green-400 text-6xl mb-4">📧</div>
          <h2 className="text-2xl font-bold text-white mb-4">Email Enviado!</h2>
          <p className="text-gray-300 mb-6">
            Enviamos um link mágico para <strong>{email}</strong>.
            Verifique sua caixa de entrada e clique no link para ativar sua conta.
          </p>
          <button
            onClick={handleMagicLink}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors mb-4"
          >
            🔗 Simular Clique no Link Mágico
          </button>
          <button
            onClick={() => {
              setEmailSent(false);
              setIsLogin(true);
            }}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Voltar ao Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-500 mb-2">ACI</h1>
          <p className="text-gray-300">
            {isLogin ? 'Entre na sua conta' : 'Crie sua conta gratuitamente'}
          </p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Seu nome completo"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Sua senha"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {isLoading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">ou</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="mt-4 w-full bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-4 rounded-lg border border-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuar com Google
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setEmail('');
              setPassword('');
              setName('');
            }}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
          </button>
        </div>

        {isLogin && (
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Teste: admin@aci.com/admin123 ou user@aci.com/user123
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente da página inicial do dashboard
const DashboardHome: React.FC<{ onNavigate: (page: string) => void; user: any }> = ({ onNavigate, user }) => {

  const handleTelegramShopeeClick = () => {
    if (user.credits <= 0) {
      alert('⚠️ Você precisa de créditos para acessar o Telegram + Shopee!\n\nClique no botão de créditos no canto superior direito para adicionar.');
      return;
    }
    onNavigate('telegram-shopee');
  };
  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-400">Telegram + Shopee</h3>
          <p className="text-gray-300 mb-4">
            Integração completa entre Telegram e Shopee para automação de vendas.
          </p>
          <button
            onClick={handleTelegramShopeeClick}
            className={`px-4 py-2 rounded-lg transition-colors ${user.credits > 0
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-600 hover:bg-gray-500'
              }`}
          >
            {user.credits > 0 ? 'Acessar' : '🔒 Precisa Créditos'}
          </button>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-green-400">Top Vendas</h3>
          <p className="text-gray-300 mb-4">
            Descubra os produtos mais vendidos na Shopee.
          </p>
          <button
            onClick={() => alert('Funcionalidade em desenvolvimento')}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
          >
            Ver Produtos
          </button>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-purple-400">Gerar Links</h3>
          <p className="text-gray-300 mb-4">
            Crie links de afiliado personalizados.
          </p>
          <button
            onClick={() => onNavigate('generate-link')}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
          >
            Gerar Link
          </button>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-yellow-400">Chat IA</h3>
          <p className="text-gray-300 mb-4">
            Converse com a IA para obter ajuda e suporte.
          </p>
          <button
            onClick={() => alert('Funcionalidade em desenvolvimento')}
            className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg transition-colors"
          >
            Iniciar Chat
          </button>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-red-400">Configurações</h3>
          <p className="text-gray-300 mb-4">
            Configure suas APIs e integrações.
          </p>
          <button
            onClick={() => onNavigate('admin')}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
          >
            Configurar
          </button>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-indigo-400">Relatórios</h3>
          <p className="text-gray-300 mb-4">
            Visualize estatísticas e métricas.
          </p>
          <button
            onClick={() => alert('Funcionalidade em desenvolvimento')}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors"
          >
            Ver Relatórios
          </button>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-400">Extrato de Créditos</h3>
          <p className="text-gray-300 mb-4">Veja suas movimentações de créditos.</p>
          <button
            onClick={() => onNavigate('credit-statement')}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            Abrir Extrato
          </button>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-green-400">Busca de Produtos</h3>
          <p className="text-gray-300 mb-4">Encontre produtos para suas campanhas de afiliado.</p>
          <button
            onClick={() => onNavigate('product-search')}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
          >
            Buscar Produtos
          </button>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-purple-400">Configurações do Sistema</h3>
          <p className="text-gray-300 mb-4">Configure suas APIs e integrações.</p>
          <button
            onClick={() => onNavigate('system-config')}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
          >
            Configurações
          </button>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-green-400">WhatsApp Channel</h3>
          <p className="text-gray-300 mb-4">Envio automático para WhatsApp Channel e Telegram.</p>
          <button
            onClick={() => onNavigate('whatsapp-channel')}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
          >
            🚀 Configurar Envio
          </button>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-orange-400">Blog Shopee</h3>
          <p className="text-gray-300 mb-4">Landing page para venda de produtos Shopee com links de afiliado.</p>
          <button
            onClick={() => onNavigate('blog-shopee')}
            className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg transition-colors"
          >
            🛍️ Abrir Blog
          </button>
        </div>
      </div>

      {/* Blog Preview */}
      <div className="mt-8">
        <BlogPreview onNavigate={onNavigate} />
      </div>

      <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Status do Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-300">Sistema Online</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-300">APIs Configuradas: 2/5</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-300">Créditos: R$ {user.credits}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente simples para Telegram + Shopee (mantendo original)
const SimpleTelegramShopee: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-blue-400 mb-6">Telegram + Shopee</h2>
          <p className="text-gray-300 mb-6">
            Esta funcionalidade permite integrar seu bot do Telegram com a Shopee para automação de vendas.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-4">Configuração do Bot</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Token do Bot Telegram
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 text-white"
                    placeholder="Digite o token do seu bot"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    ID do Afiliado Shopee
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 text-white"
                    placeholder="Digite seu ID de afiliado"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-300 mb-4">Status da Integração</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-300">Bot Telegram: Desconectado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-300">API Shopee: Não configurada</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-300">Webhook: Inativo</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors">
              Salvar Configurações
            </button>
            <button className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg transition-colors">
              Testar Conexão
            </button>
            <button
              onClick={onBack}
              className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente simples para Admin
const SimpleAdmin: React.FC<{ onBack: () => void; onManageCredits: () => void }> = ({ onBack, onManageCredits }) => {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-red-400 mb-6">Configurações do Sistema</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-4">APIs Configuradas</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Gemini AI</span>
                  <span className="text-red-400">❌ Não configurado</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Telegram Bot</span>
                  <span className="text-red-400">❌ Não configurado</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">WhatsApp API</span>
                  <span className="text-red-400">❌ Não configurado</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Shopee API</span>
                  <span className="text-red-400">❌ Não configurado</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-300 mb-4">Configurar API</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Chave da API Gemini
                  </label>
                  <input
                    type="password"
                    className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 text-white"
                    placeholder="Digite sua chave da API"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Token do Bot Telegram
                  </label>
                  <input
                    type="password"
                    className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 text-white"
                    placeholder="Digite o token do bot"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-4 flex-wrap">
            <button className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg transition-colors">
              Salvar Configurações
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors">
              Testar APIs
            </button>
            <button
              onClick={onManageCredits}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg transition-colors"
            >
              Gerenciar Créditos
            </button>
            <button
              onClick={onBack}
              className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Principal com Sidebar de Créditos
const Dashboard: React.FC<{ user: any; onLogout: () => void; onAddCredits: () => void }> = ({ user, onLogout, onAddCredits }) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showCreditSidebar, setShowCreditSidebar] = useState(false);
  const [showCreditStatement, setShowCreditStatement] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'telegram-shopee':
        return (
          <div className="p-8">
            <div className="max-w-6xl mx-auto bg-gray-800 border border-gray-700 rounded-lg p-6">
              <TelegramShopeeFull />
              <div className="mt-6 text-right">
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                >
                  Voltar
                </button>
              </div>
            </div>
          </div>
        );
      case 'admin':
        return <SimpleAdmin
          onBack={() => setCurrentPage('dashboard')}
          onManageCredits={() => setCurrentPage('manage-credits')}
        />;
      case 'manage-credits':
        return <AdminCreditManager onBack={() => setCurrentPage('admin')} />;
      case 'generate-link':
        return (
          <div className="p-8">
            <div className="max-w-5xl mx-auto">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <LinkGenerator />
                <div className="mt-6">
                  <button
                    onClick={() => setCurrentPage('dashboard')}
                    className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                  >
                    Voltar
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'go-generate-link':
        return (
          <div className="p-8">
            <div className="max-w-5xl mx-auto">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <LinkGenerator />
                <div className="mt-6">
                  <button
                    onClick={() => setCurrentPage('dashboard')}
                    className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                  >
                    Voltar
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'credit-statement':
        return (
          <CreditStatement
            user={user}
            onClose={() => setCurrentPage('dashboard')}
          />
        );
      case 'product-search':
        return (
          <ProductSearch onBack={() => setCurrentPage('dashboard')} />
        );
      case 'system-config':
        return (
          <SystemConfig onBack={() => setCurrentPage('dashboard')} />
        );
      case 'whatsapp-channel':
        return (
          <WhatsAppChannelIntegration onBack={() => setCurrentPage('dashboard')} />
        );
      case 'blog-shopee':
        return (
          <BlogShopee onBack={() => setCurrentPage('dashboard')} />
        );
      default:
        return <DashboardHome onNavigate={setCurrentPage} user={user} />;
    }
  };

  const handleTelegramShopeeAccess = () => {
    if (user.credits <= 0) {
      alert('Você precisa de créditos para acessar esta funcionalidade. Adicione créditos para continuar.');
      setShowCreditSidebar(true);
    } else {
      setCurrentPage('telegram-shopee');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {currentPage !== 'dashboard' && (
              <button
                onClick={() => setCurrentPage('dashboard')}
                className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg transition-colors text-sm"
              >
                ← Voltar
              </button>
            )}
            <h1 className="text-2xl font-bold text-blue-500">{t('welcome')}</h1>
            {currentPage === 'dashboard' && (
              <button
                onClick={() => setCurrentPage('blog-shopee')}
                className="hidden md:flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded-lg transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <span>Blog</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-4">
            {/* Botão de Créditos */}
            <button
              onClick={() => setShowCreditSidebar(true)}
              className="flex items-center gap-2 bg-green-600/20 border border-green-600/30 hover:bg-green-600/30 px-4 py-2 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <span className="text-green-400 font-medium">R$ {user.credits.toFixed(2)}</span>
            </button>

            <span className="text-gray-300">Olá, {user.name}</span>
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      {renderPage()}

      {/* Sidebar de Créditos */}
      {showCreditSidebar && (
        <CreditSidebar
          user={user}
          onAddCredits={() => {
            setShowCreditSidebar(false);
            onAddCredits();
          }}
          onLogout={onLogout}
          onClose={() => setShowCreditSidebar(false)}
          onOpenStatement={() => {
            setShowCreditSidebar(false);
            setCurrentPage('credit-statement');
          }}
        />
      )}
    </div>
  );
};

// App Principal com Sistema de Créditos
const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [appState, setAppState] = useState<'landing' | 'solutions' | 'pricing' | 'plan-checkout' | 'login' | 'dashboard' | 'credits' | 'checkout'>('landing');
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [selectedPlan, setSelectedPlan] = useState<{ id: string; isAnnual: boolean }>({ id: '', isAnnual: false });

  useEffect(() => {
    // Verifica se há usuário logado no localStorage
    const savedUser = localStorage.getItem('aci_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setAppState('dashboard');
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        localStorage.removeItem('aci_user');
      }
    } else {
      setAppState('landing');
    }
    setIsLoading(false);
  }, []);

  // Ouvir atualizações de crédito disparadas por outras telas
  useEffect(() => {
    const handler = () => {
      try {
        const saved = localStorage.getItem('aci_user');
        if (saved) setUser(JSON.parse(saved));
      } catch { }
    };
    window.addEventListener('aci:user-updated', handler);
    return () => window.removeEventListener('aci:user-updated', handler);
  }, []);

  // Navegação por evento (ex.: botão "Gerar Links" vindo de outras telas)
  useEffect(() => {
    const navigateHandler = () => {
      try {
        const target = localStorage.getItem('aci:navigate');
        if (target && target === 'generate-link') {
          // Dentro do dashboard, navega para a página de gerar link
          // usando estado interno do Dashboard (via currentPage)
          // Vamos regenerar o user para manter o fluxo e trocar currentPage externamente
          // Simplificação: trocamos para 'go-generate-link'
          // que renderiza diretamente a página de geração de link
          setTimeout(() => {
            const dashboardNav = document;
            // Apenas troca de rota interna controlada pelo estado do Dashboard
            // Alteramos o currentPage de fora via appState especial
            // Renderiza a rota dedicada
            //
            // Nota: Estrutura simples para navegação programática
            // sem adicionar roteador.


          }, 0);
          setAppState('generate-link');
        }
      } catch { }
    };
    window.addEventListener('aci:navigate', navigateHandler);
    return () => window.removeEventListener('aci:navigate', navigateHandler);
  }, []);

  const handleLogin = (loggedUser: any) => {
    setUser(loggedUser);
    setAppState('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('aci_user');
    setUser(null);
    setAppState('landing');
  };

  const handleSelectPlan = (amount: number) => {
    setSelectedAmount(amount);
    setAppState('checkout');
  };

  const handlePaymentConfirm = () => {
    if (user) {
      const bonusData = getPromotionValues(selectedAmount);
      const totalCredits = bonusData.total;

      // Atualizar créditos do usuário
      const updatedUser = {
        ...user,
        credits: user.credits + totalCredits
      };

      setUser(updatedUser);
      localStorage.setItem('aci_user', JSON.stringify(updatedUser));

      // Registrar transação de crédito no extrato
      try {
        const txRaw = localStorage.getItem('aci_credit_transactions') || '[]';
        const tx = JSON.parse(txRaw);
        tx.unshift({
          id: Date.now().toString(),
          type: 'credit',
          amount: totalCredits,
          service: 'Recarga de Créditos',
          at: new Date().toISOString(),
        });
        localStorage.setItem('aci_credit_transactions', JSON.stringify(tx));
        // Notificar telas para atualizar
        try {
          window.dispatchEvent(new Event('aci:user-updated'));
          window.dispatchEvent(new Event('aci:transactions-updated'));
        } catch { }
      } catch { }

      setAppState('dashboard');
      setSelectedAmount(0);

      alert(`🎉 Pagamento confirmado!\n\nR$ ${totalCredits.toFixed(2)} foram adicionados à sua conta.\n\nSeu saldo atual: R$ ${updatedUser.credits.toFixed(2)}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Carregando...</p>
        </div>
      </div>
    );
  }

  // Renderização baseada no estado
  switch (appState) {
    case 'landing':
      return (
        <LandingPage
          onGetStarted={() => setAppState('login')}
          onLogin={() => setAppState('login')}
          onViewPlans={() => setAppState('pricing')}
          onViewSolutions={() => setAppState('solutions')}
        />
      );

    case 'solutions':
      return (
        <SolutionsPage
          onBack={() => setAppState('landing')}
        />
      );

    case 'pricing':
      return (
        <PricingPlans
          onSelectPlan={(planId, isAnnual) => {
            setSelectedPlan({ id: planId, isAnnual });
            setAppState('plan-checkout');
          }}
          onBack={() => setAppState('landing')}
        />
      );

    case 'plan-checkout':
      return (
        <PlanCheckout
          planId={selectedPlan.id}
          isAnnual={selectedPlan.isAnnual}
          onBack={() => setAppState('pricing')}
          onConfirm={() => {
            alert(`🎉 Plano ${selectedPlan.id} ${selectedPlan.isAnnual ? 'Anual' : 'Mensal'} ativado com sucesso!\n\nFaça login para acessar sua conta.`);
            setAppState('login');
          }}
        />
      );

    case 'login':
      return <LoginPage onLogin={handleLogin} />;

    case 'credits':
      return (
        <CreditPlans
          onSelectPlan={handleSelectPlan}
          onBack={() => setAppState('dashboard')}
        />
      );

    case 'checkout':
      return (
        <CheckoutPix
          amount={selectedAmount}
          onBack={() => setAppState('credits')}
          onPaymentConfirm={handlePaymentConfirm}
        />
      );

    case 'dashboard':
    default:
      if (!user) {
        return <LoginPage onLogin={handleLogin} />;
      }
      return (
        <Dashboard
          user={user}
          onLogout={handleLogout}
          onAddCredits={() => setAppState('credits')}
        />
      );
  }
};

export default App;
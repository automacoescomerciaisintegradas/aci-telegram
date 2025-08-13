import React from 'react';
import { User } from '../services/authService';

interface UserDashboardProps {
  user: User;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
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
      <div className="max-w-6xl mx-auto">
        {/* Header de Boas-vindas */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-text-primary mb-2">
            Olá, {user.name}! 👋
          </h1>
          <p className="text-lg text-dark-text-secondary">
            Bem-vindo ao seu painel de automações comerciais
          </p>
        </div>

        {/* Status das APIs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-dark-card border border-dark-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-dark-text-primary">Status do Sistema</h3>
              <div className={`w-3 h-3 rounded-full ${apiStatus.total > 0 ? 'bg-green-400' : 'bg-red-400'}`}></div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-dark-text-secondary">APIs Configuradas</span>
                <span className="text-sm font-bold text-brand-primary">{apiStatus.total}/3</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-brand-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${(apiStatus.total / 3) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-dark-text-primary">Créditos</h3>
              <span className="text-2xl">💰</span>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-400">R$ 150,00</div>
              <div className="text-sm text-dark-text-secondary">Disponível para uso</div>
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-dark-text-primary">Campanhas Ativas</h3>
              <span className="text-2xl">📊</span>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-400">3</div>
              <div className="text-sm text-dark-text-secondary">Em execução</div>
            </div>
          </div>
        </div>

        {/* Funcionalidades Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-dark-card border border-dark-border rounded-lg p-6 hover:border-brand-primary/50 transition-colors cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">🛒</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-dark-text-primary">Telegram + Shopee</h3>
                <p className="text-sm text-dark-text-secondary">Automação completa</p>
              </div>
            </div>
            <p className="text-sm text-dark-text-secondary mb-4">
              Envie ofertas do Shopee automaticamente para seus grupos do Telegram
            </p>
            <div className="flex items-center text-sm text-brand-primary">
              <span>Acessar ferramenta</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-lg p-6 hover:border-brand-primary/50 transition-colors cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">📱</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-dark-text-primary">WhatsApp</h3>
                <p className="text-sm text-dark-text-secondary">Disparos em massa</p>
              </div>
            </div>
            <p className="text-sm text-dark-text-secondary mb-4">
              Envie mensagens promocionais para sua lista de contatos
            </p>
            <div className="flex items-center text-sm text-brand-primary">
              <span>Acessar ferramenta</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-lg p-6 hover:border-brand-primary/50 transition-colors cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">🖼️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-dark-text-primary">Gerar Imagens</h3>
                <p className="text-sm text-dark-text-secondary">IA criativa</p>
              </div>
            </div>
            <p className="text-sm text-dark-text-secondary mb-4">
              Crie imagens promocionais usando inteligência artificial
            </p>
            <div className="flex items-center text-sm text-brand-primary">
              <span>Acessar ferramenta</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Atividade Recente */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-dark-text-primary mb-4">Atividade Recente</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-dark-border">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm">✓</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-dark-text-primary">Campanha enviada com sucesso</p>
                  <p className="text-xs text-dark-text-secondary">150 mensagens enviadas via Telegram</p>
                </div>
              </div>
              <span className="text-xs text-dark-text-secondary">2 horas atrás</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-dark-border">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm">🔗</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-dark-text-primary">Links de afiliado gerados</p>
                  <p className="text-xs text-dark-text-secondary">25 produtos do Shopee processados</p>
                </div>
              </div>
              <span className="text-xs text-dark-text-secondary">5 horas atrás</span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm">🖼️</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-dark-text-primary">Imagens criadas com IA</p>
                  <p className="text-xs text-dark-text-secondary">3 imagens promocionais geradas</p>
                </div>
              </div>
              <span className="text-xs text-dark-text-secondary">1 dia atrás</span>
            </div>
          </div>
        </div>

        {/* Aviso sobre configuração */}
        {apiStatus.total === 0 && (
          <div className="mt-8 bg-yellow-900/20 border border-yellow-700 rounded-lg p-6">
            <div className="flex items-start">
              <div className="text-yellow-400 text-2xl mr-4">⚠️</div>
              <div>
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">Sistema não configurado</h3>
                <p className="text-yellow-200 mb-4">
                  Para começar a usar as automações, é necessário que um administrador configure as APIs do sistema.
                </p>
                <p className="text-sm text-yellow-300">
                  Entre em contato com o administrador para configurar: Google Gemini, Telegram Bot e WhatsApp API.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
import React from 'react';
import { notificationService } from '../services/notificationService';

export const NotificationDemo: React.FC = () => {
  const handleTestNotifications = () => {
    // Diferentes tipos de notificações para demonstração
    notificationService.success(
      'Produto Adicionado',
      'Novo produto foi adicionado à sua lista de favoritos!'
    );

    setTimeout(() => {
      notificationService.promotion(
        'Oferta Especial!',
        'iPhone 15 com 20% de desconto por tempo limitado!',
        {
          actionUrl: 'https://shopee.com.br/produto-exemplo',
          actionText: 'Ver Oferta',
          priority: 'high'
        }
      );
    }, 2000);

    setTimeout(() => {
      notificationService.campaign(
        'Campanha Finalizada',
        'Sua campanha "Black Friday 2024" foi concluída com 150 vendas!'
      );
    }, 4000);

    setTimeout(() => {
      notificationService.task(
        'Lembrete de Tarefa',
        'Não esqueça de atualizar os preços dos produtos até 18:00'
      );
    }, 6000);

    setTimeout(() => {
      notificationService.warning(
        'API Instável',
        'A API do Shopee está apresentando lentidão. Monitorando...'
      );
    }, 8000);
  };

  const handleTestError = () => {
    notificationService.error(
      'Erro de Conexão',
      'Não foi possível conectar com a API do Telegram. Verifique suas configurações.',
      {
        actionUrl: '/admin',
        actionText: 'Ir para Admin',
        priority: 'high'
      }
    );
  };

  const handleClearAll = () => {
    notificationService.clearAll();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-text-primary mb-2">
          🔔 Sistema de Notificações
        </h1>
        <p className="text-dark-text-secondary">
          Demonstração do sistema de notificações push integrado ao ACI.
        </p>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-dark-text-primary mb-4">
            Funcionalidades Implementadas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/30 p-4 rounded-lg border border-dark-border">
              <h4 className="font-medium text-dark-text-primary mb-2">✅ Tipos de Notificação</h4>
              <ul className="text-sm text-dark-text-secondary space-y-1">
                <li>• Sucesso (verde)</li>
                <li>• Avisos (amarelo)</li>
                <li>• Erros (vermelho)</li>
                <li>• Promoções (roxo)</li>
                <li>• Campanhas (azul)</li>
                <li>• Tarefas (laranja)</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 p-4 rounded-lg border border-dark-border">
              <h4 className="font-medium text-dark-text-primary mb-2">⚙️ Configurações</h4>
              <ul className="text-sm text-dark-text-secondary space-y-1">
                <li>• Push notifications nativas</li>
                <li>• Horário silencioso</li>
                <li>• Filtros por categoria</li>
                <li>• Frequência personalizada</li>
                <li>• Persistência local</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 p-4 rounded-lg border border-dark-border">
              <h4 className="font-medium text-dark-text-primary mb-2">🎯 Prioridades</h4>
              <ul className="text-sm text-dark-text-secondary space-y-1">
                <li>• Alta (vermelho)</li>
                <li>• Média (amarelo)</li>
                <li>• Baixa (verde)</li>
                <li>• Auto-close inteligente</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 p-4 rounded-lg border border-dark-border">
              <h4 className="font-medium text-dark-text-primary mb-2">📱 Interface</h4>
              <ul className="text-sm text-dark-text-secondary space-y-1">
                <li>• Centro de notificações</li>
                <li>• Contador não lidas</li>
                <li>• Ações rápidas</li>
                <li>• Timestamps relativos</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-border pt-6">
          <h3 className="text-lg font-semibold text-dark-text-primary mb-4">
            Testar Notificações
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleTestNotifications}
              className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-primary/90 transition-colors"
            >
              🚀 Testar Sequência de Notificações
            </button>

            <button
              onClick={handleTestError}
              className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-500 transition-colors"
            >
              ⚠️ Testar Erro Crítico
            </button>

            <button
              onClick={handleClearAll}
              className="bg-slate-700 text-dark-text-primary font-bold py-2 px-4 rounded-lg hover:bg-slate-600 transition-colors"
            >
              🗑️ Limpar Todas
            </button>
          </div>
        </div>

        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
          <h4 className="font-medium text-blue-300 mb-2">💡 Como Usar</h4>
          <ol className="text-sm text-blue-200 space-y-1 list-decimal list-inside">
            <li>Clique no ícone de sino no canto superior direito</li>
            <li>Teste as notificações usando os botões acima</li>
            <li>Configure suas preferências na página "Notificações"</li>
            <li>As notificações são salvas localmente e persistem entre sessões</li>
          </ol>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
          <h4 className="font-medium text-yellow-300 mb-2">🔧 Integração Automática</h4>
          <p className="text-sm text-yellow-200">
            O sistema já está integrado com as funcionalidades existentes do ACI:
          </p>
          <ul className="text-sm text-yellow-200 mt-2 space-y-1 list-disc list-inside">
            <li>Notificações automáticas quando produtos são encontrados</li>
            <li>Alertas de erro quando APIs falham</li>
            <li>Confirmações de envio de mensagens</li>
            <li>Lembretes de tarefas pendentes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { TrendingUpIcon, BellIcon, CheckIcon, AlertTriangleIcon } from './Icons';

interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<string, number>;
  byCategory: Record<string, number>;
  readRate: number;
  todayCount: number;
  weekCount: number;
}

export const NotificationAnalytics: React.FC = () => {
  const { notifications } = useNotifications();
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    byType: {},
    byCategory: {},
    readRate: 0,
    todayCount: 0,
    weekCount: 0
  });

  useEffect(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const byType: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    let unreadCount = 0;
    let todayCount = 0;
    let weekCount = 0;

    notifications.forEach(notification => {
      // Contadores por tipo
      byType[notification.type] = (byType[notification.type] || 0) + 1;
      
      // Contadores por categoria
      byCategory[notification.category] = (byCategory[notification.category] || 0) + 1;
      
      // Não lidas
      if (!notification.read) unreadCount++;
      
      // Hoje
      if (notification.timestamp >= today) todayCount++;
      
      // Esta semana
      if (notification.timestamp >= weekAgo) weekCount++;
    });

    const readRate = notifications.length > 0 
      ? ((notifications.length - unreadCount) / notifications.length) * 100 
      : 0;

    setStats({
      total: notifications.length,
      unread: unreadCount,
      byType,
      byCategory,
      readRate,
      todayCount,
      weekCount
    });
  }, [notifications]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'promotion': return '🔥';
      case 'campaign': return '📢';
      case 'task': return '📋';
      default: return '📝';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'system': return '🔧';
      case 'marketing': return '📢';
      case 'sales': return '💰';
      case 'alerts': return '⚠️';
      default: return '📝';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-text-primary mb-2 flex items-center gap-3">
          <TrendingUpIcon className="h-8 w-8 text-brand-primary" />
          Analytics de Notificações
        </h1>
        <p className="text-dark-text-secondary">
          Análise detalhada do seu histórico de notificações e engajamento.
        </p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-text-secondary text-sm font-medium">Total</p>
              <p className="text-3xl font-bold text-dark-text-primary">{stats.total}</p>
            </div>
            <BellIcon className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-text-secondary text-sm font-medium">Não Lidas</p>
              <p className="text-3xl font-bold text-red-400">{stats.unread}</p>
            </div>
            <AlertTriangleIcon className="h-8 w-8 text-red-400" />
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-text-secondary text-sm font-medium">Taxa de Leitura</p>
              <p className="text-3xl font-bold text-green-400">{stats.readRate.toFixed(1)}%</p>
            </div>
            <CheckIcon className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-text-secondary text-sm font-medium">Hoje</p>
              <p className="text-3xl font-bold text-purple-400">{stats.todayCount}</p>
            </div>
            <span className="text-2xl">📅</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Notificações por Tipo */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <h3 className="text-xl font-semibold text-dark-text-primary mb-6">
            Distribuição por Tipo
          </h3>
          <div className="space-y-4">
            {Object.entries(stats.byType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getTypeIcon(type)}</span>
                  <span className="text-dark-text-primary capitalize">{type}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-brand-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-dark-text-secondary font-medium w-8 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notificações por Categoria */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <h3 className="text-xl font-semibold text-dark-text-primary mb-6">
            Distribuição por Categoria
          </h3>
          <div className="space-y-4">
            {Object.entries(stats.byCategory).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getCategoryIcon(category)}</span>
                  <span className="text-dark-text-primary capitalize">{category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-green-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-dark-text-secondary font-medium w-8 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-8 bg-dark-card border border-dark-border rounded-xl p-6">
        <h3 className="text-xl font-semibold text-dark-text-primary mb-6">
          💡 Insights e Recomendações
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
            <h4 className="font-medium text-blue-300 mb-2">📊 Engajamento</h4>
            <p className="text-sm text-blue-200">
              {stats.readRate > 80 
                ? "Excelente! Você tem alta taxa de leitura das notificações."
                : stats.readRate > 60
                ? "Boa taxa de leitura. Considere ajustar a frequência das notificações."
                : "Taxa de leitura baixa. Revise suas configurações de notificação."
              }
            </p>
          </div>

          <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
            <h4 className="font-medium text-green-300 mb-2">🎯 Atividade</h4>
            <p className="text-sm text-green-200">
              {stats.todayCount > 5
                ? "Dia muito ativo! Você recebeu muitas notificações hoje."
                : stats.todayCount > 0
                ? "Atividade normal. Algumas notificações importantes hoje."
                : "Dia tranquilo. Nenhuma notificação nova hoje."
              }
            </p>
          </div>

          <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-4">
            <h4 className="font-medium text-purple-300 mb-2">📈 Tendência</h4>
            <p className="text-sm text-purple-200">
              Esta semana você recebeu {stats.weekCount} notificações, 
              uma média de {(stats.weekCount / 7).toFixed(1)} por dia.
            </p>
          </div>

          <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-4">
            <h4 className="font-medium text-orange-300 mb-2">⚡ Otimização</h4>
            <p className="text-sm text-orange-200">
              {stats.unread > 10
                ? "Muitas notificações não lidas. Considere usar 'Marcar todas como lidas'."
                : "Parabéns! Você está em dia com suas notificações."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
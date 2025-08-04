import React, { useState, useEffect } from 'react';
import { scheduledNotificationService, ScheduledNotification } from '../services/scheduledNotificationService';
import { ClockIcon, CheckIcon, XMarkIcon, AlertTriangleIcon } from './Icons';

export const ScheduledNotifications: React.FC = () => {
  const [scheduledNotifications, setScheduledNotifications] = useState<ScheduledNotification[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as const,
    category: 'system' as const,
    priority: 'medium' as const,
    scheduledFor: '',
    actionUrl: '',
    actionText: '',
    isRecurring: false,
    recurringType: 'daily' as const,
    recurringInterval: 1,
    recurringEndDate: ''
  });

  useEffect(() => {
    loadScheduledNotifications();
    
    // Atualizar lista a cada minuto
    const interval = setInterval(loadScheduledNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadScheduledNotifications = () => {
    setScheduledNotifications(scheduledNotificationService.getScheduledNotifications());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const scheduledFor = new Date(formData.scheduledFor);
    if (scheduledFor <= new Date()) {
      alert('A data deve ser no futuro!');
      return;
    }

    scheduledNotificationService.scheduleNotification({
      title: formData.title,
      message: formData.message,
      type: formData.type,
      category: formData.category,
      priority: formData.priority,
      scheduledFor,
      actionUrl: formData.actionUrl || undefined,
      actionText: formData.actionText || undefined,
      recurring: formData.isRecurring ? {
        type: formData.recurringType,
        interval: formData.recurringInterval,
        endDate: formData.recurringEndDate ? new Date(formData.recurringEndDate) : undefined
      } : undefined
    });

    // Resetar formulário
    setFormData({
      title: '',
      message: '',
      type: 'info',
      category: 'system',
      priority: 'medium',
      scheduledFor: '',
      actionUrl: '',
      actionText: '',
      isRecurring: false,
      recurringType: 'daily',
      recurringInterval: 1,
      recurringEndDate: ''
    });
    
    setShowForm(false);
    loadScheduledNotifications();
  };

  const handleCancel = (id: string) => {
    if (confirm('Tem certeza que deseja cancelar esta notificação agendada?')) {
      scheduledNotificationService.cancelScheduledNotification(id);
      loadScheduledNotifications();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-900/20 border-yellow-700';
      case 'sent': return 'text-green-400 bg-green-900/20 border-green-700';
      case 'cancelled': return 'text-red-400 bg-red-900/20 border-red-700';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-700';
    }
  };

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

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTimeUntil = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    
    if (diff <= 0) return 'Vencido';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const quickScheduleOptions = [
    {
      name: 'Lembrete em 5 min',
      action: () => {
        const date = new Date();
        date.setMinutes(date.getMinutes() + 5);
        scheduledNotificationService.scheduleNotification({
          title: '⏰ Lembrete Rápido',
          message: 'Este é seu lembrete de 5 minutos!',
          type: 'info',
          category: 'system',
          priority: 'medium',
          scheduledFor: date
        });
        loadScheduledNotifications();
      }
    },
    {
      name: 'Relatório Diário',
      action: () => {
        const date = new Date();
        date.setHours(18, 0, 0, 0); // 18:00
        if (date <= new Date()) {
          date.setDate(date.getDate() + 1);
        }
        scheduledNotificationService.scheduleNotification({
          title: '📊 Relatório Diário',
          message: 'Hora de revisar as métricas do dia!',
          type: 'campaign',
          category: 'marketing',
          priority: 'medium',
          scheduledFor: date,
          recurring: {
            type: 'daily',
            interval: 1
          }
        });
        loadScheduledNotifications();
      }
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-text-primary mb-2 flex items-center gap-3">
          <ClockIcon className="h-8 w-8 text-brand-primary" />
          Notificações Agendadas
        </h1>
        <p className="text-dark-text-secondary">
          Agende notificações para serem enviadas em horários específicos ou de forma recorrente.
        </p>
      </div>

      {/* Ações Rápidas */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => setShowForm(true)}
          className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-primary/90 transition-colors"
        >
          ➕ Nova Notificação Agendada
        </button>
        
        {quickScheduleOptions.map((option, index) => (
          <button
            key={index}
            onClick={option.action}
            className="bg-slate-700 text-dark-text-primary font-medium py-2 px-4 rounded-lg hover:bg-slate-600 transition-colors"
          >
            {option.name}
          </button>
        ))}
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-dark-text-primary mb-6">
            📝 Agendar Nova Notificação
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary focus:ring-2 focus:ring-brand-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                  Data e Hora
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduledFor}
                  onChange={(e) => setFormData({...formData, scheduledFor: e.target.value})}
                  className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary focus:ring-2 focus:ring-brand-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                Mensagem
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows={3}
                className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary focus:ring-2 focus:ring-brand-primary"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                  Tipo
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                  className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary focus:ring-2 focus:ring-brand-primary"
                >
                  <option value="info">Info</option>
                  <option value="success">Sucesso</option>
                  <option value="warning">Aviso</option>
                  <option value="error">Erro</option>
                  <option value="promotion">Promoção</option>
                  <option value="campaign">Campanha</option>
                  <option value="task">Tarefa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                  Categoria
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                  className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary focus:ring-2 focus:ring-brand-primary"
                >
                  <option value="system">Sistema</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Vendas</option>
                  <option value="alerts">Alertas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                  Prioridade
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                  className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary focus:ring-2 focus:ring-brand-primary"
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </select>
              </div>
            </div>

            {/* Recorrência */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData({...formData, isRecurring: e.target.checked})}
                  className="w-4 h-4 text-brand-primary bg-slate-800 border-dark-border rounded focus:ring-brand-primary"
                />
                <span className="text-dark-text-primary font-medium">Notificação Recorrente</span>
              </label>
            </div>

            {formData.isRecurring && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-slate-800/30 rounded-lg border border-dark-border">
                <div>
                  <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                    Frequência
                  </label>
                  <select
                    value={formData.recurringType}
                    onChange={(e) => setFormData({...formData, recurringType: e.target.value as any})}
                    className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary focus:ring-2 focus:ring-brand-primary"
                  >
                    <option value="daily">Diário</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                    Intervalo
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.recurringInterval}
                    onChange={(e) => setFormData({...formData, recurringInterval: parseInt(e.target.value)})}
                    className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary focus:ring-2 focus:ring-brand-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                    Data Final (Opcional)
                  </label>
                  <input
                    type="date"
                    value={formData.recurringEndDate}
                    onChange={(e) => setFormData({...formData, recurringEndDate: e.target.value})}
                    className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-brand-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-brand-primary/90 transition-colors flex items-center gap-2"
              >
                <CheckIcon className="h-4 w-4" />
                Agendar Notificação
              </button>
              
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-slate-700 text-dark-text-primary font-bold py-3 px-6 rounded-lg hover:bg-slate-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Notificações Agendadas */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h2 className="text-xl font-semibold text-dark-text-primary mb-6">
          📋 Notificações Agendadas ({scheduledNotifications.length})
        </h2>

        {scheduledNotifications.length === 0 ? (
          <div className="text-center py-12">
            <ClockIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-dark-text-primary mb-2">
              Nenhuma notificação agendada
            </h3>
            <p className="text-dark-text-secondary">
              Crie sua primeira notificação agendada usando o botão acima.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {scheduledNotifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-slate-800/30 border border-dark-border rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl">{getTypeIcon(notification.type)}</span>
                      <h3 className="font-semibold text-dark-text-primary">
                        {notification.title}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(notification.status)}`}>
                        {notification.status}
                      </span>
                    </div>
                    
                    <p className="text-dark-text-secondary mb-3">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center gap-6 text-sm text-dark-text-secondary">
                      <span>📅 {formatDateTime(notification.scheduledFor)}</span>
                      {notification.status === 'pending' && (
                        <span className="text-yellow-400">
                          ⏱️ {getTimeUntil(notification.scheduledFor)}
                        </span>
                      )}
                      {notification.recurring && (
                        <span className="text-blue-400">
                          🔄 {notification.recurring.type} (cada {notification.recurring.interval})
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {notification.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(notification.id)}
                      className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Cancelar notificação"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
import { notificationService } from './notificationService';

export interface ScheduledNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'promotion' | 'campaign' | 'task';
  category: 'system' | 'marketing' | 'sales' | 'alerts';
  priority: 'low' | 'medium' | 'high';
  scheduledFor: Date;
  recurring?: {
    type: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: Date;
  };
  actionUrl?: string;
  actionText?: string;
  status: 'pending' | 'sent' | 'cancelled';
  createdAt: Date;
}

class ScheduledNotificationService {
  private scheduledNotifications: ScheduledNotification[] = [];
  private timers: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.loadFromStorage();
    this.scheduleExistingNotifications();
  }

  // Persistência
  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('aci_scheduled_notifications');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.scheduledNotifications = parsed.map((n: any) => ({
          ...n,
          scheduledFor: new Date(n.scheduledFor),
          createdAt: new Date(n.createdAt),
          recurring: n.recurring ? {
            ...n.recurring,
            endDate: n.recurring.endDate ? new Date(n.recurring.endDate) : undefined
          } : undefined
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar notificações agendadas:', error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('aci_scheduled_notifications', JSON.stringify(this.scheduledNotifications));
    } catch (error) {
      console.error('Erro ao salvar notificações agendadas:', error);
    }
  }

  // Agendar notificação
  scheduleNotification(notification: Omit<ScheduledNotification, 'id' | 'status' | 'createdAt'>): string {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    const scheduledNotification: ScheduledNotification = {
      ...notification,
      id,
      status: 'pending',
      createdAt: new Date()
    };

    this.scheduledNotifications.push(scheduledNotification);
    this.saveToStorage();
    this.scheduleNotificationExecution(scheduledNotification);

    return id;
  }

  // Executar agendamento
  private scheduleNotificationExecution(notification: ScheduledNotification) {
    const now = new Date();
    const delay = notification.scheduledFor.getTime() - now.getTime();

    if (delay <= 0) {
      // Se já passou do horário, enviar imediatamente
      this.executeNotification(notification);
      return;
    }

    const timer = setTimeout(() => {
      this.executeNotification(notification);
    }, delay);

    this.timers.set(notification.id, timer);
  }

  // Executar notificação
  private executeNotification(notification: ScheduledNotification) {
    // Enviar notificação
    notificationService.addNotification(
      notification.type,
      notification.title,
      notification.message,
      {
        priority: notification.priority,
        category: notification.category,
        actionUrl: notification.actionUrl,
        actionText: notification.actionText
      }
    );

    // Atualizar status
    const index = this.scheduledNotifications.findIndex(n => n.id === notification.id);
    if (index !== -1) {
      this.scheduledNotifications[index].status = 'sent';
    }

    // Verificar se é recorrente
    if (notification.recurring) {
      this.scheduleRecurringNotification(notification);
    }

    // Limpar timer
    this.timers.delete(notification.id);
    this.saveToStorage();
  }

  // Agendar próxima ocorrência (recorrente)
  private scheduleRecurringNotification(notification: ScheduledNotification) {
    if (!notification.recurring) return;

    const { type, interval, endDate } = notification.recurring;
    const nextDate = new Date(notification.scheduledFor);

    switch (type) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + interval);
        break;
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + (interval * 7));
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + interval);
        break;
    }

    // Verificar se não passou da data final
    if (endDate && nextDate > endDate) {
      return;
    }

    // Criar nova notificação agendada
    const newNotification: ScheduledNotification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      scheduledFor: nextDate,
      status: 'pending',
      createdAt: new Date()
    };

    this.scheduledNotifications.push(newNotification);
    this.scheduleNotificationExecution(newNotification);
    this.saveToStorage();
  }

  // Reagendar notificações existentes (ao inicializar)
  private scheduleExistingNotifications() {
    this.scheduledNotifications
      .filter(n => n.status === 'pending')
      .forEach(notification => {
        this.scheduleNotificationExecution(notification);
      });
  }

  // Cancelar notificação agendada
  cancelScheduledNotification(id: string): boolean {
    const index = this.scheduledNotifications.findIndex(n => n.id === id);
    if (index === -1) return false;

    // Cancelar timer
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }

    // Atualizar status
    this.scheduledNotifications[index].status = 'cancelled';
    this.saveToStorage();

    return true;
  }

  // Listar notificações agendadas
  getScheduledNotifications(): ScheduledNotification[] {
    return [...this.scheduledNotifications].sort((a, b) => 
      a.scheduledFor.getTime() - b.scheduledFor.getTime()
    );
  }

  // Obter notificações pendentes
  getPendingNotifications(): ScheduledNotification[] {
    return this.scheduledNotifications.filter(n => n.status === 'pending');
  }

  // Limpar notificações antigas
  cleanupOldNotifications(daysOld: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    this.scheduledNotifications = this.scheduledNotifications.filter(notification => {
      if (notification.status === 'sent' && notification.scheduledFor < cutoffDate) {
        return false;
      }
      return true;
    });

    this.saveToStorage();
  }

  // Métodos de conveniência para agendamentos comuns
  schedulePromotion(
    productName: string, 
    discount: string, 
    scheduledFor: Date,
    actionUrl?: string
  ): string {
    return this.scheduleNotification({
      title: `🔥 ${productName} em Promoção!`,
      message: `${discount} de desconto por tempo limitado!`,
      type: 'promotion',
      category: 'marketing',
      priority: 'high',
      scheduledFor,
      actionUrl,
      actionText: 'Ver Oferta'
    });
  }

  scheduleTaskReminder(
    taskName: string,
    dueDate: Date,
    reminderMinutes: number = 60
  ): string {
    const reminderDate = new Date(dueDate.getTime() - (reminderMinutes * 60 * 1000));
    
    return this.scheduleNotification({
      title: `⏰ Lembrete: ${taskName}`,
      message: `Prazo em ${reminderMinutes} minutos!`,
      type: 'task',
      category: 'system',
      priority: 'medium',
      scheduledFor: reminderDate
    });
  }

  scheduleCampaignReport(
    campaignName: string,
    reportDate: Date,
    recurring: boolean = false
  ): string {
    return this.scheduleNotification({
      title: `📊 Relatório: ${campaignName}`,
      message: 'Relatório de performance da campanha disponível.',
      type: 'campaign',
      category: 'marketing',
      priority: 'medium',
      scheduledFor: reportDate,
      recurring: recurring ? {
        type: 'weekly',
        interval: 1
      } : undefined
    });
  }

  // Agendar notificação de backup/manutenção
  scheduleMaintenanceAlert(
    maintenanceDate: Date,
    duration: string
  ): string {
    // Notificação 24h antes
    const alertDate = new Date(maintenanceDate.getTime() - (24 * 60 * 60 * 1000));
    
    return this.scheduleNotification({
      title: '🔧 Manutenção Programada',
      message: `Sistema em manutenção amanhã por ${duration}. Planeje suas atividades.`,
      type: 'warning',
      category: 'system',
      priority: 'high',
      scheduledFor: alertDate
    });
  }
}

export const scheduledNotificationService = new ScheduledNotificationService();
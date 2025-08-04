import { Notification } from '../components/NotificationCenter';

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  categories: {
    system: boolean;
    marketing: boolean;
    sales: boolean;
    alerts: boolean;
  };
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

class NotificationService {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];
  private preferences: NotificationPreferences = {
    email: true,
    push: true,
    categories: {
      system: true,
      marketing: true,
      sales: true,
      alerts: true
    },
    frequency: 'immediate',
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  };

  constructor() {
    this.loadFromStorage();
    this.requestPushPermission();
  }

  // Gerenciamento de listeners
  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  // Persistência
  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('aci_notifications');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.notifications = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
      }

      const storedPrefs = localStorage.getItem('aci_notification_preferences');
      if (storedPrefs) {
        this.preferences = { ...this.preferences, ...JSON.parse(storedPrefs) };
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('aci_notifications', JSON.stringify(this.notifications));
      localStorage.setItem('aci_notification_preferences', JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Erro ao salvar notificações:', error);
    }
  }

  // Permissões de push
  private async requestPushPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }

  // Verificar horário silencioso
  private isQuietHours(): boolean {
    if (!this.preferences.quietHours.enabled) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = this.preferences.quietHours.start.split(':').map(Number);
    const [endHour, endMin] = this.preferences.quietHours.end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Horário atravessa meia-noite
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  // Criar notificação
  addNotification(
    type: Notification['type'],
    title: string,
    message: string,
    options: {
      priority?: Notification['priority'];
      category?: Notification['category'];
      actionUrl?: string;
      actionText?: string;
    } = {}
  ): string {
    const notification: Notification = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
      priority: options.priority || 'medium',
      category: options.category || 'system',
      actionUrl: options.actionUrl,
      actionText: options.actionText
    };

    // Verificar se a categoria está habilitada
    if (!this.preferences.categories[notification.category]) {
      return notification.id;
    }

    // Verificar horário silencioso
    if (this.isQuietHours()) {
      // Adicionar à lista mas não mostrar push
      this.notifications.unshift(notification);
      this.saveToStorage();
      this.notifyListeners();
      return notification.id;
    }

    this.notifications.unshift(notification);
    
    // Limitar a 100 notificações
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100);
    }

    this.saveToStorage();
    this.notifyListeners();

    // Mostrar push notification se habilitado
    if (this.preferences.push && 'Notification' in window && Notification.permission === 'granted') {
      this.showPushNotification(notification);
    }

    return notification.id;
  }

  // Push notification nativa
  private showPushNotification(notification: Notification) {
    const options: NotificationOptions = {
      body: notification.message,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: notification.id,
      requireInteraction: notification.priority === 'high',
      actions: notification.actionUrl ? [
        {
          action: 'view',
          title: notification.actionText || 'Ver'
        }
      ] : undefined
    };

    const pushNotification = new Notification(notification.title, options);

    pushNotification.onclick = () => {
      window.focus();
      if (notification.actionUrl) {
        window.open(notification.actionUrl, '_blank');
      }
      pushNotification.close();
    };

    // Auto-close após 5 segundos (exceto alta prioridade)
    if (notification.priority !== 'high') {
      setTimeout(() => pushNotification.close(), 5000);
    }
  }

  // Métodos de conveniência para diferentes tipos
  success(title: string, message: string, options?: any) {
    return this.addNotification('success', title, message, { ...options, category: 'system' });
  }

  error(title: string, message: string, options?: any) {
    return this.addNotification('error', title, message, { 
      ...options, 
      category: 'alerts',
      priority: 'high'
    });
  }

  warning(title: string, message: string, options?: any) {
    return this.addNotification('warning', title, message, { 
      ...options, 
      category: 'alerts',
      priority: 'medium'
    });
  }

  info(title: string, message: string, options?: any) {
    return this.addNotification('info', title, message, { ...options, category: 'system' });
  }

  promotion(title: string, message: string, options?: any) {
    return this.addNotification('promotion', title, message, { 
      ...options, 
      category: 'marketing',
      priority: 'medium'
    });
  }

  campaign(title: string, message: string, options?: any) {
    return this.addNotification('campaign', title, message, { 
      ...options, 
      category: 'marketing'
    });
  }

  task(title: string, message: string, options?: any) {
    return this.addNotification('task', title, message, { ...options, category: 'system' });
  }

  // Gerenciamento de notificações
  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.saveToStorage();
    this.notifyListeners();
  }

  deleteNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.saveToStorage();
    this.notifyListeners();
  }

  clearAll() {
    this.notifications = [];
    this.saveToStorage();
    this.notifyListeners();
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  // Preferências
  getPreferences(): NotificationPreferences {
    return { ...this.preferences };
  }

  updatePreferences(newPreferences: NotificationPreferences) {
    this.preferences = { ...newPreferences };
    this.saveToStorage();
  }

  // Notificações automáticas do sistema
  notifyProductPromotion(productName: string, discount: string, url: string) {
    this.promotion(
      '🔥 Produto em Promoção!',
      `${productName} com ${discount} de desconto!`,
      {
        actionUrl: url,
        actionText: 'Ver Produto',
        priority: 'medium'
      }
    );
  }

  notifyCampaignComplete(campaignName: string, results: string) {
    this.campaign(
      '✅ Campanha Concluída',
      `${campaignName}: ${results}`,
      {
        category: 'marketing',
        priority: 'medium'
      }
    );
  }

  notifySystemUpdate(version: string, features: string[]) {
    this.info(
      '🚀 Atualização Disponível',
      `Versão ${version} com: ${features.join(', ')}`,
      {
        priority: 'low'
      }
    );
  }

  notifyApiError(service: string, error: string) {
    this.error(
      '⚠️ Erro de API',
      `Problema com ${service}: ${error}`,
      {
        priority: 'high'
      }
    );
  }

  notifyTaskReminder(task: string, dueDate: string) {
    this.task(
      '⏰ Lembrete de Tarefa',
      `${task} - Prazo: ${dueDate}`,
      {
        priority: 'medium'
      }
    );
  }
}

export const notificationService = new NotificationService();
import { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import type { Notification } from '../components/NotificationCenter';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Carregar notificações iniciais
    setNotifications(notificationService.getNotifications());
    setUnreadCount(notificationService.getUnreadCount());

    // Inscrever-se para atualizações
    const unsubscribe = notificationService.subscribe((newNotifications) => {
      setNotifications(newNotifications);
      setUnreadCount(newNotifications.filter(n => !n.read).length);
    });

    return unsubscribe;
  }, []);

  const markAsRead = (id: string) => {
    notificationService.markAsRead(id);
  };

  const markAllAsRead = () => {
    notificationService.markAllAsRead();
  };

  const deleteNotification = (id: string) => {
    notificationService.deleteNotification(id);
  };

  const clearAll = () => {
    notificationService.clearAll();
  };

  // Métodos de conveniência para criar notificações
  const notify = {
    success: (title: string, message: string, options?: any) => 
      notificationService.success(title, message, options),
    
    error: (title: string, message: string, options?: any) => 
      notificationService.error(title, message, options),
    
    warning: (title: string, message: string, options?: any) => 
      notificationService.warning(title, message, options),
    
    info: (title: string, message: string, options?: any) => 
      notificationService.info(title, message, options),
    
    promotion: (title: string, message: string, options?: any) => 
      notificationService.promotion(title, message, options),
    
    campaign: (title: string, message: string, options?: any) => 
      notificationService.campaign(title, message, options),
    
    task: (title: string, message: string, options?: any) => 
      notificationService.task(title, message, options),
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    notify
  };
};

// Hook para preferências de notificação
export const useNotificationPreferences = () => {
  const [preferences, setPreferences] = useState(notificationService.getPreferences());

  const updatePreferences = (newPreferences: any) => {
    notificationService.updatePreferences(newPreferences);
    setPreferences(newPreferences);
  };

  return {
    preferences,
    updatePreferences
  };
};
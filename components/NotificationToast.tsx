import React, { useEffect, useState } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationToastProps {
  notification: Notification;
  onClose: (id: string) => void;
}

const getNotificationStyles = (type: NotificationType) => {
  const styles = {
    success: {
      bg: 'bg-green-500/10 border-green-500/20',
      icon: '✅',
      iconBg: 'bg-green-500',
      text: 'text-green-400',
      title: 'text-green-300',
    },
    error: {
      bg: 'bg-red-500/10 border-red-500/20',
      icon: '❌',
      iconBg: 'bg-red-500',
      text: 'text-red-400',
      title: 'text-red-300',
    },
    warning: {
      bg: 'bg-yellow-500/10 border-yellow-500/20',
      icon: '⚠️',
      iconBg: 'bg-yellow-500',
      text: 'text-yellow-400',
      title: 'text-yellow-300',
    },
    info: {
      bg: 'bg-blue-500/10 border-blue-500/20',
      icon: 'ℹ️',
      iconBg: 'bg-blue-500',
      text: 'text-blue-400',
      title: 'text-blue-300',
    },
  };
  return styles[type];
};

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const styles = getNotificationStyles(notification.type);

  useEffect(() => {
    // Animação de entrada
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto-close
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification.duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(notification.id);
    }, 300);
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out mb-4
        ${isVisible && !isLeaving 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
        }
      `}
    >
      <div
        className={`
          max-w-sm w-full border rounded-lg shadow-lg backdrop-blur-sm
          ${styles.bg}
        `}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${styles.iconBg}`}>
                {styles.icon}
              </div>
            </div>
            
            <div className="ml-3 w-0 flex-1">
              <p className={`text-sm font-medium ${styles.title}`}>
                {notification.title}
              </p>
              {notification.message && (
                <p className={`mt-1 text-sm ${styles.text}`}>
                  {notification.message}
                </p>
              )}
              
              {notification.action && (
                <div className="mt-3">
                  <button
                    onClick={notification.action.onClick}
                    className={`text-sm font-medium ${styles.text} hover:opacity-80 underline`}
                  >
                    {notification.action.label}
                  </button>
                </div>
              )}
            </div>
            
            <div className="ml-4 flex-shrink-0 flex">
              <button
                onClick={handleClose}
                className="inline-flex text-gray-400 hover:text-gray-200 focus:outline-none focus:text-gray-200 transition-colors"
              >
                <span className="sr-only">Fechar</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
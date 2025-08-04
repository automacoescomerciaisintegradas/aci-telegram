import React, { useState } from 'react';
import { BellIcon } from './Icons';
import { NotificationCenter } from './NotificationCenter';
import { useNotifications } from '../hooks/useNotifications';

export const NotificationButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-dark-text-secondary hover:text-dark-text-primary hover:bg-slate-700/50 rounded-lg transition-colors"
        title="Notificações"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      <NotificationCenter
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onDeleteNotification={deleteNotification}
      />
    </>
  );
};
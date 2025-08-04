import React from 'react';
import { NotificationToast } from './NotificationToast';
import { useToast } from '../hooks/useToast';

export const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useToast();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
};
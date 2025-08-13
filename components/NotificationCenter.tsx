import React from 'react';
import { BellIcon, CheckIcon, XMarkIcon, ClockIcon, TrendingUpIcon, AlertTriangleIcon } from './Icons';
import { Notification } from '../types/notification';

interface NotificationCenterProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
    onDeleteNotification: (id: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
    isOpen,
    onClose,
    notifications,
    onMarkAsRead,
    onMarkAllAsRead,
    onDeleteNotification
}) => {
    const unreadCount = notifications.filter(n => !n.read).length;

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckIcon className="h-5 w-5 text-green-400" />;
            case 'warning':
                return <AlertTriangleIcon className="h-5 w-5 text-yellow-400" />;
            case 'error':
                return <XMarkIcon className="h-5 w-5 text-red-400" />;
            case 'promotion':
                return <TrendingUpIcon className="h-5 w-5 text-purple-400" />;
            case 'campaign':
                return <BellIcon className="h-5 w-5 text-blue-400" />;
            case 'task':
                return <ClockIcon className="h-5 w-5 text-orange-400" />;
            default:
                return <BellIcon className="h-5 w-5 text-gray-400" />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'border-l-red-500';
            case 'medium':
                return 'border-l-yellow-500';
            case 'low':
                return 'border-l-green-500';
            default:
                return 'border-l-gray-500';
        }
    };

    const formatTimestamp = (timestamp: Date) => {
        const now = new Date();
        const diff = now.getTime() - timestamp.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Agora';
        if (minutes < 60) return `${minutes}m atrás`;
        if (hours < 24) return `${hours}h atrás`;
        return `${days}d atrás`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-dark-card border-l border-dark-border shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-dark-border">
                    <div className="flex items-center gap-3">
                        <BellIcon className="h-6 w-6 text-brand-primary" />
                        <h2 className="text-xl font-semibold text-dark-text-primary">
                            Notificações
                        </h2>
                        {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <XMarkIcon className="h-5 w-5 text-dark-text-secondary" />
                    </button>
                </div>

                {/* Actions */}
                {notifications.length > 0 && (
                    <div className="p-4 border-b border-dark-border">
                        <button
                            onClick={onMarkAllAsRead}
                            className="text-sm text-brand-primary hover:text-brand-primary/80 transition-colors"
                        >
                            Marcar todas como lidas
                        </button>
                    </div>
                )}

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <BellIcon className="h-12 w-12 text-gray-500 mb-4" />
                            <h3 className="text-lg font-medium text-dark-text-primary mb-2">
                                Nenhuma notificação
                            </h3>
                            <p className="text-dark-text-secondary">
                                Você está em dia! Não há notificações pendentes.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-dark-border">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 border-l-4 ${getPriorityColor(notification.priority)} ${!notification.read ? 'bg-slate-800/30' : ''
                                        } hover:bg-slate-800/50 transition-colors`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 mt-1">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <h4 className={`text-sm font-medium ${!notification.read ? 'text-dark-text-primary' : 'text-dark-text-secondary'
                                                    }`}>
                                                    {notification.title}
                                                </h4>
                                                <div className="flex items-center gap-2 ml-2">
                                                    <span className="text-xs text-dark-text-secondary whitespace-nowrap">
                                                        {formatTimestamp(notification.timestamp)}
                                                    </span>
                                                    <button
                                                        onClick={() => onDeleteNotification(notification.id)}
                                                        className="p-1 hover:bg-slate-700 rounded transition-colors"
                                                    >
                                                        <XMarkIcon className="h-3 w-3 text-dark-text-secondary" />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-sm text-dark-text-secondary mt-1 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center gap-3 mt-3">
                                                {!notification.read && (
                                                    <button
                                                        onClick={() => onMarkAsRead(notification.id)}
                                                        className="text-xs text-brand-primary hover:text-brand-primary/80 transition-colors"
                                                    >
                                                        Marcar como lida
                                                    </button>
                                                )}
                                                {notification.actionUrl && notification.actionText && (
                                                    <a
                                                        href={notification.actionUrl}
                                                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                                    >
                                                        {notification.actionText}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
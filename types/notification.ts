export interface Notification {
    id: string;
    type: 'success' | 'warning' | 'error' | 'info' | 'promotion' | 'campaign' | 'task';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    actionUrl?: string;
    actionText?: string;
    priority: 'low' | 'medium' | 'high';
    category: 'system' | 'marketing' | 'sales' | 'alerts';
}
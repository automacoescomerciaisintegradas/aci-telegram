import React, { useState } from 'react';
import { UserLoginPage } from './UserLoginPage';
import { AdminLoginPage } from './AdminLoginPage';
import { AuthUser } from '../services/supabaseService';

interface AuthRouterProps {
  onLogin: (user: AuthUser) => void;
}

type AuthMode = 'user' | 'admin';

export const AuthRouter: React.FC<AuthRouterProps> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('user');

  const switchToAdmin = () => setAuthMode('admin');
  const switchToUser = () => setAuthMode('user');

  if (authMode === 'admin') {
    return (
      <AdminLoginPage 
        onLogin={onLogin}
        onSwitchToUser={switchToUser}
      />
    );
  }

  return (
    <UserLoginPage 
      onLogin={onLogin}
      onSwitchToAdmin={switchToAdmin}
    />
  );
};
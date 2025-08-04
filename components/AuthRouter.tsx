import React, { useState, useEffect } from 'react';
import { AuthPage } from './AuthPage';
import { AdminAuthPage } from './AdminAuthPage';

interface AuthRouterProps {
  onLoginSuccess: (userType: 'user' | 'admin') => void;
}

export const AuthRouter: React.FC<AuthRouterProps> = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<'user' | 'admin'>('user');

  useEffect(() => {
    // Verificar se a URL contém #admin
    const checkAdminMode = () => {
      if (window.location.hash === '#admin') {
        setAuthMode('admin');
      } else {
        setAuthMode('user');
      }
    };

    checkAdminMode();

    // Escutar mudanças no hash
    window.addEventListener('hashchange', checkAdminMode);
    return () => window.removeEventListener('hashchange', checkAdminMode);
  }, []);

  const handleUserLogin = () => {
    onLoginSuccess('user');
  };

  const handleAdminLogin = () => {
    onLoginSuccess('admin');
  };

  const switchToAdmin = () => {
    window.location.hash = 'admin';
    setAuthMode('admin');
  };

  const switchToUser = () => {
    window.location.hash = '';
    setAuthMode('user');
  };

  if (authMode === 'admin') {
    return (
      <AdminAuthPage 
        onLoginSuccess={handleAdminLogin}
        onBackToUser={switchToUser}
      />
    );
  }

  return (
    <AuthPage 
      onLoginSuccess={handleUserLogin}
      onSwitchToAdmin={switchToAdmin}
    />
  );
};
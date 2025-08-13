import React from 'react';
import { User } from '../services/authService';

interface ProtectedRouteProps {
  user: User;
  allowedRoles: ('admin' | 'user')[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  user,
  allowedRoles,
  children,
  fallback
}) => {
  const hasPermission = allowedRoles.includes(user.role);

  if (!hasPermission) {
    return (
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-8">
            <div className="text-red-400 text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">Acesso Negado</h2>
            <p className="text-red-300 mb-6">
              Você não tem permissão para acessar esta funcionalidade.
            </p>
            <div className="bg-red-800/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-200">
                <strong>Seu nível:</strong> {user.role === 'user' ? 'Usuário' : 'Administrador'}
              </p>
              <p className="text-sm text-red-200">
                <strong>Necessário:</strong> {allowedRoles.map(role =>
                  role === 'admin' ? 'Administrador' : 'Usuário'
                ).join(' ou ')}
              </p>
            </div>
            <p className="text-sm text-gray-400">
              Entre em contato com o administrador do sistema se você acredita que deveria ter acesso a esta área.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
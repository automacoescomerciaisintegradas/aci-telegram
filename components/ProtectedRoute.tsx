import React from 'react';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallback,
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-gray-400">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, mostra fallback ou nada
  if (!isAuthenticated) {
    return fallback ? <>{fallback}</> : null;
  }

  // Verifica role se especificada
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-white mb-2">Acesso Negado</h2>
          <p className="text-gray-400">
            Você não tem permissão para acessar esta página.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Role necessária: {requiredRole} | Sua role: {user?.role}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// HOC para facilitar o uso
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: 'admin' | 'user'
) => {
  return (props: P) => (
    <ProtectedRoute requiredRole={requiredRole}>
      <Component {...props} />
    </ProtectedRoute>
  );
};
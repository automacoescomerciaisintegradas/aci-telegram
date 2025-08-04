import React, { useState } from 'react';
import { authService } from '../services/authService';

interface AuthPageProps {
  onLoginSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await authService.login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      });
      
      onLoginSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro no login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      await authService.loginWithGoogle();
      onLoginSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro no login com Google');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-brand-primary mb-2">ACI</h1>
          <p className="text-dark-text-secondary">Automações Comerciais Integradas</p>
        </div>

        {/* Form */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-8">
          <h2 className="text-2xl font-bold text-dark-text-primary mb-6 text-center">
            Entrar
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-text-primary mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-text-primary mb-2">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                placeholder="Sua senha"
              />
            </div>

            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="h-4 w-4 text-brand-primary bg-slate-800 border-gray-600 rounded focus:ring-brand-primary"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-dark-text-secondary">
                Lembrar-me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-brand-primary hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dark-card text-dark-text-secondary">ou</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="mt-4 w-full py-2 px-4 border border-gray-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Entrar com Google
            </button>
          </div>

          {/* Credenciais de teste */}
          <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
            <h3 className="text-sm font-medium text-dark-text-primary mb-2">🧪 Credenciais de Teste:</h3>
            <div className="text-xs text-dark-text-secondary space-y-1">
              <div className="flex justify-between">
                <span>Admin:</span>
                <span>admin@aci.com / admin123</span>
              </div>
              <div className="flex justify-between">
                <span>User:</span>
                <span>user@aci.com / user123</span>
              </div>
            </div>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, email: 'admin@aci.com', password: 'admin123' }))}
                className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                Usar Admin
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, email: 'user@aci.com', password: 'user123' }))}
                className="text-xs px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
              >
                Usar User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
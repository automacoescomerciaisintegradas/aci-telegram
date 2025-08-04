import React, { useState } from 'react';
import { authService, AuthResponse } from '../services/authService';

interface AuthPageProps {
  onLoginSuccess: () => void;
}

type AuthMode = 'login' | 'signup' | 'forgot';

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      let response: AuthResponse | { error: string | null };

      if (mode === 'signup') {
        // Validar confirmação de senha
        if (formData.password !== formData.confirmPassword) {
          setError('Senhas não coincidem');
          return;
        }

        response = await authService.signUp(
          formData.email,
          formData.password,
          formData.name
        );

        if (!response.error) {
          setSuccess('Conta criada com sucesso! Você já está logado.');
          setTimeout(() => onLoginSuccess(), 1500);
        }
      } else if (mode === 'login') {
        response = await authService.signIn(formData.email, formData.password);

        if (!response.error) {
          onLoginSuccess();
        }
      } else if (mode === 'forgot') {
        response = await authService.resetPassword(formData.email);

        if (!response.error) {
          setSuccess('Email de recuperação enviado! Verifique sua caixa de entrada.');
          setTimeout(() => setMode('login'), 2000);
        }
      }

      if (response.error) {
        setError(response.error);
      }

    } catch (err: any) {
      setError(err.message || 'Erro inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.signInWithGoogle();

      if (response.error) {
        setError(response.error);
      } else {
        onLoginSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login com Google');
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoginForm = () => (
    <>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-dark-text-secondary mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="seu@email.com"
            className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-text-secondary mb-2">
            Senha
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="••••••••"
            className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-brand-primary hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            Entrando...
          </>
        ) : (
          'Entrar'
        )}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setMode('forgot')}
          className="text-sm text-brand-primary hover:text-blue-400 transition-colors"
        >
          Esqueceu sua senha?
        </button>
      </div>
    </>
  );

  const renderSignupForm = () => (
    <>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-dark-text-secondary mb-2">
            Nome
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Seu nome"
            className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-text-secondary mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="seu@email.com"
            className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-text-secondary mb-2">
            Senha
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="••••••••"
            className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-text-secondary mb-2">
            Confirmar Senha
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="••••••••"
            className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-brand-primary hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            Criando conta...
          </>
        ) : (
          'Criar Conta'
        )}
      </button>
    </>
  );

  const renderForgotForm = () => (
    <>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-dark-text-secondary mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="seu@email.com"
            className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-brand-primary hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            Enviando...
          </>
        ) : (
          'Enviar Email de Recuperação'
        )}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setMode('login')}
          className="text-sm text-brand-primary hover:text-blue-400 transition-colors"
        >
          Voltar ao login
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="bg-dark-card border border-dark-border p-8 rounded-lg max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-brand-primary mb-2">ACI</h1>
          <p className="text-dark-text-secondary">Automações Comerciais Integradas</p>
        </div>

        {/* Tabs */}
        {mode !== 'forgot' && (
          <div className="flex mb-6 bg-slate-800/50 rounded-lg p-1">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                mode === 'login'
                  ? 'bg-brand-primary text-white'
                  : 'text-dark-text-secondary hover:text-dark-text-primary'
              }`}
            >
              ENTRAR
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                mode === 'signup'
                  ? 'bg-brand-primary text-white'
                  : 'text-dark-text-secondary hover:text-dark-text-primary'
              }`}
            >
              CADASTRAR
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'login' && renderLoginForm()}
          {mode === 'signup' && renderSignupForm()}
          {mode === 'forgot' && renderForgotForm()}
        </form>

        {/* Social Login */}
        {mode !== 'forgot' && (
          <>
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-dark-border"></div>
              <span className="px-4 text-sm text-dark-text-secondary">ou</span>
              <div className="flex-1 border-t border-dark-border"></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white hover:bg-gray-100 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isLoading ? 'Conectando...' : 'Continuar com Google'}
            </button>
          </>
        )}

        {/* Error/Success Messages */}
        {error && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-green-900/50 border border-green-700 text-green-300 rounded-lg text-sm">
            {success}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-dark-text-secondary">
          {mode === 'login' && (
            <p>
              Não tem uma conta?{' '}
              <button
                onClick={() => setMode('signup')}
                className="text-brand-primary hover:text-blue-400 transition-colors"
              >
                Cadastre-se
              </button>
            </p>
          )}
          {mode === 'signup' && (
            <p>
              Já tem uma conta?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-brand-primary hover:text-blue-400 transition-colors"
              >
                Faça login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
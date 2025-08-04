import React, { useState } from 'react';
import { MailIcon, LockIcon, GoogleIcon } from './Icons';
import { useAuth } from '../hooks/useAuth';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface AdminAuthPageProps {
  onLoginSuccess: () => void;
  onBackToUser: () => void;
}

const InputField: React.FC<{
  id: string;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}> = ({ id, type, placeholder, icon, value, onChange, error }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      {icon}
    </div>
    <input
      id={id}
      name={id}
      type={type}
      required
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full pl-10 pr-3 py-3 bg-slate-800 border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:border-primary-500 transition duration-200 ${
        error ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-primary-500'
      }`}
      placeholder={placeholder}
    />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

export const AdminAuthPage: React.FC<AdminAuthPageProps> = ({ onLoginSuccess, onBackToUser }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const { login, loginWithGoogle, isLoading, error, clearError } = useAuth();

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.email.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido';
    }

    if (!formData.password.trim()) {
      errors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      errors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    try {
      await login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
        isAdmin: true, // Marca como login de administrador
      });
      onLoginSuccess();
    } catch {
      // Erro já é tratado pelo hook useAuth
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle({ isAdmin: true });
      onLoginSuccess();
    } catch {
      // Erro já é tratado pelo hook useAuth
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-900 p-4 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
          ACI
        </h1>
        <p className="text-gray-400 mt-2">Painel Administrativo</p>
        <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-900/30 text-red-300 border border-red-700">
          👨‍💼 Acesso Restrito - Administradores
        </div>
      </div>

      <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl shadow-black/30 border border-red-700/50 overflow-hidden animate-scale-in">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 py-4">
          <h2 className="text-center text-white font-bold text-lg">LOGIN ADMINISTRATIVO</h2>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleFormSubmit}>
            <InputField
              id="email"
              type="email"
              placeholder="Email do Administrador"
              icon={<MailIcon className="h-5 w-5 text-gray-400" />}
              value={formData.email}
              onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
              error={fieldErrors.email}
            />

            <InputField
              id="password"
              type="password"
              placeholder="Senha do Administrador"
              icon={<LockIcon className="h-5 w-5 text-gray-400" />}
              value={formData.password}
              onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
              error={fieldErrors.password}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                  className="h-4 w-4 text-red-600 bg-slate-700 border-gray-600 rounded focus:ring-red-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                  Lembrar-me
                </label>
              </div>
              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="font-medium text-red-400 hover:text-red-300"
                >
                  Esqueceu a senha?
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner w-4 h-4 mr-2"></div>
                    Entrando...
                  </>
                ) : (
                  '🔐 Entrar como Administrador'
                )}
              </button>
            </div>
          </form>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-t border-gray-600" />
            <span className="mx-4 text-xs font-semibold text-gray-400">OU</span>
            <hr className="flex-grow border-t border-gray-600" />
          </div>

          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-600 rounded-lg shadow-sm bg-slate-700 text-sm font-medium text-white hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <GoogleIcon className="h-5 w-5 mr-3" />
              {isLoading ? 'Conectando...' : 'Entrar com Google (Admin)'}
            </button>

            {/* Adicionar GitHub OAuth */}
            <button
              type="button"
              onClick={() => {
                // TODO: Implementar GitHub OAuth
                alert('GitHub OAuth será implementado em breve');
              }}
              disabled={isLoading}
              className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-600 rounded-lg shadow-sm bg-slate-700 text-sm font-medium text-white hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
              {isLoading ? 'Conectando...' : 'Entrar com GitHub (Admin)'}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-600">
            <button
              type="button"
              onClick={onBackToUser}
              className="w-full text-center text-sm text-gray-400 hover:text-gray-300 transition-colors"
            >
              ← Voltar para Login de Usuário
            </button>
          </div>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />

      <div className="mt-6 w-full max-w-md bg-red-900/20 rounded-lg border border-red-700/50 p-4">
        <div className="text-center">
          <h3 className="text-sm font-semibold text-red-300 mb-2">⚠️ Área Restrita</h3>
          <p className="text-xs text-gray-400">
            Este painel é exclusivo para administradores do sistema. 
            Usuários regulares devem usar o login padrão.
          </p>
        </div>
      </div>
    </div>
  );
};
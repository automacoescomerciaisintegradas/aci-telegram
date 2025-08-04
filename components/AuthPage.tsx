
import React, { useState } from 'react';
import { MailIcon, LockIcon, UserIcon, GoogleIcon } from './Icons';
import { useAuth } from '../hooks/useAuth';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface AuthPageProps {
  onLoginSuccess: () => void;
}

type AuthTab = 'login' | 'signup';

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
      className={`w-full pl-10 pr-3 py-3 bg-slate-800 border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:border-primary-500 transition duration-200 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-primary-500'
        }`}
      placeholder={placeholder}
    />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rememberMe: false,
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const { login, signup, loginWithGoogle, isLoading, error, clearError } = useAuth();

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (activeTab === 'signup' && !formData.name.trim()) {
      errors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido';
    }

    if (!formData.password.trim()) {
      errors.password = 'Senha é obrigatória';
    } else if (activeTab === 'signup') {
      // Validação mais rigorosa para cadastro
      if (formData.password.length < 8) {
        errors.password = 'Senha deve ter pelo menos 8 caracteres';
      } else if (!/(?=.*[a-z])/.test(formData.password)) {
        errors.password = 'Senha deve conter pelo menos uma letra minúscula';
      } else if (!/(?=.*[A-Z])/.test(formData.password)) {
        errors.password = 'Senha deve conter pelo menos uma letra maiúscula';
      } else if (!/(?=.*\d)/.test(formData.password)) {
        errors.password = 'Senha deve conter pelo menos um número';
      }
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
      if (activeTab === 'login') {
        await login({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe,
        });
      } else {
        await signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
      }
      onLoginSuccess();
    } catch (err) {
      // Erro já é tratado pelo hook useAuth
    }
  };

  const handleTabChange = (tab: AuthTab) => {
    setActiveTab(tab);
    setFieldErrors({});
    clearError();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-900 p-4 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
          ACI
        </h1>
        <p className="text-gray-400 mt-2">Automações Comerciais Integradas</p>
      </div>

      <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl shadow-black/30 border border-gray-700 overflow-hidden animate-scale-in">
        <div className="flex">
          <button
            onClick={() => handleTabChange('login')}
            className={`w-1/2 py-4 text-sm font-bold transition-colors duration-300 ${activeTab === 'login'
              ? 'bg-primary-600 text-white'
              : 'bg-slate-800 text-gray-400 hover:bg-slate-700/50'
              }`}
          >
            ENTRAR
          </button>
          <button
            onClick={() => handleTabChange('signup')}
            className={`w-1/2 py-4 text-sm font-bold transition-colors duration-300 ${activeTab === 'signup'
              ? 'bg-primary-600 text-white'
              : 'bg-slate-800 text-gray-400 hover:bg-slate-700/50'
              }`}
          >
            CADASTRAR
          </button>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleFormSubmit}>
            {activeTab === 'signup' && (
              <InputField
                id="name"
                type="text"
                placeholder="Nome Completo"
                icon={<UserIcon className="h-5 w-5 text-gray-400" />}
                value={formData.name}
                onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                error={fieldErrors.name}
              />
            )}

            <InputField
              id="email"
              type="email"
              placeholder="Email"
              icon={<MailIcon className="h-5 w-5 text-gray-400" />}
              value={formData.email}
              onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
              error={fieldErrors.email}
            />

            <InputField
              id="password"
              type="password"
              placeholder="Senha"
              icon={<LockIcon className="h-5 w-5 text-gray-400" />}
              value={formData.password}
              onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
              error={fieldErrors.password}
            />

            {activeTab === 'login' && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                    className="h-4 w-4 text-primary-600 bg-slate-700 border-gray-600 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                    Lembrar-me
                  </label>
                </div>
                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="font-medium text-primary-400 hover:text-primary-300"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner w-4 h-4 mr-2"></div>
                    {activeTab === 'login' ? 'Entrando...' : 'Criando conta...'}
                  </>
                ) : (
                  activeTab === 'login' ? 'Entrar' : 'Criar Conta'
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
              onClick={async () => {
                try {
                  await loginWithGoogle();
                  onLoginSuccess();
                } catch (err) {
                  // Erro já é tratado pelo hook useAuth
                }
              }}
              disabled={isLoading}
              className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-600 rounded-lg shadow-sm bg-slate-700 text-sm font-medium text-white hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <GoogleIcon className="h-5 w-5 mr-3" />
              {isLoading ? 'Conectando...' : 'Entrar com Google'}
            </button>
          </div>
        </div>

      </div>
      <p className="mt-8 text-center text-sm text-gray-400">
        {activeTab === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleTabChange(activeTab === 'login' ? 'signup' : 'login');
          }}
          className="font-medium text-primary-400 hover:text-primary-300 ml-1"
        >
          {activeTab === 'login' ? 'Cadastre-se' : 'Faça login'}
        </a>
      </p>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />

      {/* Card com credenciais de teste */}
      <div className="mt-6 w-full max-w-md bg-slate-800/50 rounded-lg border border-gray-700 p-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-3 text-center">🧪 Credenciais de Teste</h3>
        <div className="space-y-3 text-xs">
          <button
            type="button"
            onClick={() => {
              setFormData(prev => ({ ...prev, email: 'admin@aci.com', password: 'admin123' }));
              setFieldErrors({});
            }}
            className="w-full bg-slate-700/50 p-3 rounded hover:bg-slate-700 transition-colors text-left"
          >
            <p className="font-medium text-blue-400 mb-1">👨‍💼 Administrador</p>
            <p className="text-gray-300">Email: admin@aci.com</p>
            <p className="text-gray-300">Senha: admin123</p>
          </button>
          <button
            type="button"
            onClick={() => {
              setFormData(prev => ({ ...prev, email: 'user@aci.com', password: 'user123' }));
              setFieldErrors({});
            }}
            className="w-full bg-slate-700/50 p-3 rounded hover:bg-slate-700 transition-colors text-left"
          >
            <p className="font-medium text-green-400 mb-1">👤 Usuário</p>
            <p className="text-gray-300">Email: user@aci.com</p>
            <p className="text-gray-300">Senha: user123</p>
          </button>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-600">
          <p className="text-xs text-gray-400 text-center">
            💡 Clique nos cards acima para preencher automaticamente
          </p>
        </div>
      </div>
    </div>
  );
};

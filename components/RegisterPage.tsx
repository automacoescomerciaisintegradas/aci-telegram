import React, { useState } from 'react';

interface RegisterPageProps {
  onRegister: (userData: any) => void;
  onBackToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister, onBackToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onRegister({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro no cadastro');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="bg-dark-card border border-dark-border rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-primary mb-2">ACI</h1>
          <p className="text-dark-text-secondary">Crie sua conta</p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              placeholder="Seu nome completo"
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
              onChange={handleChange}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              placeholder="seu@email.com"
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
              onChange={handleChange}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              placeholder="Sua senha"
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
              onChange={handleChange}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              placeholder="Confirme sua senha"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {isLoading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onBackToLogin}
            className="text-brand-primary hover:text-brand-primary/80 text-sm font-medium"
          >
            Já tem conta? Entre aqui
          </button>
        </div>
      </div>
    </div>
  );
};
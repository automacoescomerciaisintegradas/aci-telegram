import React, { useState } from 'react';

// Componente de Login simples
const SimpleAuth: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className="bg-dark-card border border-dark-border p-8 rounded-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-dark-text-primary mb-6 text-center">
          ACI - Login
        </h1>
        <button 
          onClick={onLogin}
          className="w-full bg-brand-primary text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Entrar
        </button>
      </div>
    </div>
  );
};

// Painel Admin simples
const SimpleAdmin: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-bg p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-dark-text-primary mb-6">
          Painel Administrativo
        </h1>
        <div className="bg-dark-card border border-dark-border p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-dark-text-primary mb-4">
            Configuração de APIs
          </h2>
          <p className="text-dark-text-secondary mb-4">
            Sistema funcionando! Aqui você pode configurar suas APIs.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                Gemini API Key
              </label>
              <input 
                type="password"
                className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary"
                placeholder="Cole sua chave aqui"
              />
            </div>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-500">
              Salvar Configurações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AppTest: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  if (!isAuthenticated) {
    return <SimpleAuth onLogin={() => setIsAuthenticated(true)} />;
  }

  return <SimpleAdmin />;
};

export default AppTest;
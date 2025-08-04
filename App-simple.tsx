import React from 'react';

const AppSimple: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-bg text-dark-text-primary p-8">
      <h1 className="text-3xl font-bold mb-4">🚀 ACI - Sistema Funcionando</h1>
      <p className="text-lg mb-4">Se você está vendo esta mensagem, o React está funcionando!</p>
      
      <div className="bg-dark-card border border-dark-border p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Teste Básico</h2>
        <button 
          className="bg-brand-primary text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => alert('Botão funcionando!')}
        >
          Testar Interação
        </button>
      </div>
    </div>
  );
};

export default AppSimple;
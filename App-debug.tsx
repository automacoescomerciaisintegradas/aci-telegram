import React from 'react';

const AppDebug: React.FC = () => {
  return (
    <div style={{ 
      backgroundColor: '#0f172a', 
      color: '#f1f5f9', 
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        🚀 ACI - Debug Mode
      </h1>
      <p style={{ marginBottom: '1rem' }}>
        Se você está vendo esta mensagem, o React está funcionando!
      </p>
      <div style={{ 
        backgroundColor: '#1e293b', 
        padding: '1rem', 
        borderRadius: '8px',
        border: '1px solid #334155'
      }}>
        <h2>Status do Sistema:</h2>
        <ul style={{ marginTop: '0.5rem' }}>
          <li>✅ React carregado</li>
          <li>✅ Tailwind CSS disponível</li>
          <li>✅ Tema escuro aplicado</li>
          <li>✅ Componente renderizando</li>
        </ul>
      </div>
      <button 
        style={{
          backgroundColor: '#4f46e5',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '6px',
          marginTop: '1rem',
          cursor: 'pointer'
        }}
        onClick={() => alert('Botão funcionando!')}
      >
        Testar Interação
      </button>
    </div>
  );
};

export default AppDebug;
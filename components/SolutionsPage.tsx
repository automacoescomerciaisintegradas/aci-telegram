import React from 'react';

type SolutionsPageProps = {
  onBack: () => void;
};

export const SolutionsPage: React.FC<SolutionsPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg transition-colors text-sm"
            >
              ← Voltar
            </button>
            <h1 className="text-2xl font-bold text-blue-400">Soluções ACI</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <p className="text-gray-300 mb-6">
          Explore soluções para integrar Telegram, Shopee e automações com IA.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">Telegram + Shopee</h3>
            <p className="text-gray-300 mb-4">
              Integração para automação de vendas, geração de links e notificações.
            </p>
            <span className="inline-block text-xs text-gray-400">Em breve</span>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-300 mb-2">Notificações</h3>
            <p className="text-gray-300 mb-4">
              Modelos de mensagens e alertas programados para campanhas.
            </p>
            <span className="inline-block text-xs text-gray-400">Em desenvolvimento</span>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-300 mb-2">IA de Conteúdo</h3>
            <p className="text-gray-300 mb-4">
              Geração de descrições, títulos e variações com IA.
            </p>
            <span className="inline-block text-xs text-gray-400">Planejado</span>
          </div>
        </div>
      </main>
    </div>
  );
};




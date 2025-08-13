import React, { useState } from 'react';

interface AdminCreditManagerProps {
  onBack: () => void;
}

export const AdminCreditManager: React.FC<AdminCreditManagerProps> = ({ onBack }) => {
  const [userEmail, setUserEmail] = useState('');
  const [creditAmount, setCreditAmount] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Simular busca de usuários
  const searchUsers = () => {
    if (!userEmail) return;
    
    // Simular usuários encontrados
    const mockUsers = [
      { id: '1', name: 'João Silva', email: 'joao@email.com', credits: 25.50 },
      { id: '2', name: 'Maria Santos', email: 'maria@email.com', credits: 150.00 },
      { id: '3', name: 'Pedro Costa', email: 'pedro@email.com', credits: 0.00 },
    ];
    
    const filtered = mockUsers.filter(user => 
      user.email.toLowerCase().includes(userEmail.toLowerCase()) ||
      user.name.toLowerCase().includes(userEmail.toLowerCase())
    );
    
    setSearchResults(filtered);
  };

  const addCredits = (userId: string, userEmail: string) => {
    const amount = parseFloat(creditAmount);
    if (!amount || amount <= 0) {
      alert('Digite um valor válido para os créditos');
      return;
    }

    // Simular adição de créditos
    alert(`✅ R$ ${amount.toFixed(2)} adicionados à conta de ${userEmail}`);
    
    // Atualizar lista
    setSearchResults(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, credits: user.credits + amount }
          : user
      )
    );
    
    setCreditAmount('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg transition-colors text-sm"
          >
            ← Voltar
          </button>
          <h1 className="text-2xl font-bold text-red-500">Gerenciar Créditos</h1>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Buscar Usuário */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Buscar Usuário</h2>
            
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Digite email ou nome do usuário"
                />
              </div>
              <button
                onClick={searchUsers}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
              >
                Buscar
              </button>
            </div>
          </div>

          {/* Adicionar Créditos */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Adicionar Créditos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Valor dos Créditos (R$)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0.00"
                />
              </div>
              
              <div className="flex items-end">
                <div className="grid grid-cols-3 gap-2 w-full">
                  <button
                    onClick={() => setCreditAmount('50')}
                    className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-sm transition-colors"
                  >
                    R$ 50
                  </button>
                  <button
                    onClick={() => setCreditAmount('100')}
                    className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-sm transition-colors"
                  >
                    R$ 100
                  </button>
                  <button
                    onClick={() => setCreditAmount('200')}
                    className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-sm transition-colors"
                  >
                    R$ 200
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Resultados da Busca */}
          {searchResults.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Usuários Encontrados</h2>
              
              <div className="space-y-4">
                {searchResults.map((user) => (
                  <div key={user.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-lg font-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{user.name}</h3>
                            <p className="text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-400">Crédito Atual</p>
                          <p className="text-xl font-bold text-green-400">
                            R$ {user.credits.toFixed(2)}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => addCredits(user.id, user.email)}
                          disabled={!creditAmount || parseFloat(creditAmount) <= 0}
                          className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-colors"
                        >
                          Adicionar R$ {creditAmount || '0.00'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instruções */}
          <div className="mt-8 bg-blue-600/20 border border-blue-500 rounded-lg p-6">
            <h3 className="font-semibold mb-2">📋 Como usar:</h3>
            <ol className="text-sm space-y-1 list-decimal list-inside text-blue-100">
              <li>Digite o email ou nome do usuário no campo de busca</li>
              <li>Clique em "Buscar" para encontrar o usuário</li>
              <li>Digite o valor dos créditos a serem adicionados</li>
              <li>Clique em "Adicionar" para confirmar a operação</li>
              <li>O usuário receberá os créditos imediatamente</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
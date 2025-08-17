import React, { useState, useEffect } from 'react';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  service: string;
  at: string;
}

interface CreditStatementProps {
  user: any;
  onClose: () => void;
}

export const CreditStatement: React.FC<CreditStatementProps> = ({ user, onClose }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    try {
      const txRaw = localStorage.getItem('aci_credit_transactions') || '[]';
      const tx = JSON.parse(txRaw);
      setTransactions(tx);

      // Calcular saldo baseado nas transações
      const calculatedBalance = tx.reduce((total: number, transaction: Transaction) => {
        return transaction.type === 'credit'
          ? total + transaction.amount
          : total - transaction.amount;
      }, 0);

      console.log('Saldo calculado pelas transações:', calculatedBalance);
      console.log('Saldo atual do usuário:', user.credits);

    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearTransactions = () => {
    if (confirm('⚠️ Tem certeza que deseja limpar todo o histórico de transações?\n\nEsta ação não pode ser desfeita.')) {
      localStorage.removeItem('aci_credit_transactions');
      setTransactions([]);
      alert('✅ Histórico de transações limpo com sucesso!');
    }
  };

  const resetUserCredits = () => {
    if (confirm('⚠️ Tem certeza que deseja zerar o saldo de créditos?\n\nEsta ação não pode ser desfeita.')) {
      const updatedUser = { ...user, credits: 0 };
      localStorage.setItem('aci_user', JSON.stringify(updatedUser));

      // Limpar transações também
      localStorage.removeItem('aci_credit_transactions');
      setTransactions([]);

      // Recarregar a página para atualizar o estado
      window.location.reload();
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR');
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount: number) => {
    return `R$ ${amount.toFixed(2).replace('.', ',')}`;
  };

  const totalCredits = transactions
    .filter(tx => tx.type === 'credit')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalDebits = transactions
    .filter(tx => tx.type === 'debit')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const calculatedBalance = totalCredits - totalDebits;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-700 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">💳 Extrato de Créditos</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-900/20 border border-green-600 rounded-lg p-4">
              <h3 className="text-green-400 font-semibold mb-2">💰 Total Créditos</h3>
              <p className="text-2xl font-bold text-green-300">{formatCurrency(totalCredits)}</p>
            </div>

            <div className="bg-red-900/20 border border-red-600 rounded-lg p-4">
              <h3 className="text-red-400 font-semibold mb-2">💸 Total Gastos</h3>
              <p className="text-2xl font-bold text-red-300">{formatCurrency(totalDebits)}</p>
            </div>

            <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-4">
              <h3 className="text-blue-400 font-semibold mb-2">🏦 Saldo Atual</h3>
              <p className="text-2xl font-bold text-blue-300">{formatCurrency(user.credits)}</p>
              {Math.abs(calculatedBalance - user.credits) > 0.01 && (
                <p className="text-xs text-yellow-400 mt-1">
                  ⚠️ Divergência: {formatCurrency(calculatedBalance)} calculado
                </p>
              )}
            </div>
          </div>

          {/* Ações */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={clearTransactions}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              🗑️ Limpar Histórico
            </button>

            <button
              onClick={resetUserCredits}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              🔄 Zerar Saldo
            </button>
          </div>

          {/* Lista de Transações */}
          <div className="bg-gray-700 rounded-lg">
            <div className="p-4 border-b border-gray-600">
              <h3 className="text-lg font-semibold text-white">📋 Histórico de Movimentações</h3>
              <p className="text-gray-400 text-sm">{transactions.length} transações encontradas</p>
            </div>

            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Carregando transações...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-400">Nenhuma transação encontrada</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-600">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'credit'
                        ? 'bg-green-600 text-green-100'
                        : 'bg-red-600 text-red-100'
                        }`}>
                        {transaction.type === 'credit' ? '💰' : '💸'}
                      </div>
                      <div>
                        <p className="text-white font-medium">{transaction.service}</p>
                        <p className="text-gray-400 text-sm">{formatDate(transaction.at)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'
                        }`}>
                        {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
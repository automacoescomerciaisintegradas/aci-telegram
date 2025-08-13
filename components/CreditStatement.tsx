import React, { useEffect, useMemo, useState } from 'react';

type Transaction = {
  id: string;
  type: 'debit' | 'credit';
  amount: number; // negativo para débito, positivo para crédito
  service: string;
  at: string; // ISO
};

interface CreditStatementProps {
  onBack: () => void;
}

const formatBRL = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const CreditStatement: React.FC<CreditStatementProps> = ({ onBack }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentCredits, setCurrentCredits] = useState<number>(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('aci_credit_transactions') || '[]';
      const parsed: Transaction[] = JSON.parse(raw);
      // Ordenar do mais recente para o mais antigo
      parsed.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
      setTransactions(parsed);
      const userRaw = localStorage.getItem('aci_user');
      if (userRaw) {
        const user = JSON.parse(userRaw);
        setCurrentCredits(Number(user.credits || 0));
      }
    } catch {
      setTransactions([]);
    }
  }, []);

  // Recarregar quando houver novas transações
  useEffect(() => {
    const refresh = () => {
      try {
        const raw = localStorage.getItem('aci_credit_transactions') || '[]';
        const parsed: Transaction[] = JSON.parse(raw);
        parsed.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
        setTransactions(parsed);
      } catch {}
    };
    window.addEventListener('aci:transactions-updated', refresh);
    return () => window.removeEventListener('aci:transactions-updated', refresh);
  }, []);

  // Atualizar saldo atual quando o usuário mudar
  useEffect(() => {
    const refreshUser = () => {
      try {
        const userRaw = localStorage.getItem('aci_user');
        if (userRaw) {
          const user = JSON.parse(userRaw);
          setCurrentCredits(Number(user.credits || 0));
        }
      } catch {}
    };
    window.addEventListener('aci:user-updated', refreshUser);
    return () => window.removeEventListener('aci:user-updated', refreshUser);
  }, []);

  const totals = useMemo(() => {
    const credits = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    const debits = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const balance = credits - debits;
    return { credits, debits, balance };
  }, [transactions]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center gap-4 max-w-6xl mx-auto">
          <button onClick={onBack} className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg transition-colors text-sm">
            ← Voltar
          </button>
          <h1 className="text-2xl font-bold text-blue-400">Extrato de Créditos</h1>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-sm">Saldo atual</div>
              <div className="text-green-400 text-2xl font-bold">{formatBRL(currentCredits)}</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-sm">Débitos (movimentações)</div>
              <div className="text-red-400 text-2xl font-bold">{formatBRL(totals.debits)}</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-sm">Saldo (movimentações)</div>
              <div className="text-blue-400 text-2xl font-bold">{formatBRL(totals.balance)}</div>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-700 font-semibold">Movimentações</div>
            {transactions.length === 0 ? (
              <div className="p-6 text-gray-400">Nenhuma movimentação encontrada.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Data</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tipo</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Serviço</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-900 divide-y divide-gray-800">
                    {transactions.map(tx => (
                      <tr key={tx.id}>
                        <td className="px-4 py-3 text-sm text-gray-300">{new Date(tx.at).toLocaleString('pt-BR')}</td>
                        <td className="px-4 py-3 text-sm">
                          {tx.amount < 0 ? (
                            <span className="text-red-400">Débito</span>
                          ) : (
                            <span className="text-green-400">Crédito</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-300">{tx.service}</td>
                        <td className="px-4 py-3 text-sm text-right {tx.amount < 0 ? 'text-red-300' : 'text-green-300'}">
                          {formatBRL(tx.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};



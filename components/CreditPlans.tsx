import React, { useState } from 'react';

interface CreditPlansProps {
  onSelectPlan: (amount: number) => void;
  onBack: () => void;
}

export const CreditPlans: React.FC<CreditPlansProps> = ({ onSelectPlan, onBack }) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');

  const plans = [
    { value: 50, label: 'R$ 50,00' },
    { value: 97, label: 'R$ 97,00' },
    { value: 197, label: 'R$ 197,00' },
    { value: 397, label: 'R$ 397,00' },
    { value: 697, label: 'R$ 697,00' },
    { value: 999, label: 'R$ 999,00' },
  ];

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d,]/g, '');
    setCustomAmount(value);
    if (value) {
      const numericValue = parseFloat(value.replace(',', '.'));
      if (numericValue >= 50) {
        setSelectedAmount(numericValue);
      }
    }
  };

  const handlePlanSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleFinalize = () => {
    if (selectedAmount && selectedAmount >= 50) {
      onSelectPlan(selectedAmount);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-white">Selecione um valor</h1>
        </div>

        {/* Promoção */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
            <span className="text-white font-semibold">
              Promoção: Ganhe 20% de bônus em qualquer recarga realizada até 27/07/2025
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Planos */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Valores Disponíveis</h2>
            
            <div className="grid grid-cols-2 gap-3">
              {plans.map((plan) => (
                <button
                  key={plan.value}
                  onClick={() => handlePlanSelect(plan.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedAmount === plan.value
                      ? 'border-blue-500 bg-blue-500/20 text-white'
                      : 'border-white/20 bg-white/10 text-gray-300 hover:border-blue-400 hover:bg-blue-400/10'
                  }`}
                >
                  <div className="text-sm text-gray-400 mb-1">Valor</div>
                  <div className="text-lg font-semibold">{plan.label}</div>
                </button>
              ))}
            </div>

            {/* Valor customizado */}
            <div className="mt-6">
              <h3 className="text-white font-medium mb-3">Valor Selecionado</h3>
              <p className="text-gray-300 text-sm mb-3">
                Se preferir, informe outro valor, desde que seja mínimo R$ 50,00
              </p>
              
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">R$</span>
                <input
                  type="text"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  placeholder="50,00"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              onClick={handleFinalize}
              disabled={!selectedAmount || selectedAmount < 50}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors mt-6"
            >
              Finalizar Compra
            </button>
          </div>

          {/* Informações */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">ACI - Automações Comerciais Integradas</h3>
            
            <div className="space-y-4 text-gray-300">
              <p>
                Adicione crédito à sua conta para acessar os serviços do ACI-automações comerciais integradas. 
                Escolha entre os modelos GPT-3.5 e GPT-4.0, cada um com seu valor específico por uso.
              </p>
              
              <p>
                Selecione um valor e conclua o pagamento para começar a utilizar os serviços do 
                ACI-automações comerciais integradas.
              </p>

              {selectedAmount && (
                <div className="mt-6 p-4 bg-blue-600/20 border border-blue-600/30 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">Valor selecionado:</span>
                    <span className="text-2xl font-bold text-green-400">
                      R$ {selectedAmount.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  
                  {selectedAmount >= 50 && (
                    <div className="mt-2 text-sm text-green-400">
                      + Bônus de 20%: R$ {(selectedAmount * 0.2).toFixed(2).replace('.', ',')}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
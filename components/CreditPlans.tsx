import React, { useState } from 'react';
import { CREDIT_PLANS, PROMOTION_END_DATE, getPromotionValues, formatCurrency } from '../utils/promotionValues';

interface CreditPlansProps {
  onSelectPlan: (amount: number) => void;
  onBack: () => void;
}

export const CreditPlans: React.FC<CreditPlansProps> = ({ onSelectPlan, onBack }) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');

  const plans = CREDIT_PLANS;

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 50) {
      setSelectedAmount(numValue);
    }
  };

  const handlePlanSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const calculateBonus = (amount: number) => {
    return getPromotionValues(amount).bonus;
  };

  const getTotalWithBonus = (amount: number) => {
    return getPromotionValues(amount).total;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center gap-4 max-w-7xl mx-auto">
          <button
            onClick={onBack}
            className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg transition-colors text-sm text-gray-700"
          >
            ← Voltar
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Adicionar Créditos</h1>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Título */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Selecione um valor</h2>
            
            {/* Promoção */}
            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg p-4 mb-8 inline-block">
              <p className="text-lg font-semibold">
                🎉 Promoção: Ganhe 20% de bônus em qualquer recarga realizada até {PROMOTION_END_DATE}
              </p>
            </div>
          </div>

          {/* Planos */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan) => (
              <button
                key={plan.value}
                onClick={() => handlePlanSelect(plan.value)}
                className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                  selectedAmount === plan.value && !customAmount
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-300 bg-white hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">Valor</p>
                  <p className="text-2xl font-bold text-gray-900">{plan.label}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Valor Selecionado */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Valor Selecionado</h3>
            
            <p className="text-gray-600 mb-6 text-center">
              Se preferir, informe outro valor, desde que seja mínimo R$ 50,00
            </p>
            
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-3 text-center">
                ACI - Automações Comerciais Integradas
              </label>
              <div className="relative max-w-xs mx-auto">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
                  R$
                </span>
                <input
                  type="number"
                  min="50"
                  step="0.01"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg pl-12 pr-4 py-4 text-xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="50.00"
                />
              </div>
            </div>

            {/* Resumo Simplificado */}
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                R$ {selectedAmount.toFixed(2)}
              </div>
              <div className="text-green-600 font-semibold mb-4">
                + R$ {calculateBonus(selectedAmount).toFixed(2)} bônus (20%)
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="text-2xl font-bold text-blue-600">
                  Total: R$ {getTotalWithBonus(selectedAmount).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Botão Finalizar */}
          <div className="text-center">
            <button
              onClick={() => onSelectPlan(selectedAmount)}
              disabled={selectedAmount < 50}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-12 rounded-full text-xl transition-all transform hover:scale-105 shadow-lg"
            >
              Finalizar Compra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
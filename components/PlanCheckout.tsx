import React, { useState } from 'react';

interface PlanCheckoutProps {
  planId: string;
  isAnnual: boolean;
  onBack: () => void;
  onConfirm: () => void;
}

export const PlanCheckout: React.FC<PlanCheckoutProps> = ({ planId, isAnnual, onBack, onConfirm }) => {
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');

  const planDetails = {
    essencial: {
      name: 'Essencial',
      monthlyPrice: 59,
      annualPrice: 590,
      color: 'bg-gray-600'
    },
    ouro: {
      name: 'Ouro',
      monthlyPrice: 127,
      annualPrice: 1270,
      color: 'bg-yellow-400'
    },
    diamante: {
      name: 'Diamante',
      monthlyPrice: 167,
      annualPrice: 1670,
      color: 'bg-blue-400'
    },
    free: {
      name: 'Grátis',
      monthlyPrice: 0,
      annualPrice: 0,
      color: 'bg-green-500'
    }
  };

  const plan = planDetails[planId as keyof typeof planDetails];
  const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
  const discount = isAnnual ? Math.round((1 - plan.annualPrice / (plan.monthlyPrice * 12)) * 100) : 0;

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleCpfChange = (value: string) => {
    setCpf(formatCPF(value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (planId === 'free') {
      onConfirm();
      return;
    }

    if (!email || !name || !cpf) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    onConfirm();
  };

  if (planId === 'free') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Plano Grátis Ativado!</h2>
          <p className="text-gray-600 mb-8">
            Você pode começar a usar o ACI imediatamente com as funcionalidades básicas.
          </p>
          
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 text-left">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700">Limite de 3 promoções por hora</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700">Gere promoções Magalu</span>
            </div>
          </div>
          
          <button
            onClick={onConfirm}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition-colors mb-4"
          >
            Começar Agora
          </button>
          
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Voltar aos planos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg transition-colors text-sm"
          >
            ← Voltar
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Finalizar Assinatura</h1>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulário */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Dados da Assinatura</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CPF
                  </label>
                  <input
                    type="text"
                    value={cpf}
                    onChange={(e) => handleCpfChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="000.000.000-00"
                    required
                  />
                </div>

                {/* Método de Pagamento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Método de Pagamento
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('pix')}
                      className={`p-4 border-2 rounded-lg transition-colors ${
                        paymentMethod === 'pix'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">🏦</div>
                        <div className="font-semibold">PIX</div>
                        <div className="text-sm text-gray-600">Aprovação imediata</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 border-2 rounded-lg transition-colors ${
                        paymentMethod === 'card'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">💳</div>
                        <div className="font-semibold">Cartão</div>
                        <div className="text-sm text-gray-600">Débito ou Crédito</div>
                      </div>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-full transition-all transform hover:scale-105"
                >
                  Finalizar Assinatura
                </button>
              </form>
            </div>

            {/* Resumo */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumo do Pedido</h2>
              
              {/* Plan Card */}
              <div className={`${plan.color} text-white rounded-xl p-6 mb-6`}>
                <h3 className="text-2xl font-bold mb-2">Plano {plan.name}</h3>
                <div className="text-3xl font-bold">
                  R$ {price.toFixed(2)}
                  <span className="text-lg font-normal">
                    /{isAnnual ? 'ano' : 'mês'}
                  </span>
                </div>
                {isAnnual && discount > 0 && (
                  <div className="mt-2 text-sm bg-white/20 rounded-full px-3 py-1 inline-block">
                    💰 Economize {discount}% no plano anual
                  </div>
                )}
              </div>

              {/* Billing Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plano selecionado:</span>
                  <span className="font-semibold">{plan.name} {isAnnual ? 'Anual' : 'Mensal'}</span>
                </div>
                
                {isAnnual && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto anual:</span>
                    <span className="font-semibold">-{discount}%</span>
                  </div>
                )}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span>R$ {price.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">✨ Benefícios inclusos:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Acesso imediato</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Suporte técnico</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Atualizações gratuitas</span>
                  </div>
                  {isAnnual && (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>2 meses grátis</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';

interface PricingPlansProps {
  onSelectPlan: (planId: string, isAnnual: boolean) => void;
  onBack: () => void;
}

export const PricingPlans: React.FC<PricingPlansProps> = ({ onSelectPlan, onBack }) => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      id: 'essencial',
      name: 'ESSENCIAL',
      color: 'bg-gray-600',
      textColor: 'text-white',
      monthlyPrice: 59,
      annualPrice: 590,
      features: [
        'Gere promoções ilimitadas de grandes lojas como Shopee, Mercado Livre, Amazon',
        'Texto de disparo customizável por loja',
        'Template de story customizado',
        'Site de promoções personalizado',
        'Selo de verificado no site de promoções'
      ]
    },
    {
      id: 'ouro',
      name: 'OURO',
      color: 'bg-yellow-400',
      textColor: 'text-gray-900',
      monthlyPrice: 127,
      annualPrice: 1270,
      features: [
        'Tudo do plano Essencial',
        'Gere promoções ilimitadas de grandes lojas como Natura, Amazon, Eudora, ZZMall, C&A e Beleza na Web',
        'Gere promoções ilimitadas Amazon',
        'Configure domínio próprio'
      ]
    },
    {
      id: 'diamante',
      name: 'DIAMANTE',
      color: 'bg-blue-400',
      textColor: 'text-white',
      monthlyPrice: 167,
      annualPrice: 1670,
      popular: true,
      features: [
        'Tudo do plano Essencial + Ouro',
        'Gere promoções ilimitadas de grandes lojas como MercadoLivre, Época Cosméticos, Awin, LTK (reStyle) e AliExpress',
        'Integre com Whatsapp (API Oficial)',
        'Integre Google Tagmanager + Google Analytics p/ métricas',
        'Crie até 2 perfis na mesma assinatura'
      ]
    }
  ];

  const freeFeatures = [
    'Limite de 3 promoções por hora',
    'Gere promoções Magalu'
  ];

  const getPrice = (plan: any) => {
    return isAnnual ? plan.annualPrice : plan.monthlyPrice;
  };

  const getDiscount = () => {
    return isAnnual ? 10 : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center gap-4 max-w-7xl mx-auto">
          <button
            onClick={onBack}
            className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg transition-colors text-sm"
          >
            ← Voltar
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Planos ACI</h1>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Escolha um plano
              </span>
              <span className="text-gray-600 text-lg ml-2">(Acesso imediato)</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Comece <strong>hoje mesmo</strong> a usar o ACI - Automações Comerciais Integradas para otimizar sua rotina de vendas online
            </p>
          </div>

          {/* Toggle Mensal/Anual */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4 bg-white rounded-full p-2 shadow-lg">
              <span className={`px-4 py-2 ${!isAnnual ? 'text-purple-600 font-semibold' : 'text-gray-600'}`}>
                MENSAL
              </span>
              
              <div className="relative">
                <button
                  onClick={() => setIsAnnual(!isAnnual)}
                  className={`w-14 h-7 rounded-full transition-colors ${
                    isAnnual ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    isAnnual ? 'translate-x-8' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-4 py-2 ${isAnnual ? 'text-purple-600 font-semibold' : 'text-gray-600'}`}>
                  ANUAL
                </span>
                {isAnnual && (
                  <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                    💰 Economize até {getDiscount()}%
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Plan Type Toggle */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-white rounded-full p-1 shadow-lg">
              <button className="px-6 py-2 rounded-full bg-gray-100 text-gray-700 font-medium">
                Plano Básico
              </button>
              <button className="px-6 py-2 rounded-full text-gray-600 font-medium flex items-center gap-2">
                ⚡ Com Disparador
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan) => (
              <div key={plan.id} className="relative">
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      ⭐ POPULAR
                    </div>
                  </div>
                )}
                
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full">
                  {/* Plan Header */}
                  <div className={`${plan.color} ${plan.textColor} p-6 text-center`}>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                  </div>

                  {/* Plan Content */}
                  <div className="p-6">
                    <div className="text-center mb-6">
                      <p className="text-gray-600 mb-2">Plano {isAnnual ? 'Anual' : 'Mensal'}</p>
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        {isAnnual ? '12x ' : ''}R$ {getPrice(plan).toFixed(2)}
                      </div>
                      <p className="text-purple-600 hover:underline cursor-pointer text-sm">
                        Conte com nosso suporte
                      </p>
                    </div>

                    <button
                      onClick={() => onSelectPlan(plan.id, isAnnual)}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105 mb-6"
                    >
                      QUERO ESSE PLANO
                    </button>

                    {/* Features */}
                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">{feature}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">GRÁTIS</h3>
              <div className="text-6xl font-bold text-gray-900 mb-2">
                0<span className="text-2xl text-gray-500">/MÊS</span>
              </div>
              <p className="text-gray-600">Não precisa de cartão de crédito</p>
            </div>

            <div className="space-y-3 mb-6">
              {freeFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{feature}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => onSelectPlan('free', false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors"
            >
              COMEÇAR HOJE GRÁTIS
            </button>
          </div>

          {/* Bottom Navigation */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xl font-bold">ACI</span>
              </div>

              <div className="hidden md:flex items-center gap-8">
                <a href="#inicio" className="hover:text-purple-200 transition-colors">Início</a>
                <a href="#solucoes" className="hover:text-purple-200 transition-colors">Soluções</a>
                <a href="#planos" className="hover:text-purple-200 transition-colors">Planos</a>
                <a href="#ajuda" className="hover:text-purple-200 transition-colors">Ajuda</a>
                <a href="#login" className="hover:text-purple-200 transition-colors">Login</a>
              </div>

              <button className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-full font-medium transition-colors">
                Comece agora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
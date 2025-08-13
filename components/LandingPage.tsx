import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onViewPlans: () => void;
  onViewSolutions: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin, onViewPlans, onViewSolutions }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 text-white overflow-hidden">
      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold">ACI</span>
          </div>

          {/* Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#inicio" className="hover:text-pink-300 transition-colors">Início</a>
            <button 
              onClick={onViewSolutions}
              className="hover:text-pink-300 transition-colors"
            >
              Soluções
            </button>
            <button 
              onClick={onViewPlans}
              className="hover:text-pink-300 transition-colors"
            >
              Planos
            </button>
            <a href="#ajuda" className="hover:text-pink-300 transition-colors">Ajuda</a>
            <button 
              onClick={onLogin}
              className="hover:text-pink-300 transition-colors"
            >
              Login
            </button>
          </div>

          {/* CTA Button */}
          <button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 px-6 py-2 rounded-full font-medium transition-all transform hover:scale-105"
          >
            Comece agora
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative px-6 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                O app que
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                  facilita o dia a
                </span>
                <br />
                dia do
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                  empreendedor
                </span>
              </h1>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg text-blue-100">
                    <strong className="text-white">VENDA MAIS E GANHE TEMPO</strong> ao automatizar suas 
                    vendas no Telegram com integração Shopee, WhatsApp, e muito mais.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Comece agora
            </button>
          </div>

          {/* Right Content - Phone Mockup */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0">
              <div className="absolute top-20 right-20 w-32 h-32 bg-pink-500/20 rounded-full blur-xl"></div>
              <div className="absolute bottom-20 left-10 w-24 h-24 bg-purple-500/20 rounded-full blur-xl"></div>
            </div>

            {/* Phone Mockup */}
            <div className="relative z-10">
              <div className="w-80 h-[600px] bg-black rounded-[3rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-gradient-to-b from-gray-900 to-gray-800 rounded-[2.5rem] overflow-hidden">
                  {/* Phone Header */}
                  <div className="flex items-center justify-between p-4 bg-gray-800">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold">ACI</span>
                      </div>
                      <span className="text-white text-sm font-medium">Automações...</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                    </div>
                  </div>

                  {/* Phone Content */}
                  <div className="p-6 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-600/30 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-blue-300">150+</div>
                        <div className="text-xs text-blue-200">Vendas/dia</div>
                      </div>
                      <div className="bg-green-600/30 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-green-300">R$ 5k</div>
                        <div className="text-xs text-green-200">Faturamento</div>
                      </div>
                    </div>

                    {/* Feature List */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 bg-gray-700/50 rounded-lg p-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-white text-sm font-medium">Telegram Bot</div>
                          <div className="text-gray-400 text-xs">Automatizado</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-gray-700/50 rounded-lg p-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-white text-sm font-medium">Shopee Links</div>
                          <div className="text-gray-400 text-xs">Afiliação ativa</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-gray-700/50 rounded-lg p-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-white text-sm font-medium">Analytics</div>
                          <div className="text-gray-400 text-xs">Tempo real</div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg p-4 text-center">
                      <div className="text-white font-bold text-lg mb-1">COMISSÕES</div>
                      <div className="text-pink-100 text-sm">Aumente seus ganhos</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-10 right-10 bg-white/10 backdrop-blur-sm rounded-full p-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>

            <div className="absolute bottom-20 right-0 bg-white/10 backdrop-blur-sm rounded-full p-4">
              <div className="text-center">
                <div className="text-2xl font-bold">98%</div>
                <div className="text-xs">Satisfação</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};
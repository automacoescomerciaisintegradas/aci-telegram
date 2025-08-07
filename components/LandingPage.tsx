import React from 'react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <h1 className="text-2xl font-bold text-white">ACI</h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => onNavigate('home')}
                className="text-white hover:text-blue-300 transition-colors"
              >
                Início
              </button>
              <button 
                onClick={() => onNavigate('categories')}
                className="text-white hover:text-blue-300 transition-colors"
              >
                Categorias
              </button>
              <button 
                onClick={() => onNavigate('blog')}
                className="text-white hover:text-blue-300 transition-colors"
              >
                Blog
              </button>
              <button 
                onClick={() => onNavigate('about')}
                className="text-white hover:text-blue-300 transition-colors"
              >
                Sobre
              </button>
              <button 
                onClick={() => onNavigate('contact')}
                className="text-white hover:text-blue-300 transition-colors"
              >
                Contato
              </button>
              <button 
                onClick={() => onNavigate('login')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Entrar
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Automações
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Comerciais
            </span>
            Integradas
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Potencialize suas vendas na Shopee com nossa plataforma de automação inteligente. 
            Gerencie produtos, crie campanhas no Telegram e maximize seus resultados com IA.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => onNavigate('register')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Começar Agora
            </button>
            <button 
              onClick={() => onNavigate('about')}
              className="border border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Saiba Mais
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Recursos Principais
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Integração Shopee</h3>
              <p className="text-gray-300">
                Conecte-se diretamente com a API da Shopee para gerenciar produtos, 
                preços e campanhas de forma automatizada.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Automação Telegram</h3>
              <p className="text-gray-300">
                Crie bots inteligentes para divulgar ofertas, gerenciar grupos 
                e automatizar suas campanhas de marketing.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">IA Integrada</h3>
              <p className="text-gray-300">
                Use inteligência artificial para otimizar descrições, 
                gerar imagens e criar conteúdo para suas campanhas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">1000+</div>
              <div className="text-gray-300">Usuários Ativos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">50k+</div>
              <div className="text-gray-300">Produtos Gerenciados</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">99.9%</div>
              <div className="text-gray-300">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">24/7</div>
              <div className="text-gray-300">Suporte</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para Automatizar suas Vendas?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Junte-se a milhares de vendedores que já estão usando nossa plataforma 
            para aumentar suas vendas na Shopee.
          </p>
          <button 
            onClick={() => onNavigate('register')}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
          >
            Criar Conta Gratuita
          </button>
        </div>
      </section>
    </div>
  );
};
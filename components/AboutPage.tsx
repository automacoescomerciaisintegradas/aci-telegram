import React from 'react';
import { Footer } from './Footer';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => onNavigate('home')}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <h1 className="text-2xl font-bold text-white">ACI</h1>
              </button>
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
                className="text-blue-300 font-semibold"
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
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Sobre a
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              ACI
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Somos especialistas em automação comercial, ajudando empreendedores 
            a maximizar seus resultados na Shopee através de tecnologia avançada.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Nossa Missão
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Democratizar o acesso às ferramentas de automação comercial, 
                permitindo que pequenos e médios empreendedores compitam em 
                igualdade com grandes players do mercado.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Acreditamos que a tecnologia deve ser acessível e fácil de usar, 
                por isso desenvolvemos soluções intuitivas que qualquer pessoa 
                pode implementar em seu negócio.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
              <div className="text-6xl text-center mb-6">🎯</div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Nosso Objetivo</h3>
                <p className="text-gray-300">
                  Ser a principal plataforma de automação comercial do Brasil, 
                  ajudando mais de 10.000 empreendedores até 2026.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Nossos Valores
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Inovação</h3>
              <p className="text-gray-300">
                Estamos sempre buscando novas tecnologias e metodologias 
                para oferecer as melhores soluções aos nossos clientes.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Parceria</h3>
              <p className="text-gray-300">
                Vemos nossos clientes como parceiros de negócio. 
                Seu sucesso é o nosso sucesso.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Eficiência</h3>
              <p className="text-gray-300">
                Desenvolvemos soluções que economizam tempo e recursos, 
                maximizando a produtividade dos nossos usuários.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Nossa Equipe
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">FC</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Francisco Queiroz</h3>
              <p className="text-blue-400 mb-4">CEO & Fundador</p>
              <p className="text-gray-300 text-sm">
                Especialista em automação comercial com mais de 8 anos de experiência 
                em e-commerce e marketing digital.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">TS</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Time de Suporte</h3>
              <p className="text-green-400 mb-4">Suporte Técnico</p>
              <p className="text-gray-300 text-sm">
                Equipe especializada em atendimento ao cliente e suporte técnico, 
                disponível 24/7 para ajudar nossos usuários.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">TD</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Time de Desenvolvimento</h3>
              <p className="text-purple-400 mb-4">Tecnologia</p>
              <p className="text-gray-300 text-sm">
                Desenvolvedores experientes focados em criar soluções robustas 
                e escaláveis para automação comercial.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Nossos Números
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
              <div className="text-4xl font-bold text-blue-400 mb-2">1000+</div>
              <div className="text-gray-300">Clientes Ativos</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
              <div className="text-4xl font-bold text-purple-400 mb-2">50k+</div>
              <div className="text-gray-300">Produtos Automatizados</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
              <div className="text-4xl font-bold text-green-400 mb-2">R$ 2M+</div>
              <div className="text-gray-300">Em Vendas Geradas</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
              <div className="text-4xl font-bold text-yellow-400 mb-2">99.9%</div>
              <div className="text-gray-300">Uptime da Plataforma</div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Info Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Informações da Empresa
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Razão Social</p>
                    <p className="text-gray-300">F.C.A. DE QUEIROZ</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold">CNPJ</p>
                    <p className="text-gray-300">59.216.642/0001-75</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Telefone</p>
                    <p className="text-gray-300">(88) 9 2156-7214</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Endereço</p>
                    <p className="text-gray-300">
                      LUIZ SATURNINO DE MATOS, 39<br />
                      Morada Nova, CE<br />
                      CEP: 62940-037
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold">E-mail</p>
                    <p className="text-gray-300">contato@aci.com.br</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para Conhecer Nossa Plataforma?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Junte-se a milhares de empreendedores que já estão automatizando 
            suas vendas e aumentando seus lucros com a ACI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => onNavigate('register')}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Criar Conta Gratuita
            </button>
            <button 
              onClick={() => onNavigate('contact')}
              className="border border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Falar Conosco
            </button>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};
import React, { useState } from 'react';

interface SolutionsPageProps {
    onBack: () => void;
}

export const SolutionsPage: React.FC<SolutionsPageProps> = ({ onBack }) => {
    const [shopeeConnected, setShopeeConnected] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
            {/* Header */}
            <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
                <div className="flex items-center gap-4 max-w-7xl mx-auto">
                    <button
                        onClick={onBack}
                        className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-colors text-sm"
                    >
                        ← Voltar
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-bold">ACI</span>
                        </div>
                        <h1 className="text-2xl font-bold">Soluções ACI</h1>
                    </div>
                </div>
            </div>

            {/* Top Banner */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3">
                <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 text-center flex-wrap">
                    <span className="bg-white text-red-600 px-3 py-1 rounded-full font-bold text-sm">
                        GANHE COMISSÕES
                    </span>
                    <span className="text-sm">
                        Torne-se um afiliado <strong>Shopee</strong> e promova produtos com links automáticos.
                    </span>
                    <button
                        onClick={() => window.open('https://t.me/+qr-lj4zRnzkyYjhh', '_blank')}
                        className="bg-green-500 hover:bg-green-600 px-4 py-1 rounded-full font-bold text-sm transition-colors"
                    >
                        Participar Agora
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Shopee Integration */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">🛒</span>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold">Integração com Shopee</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className={`w-3 h-3 rounded-full ${shopeeConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className="text-sm">
                                        {shopeeConnected ? 'Conta Shopee conectada! Agora é hora de importar produtos e turbinar suas vendas.' : 'Conecte sua conta Shopee para começar'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Conectar Conta Shopee */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                                <h3 className="text-2xl font-bold mb-4">Configuração da Shopee</h3>
                                <p className="text-gray-300 mb-6">
                                    Para utilizar os recursos de importação e automação da Shopee, insira suas credenciais de acesso abaixo:
                                </p>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span>Importação automática de produtos</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span>Geração de artigos detalhados</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span>Listas personalizadas</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span>Análises e reviews automatizados</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShopeeConnected(!shopeeConnected)}
                                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${shopeeConnected
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                                        }`}
                                >
                                    {shopeeConnected ? 'Conta Conectada ✓' : 'Conectar Conta Shopee'}
                                </button>
                            </div>

                            {/* Ganhe Dinheiro como Afiliado */}
                            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/30">
                                <h3 className="text-2xl font-bold mb-4">Ganhe Dinheiro como Afiliado Shopee</h3>
                                <p className="text-gray-300 mb-6">
                                    Transforme sua presença online em uma máquina de faturamento! Cadastre-se no
                                    programa de afiliados Shopee e comece a ganhar comissões ao indicar produtos.
                                    Inscreva-se agora e aumente seus ganhos passivamente!
                                </p>

                                <div className="bg-black/20 rounded-lg p-4 mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-400">Comissão média:</span>
                                        <span className="text-2xl font-bold text-green-400">5-15%</span>
                                    </div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-400">Produtos disponíveis:</span>
                                        <span className="text-lg font-bold text-blue-400">10M+</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-400">Pagamento:</span>
                                        <span className="text-lg font-bold text-purple-400">Mensal</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => window.open('https://s.shopee.com.br/7V6FKWCayQ', '_blank')}
                                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 py-4 px-6 rounded-xl font-bold text-lg transition-all transform hover:scale-105"
                                >
                                    Quero me tornar um Afiliado Agora
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Outras Integrações */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Telegram */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold">Telegram Bot</h3>
                            </div>
                            <p className="text-gray-300 mb-4">
                                Automatize suas vendas com bot inteligente que responde clientes e processa pedidos 24/7.
                            </p>
                            <div className="flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                <span className="text-yellow-400">Em desenvolvimento</span>
                            </div>
                        </div>

                        {/* WhatsApp */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold">WhatsApp Business</h3>
                            </div>
                            <p className="text-gray-300 mb-4">
                                Integre com WhatsApp Business API para disparos em massa e atendimento automatizado.
                            </p>
                            <div className="flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span className="text-red-400">Não configurado</span>
                            </div>
                        </div>

                        {/* Analytics */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold">Analytics Avançado</h3>
                            </div>
                            <p className="text-gray-300 mb-4">
                                Métricas detalhadas de vendas, conversões e performance dos seus links de afiliado.
                            </p>
                            <div className="flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-green-400">Disponível</span>
                            </div>
                        </div>

                        {/* IA Content */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold">Conteúdo IA</h3>
                            </div>
                            <p className="text-gray-300 mb-4">
                                Geração automática de descrições, posts e conteúdo promocional usando inteligência artificial.
                            </p>
                            <div className="flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-green-400">Ativo</span>
                            </div>
                        </div>

                        {/* Automação */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold">Automação Total</h3>
                            </div>
                            <p className="text-gray-300 mb-4">
                                Fluxos automatizados para captura de leads, follow-up de clientes e gestão de campanhas.
                            </p>
                            <div className="flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-blue-400">Configurável</span>
                            </div>
                        </div>

                        {/* Multi-plataforma */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold">Multi-plataforma</h3>
                            </div>
                            <p className="text-gray-300 mb-4">
                                Integração com Amazon, Mercado Livre, AliExpress e outras grandes plataformas de e-commerce.
                            </p>
                            <div className="flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                <span className="text-yellow-400">Em breve</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-black/30 backdrop-blur-sm border-t border-white/10 p-6 mt-12">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-gray-400 text-sm">
                        © 2025 <span className="text-blue-400 font-semibold">ACI</span>. Todos os Direitos Reservados.
                    </p>
                    <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Participe da Comunidade</a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Guias e Tutoriais</a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Suporte</a>
                    </div>
                </div>
            </div>
        </div>
    );
};
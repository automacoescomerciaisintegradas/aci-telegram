import React from 'react';
import { BlogHeader } from './blog/BlogHeader';
import { BlogFooter } from './blog/BlogFooter';

export const BlogLandingPage: React.FC = () => {
  const handleViewProducts = () => {
    // Rolar para a seção de produtos
    const productsSection = document.getElementById('produto');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewOffers = () => {
    // Rolar para a seção de ofertas
    const offersSection = document.getElementById('ofertas');
    if (offersSection) {
      offersSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewGuarantees = () => {
    // Rolar para a seção de garantias
    const guaranteesSection = document.getElementById('garantias');
    if (guaranteesSection) {
      guaranteesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <BlogHeader />
      
      <main className="flex-grow">
        {/* Hero Section - Simplificada para landing page */}
        <section className="relative bg-gradient-to-br from-red-500 via-orange-500 to-yellow-400 overflow-hidden py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ofertas Imperdíveis da Shopee
            </h1>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Descubra os melhores produtos com descontos exclusivos. Qualidade garantida e entrega rápida para todo o Brasil.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleViewProducts}
                className="bg-white text-red-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-100 transition-all duration-300"
              >
                Ver Produtos
              </button>
              <button 
                onClick={handleViewOffers}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-red-600 transition-all duration-300"
              >
                Ver Ofertas
              </button>
            </div>
          </div>
        </section>

        {/* Seção de Destaques */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Por que escolher nossos produtos?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="text-4xl mb-4">🚚</div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Entrega Rápida</h3>
                <p className="text-gray-600">Receba seus produtos em até 5 dias úteis, com frete grátis em compras acima de R$ 150.</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Compra Segura</h3>
                <p className="text-gray-600">Pagamento 100% protegido pela Shopee. Seus dados estão sempre seguros.</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Qualidade Garantida</h3>
                <p className="text-gray-600">Produtos selecionados com garantia de satisfação e milhares de avaliações positivas.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de CTA */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Não perca as melhores ofertas!</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Aproveite descontos especiais por tempo limitado. Clique no botão abaixo para ver os produtos em oferta.
            </p>
            <button 
              onClick={handleViewOffers}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-8 rounded-lg text-xl transition-colors"
            >
              Ver Ofertas Especiais
            </button>
          </div>
        </section>
      </main>

      <BlogFooter />
    </div>
  );
};
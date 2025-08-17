import React, { useState, useEffect } from 'react';
import { BlogHeader } from './BlogHeader';
import { BlogFooter } from './BlogFooter';

// Ícones SVG simples
const Icons = {
  Star: () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  Truck: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7h-3V6a3 3 0 00-6 0v1H8a1 1 0 000 2h1v11a3 3 0 003 3h4a3 3 0 003-3V9h1a1 1 0 100-2zM13 6a1 1 0 00-2 0v1h2V6zm1 15a1 1 0 01-1 1h-4a1 1 0 01-1-1V9h6v12z" />
    </svg>
  ),
  ShoppingBag: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  )
};

interface BlogPageProps {
  onBack?: () => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onBack }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const productImages = [
    'https://down-br.img.susercontent.com/file/br-11134258-7r98o-mbpr92sw6g6132',
    'https://down-br.img.susercontent.com/file/sg-11134201-7rbl9-lmxhplptcwsl78.webp',
    'https://down-br.img.susercontent.com/file/sg-11134201-7rbkc-lmxhpkjx27xla2.webp',
    'https://down-br.img.susercontent.com/file/sg-11134201-7rbm6-lmxhpjsg6f1le8.webp',
    'https://down-br.img.susercontent.com/file/sg-11134201-7rbkm-lmxhpgy2c95lef.webp'
  ];

  const affiliateLink = 'https://s.shopee.com.br/7fPbuMgCs6';
  const videoUrl = 'https://youtube.com/shorts/3fBXcYGg_3A';

  const handleBuyNow = () => {
    window.open(affiliateLink, '_blank');
  };

  const handleWatchVideo = () => {
    window.open(videoUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      <BlogHeader onBack={onBack} />

      {/* Hero Section */}
      <section id="inicio" className="relative bg-gradient-to-br from-red-500 via-orange-500 to-yellow-400 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full transform -translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full transform translate-x-32 translate-y-32"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Oferta
                  <span className="block text-yellow-200">Relâmpago!</span>
                </h1>
                <p className="text-xl lg:text-2xl text-orange-100">
                  Produto com 58% de desconto por tempo limitado
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Icons.Star />
                  </div>
                  <div>
                    <p className="font-semibold">Qualidade</p>
                    <p className="text-sm text-orange-100">Produto testado</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Icons.Truck />
                  </div>
                  <div>
                    <p className="font-semibold">Entrega Rápida</p>
                    <p className="text-sm text-orange-100">Para todo Brasil</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Icons.ShoppingBag />
                  </div>
                  <div>
                    <p className="font-semibold">Desconto</p>
                    <p className="text-sm text-orange-100">58% OFF</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleBuyNow}
                  className="bg-white text-red-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Comprar Agora
                  <Icons.ArrowRight />
                </button>
                <button 
                  onClick={handleWatchVideo}
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-red-600 transition-all duration-300"
                >
                  Ver Vídeo
                </button>
              </div>
            </div>

            <div className="relative">
              <img
                src={productImages[0]}
                alt="Produto em oferta"
                className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/600x500/374151/ffffff?text=Produto+em+Oferta';
                }}
              />
              
              <div className="absolute -top-4 -left-4 bg-white p-4 rounded-xl shadow-xl transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center space-x-2">
                  <div className="bg-green-500 text-white p-2 rounded-lg">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">58%</p>
                    <p className="text-xs text-gray-600">Desconto</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-xl transform rotate-6 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center space-x-2">
                  <div className="bg-red-500 text-white p-2 rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">R$ 18,90</p>
                    <p className="text-xs text-gray-600">Preço</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,60 C300,100 500,20 800,60 L1200,80 L1200,120 L0,120 Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto p-6">
          {/* Flash Sale Banner */}
          <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-lg p-6 mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-3xl">🚨</span>
              <h2 className="text-3xl font-bold">OFERTA RELÂMPAGO!</h2>
              <span className="text-3xl">🚨</span>
            </div>
            
            {/* Countdown Timer */}
            <div className="bg-black/20 rounded-lg p-4 mb-4 inline-block">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-400">⏰</span>
                <span className="text-lg font-semibold">Termina em:</span>
              </div>
              <div className="flex gap-4 text-2xl font-bold">
                <div className="bg-white/10 rounded px-3 py-2">
                  <div>{timeLeft.hours.toString().padStart(2, '0')}</div>
                  <div className="text-xs text-gray-300">HORAS</div>
                </div>
                <div className="bg-white/10 rounded px-3 py-2">
                  <div>{timeLeft.minutes.toString().padStart(2, '0')}</div>
                  <div className="text-xs text-gray-300">MIN</div>
                </div>
                <div className="bg-white/10 rounded px-3 py-2">
                  <div>{timeLeft.seconds.toString().padStart(2, '0')}</div>
                  <div className="text-xs text-gray-300">SEG</div>
                </div>
              </div>
            </div>

            <div className="text-xl mb-4">
              <span className="line-through text-gray-300">R$ 45,00</span>
              <span className="text-3xl font-bold text-yellow-300 ml-4">R$ 18,90</span>
              <span className="bg-green-500 text-white px-2 py-1 rounded ml-2 text-sm">-58%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Galeria de Imagens */}
            <div id="produto" className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-center">📸 Galeria do Produto</h3>
                <div className="grid grid-cols-2 gap-4">
                  {productImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Produto ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg bg-gray-700 group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://via.placeholder.com/300x300/374151/ffffff?text=Produto+${index + 1}`;
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors duration-300"></div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-yellow-400 text-sm">⚠️ Atenção! As imagens são apenas ilustrativas.</p>
                  <p className="text-gray-300 text-sm">Os respectivos produtos estão nos links.</p>
                </div>
              </div>

              {/* Vídeo de Vendas */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-center">🎥 Vídeo de Vendas</h3>
                <div className="relative bg-gray-700 rounded-lg overflow-hidden aspect-video">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={handleWatchVideo}
                      className="bg-red-600 hover:bg-red-700 rounded-full p-4 transition-colors group"
                    >
                      <svg className="w-8 h-8 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/70 rounded px-2 py-1 text-sm">
                    📺 Clique para assistir
                  </div>
                </div>
                <button
                  onClick={handleWatchVideo}
                  className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  🎬 Assistir Vídeo de Vendas
                </button>
              </div>
            </div>

            {/* Informações e CTA */}
            <div className="space-y-6">
              {/* Oferta Principal */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">🔗 👉 Compre agora</h2>
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-3xl font-bold text-yellow-300 mb-2">R$ 18,90</div>
                    <div className="text-lg line-through text-gray-300">De: R$ 45,00</div>
                    <div className="text-green-300 font-bold">Economia de 58%</div>
                  </div>
                  
                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-xl transition-colors transform hover:scale-105 duration-200"
                  >
                    🛒 COMPRAR AGORA
                  </button>
                  
                  <div className="text-sm text-yellow-300">
                    ⚠️ O preço pode mudar a qualquer momento.
                  </div>
                </div>
              </div>

              {/* Benefícios */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-center">✨ Por que escolher este produto?</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-green-400">✅</span>
                    <span>Qualidade garantida</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400">✅</span>
                    <span>Entrega rápida</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400">✅</span>
                    <span>Melhor preço do mercado</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400">✅</span>
                    <span>Garantia de satisfação</span>
                  </div>
                </div>
              </div>

              {/* Urgência */}
              <div className="bg-red-900/20 border border-red-600 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-center text-red-400">⚡ Não perca essa oportunidade única!</h3>
                <div className="text-center space-y-3">
                  <p className="text-gray-300">👆 Clique no botão abaixo e garante já o seu!</p>
                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors animate-pulse"
                  >
                    🚀 GARANTIR MINHA OFERTA
                  </button>
                </div>
              </div>

              {/* Hashtags */}
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">#OfertaEspecial</span>
                  <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm">#Shopee</span>
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">#Promoção</span>
                </div>
              </div>
            </div>
          </div>

          {/* Seção de Garantias */}
          <div id="garantias" className="mt-12 bg-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-8">🛡️ Suas Garantias</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-4">🚚</div>
                <h3 className="text-lg font-bold mb-2">Entrega Garantida</h3>
                <p className="text-gray-300">Receba seu produto ou seu dinheiro de volta</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-lg font-bold mb-2">Compra Segura</h3>
                <p className="text-gray-300">Pagamento 100% protegido pela Shopee</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="text-lg font-bold mb-2">Qualidade Aprovada</h3>
                <p className="text-gray-300">Milhares de avaliações positivas</p>
              </div>
            </div>
          </div>

          {/* CTA Final */}
          <div id="ofertas" className="mt-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">🎯 Última Chance!</h2>
            <p className="text-xl mb-6">Não deixe essa oferta passar. Clique agora e aproveite!</p>
            <button
              onClick={handleBuyNow}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-8 rounded-lg text-xl transition-colors transform hover:scale-105 duration-200"
            >
              💰 COMPRAR COM DESCONTO
            </button>
            <div className="mt-4 text-sm text-yellow-200">
              ⏰ Oferta válida por tempo limitado
            </div>
          </div>
        </div>
      </div>

      <BlogFooter />
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { Footer } from './Footer';

interface Category {
  id: number;
  name: string;
  image: string;
  productCount: number;
  trending: boolean;
}

interface CategoriesPageProps {
  onNavigate: (page: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onNavigate }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Simular carregamento de categorias da Shopee
  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Categorias simuladas da Shopee
      const mockCategories: Category[] = [
        { id: 1, name: 'Eletrônicos', image: '📱', productCount: 15420, trending: true },
        { id: 2, name: 'Moda Feminina', image: '👗', productCount: 23150, trending: true },
        { id: 3, name: 'Casa e Jardim', image: '🏠', productCount: 18900, trending: false },
        { id: 4, name: 'Beleza e Cuidados', image: '💄', productCount: 12300, trending: true },
        { id: 5, name: 'Esportes', image: '⚽', productCount: 8750, trending: false },
        { id: 6, name: 'Automóveis', image: '🚗', productCount: 6420, trending: false },
        { id: 7, name: 'Livros e Papelaria', image: '📚', productCount: 4200, trending: false },
        { id: 8, name: 'Brinquedos', image: '🧸', productCount: 9800, trending: true },
        { id: 9, name: 'Saúde', image: '💊', productCount: 5600, trending: false },
        { id: 10, name: 'Pets', image: '🐕', productCount: 7300, trending: true },
        { id: 11, name: 'Ferramentas', image: '🔧', productCount: 3900, trending: false },
        { id: 12, name: 'Música', image: '🎵', productCount: 2800, trending: false },
      ];
      
      setCategories(mockCategories);
      setLoading(false);
    };

    loadCategories();
  }, []);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const trendingCategories = categories.filter(cat => cat.trending);

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
                className="text-blue-300 font-semibold"
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
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Categorias da
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Shopee
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Explore todas as categorias disponíveis na Shopee e encontre as melhores 
            oportunidades para seus produtos e campanhas de afiliação.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Buscar categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </section>

      {/* Trending Categories */}
      {!searchTerm && (
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              🔥 Categorias em Alta
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingCategories.map((category) => (
                <div key={category.id} className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white relative overflow-hidden">
                  <div className="absolute top-2 right-2">
                    <span className="bg-white/20 text-xs px-2 py-1 rounded-full">TRENDING</span>
                  </div>
                  <div className="text-4xl mb-4">{category.image}</div>
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <p className="text-orange-100 text-sm">
                    {category.productCount.toLocaleString()} produtos
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Categories */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            {searchTerm ? `Resultados para "${searchTerm}"` : 'Todas as Categorias'}
          </h2>
          
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 animate-pulse">
                  <div className="w-16 h-16 bg-gray-600 rounded-full mb-4"></div>
                  <div className="h-6 bg-gray-600 rounded mb-2"></div>
                  <div className="h-4 bg-gray-600 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCategories.map((category) => (
                <div 
                  key={category.id} 
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all cursor-pointer group"
                  onClick={() => {
                    // Aqui você pode navegar para uma página específica da categoria
                    console.log(`Navegando para categoria: ${category.name}`);
                  }}
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                    {category.image}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                  <p className="text-gray-300 text-sm">
                    {category.productCount.toLocaleString()} produtos
                  </p>
                  {category.trending && (
                    <div className="mt-2">
                      <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                        🔥 Em Alta
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {!loading && filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">Nenhuma categoria encontrada</h3>
              <p className="text-gray-300">
                Tente buscar por outro termo ou explore todas as categorias disponíveis.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para Começar?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Cadastre-se agora e comece a automatizar suas vendas nas categorias mais rentáveis da Shopee.
          </p>
          <button 
            onClick={() => onNavigate('register')}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
          >
            Criar Conta Gratuita
          </button>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};
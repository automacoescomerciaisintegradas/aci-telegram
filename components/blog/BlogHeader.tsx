import React, { useState } from 'react';

// Ícones SVG simples
const Icons = {
  Menu: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  X: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Search: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  ShoppingCart: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293A1 1 0 005 16h12M7 13v4a2 2 0 002 2h6a2 2 0 002-2v-4" />
    </svg>
  ),
  User: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
};

interface BlogHeaderProps {
  onBack?: () => void;
}

export const BlogHeader: React.FC<BlogHeaderProps> = ({ onBack }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-red-500 to-orange-500 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition-colors text-sm text-white"
              >
                ← Voltar
              </button>
            )}
            <div className="text-2xl font-bold text-white">
              <span className="bg-white text-red-500 px-2 py-1 rounded-lg">A</span>
              <span className="ml-2">ACI Blog</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#inicio" className="text-white hover:text-yellow-200 transition-colors font-medium">
              Início
            </a>
            <a href="#produto" className="text-white hover:text-yellow-200 transition-colors font-medium">
              Produto
            </a>
            <a href="#ofertas" className="text-white hover:text-yellow-200 transition-colors font-medium">
              Ofertas
            </a>
            <a href="#garantias" className="text-white hover:text-yellow-200 transition-colors font-medium">
              Garantias
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Icons.Search />
              <input
                type="text"
                placeholder="Buscar produtos..."
                className="pl-10 pr-4 py-2 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-yellow-300 w-64"
              />
            </div>
            <Icons.ShoppingCart />
            <Icons.User />
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-yellow-200 transition-colors"
          >
            {isMenuOpen ? <Icons.X /> : <Icons.Menu />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-sm rounded-lg mt-2 mb-4 p-4 shadow-xl">
            <div className="flex flex-col space-y-4">
              <a href="#inicio" className="text-gray-700 hover:text-red-600 transition-colors font-medium py-2">
                Início
              </a>
              <a href="#produto" className="text-gray-700 hover:text-red-600 transition-colors font-medium py-2">
                Produto
              </a>
              <a href="#ofertas" className="text-gray-700 hover:text-red-600 transition-colors font-medium py-2">
                Ofertas
              </a>
              <a href="#garantias" className="text-gray-700 hover:text-red-600 transition-colors font-medium py-2">
                Garantias
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
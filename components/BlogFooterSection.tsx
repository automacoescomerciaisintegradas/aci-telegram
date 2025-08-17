import React from 'react';

interface BlogFooterSectionProps {
  onNavigate: (page: string) => void;
}

export const BlogFooterSection: React.FC<BlogFooterSectionProps> = ({ onNavigate }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4 text-orange-400">Blog Shopee</h3>
      <p className="text-gray-300 mb-4">
        Descubra as melhores ofertas da Shopee com nosso blog especializado. 
        Produtos selecionados com descontos exclusivos.
      </p>
      <button
        onClick={() => onNavigate('blog-shopee')}
        className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Explorar Ofertas
      </button>
    </div>
  );
};
import React from 'react';

interface BlogPreviewProps {
  onNavigate: (page: string) => void;
}

export const BlogPreview: React.FC<BlogPreviewProps> = ({ onNavigate }) => {
  return (
    <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-lg p-6 text-white">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-shrink-0">
          <div className="bg-white/20 rounded-full p-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
        </div>
        
        <div className="flex-grow">
          <h3 className="text-2xl font-bold mb-2">Blog Shopee</h3>
          <p className="mb-4 opacity-90">
            Descubra as melhores ofertas da Shopee com nosso blog especializado. 
            Produtos selecionados com descontos exclusivos.
          </p>
          <button
            onClick={() => onNavigate('blog-shopee')}
            className="bg-white text-orange-600 hover:bg-orange-50 font-bold py-2 px-6 rounded-full transition-colors"
          >
            Explorar Ofertas
          </button>
        </div>
      </div>
    </div>
  );
};
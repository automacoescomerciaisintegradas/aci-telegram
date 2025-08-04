
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-dark-card/50 backdrop-blur-lg border-b border-dark-border sticky top-0 z-50">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
             <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
               FalaAí.xyz
             </span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-sm font-medium text-dark-text-secondary hover:text-dark-text-primary transition-colors">
              Gerar Conteúdo
            </a>
            <a href="#" className="text-sm font-medium text-dark-text-secondary hover:text-dark-text-primary transition-colors">
              Contato
            </a>
            <a href="#" className="bg-brand-primary text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-primary/90 transition-colors">
              Login
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

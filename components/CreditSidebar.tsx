import React from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  avatar: string;
}

interface CreditSidebarProps {
  user: User;
  onAddCredits: () => void;
  onLogout: () => void;
  onClose: () => void;
  onOpenStatement?: () => void;
}

export const CreditSidebar: React.FC<CreditSidebarProps> = ({ 
  user, 
  onAddCredits, 
  onLogout, 
  onClose,
  onOpenStatement
}) => {
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      
      {/* Sidebar */}
      <div className="relative w-80 bg-gray-900 text-white h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Usuário</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
              {user.avatar}
            </div>
            <div>
              <h4 className="font-semibold">{user.name}</h4>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
          </div>
          
          {/* Crédito */}
          <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Crédito:</p>
              <p className="text-xl font-bold text-green-400">
                R$ {user.credits.toFixed(2)}
              </p>
            </div>
            <div className="text-green-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-left">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Meu Perfil</span>
              </button>
            </li>
            
            <li>
              <button 
                onClick={onOpenStatement}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-left"
              >
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Extrato</span>
              </button>
            </li>
            
            <li>
              <button 
                onClick={onAddCredits}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-green-600/20 border border-green-600/30 hover:bg-green-600/30 transition-colors text-left"
              >
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-green-400 font-medium">Adicionar Crédito</span>
              </button>
            </li>
            
            <li>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-left">
                <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Pedidos</span>
              </button>
            </li>
            
            <li>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-left">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>FAQ</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Botão Sair */}
        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-600/20 transition-colors text-left text-red-400 hover:text-red-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
};
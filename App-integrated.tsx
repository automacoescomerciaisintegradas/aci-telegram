import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { LinkGenerator } from './components/LinkGenerator';
import { ShopeeSearch } from './components/ShopeeSearch';
import { TopSales } from './components/TopSales';
import { TelegramPage } from './components/TelegramPage';
import { TelegramShopeePage } from './components/TelegramShopeePage';
import { AdminPage } from './components/AdminPage-simple'; // Usando o painel que funciona
import { ImageGenerator } from './components/ImageGenerator';
import { ChatPage } from './components/ChatPage';
import { AuthPage } from './components/AuthPage';
import NotificationToast from './components/NotificationToast';

export type Page = 'search' | 'generate' | 'topsales' | 'telegram' | 'telegram-shopee' | 'admin' | 'image' | 'chat';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<Page>('admin');

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  if (!isAuthenticated) {
    return <AuthPage onLoginSuccess={handleLogin} />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'admin':
        return <AdminPage />;
      case 'telegram-shopee':
        return <TelegramShopeePage />;
      case 'telegram':
        return <TelegramPage />;
      case 'search':
        return <ShopeeSearch />;
      case 'topsales':
        return <TopSales />;
      case 'generate':
        return <LinkGenerator />;
      case 'image':
        return <ImageGenerator />;
      case 'chat':
        return <ChatPage />;
      default:
        return <AdminPage />;
    }
  };
  
  const isChatPage = activePage === 'chat';

  return (
    <div className="flex h-screen bg-dark-bg text-dark-text-primary font-sans">
      <Sidebar activePage={activePage} onNavigate={setActivePage} onLogout={handleLogout} />
      <main className={`flex-1 ${isChatPage ? 'flex flex-col overflow-hidden' : 'overflow-y-auto'} p-6 md:p-10`}>
        <div className={`max-w-7xl mx-auto ${isChatPage ? 'w-full h-full flex flex-col' : ''}`}>
          {renderPage()}
        </div>
      </main>
      <NotificationToast />
    </div>
  );
};

export default App;
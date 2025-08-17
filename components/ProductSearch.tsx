import React, { useState, useEffect } from 'react';
import { configService } from '../services/configService';
import { productSearchService, Product, SearchFilters } from '../services/productSearchService';

interface ProductSearchProps {
  onBack?: () => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ onBack }) => {
  // --- Estados do Componente ---
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [userCredits, setUserCredits] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isSendingTelegram, setIsSendingTelegram] = useState(false);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const [searchStats, setSearchStats] = useState<{ totalResults: number; searchTime: number; creditsUsed: number } | null>(null);

  // Estados para mensagens de feedback (toasts)
  const [error, setError] = useState('');
  const [telegramMessage, setTelegramMessage] = useState('');
  const [whatsappMessage, setWhatsappMessage] = useState('');

  const categories = [
    { id: 'roupas-femininas', name: 'Roupas Femininas (Todas)' },
    { id: 'roupas-masculinas', name: 'Roupas Masculinas (Todas)' },
    { id: 'eletronicos', name: 'Eletrônicos' },
    { id: 'casa-decoracao', name: 'Casa e Decoração' },
    { id: 'beleza-saude', name: 'Beleza e Saúde' },
    { id: 'esportes', name: 'Esportes' }
  ];

  // --- Efeitos ---

  // Carregar créditos do usuário ao montar o componente
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('aci_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setUserCredits(user.credits || 0);
      }
    } catch (err) {
      console.error('Erro ao carregar créditos do usuário:', err);
      setError('Não foi possível carregar seus créditos.');
    }
  }, []);

  // Efeito para limpar mensagens de feedback após 5 segundos
  useEffect(() => {
    if (error || telegramMessage || whatsappMessage) {
      const timer = setTimeout(() => {
        setError('');
        setTelegramMessage('');
        setWhatsappMessage('');
      }, 5000); // Mensagem desaparece após 5 segundos

      // Limpa o timer se o componente for desmontado
      return () => clearTimeout(timer);
    }
  }, [error, telegramMessage, whatsappMessage]);


  // --- Funções ---

  const hasEnoughCredits = () => userCredits >= 0.03;

  const handleSearch = async () => {
    if (!selectedCategory) {
      setError('Selecione uma categoria para realizar a busca.');
      return;
    }
    if (!searchTerm.trim()) {
      setError('Digite um termo para buscar.');
      return;
    }
    if (!hasEnoughCredits()) {
      setError('Créditos insuficientes. Você precisa de R$ 0,03 para realizar uma busca.');
      return;
    }

    setIsSearching(true);
    setError('');
    setProducts([]);
    setSearchStats(null);

    try {
      const filters: SearchFilters = {
        category: selectedCategory,
        searchTerm: searchTerm.trim(),
        sortBy: 'sales',
        sortOrder: 'desc'
      };

      const result = await productSearchService.searchProducts(filters);
      
      setProducts(result.products);
      setSearchStats({
        totalResults: result.totalResults,
        searchTime: result.searchTime,
        creditsUsed: result.creditsUsed
      });
      setUserCredits(prev => Math.max(0, prev - result.creditsUsed));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido na busca.');
    } finally {
      setIsSearching(false);
    }
  };

  const selectAllProducts = () => setSelectedProducts(products.map(p => p.id));
  const deselectAllProducts = () => setSelectedProducts([]);

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const sendToTelegram = async () => {
    if (selectedProducts.length === 0) {
      setError('Selecione pelo menos um produto para enviar.');
      return;
    }
    const telegramConfig = configService.getTelegramConfig();
    if (!telegramConfig.botToken || !telegramConfig.chatId) {
      setError('A configuração do Telegram está incompleta. Verifique as configurações.');
      return;
    }

    setIsSendingTelegram(true);
    setError('');

    try {
      const selectedProductList = products.filter(p => selectedProducts.includes(p.id));
      for (const product of selectedProductList) {
        const message = productSearchService.generateTelegramMessage(product);
        const response = await fetch(`https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramConfig.chatId,
            text: message,
            parse_mode: 'Markdown'
          })
        });
        if (!response.ok) throw new Error(`Falha ao enviar o produto: ${product.title}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Pausa para evitar rate limiting
      }
      setTelegramMessage(`✅ ${selectedProductList.length} produtos enviados com sucesso para o Telegram!`);
      setSelectedProducts([]);
    } catch (err) {
      setError(`Erro ao enviar para Telegram: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    } finally {
      setIsSendingTelegram(false);
    }
  };

  const sendToWhatsApp = async () => {
    if (selectedProducts.length === 0) {
      setError('Selecione pelo menos um produto para enviar.');
      return;
    }
    const whatsappConfig = configService.getWhatsAppConfig();
    if (!whatsappConfig.apiKey || !whatsappConfig.apiUrl || !whatsappConfig.instanceName || !whatsappConfig.channelUrl) {
      setError('A configuração do WhatsApp está incompleta. Verifique as configurações.');
      return;
    }

    setIsSendingWhatsApp(true);
    setError('');

    try {
      const selectedProductList = products.filter(p => selectedProducts.includes(p.id));
      const channelId = whatsappConfig.channelUrl.split('/').pop();
      if(!channelId) throw new Error("URL do Canal do WhatsApp inválida.");

      for (const product of selectedProductList) {
        const message = productSearchService.generateTelegramMessage(product); // Reutilizando formato
        const response = await fetch(`${whatsappConfig.apiUrl}/message/sendText/${whatsappConfig.instanceName}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': whatsappConfig.apiKey
          },
          body: JSON.stringify({ number: channelId, options: { text: message } }) // Ajustado para o corpo esperado da Evolution API
        });
        if (!response.ok) throw new Error(`Falha ao enviar o produto: ${product.title}`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Pausa maior para WhatsApp
      }
      setWhatsappMessage(`✅ ${selectedProductList.length} produtos enviados para o canal do WhatsApp!`);
      setSelectedProducts([]);
    } catch (err) {
      setError(`Erro ao enviar para WhatsApp: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    } finally {
      setIsSendingWhatsApp(false);
    }
  };

  const copyAffiliateLink = async (product: Product) => {
    try {
      const link = product.short_url || product.affiliate_url;
      await navigator.clipboard.writeText(link);
      const copyBtn = document.querySelector(`[data-product-id="${product.id}"] .copy-btn`);
      if (copyBtn) {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copiado!';
        setTimeout(() => { copyBtn.textContent = originalText; }, 2000);
      }
    } catch (err) {
      console.error('Erro ao copiar link:', err);
      setError('Falha ao copiar o link.');
    }
  };

  const openAffiliateLink = (product: Product) => {
    const link = product.short_url || product.affiliate_url;
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-400 mb-2">Busca de Produtos</h1>
            <p className="text-gray-300 text-lg">Encontre produtos para suas campanhas de afiliado</p>
          </div>
          {onBack && (
            <button onClick={onBack} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors">
              Voltar
            </button>
          )}
        </div>

        {/* Aviso de Créditos */}
        <div className="bg-orange-600 text-white p-4 rounded-lg mb-6 text-center">
          <p className="text-lg font-semibold">⚠️ CADA BUSCA CONSOME R$ 0,03 EM CRÉDITOS</p>
          <p className="text-sm mt-1">
            Seus créditos atuais: <span className="font-bold text-yellow-300">R$ {userCredits.toFixed(2)}</span>
          </p>
        </div>

        {/* Filtros e Busca */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <label htmlFor="category-select" className="block text-xl font-semibold mb-4 text-blue-400">1. Selecione a Categoria</label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Escolha uma categoria --</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <label htmlFor="search-input" className="block text-xl font-semibold mb-4 text-green-400">2. Pesquise o Produto</label>
            <div className="flex gap-2">
              <input
                id="search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ex: 'vestido de festa', 'tênis corrida'..."
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                onClick={handleSearch}
                disabled={isSearching || !selectedCategory || !searchTerm.trim() || !hasEnoughCredits()}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-2 rounded-lg transition-colors font-semibold"
              >
                {isSearching ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Resultados */}
        {isSearching && <p className="text-center text-lg">Buscando produtos, por favor aguarde...</p>}
        
        {searchStats && (
          <div className="bg-green-800 border border-green-600 text-white p-4 rounded-lg mb-6 text-center">
            <p>
              ✅ Busca concluída! {searchStats.totalResults} produtos encontrados em {(searchStats.searchTime / 1000).toFixed(1)}s.
              Créditos usados: R$ {searchStats.creditsUsed.toFixed(2)}
            </p>
          </div>
        )}

        {products.length > 0 && (
          <>
            {/* Ações em Lote */}
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-6">
              <h3 className="text-lg font-semibold mb-4">Ações em Lote</h3>
              <div className="flex flex-wrap gap-4 mb-4">
                <button onClick={sendToTelegram} disabled={isSendingTelegram || selectedProducts.length === 0} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  {isSendingTelegram ? 'Enviando...' : `Enviar p/ Telegram (${selectedProducts.length})`}
                </button>
                <button onClick={sendToWhatsApp} disabled={isSendingWhatsApp || selectedProducts.length === 0} className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  {isSendingWhatsApp ? 'Enviando...' : `Enviar p/ WhatsApp (${selectedProducts.length})`}
                </button>
                {/* Outros botões podem ser adicionados aqui */}
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                <button onClick={selectAllProducts} className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded-md text-sm">Selecionar Todos</button>
                <button onClick={deselectAllProducts} className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded-md text-sm">Limpar Seleção</button>
                <span className="text-gray-300 text-sm">{selectedProducts.length} de {products.length} produtos selecionados</span>
              </div>
            </div>

            {/* Tabela de Produtos */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-700 text-xs uppercase">
                    <tr>
                      <th className="px-4 py-3"><input type="checkbox" className="rounded" checked={products.length > 0 && selectedProducts.length === products.length} onChange={selectedProducts.length === products.length ? deselectAllProducts : selectAllProducts} /></th>
                      <th className="px-4 py-3">Produto</th>
                      <th className="px-4 py-3">Vendidos</th>
                      <th className="px-4 py-3">Ganho</th>
                      <th className="px-4 py-3">Preço</th>
                      <th className="px-4 py-3">Comissão</th>
                      <th className="px-4 py-3">Desconto</th>
                      <th className="px-4 py-3 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-t border-gray-700 hover:bg-gray-750" data-product-id={product.id}>
                        <td className="px-4 py-3"><input type="checkbox" className="rounded" checked={selectedProducts.includes(product.id)} onChange={() => toggleProductSelection(product.id)} /></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={product.image_url} alt={product.title} className="w-12 h-12 object-cover rounded" />
                            <p className="font-medium line-clamp-2 max-w-xs">{product.title}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">{product.sold_count.toLocaleString()}</td>
                        <td className="px-4 py-3 text-green-400 font-semibold">{product.affiliate_earning}</td>
                        <td className="px-4 py-3">{`${product.min_price} - ${product.max_price}`}</td>
                        <td className="px-4 py-3 text-blue-400">{product.commission_rate}</td>
                        <td className="px-4 py-3 text-orange-400">{product.discount}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col items-center gap-2">
                            <button onClick={() => openAffiliateLink(product)} className="bg-green-600 hover:bg-green-700 w-full px-2 py-1 rounded text-xs font-semibold transition-colors">Ver Oferta</button>
                            <button onClick={() => copyAffiliateLink(product)} className="copy-btn bg-blue-600 hover:bg-blue-700 w-full px-2 py-1 rounded text-xs transition-colors">Copiar Link</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Mensagens de Feedback Flutuantes */}
        {error && <div className="fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">{error}</div>}
        {telegramMessage && <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">{telegramMessage}</div>}
        {whatsappMessage && <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">{whatsappMessage}</div>}
      </div>
    </div>
  );
};

export default ProductSearch;
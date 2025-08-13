import React, { useState, useEffect } from 'react';
import { configService } from '../services/configService';
import { productSearchService, Product, SearchFilters } from '../services/productSearchService';

interface ProductSearchProps {
  onBack?: () => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [userCredits, setUserCredits] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isSendingTelegram, setIsSendingTelegram] = useState(false);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const [telegramMessage, setTelegramMessage] = useState('');
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [searchStats, setSearchStats] = useState<{ totalResults: number; searchTime: number; creditsUsed: number } | null>(null);

  // Categorias disponíveis
  const categories = [
    { id: 'roupas-femininas', name: 'Roupas Femininas (Todas)' },
    { id: 'roupas-masculinas', name: 'Roupas Masculinas (Todas)' },
    { id: 'eletronicos', name: 'Eletrônicos' },
    { id: 'casa-decoracao', name: 'Casa e Decoração' },
    { id: 'beleza-saude', name: 'Beleza e Saúde' },
    { id: 'esportes', name: 'Esportes' }
  ];

  // Carregar créditos do usuário
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('aci_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setUserCredits(user.credits || 0);
      }
    } catch (error) {
      console.error('Erro ao carregar créditos:', error);
    }
  }, []);

  // Verificar se tem créditos suficientes
  const hasEnoughCredits = () => {
    return userCredits >= 0.03;
  };

  // Realizar busca
  const handleSearch = async () => {
    if (!selectedCategory) {
      setError('Selecione uma categoria para realizar a busca');
      return;
    }

    if (!searchTerm.trim()) {
      setError('Digite um termo para buscar');
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

      // Atualizar créditos do usuário
      setUserCredits(prev => Math.max(0, prev - result.creditsUsed));

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao realizar busca');
    } finally {
      setIsSearching(false);
    }
  };

  // Selecionar todos os produtos
  const selectAllProducts = () => {
    setSelectedProducts(products.map(p => p.id));
  };

  // Desselecionar todos os produtos
  const deselectAllProducts = () => {
    setSelectedProducts([]);
  };

  // Alternar seleção de um produto
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Enviar produtos selecionados para o Telegram
  const sendToTelegram = async () => {
    if (selectedProducts.length === 0) {
      setError('Selecione pelo menos um produto para enviar');
      return;
    }

    const telegramConfig = configService.getTelegramConfig();
    if (!telegramConfig.botToken || !telegramConfig.chatId) {
      setError('Configure o bot do Telegram primeiro');
      return;
    }

    setIsSendingTelegram(true);
    setError('');

    try {
      const selectedProductList = products.filter(p => selectedProducts.includes(p.id));
      
      // Enviar produtos um por vez para evitar limite de caracteres
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

        if (!response.ok) {
          throw new Error(`Erro ao enviar produto ${product.title}`);
        }

        // Aguardar um pouco entre envios para evitar spam
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setTelegramMessage(`✅ ${selectedProductList.length} produtos enviados com sucesso para o Telegram!`);
      setSelectedProducts([]); // Limpar seleção

    } catch (error) {
      setError(`Erro ao enviar para o Telegram: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsSendingTelegram(false);
    }
  };

  // Enviar produtos selecionados para o WhatsApp
  const sendToWhatsApp = async () => {
    if (selectedProducts.length === 0) {
      setError('Selecione pelo menos um produto para enviar');
      return;
    }

    const whatsappConfig = configService.getWhatsAppConfig();
    if (!whatsappConfig.apiKey || !whatsappConfig.channelUrl) {
      setError('Configure o WhatsApp primeiro nas configurações do sistema');
      return;
    }

    setIsSendingWhatsApp(true);
    setError('');

    try {
      const selectedProductList = products.filter(p => selectedProducts.includes(p.id));
      
      // Enviar produtos um por vez para o canal do WhatsApp
      for (const product of selectedProductList) {
        const message = productSearchService.generateTelegramMessage(product); // Reutilizar formato do Telegram
        
        // Enviar para o canal do WhatsApp usando a Evolution API
        const response = await fetch(`${whatsappConfig.apiUrl}message/sendText/${whatsappConfig.instanceName}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': whatsappConfig.apiKey
          },
          body: JSON.stringify({
            number: whatsappConfig.channelUrl.split('/').pop(), // Extrair ID do canal da URL
            text: message
          })
        });

        if (!response.ok) {
          throw new Error(`Erro ao enviar produto ${product.title} para o WhatsApp`);
        }

        // Aguardar um pouco entre envios para evitar spam
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      setWhatsappMessage(`✅ ${selectedProductList.length} produtos enviados com sucesso para o canal do WhatsApp!`);
      setSelectedProducts([]); // Limpar seleção

    } catch (error) {
      setError(`Erro ao enviar para o WhatsApp: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsSendingWhatsApp(false);
    }
  };

  // Copiar link de afiliado para a área de transferência
  const copyAffiliateLink = async (product: Product) => {
    try {
      const link = product.short_url || product.affiliate_url;
      await navigator.clipboard.writeText(link);
      
      // Mostrar feedback temporário
      const originalText = document.querySelector(`[data-product-id="${product.id}"] .copy-btn`)?.textContent;
      const copyBtn = document.querySelector(`[data-product-id="${product.id}"] .copy-btn`);
      if (copyBtn) {
        copyBtn.textContent = '✅ Copiado!';
        setTimeout(() => {
          copyBtn.textContent = originalText || '📋 Copiar';
        }, 2000);
      }
    } catch (error) {
      console.error('Erro ao copiar link:', error);
    }
  };

  // Abrir link de afiliado em nova aba
  const openAffiliateLink = (product: Product) => {
    const link = product.short_url || product.affiliate_url;
    window.open(link, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-blue-400 mb-2">
                Busca de Produtos
              </h1>
              <p className="text-gray-300 text-lg">
                Encontre produtos para suas campanhas de afiliado
              </p>
            </div>
            {onBack && (
              <button
                onClick={onBack}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
              >
                Voltar
              </button>
            )}
          </div>
        </div>

        {/* Aviso de Créditos */}
        <div className="bg-orange-600 text-white p-4 rounded-lg mb-6 text-center">
          <p className="text-lg font-semibold">
            ⚠️ CADA BUSCA CONSOME R$ 0,03 EM CRÉDITOS
          </p>
          <p className="text-sm mt-1">
            Seus créditos atuais: <span className="font-bold text-yellow-300">R$ {userCredits.toFixed(2)}</span>
          </p>
        </div>

        {/* Filtros e Busca */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Filtro de Categoria */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Filtro</h2>
            <div>
              <label className="block text-sm font-medium mb-2">
                Selecione uma categoria
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-2">
                A cada busca terá um custo de R$ 0,03 do seu crédito
              </p>
            </div>
          </div>

          {/* Busca de Produto */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-400">Pesquisar Produto</h2>
            <div>
              <label className="block text-sm font-medium mb-2">
                Termo de busca
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Digite o que deseja buscar..."
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
              <p className="text-xs text-gray-400 mt-2">
                Custo: R$ 0,03 | Créditos disponíveis: R$ {userCredits.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Estatísticas da Busca */}
        {searchStats && (
          <div className="bg-green-600 text-white p-4 rounded-lg mb-6 text-center">
            <p className="text-lg font-semibold">
              ✅ Busca realizada com sucesso!
            </p>
            <p className="text-sm mt-1">
              {searchStats.totalResults} produtos encontrados em {(searchStats.searchTime / 1000).toFixed(1)}s | 
              Créditos utilizados: R$ {searchStats.creditsUsed.toFixed(2)}
            </p>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex gap-4 mb-6">
          <button className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg flex items-center gap-2">
            📥 Export
          </button>
          
          <button
            onClick={sendToTelegram}
            disabled={isSendingTelegram || selectedProducts.length === 0}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            {isSendingTelegram ? '📤 Enviando...' : `📤 Enviar Lote Telegram (${selectedProducts.length})`}
          </button>
          
          <button
            onClick={sendToWhatsApp}
            disabled={isSendingWhatsApp || selectedProducts.length === 0}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            {isSendingWhatsApp ? '📱 Enviando...' : `📱 Enviar Lote WhatsApp (${selectedProducts.length})`}
          </button>
          
          <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2">
            🛒 Enviar Lote WooCommerce
          </button>
          
          <button className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg flex items-center gap-2">
            ⭐ Gerar Review
          </button>
        </div>

        {/* Controles de Seleção */}
        {products.length > 0 && (
          <div className="flex gap-3 mb-4">
            <button
              onClick={selectAllProducts}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg text-sm"
            >
              ✅ Selecionar Todos
            </button>
            <button
              onClick={deselectAllProducts}
              className="bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded-lg text-sm"
            >
              ❌ Desselecionar Todos
            </button>
            <span className="text-gray-300 text-sm flex items-center">
              {selectedProducts.length} de {products.length} produtos selecionados
            </span>
          </div>
        )}

        {/* Tabela de Produtos */}
        {products.length > 0 && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input 
                        type="checkbox" 
                        className="rounded"
                        checked={selectedProducts.length === products.length && products.length > 0}
                        onChange={() => selectedProducts.length === products.length ? deselectAllProducts() : selectAllProducts()}
                      />
                    </th>
                    <th className="px-4 py-3 text-left">PRODUTO</th>
                    <th className="px-4 py-3 text-left">VENDIDOS</th>
                    <th className="px-4 py-3 text-left">GANHO AFILIADO</th>
                    <th className="px-4 py-3 text-left">PREÇO MÍN</th>
                    <th className="px-4 py-3 text-left">PREÇO MÁX</th>
                    <th className="px-4 py-3 text-left">TAXA COMISSÃO</th>
                    <th className="px-4 py-3 text-left">DESCONTO</th>
                    <th className="px-4 py-3 text-left">LINK DE COMPRA</th>
                    <th className="px-4 py-3 text-left">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-t border-gray-700 hover:bg-gray-700" data-product-id={product.id}>
                      <td className="px-4 py-3">
                        <input 
                          type="checkbox" 
                          className="rounded"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => toggleProductSelection(product.id)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={product.image_url} 
                            alt={product.title} 
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="max-w-xs">
                            <p className="text-sm font-medium line-clamp-2">{product.title}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{product.sold_count.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-green-400 font-semibold">{product.affiliate_earning}</td>
                      <td className="px-4 py-3 text-sm">{product.min_price}</td>
                      <td className="px-4 py-3 text-sm">{product.max_price}</td>
                      <td className="px-4 py-3 text-sm text-blue-400">{product.commission_rate}</td>
                      <td className="px-4 py-3 text-sm text-orange-400">{product.discount}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => openAffiliateLink(product)}
                            className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs font-semibold transition-colors"
                          >
                            🚨 COMPRAR AGORA !!
                          </button>
                          <button
                            onClick={() => copyAffiliateLink(product)}
                            className="copy-btn bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs transition-colors"
                          >
                            📋 Copiar
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => openAffiliateLink(product)}
                            className="text-blue-400 hover:text-blue-300"
                            title="Ver produto"
                          >
                            👁️
                          </button>
                          <button className="text-gray-400 hover:text-gray-300">
                            ⋯
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mensagens de Feedback */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg">
            {error}
          </div>
        )}

        {telegramMessage && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
            {telegramMessage}
          </div>
        )}

        {whatsappMessage && (
          <div className="fixed bottom-4 left-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
            {whatsappMessage}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';

const ProductSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSendingTelegram, setIsSendingTelegram] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [userCredits, setUserCredits] = useState(10.0);
  const [products, setProducts] = useState<Array<any>>([]);
  const [searchStats, setSearchStats] = useState<{
    totalResults: number;
    searchTime: number;
    creditsUsed: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [telegramMessage, setTelegramMessage] = useState<string | null>(null);

  // Mock functions
  const handleSearch = () => {
    if (!searchTerm.trim() || !selectedCategory) return;
    setIsSearching(true);
    setTimeout(() => {
      setProducts([
        {
          id: '1',
          title: 'Produto Exemplo com Nome Longo para Testar Linha',
          image_url: 'https://via.placeholder.com/50',
          sold_count: 1234,
          affiliate_earning: 'R$ 15,30',
          min_price: 'R$ 29,90',
          max_price: 'R$ 89,90',
          commission_rate: '5%',
          discount: '20%',
        },
      ]);
      setSearchStats({
        totalResults: 1,
        searchTime: 1200,
        creditsUsed: 0.03,
      });
      setIsSearching(false);
    }, 1500);
  };

  const hasEnoughCredits = () => userCredits >= 0.03;

  const selectAllProducts = () => {
    setSelectedProducts(products.map((p) => p.id));
  };

  const deselectAllProducts = () => {
    setSelectedProducts([]);
  };

  const toggleProductSelection = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id)
        ? prev.filter((pid) => pid !== id)
        : [...prev, id]
    );
  };

  const sendToTelegram = () => {
    setIsSendingTelegram(true);
    setTimeout(() => {
      setTelegramMessage(`✅ Enviado ${selectedProducts.length} produtos para Telegram!`);
      setIsSendingTelegram(false);
      setTimeout(() => setTelegramMessage(null), 3000);
    }, 1000);
  };

  const openAffiliateLink = (product: any) => {
    window.open(`https://example.com/product/${product.id}`, '_blank');
  };

  const copyAffiliateLink = (product: any) => {
    navigator.clipboard.writeText(`https://example.com/product/${product.id}?ref=aff123`);
    alert('Link copiado!');
  };

  return (
    <div className="p-6 text-white">
      {/* Search Section */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">
            Termo de busca
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite o que deseja buscar..."
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

          <p className="text-xs text-gray-400 mt-2">
            Custo: R$ 0,03 | Créditos disponíveis: R$ {userCredits.toFixed(2)}
          </p>
        </div>

        {/* Search Stats */}
        {searchStats && (
          <div className="bg-green-600 text-white p-4 rounded-lg mb-6 text-center">
            <p className="text-lg font-semibold">✅ Busca realizada com sucesso!</p>
            <p className="text-sm mt-1">
              {searchStats.totalResults} produtos encontrados em{' '}
              {(searchStats.searchTime / 1000).toFixed(1)}s |{' '}
              Créditos utilizados: R$ {searchStats.creditsUsed.toFixed(2)}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg flex items-center gap-2">
            📥 Export
          </button>

          <button
            onClick={sendToTelegram}
            disabled={isSendingTelegram || selectedProducts.length === 0}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            {isSendingTelegram
              ? '📤 Enviando...'
              : `📤 Enviar Lote Telegram (${selectedProducts.length})`}
          </button>

          <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2">
            🛒 Enviar Lote WooCommerce
          </button>

          <button className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg flex items-center gap-2">
            ⭐ Gerar Review
          </button>
        </div>

        {/* Selection Controls */}
        {products.length > 0 && (
          <div className="flex gap-3 mb-4">
            <button
              onClick={selectAllProducts}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg text-sm"
            >
              ✅ Selecionar Todos
            </button>
            <button
              onClick={deselectAllProducts}
              className="bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded-lg text-sm"
            >
              ❌ Desselecionar Todos
            </button>
            <span className="text-gray-300 text-sm flex items-center">
              {selectedProducts.length} de {products.length} produtos selecionados
            </span>
          </div>
        )}

        {/* Products Table */}
        {products.length > 0 && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={selectedProducts.length === products.length && products.length > 0}
                        onChange={() =>
                          selectedProducts.length === products.length
                            ? deselectAllProducts()
                            : selectAllProducts()
                        }
                      />
                    </th>
                    <th className="px-4 py-3 text-left">PRODUTO</th>
                    <th className="px-4 py-3 text-left">VENDIDOS</th>
                    <th className="px-4 py-3 text-left">GANHO AFILIADO</th>
                    <th className="px-4 py-3 text-left">PREÇO MÍN</th>
                    <th className="px-4 py-3 text-left">PREÇO MÁX</th>
                    <th className="px-4 py-3 text-left">TAXA COMISSÃO</th>
                    <th className="px-4 py-3 text-left">DESCONTO</th>
                    <th className="px-4 py-3 text-left">LINK DE COMPRA</th>
                    <th className="px-4 py-3 text-left">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-t border-gray-700 hover:bg-gray-700"
                      data-product-id={product.id}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => toggleProductSelection(product.id)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image_url}
                            alt={product.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="max-w-xs">
                            <p className="text-sm font-medium line-clamp-2">{product.title}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{product.sold_count.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-green-400 font-semibold">
                        {product.affiliate_earning}
                      </td>
                      <td className="px-4 py-3 text-sm">{product.min_price}</td>
                      <td className="px-4 py-3 text-sm">{product.max_price}</td>
                      <td className="px-4 py-3 text-sm text-blue-400">{product.commission_rate}</td>
                      <td className="px-4 py-3 text-sm text-orange-400">{product.discount}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => openAffiliateLink(product)}
                            className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs font-semibold transition-colors"
                          >
                            🚨 COMPRAR AGORA !!
                          </button>
                          <button
                            onClick={() => copyAffiliateLink(product)}
                            className="copy-btn bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs transition-colors"
                          >
                            📋 Copiar
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openAffiliateLink(product)}
                            className="text-blue-400 hover:text-blue-300"
                            title="Ver produto"
                          >
                            👁️
                          </button>
                          <button className="text-gray-400 hover:text-gray-300">⋯</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Error & Success Toasts */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg">
            {error}
          </div>
        )}

        {telegramMessage && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
            {telegramMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSearch;
                              import React, { useState } from 'react';

interface LinkGeneratorProps {
  onBack?: () => void;
}

interface GeneratedLink {
  originalUrl: string;
  affiliateUrl: string;
  subIds: string[];
  timestamp: Date;
}

const LinkGenerator: React.FC<LinkGeneratorProps> = ({ onBack }) => {
  const [shopeeUrl, setShopeeUrl] = useState('');
  const [subIds, setSubIds] = useState(['', '', '', '', '']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLinks, setGeneratedLinks] = useState<GeneratedLink[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Carregar links gerados do localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('aci_generated_links');
      if (saved) {
        setGeneratedLinks(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Erro ao carregar links:', error);
    }
  }, []);

  // Salvar links no localStorage
  const saveLinks = (links: GeneratedLink[]) => {
    try {
      localStorage.setItem('aci_generated_links', JSON.stringify(links));
    } catch (error) {
      console.error('Erro ao salvar links:', error);
    }
  };

  const validateShopeeUrl = (url: string): boolean => {
    if (!url) return false;
    
    // Verificar se é uma URL válida da Shopee Brasil
    const shopeePattern = /^https?:\/\/(www\.)?shopee\.com\.br\/.*/;
    return shopeePattern.test(url);
  };

  const validateSubId = (subId: string): boolean => {
    if (!subId) return true; // Sub_IDs vazios são permitidos
    // Apenas alfanumérico (a-z, A-Z, 0-9)
    const subIdPattern = /^[a-zA-Z0-9]+$/;
    return subIdPattern.test(subId);
  };

  const generateAffiliateLink = async () => {
    setError('');
    setSuccess('');

    // Validações
    if (!validateShopeeUrl(shopeeUrl)) {
      setError('Por favor, insira uma URL válida da Shopee Brasil.');
      return;
    }

    // Validar Sub_IDs
    const invalidSubIds = subIds.filter(subId => !validateSubId(subId));
    if (invalidSubIds.length > 0) {
      setError('Sub_IDs devem conter apenas letras e números (a-z, A-Z, 0-9).');
      return;
    }

    setIsGenerating(true);

    try {
      // Simular geração de link (em produção, isso seria uma chamada para a API da Shopee)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Gerar link de afiliado (exemplo - em produção seria a API real)
      const affiliateId = '18372150411'; // Seu ID de afiliado
      const baseUrl = new URL(shopeeUrl);
      
      // Adicionar parâmetros de afiliado
      baseUrl.searchParams.set('affiliate_id', affiliateId);
      
      // Adicionar Sub_IDs preenchidos
      subIds.forEach((subId, index) => {
        if (subId.trim()) {
          baseUrl.searchParams.set(`sub_id${index + 1}`, subId.trim());
        }
      });

      const newLink: GeneratedLink = {
        originalUrl: shopeeUrl,
        affiliateUrl: baseUrl.toString(),
        subIds: subIds.filter(subId => subId.trim()),
        timestamp: new Date()
      };

      const updatedLinks = [newLink, ...generatedLinks];
      setGeneratedLinks(updatedLinks);
      saveLinks(updatedLinks);

      setSuccess('Link de afiliado gerado com sucesso!');
      
      // Limpar formulário
      setShopeeUrl('');
      setSubIds(['', '', '', '', '']);

    } catch (error) {
      setError('Erro ao gerar link. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess('Link copiado para a área de transferência!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Erro ao copiar link.');
    }
  };

  const removeLink = (index: number) => {
    const updatedLinks = generatedLinks.filter((_, i) => i !== index);
    setGeneratedLinks(updatedLinks);
    saveLinks(updatedLinks);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-blue-400 mb-2">
                Gerador de Links de Afiliado
              </h1>
              <p className="text-gray-300 text-lg">
                Crie links de afiliado personalizados para a Shopee Brasil e rastreie seu desempenho
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">
              Criar Link Personalizado
            </h2>
            
            <div className="space-y-4">
              {/* URL da Shopee */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  URL da Página da Shopee *
                </label>
                <input
                  type="url"
                  value={shopeeUrl}
                  onChange={(e) => setShopeeUrl(e.target.value)}
                  placeholder="https://shopee.com.br/produto/..."
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Cole a URL da página da Shopee que você deseja divulgar
                </p>
              </div>

              {/* Sub_IDs */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Sub_IDs para Rastreamento (Opcional)
                </label>
                <p className="text-xs text-gray-400 mb-3">
                  Adicione até 5 Sub_IDs para rastrear o desempenho dos seus links
                </p>
                
                <div className="space-y-2">
                  {subIds.map((subId, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={subId}
                        onChange={(e) => {
                          const newSubIds = [...subIds];
                          newSubIds[index] = e.target.value;
                          setSubIds(newSubIds);
                        }}
                        placeholder={`Sub_id ${index + 1}`}
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {subId && (
                        <span className="text-xs text-gray-400 w-16">
                          {validateSubId(subId) ? '✅' : '❌'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                
                <p className="text-xs text-gray-400 mt-2">
                  Sub_IDs devem conter apenas letras e números (a-z, A-Z, 0-9)
                </p>
              </div>

              {/* Botão Gerar */}
              <button
                onClick={generateAffiliateLink}
                disabled={isGenerating || !shopeeUrl}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                {isGenerating ? 'Gerando...' : 'Gerar Link de Afiliado'}
              </button>
            </div>

            {/* Informações */}
            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2 text-blue-400">Páginas Suportadas:</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Página inicial da Shopee</li>
                <li>• Páginas de detalhes de produtos</li>
                <li>• Páginas de campanhas promocionais</li>
                <li>• Páginas de lojas de vendedores</li>
                <li>• Páginas de categorias de produtos</li>
              </ul>
            </div>
          </div>

          {/* Links Gerados */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-400">
              Links Gerados ({generatedLinks.length})
            </h2>
            
            {generatedLinks.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>Nenhum link gerado ainda.</p>
                <p className="text-sm">Use o formulário ao lado para criar seu primeiro link.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {generatedLinks.map((link, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-gray-400">
                        {link.timestamp.toLocaleString('pt-BR')}
                      </span>
                      <button
                        onClick={() => removeLink(index)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remover
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-400">URL Original:</p>
                        <p className="text-sm text-gray-300 break-all">{link.originalUrl}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-400">Link de Afiliado:</p>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm text-blue-400 break-all flex-1">{link.affiliateUrl}</p>
                          <button
                            onClick={() => copyToClipboard(link.affiliateUrl)}
                            className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
                          >
                            Copiar
                          </button>
                        </div>
                      </div>
                      
                      {link.subIds.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-400">Sub_IDs:</p>
                          <div className="flex flex-wrap gap-1">
                            {link.subIds.map((subId, subIndex) => (
                              <span
                                key={subIndex}
                                className="bg-gray-600 px-2 py-1 rounded text-xs"
                              >
                                {subId}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mensagens de Feedback */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
            {success}
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkGenerator;
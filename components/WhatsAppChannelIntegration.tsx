import React, { useState, useEffect } from 'react';
import { AutoSender, AutoSendConfig, ProductOffer } from '../utils/autoSender';

interface WhatsAppChannelIntegrationProps {
  onBack: () => void;
}

export const WhatsAppChannelIntegration: React.FC<WhatsAppChannelIntegrationProps> = ({ onBack }) => {
  const [config, setConfig] = useState<AutoSendConfig>({
    botToken: '',
    destinations: [],
    whatsappChannelUrl: '',
    interval: 30
  });
  
  const [autoSender, setAutoSender] = useState<AutoSender | null>(null);
  const [status, setStatus] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [newDestination, setNewDestination] = useState({
    name: '',
    chatId: '',
    type: 'whatsapp' as 'telegram' | 'whatsapp'
  });
  
  const [sampleProducts] = useState<ProductOffer[]>([
    {
      title: "Smartphone Samsung Galaxy A54 128GB",
      price: "R$ 1.299,90",
      image_url: "https://via.placeholder.com/300x300/1a1a1a/ffffff?text=Samsung+A54",
      product_url: "https://shopee.com.br/produto-exemplo-1",
      message: "🔥 OFERTA IMPERDÍVEL! 🔥\n\n📱 Samsung Galaxy A54 128GB\n💰 Por apenas R$ 1.299,90\n\n✨ Características:\n• Tela Super AMOLED 6.4\"\n• Câmera tripla 50MP\n• Bateria 5000mAh\n• 128GB de armazenamento\n\n⚡ Oferta por tempo limitado!\n👆 Clique no link para comprar!"
    },
    {
      title: "Fone Bluetooth JBL Tune 510BT",
      price: "R$ 199,90",
      image_url: "https://via.placeholder.com/300x300/1a1a1a/ffffff?text=JBL+Tune",
      product_url: "https://shopee.com.br/produto-exemplo-2",
      message: "🎧 SOM DE QUALIDADE! 🎧\n\n🔊 JBL Tune 510BT Bluetooth\n💰 Apenas R$ 199,90\n\n✨ Características:\n• Som JBL Pure Bass\n• 40h de bateria\n• Conexão Bluetooth 5.0\n• Dobrável e portátil\n\n🎵 Perfeito para música e calls!\n👆 Garante já o seu!"
    },
    {
      title: "Smartwatch Amazfit GTS 4 Mini",
      price: "R$ 599,90",
      image_url: "https://via.placeholder.com/300x300/1a1a1a/ffffff?text=Amazfit+GTS",
      product_url: "https://shopee.com.br/produto-exemplo-3",
      message: "⌚ TECNOLOGIA NO SEU PULSO! ⌚\n\n📱 Amazfit GTS 4 Mini\n💰 Por R$ 599,90\n\n✨ Características:\n• Tela AMOLED 1.65\"\n• 120+ modos esportivos\n• Bateria até 15 dias\n• GPS integrado\n\n💪 Monitore sua saúde 24/7!\n👆 Compre agora com desconto!"
    }
  ]);

  // Carregar configurações salvas
  useEffect(() => {
    try {
      const saved = localStorage.getItem('aci_whatsapp_config');
      if (saved) {
        const parsedConfig = JSON.parse(saved);
        setConfig(parsedConfig);
        
        // Inicializar AutoSender com configuração salva
        const sender = new AutoSender(parsedConfig);
        setAutoSender(sender);
      }
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
    }
  }, []);

  // Salvar configurações
  const saveConfig = () => {
    try {
      localStorage.setItem('aci_whatsapp_config', JSON.stringify(config));
      
      // Reinicializar AutoSender
      const sender = new AutoSender(config);
      setAutoSender(sender);
      
      alert('✅ Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      alert('❌ Erro ao salvar configurações');
    }
  };

  // Adicionar destino
  const addDestination = () => {
    if (!newDestination.name || !newDestination.chatId) {
      alert('Preencha nome e ID/URL do destino');
      return;
    }

    const destination = {
      id: Date.now().toString(),
      name: newDestination.name,
      chatId: newDestination.chatId,
      type: newDestination.type,
      enabled: true
    };

    setConfig(prev => ({
      ...prev,
      destinations: [...prev.destinations, destination]
    }));

    setNewDestination({ name: '', chatId: '', type: 'whatsapp' });
  };

  // Remover destino
  const removeDestination = (id: string) => {
    setConfig(prev => ({
      ...prev,
      destinations: prev.destinations.filter(dest => dest.id !== id)
    }));
  };

  // Toggle destino
  const toggleDestination = (id: string) => {
    setConfig(prev => ({
      ...prev,
      destinations: prev.destinations.map(dest =>
        dest.id === id ? { ...dest, enabled: !dest.enabled } : dest
      )
    }));
  };

  // Iniciar envio automático
  const startAutoSend = () => {
    if (!autoSender) {
      alert('Configure e salve as configurações primeiro');
      return;
    }

    // Adicionar produtos de exemplo à fila
    autoSender.addToQueue(sampleProducts);
    autoSender.start();
    setIsRunning(true);
    
    // Atualizar status periodicamente
    const statusInterval = setInterval(() => {
      const currentStatus = autoSender.getStatus();
      setStatus(currentStatus);
      
      if (!currentStatus.isRunning) {
        setIsRunning(false);
        clearInterval(statusInterval);
      }
    }, 1000);
  };

  // Parar envio automático
  const stopAutoSend = () => {
    if (autoSender) {
      autoSender.stop();
      setIsRunning(false);
      setStatus(null);
    }
  };

  // Limpar fila
  const clearQueue = () => {
    if (autoSender) {
      autoSender.clearQueue();
      setStatus(null);
      setIsRunning(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-green-400 mb-2">WhatsApp Channel Integration</h2>
              <p className="text-gray-300">Configure envio automático para WhatsApp Channel e Telegram</p>
            </div>
            <button
              onClick={onBack}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              ← Voltar
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Configurações */}
            <div className="space-y-6">
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">⚙️ Configurações Gerais</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Token do Bot Telegram
                    </label>
                    <input
                      type="password"
                      value={config.botToken}
                      onChange={(e) => setConfig(prev => ({ ...prev, botToken: e.target.value }))}
                      className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 text-white"
                      placeholder="Token do @BotFather"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      URL do WhatsApp Channel
                    </label>
                    <input
                      type="url"
                      value={config.whatsappChannelUrl}
                      onChange={(e) => setConfig(prev => ({ ...prev, whatsappChannelUrl: e.target.value }))}
                      className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 text-white"
                      placeholder="https://whatsapp.com/channel/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Intervalo entre envios (segundos)
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="3600"
                      value={config.interval}
                      onChange={(e) => setConfig(prev => ({ ...prev, interval: parseInt(e.target.value) || 30 }))}
                      className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 text-white"
                    />
                  </div>

                  <button
                    onClick={saveConfig}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    💾 Salvar Configurações
                  </button>
                </div>
              </div>

              {/* Adicionar Destinos */}
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">📍 Adicionar Destino</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
                    <input
                      type="text"
                      value={newDestination.name}
                      onChange={(e) => setNewDestination(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 text-white"
                      placeholder="Ex: Canal Principal"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Tipo</label>
                    <select
                      value={newDestination.type}
                      onChange={(e) => setNewDestination(prev => ({ ...prev, type: e.target.value as 'telegram' | 'whatsapp' }))}
                      className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 text-white"
                    >
                      <option value="whatsapp">📱 WhatsApp Channel</option>
                      <option value="telegram">📢 Telegram Channel</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {newDestination.type === 'whatsapp' ? 'URL do Channel' : 'Chat ID'}
                    </label>
                    <input
                      type="text"
                      value={newDestination.chatId}
                      onChange={(e) => setNewDestination(prev => ({ ...prev, chatId: e.target.value }))}
                      className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 text-white"
                      placeholder={newDestination.type === 'whatsapp' ? 'https://whatsapp.com/channel/...' : '@canal ou -100123456789'}
                    />
                  </div>

                  <button
                    onClick={addDestination}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    ➕ Adicionar Destino
                  </button>
                </div>
              </div>
            </div>

            {/* Status e Controles */}
            <div className="space-y-6">
              {/* Lista de Destinos */}
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">📋 Destinos Configurados</h3>
                
                {config.destinations.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">Nenhum destino configurado</p>
                ) : (
                  <div className="space-y-3">
                    {config.destinations.map((dest) => (
                      <div key={dest.id} className="bg-gray-600 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={dest.enabled}
                            onChange={() => toggleDestination(dest.id)}
                            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">{dest.name}</span>
                              <span className={`px-2 py-1 rounded text-xs ${
                                dest.type === 'whatsapp' ? 'bg-green-600' : 'bg-blue-600'
                              }`}>
                                {dest.type === 'whatsapp' ? '📱 WhatsApp' : '📢 Telegram'}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm truncate max-w-xs">{dest.chatId}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeDestination(dest.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Controles de Envio */}
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">🚀 Controles de Envio</h3>
                
                <div className="space-y-4">
                  {status && (
                    <div className="bg-gray-600 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2">📊 Status da Fila</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Total:</span>
                          <span className="text-white ml-2">{status.total}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Atual:</span>
                          <span className="text-white ml-2">{status.current}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Restantes:</span>
                          <span className="text-white ml-2">{status.remaining}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Status:</span>
                          <span className={`ml-2 ${status.isRunning ? 'text-green-400' : 'text-red-400'}`}>
                            {status.isRunning ? '🟢 Rodando' : '🔴 Parado'}
                          </span>
                        </div>
                      </div>
                      {status.nextProduct && (
                        <div className="mt-2">
                          <span className="text-gray-400">Próximo:</span>
                          <span className="text-white ml-2 text-sm">{status.nextProduct}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={startAutoSend}
                      disabled={isRunning || config.destinations.filter(d => d.enabled).length === 0}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      {isRunning ? '⏳ Enviando...' : '▶️ Iniciar Envio'}
                    </button>
                    
                    <button
                      onClick={stopAutoSend}
                      disabled={!isRunning}
                      className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      ⏹️ Parar
                    </button>
                  </div>

                  <button
                    onClick={clearQueue}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    🗑️ Limpar Fila
                  </button>
                </div>
              </div>

              {/* Produtos de Exemplo */}
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">📦 Produtos de Exemplo</h3>
                <div className="space-y-3">
                  {sampleProducts.map((product, index) => (
                    <div key={index} className="bg-gray-600 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.image_url} 
                          alt={product.title}
                          className="w-12 h-12 object-cover rounded bg-gray-500"
                        />
                        <div className="flex-1">
                          <p className="text-white font-medium text-sm line-clamp-1">{product.title}</p>
                          <p className="text-green-400 font-bold text-sm">{product.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-gray-400 text-xs mt-3">
                  Estes produtos serão enviados automaticamente quando iniciar o envio
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
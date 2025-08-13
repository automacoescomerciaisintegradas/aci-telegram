import React, { useState, useEffect } from 'react';
import { configService } from '../services/configService';
import type { SystemConfig } from '../services/configService';

interface SystemConfigProps {
  onBack?: () => void;
}

const SystemConfig: React.FC<SystemConfigProps> = ({ onBack }) => {
  const [config, setConfig] = useState<SystemConfig>(configService.getSystemConfig());
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  // Atualizar configurações quando mudarem
  useEffect(() => {
    const handleConfigUpdate = () => {
      setConfig(configService.getSystemConfig());
    };

    window.addEventListener('aci:config-updated', handleConfigUpdate);
    return () => window.removeEventListener('aci:config-updated', handleConfigUpdate);
  }, []);

  // Salvar configurações
  const saveConfig = async () => {
    setIsSaving(true);
    setMessage('');

    try {
      // Salvar configurações usando os métodos específicos
      configService.setTelegramConfig(config.telegram.botToken, config.telegram.chatId);
      configService.setShopeeConfig(config.shopee.affiliateId);
      configService.setWhatsAppConfig(config.whatsapp.apiKey, config.whatsapp.instanceName, config.whatsapp.apiUrl, config.whatsapp.channelUrl);
      
      // Atualizar o estado local
      setConfig(configService.getSystemConfig());
      
      // Verificar se as configurações estão completas
      if (configService.isFullyConfigured()) {
        setMessage('✅ Configurações salvas com sucesso! Sistema pronto para uso.');
        setMessageType('success');
      } else {
        setMessage('⚠️ Configurações salvas, mas algumas integrações ainda precisam ser configuradas.');
        setMessageType('error');
      }

      // Disparar evento de atualização
      window.dispatchEvent(new Event('aci:config-updated'));
      
    } catch (error) {
      setMessage('❌ Erro ao salvar configurações. Tente novamente.');
      setMessageType('error');
    } finally {
      setIsSaving(false);
    }
  };

  // Testar conexão do Telegram
  const testTelegramConnection = async () => {
    if (!config.telegram.botToken || !config.telegram.chatId) {
      setMessage('❌ Configure o bot e chat do Telegram primeiro.');
      setMessageType('error');
      return;
    }

    try {
      const response = await fetch(`https://api.telegram.org/bot${config.telegram.botToken}/getMe`);
      const data = await response.json();
      
      if (data.ok) {
        setMessage(`✅ Bot conectado: @${data.result.username}`);
        setMessageType('success');
      } else {
        setMessage('❌ Token do bot inválido.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('❌ Erro ao testar conexão do Telegram.');
      setMessageType('error');
    }
  };

  // Testar conexão do WhatsApp
  const testWhatsAppConnection = async () => {
    if (!config.whatsapp.apiKey || !config.whatsapp.instanceName || !config.whatsapp.apiUrl || !config.whatsapp.channelUrl) {
      setMessage('❌ Configure a API, nome da instância, URL da API e canal do WhatsApp primeiro.');
      setMessageType('error');
      return;
    }

    try {
      // Testar conexão com a API do WhatsApp Evolution
      const response = await fetch(`${config.whatsapp.apiUrl}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': config.whatsapp.apiKey
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessage(`✅ API do WhatsApp conectada! Status: ${data.status || 'OK'}`);
    setMessageType('success');
      } else {
        setMessage('❌ Erro ao conectar com a API do WhatsApp. Verifique a URL e chave.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('❌ Erro ao testar conexão do WhatsApp. Verifique a URL da API.');
      setMessageType('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-blue-400 mb-2">
                Configurações do Sistema
              </h1>
              <p className="text-gray-300 text-lg">
                Configure suas APIs e integrações
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

        {/* Status das Configurações */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`p-4 rounded-lg border-2 ${
            config.telegram.isConfigured 
              ? 'bg-green-900/30 border-green-600' 
              : 'bg-red-900/30 border-red-600'
          }`}>
            <h3 className="font-semibold mb-2">📱 Telegram</h3>
            <p className="text-sm">
              {config.telegram.isConfigured ? '✅ Configurado' : '❌ Não configurado'}
            </p>
          </div>
          
          <div className={`p-4 rounded-lg border-2 ${
            config.shopee.isConfigured 
              ? 'bg-green-900/30 border-green-600' 
              : 'bg-red-900/30 border-red-600'
          }`}>
            <h3 className="font-semibold mb-2">🛒 Shopee</h3>
            <p className="text-sm">
              {config.shopee.isConfigured ? '✅ Configurado' : '❌ Não configurado'}
            </p>
          </div>
          
          <div className={`p-4 rounded-lg border-2 ${
            config.whatsapp.isConfigured 
              ? 'bg-green-900/30 border-green-600' 
              : 'bg-red-900/30 border-red-600'
          }`}>
            <h3 className="font-semibold mb-2">📞 WhatsApp</h3>
            <p className="text-sm">
              {config.whatsapp.isConfigured ? '✅ Configurado' : '❌ Não configurado'}
            </p>
          </div>
        </div>

        {/* Configurações do Telegram */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">🤖 Configurações do Telegram</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Token do Bot</label>
              <input
                type="password"
                value={config.telegram.botToken}
                onChange={(e) => setConfig({
                  ...config,
                  telegram: { ...config.telegram, botToken: e.target.value }
                })}
                placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1">
                Obtenha em @BotFather no Telegram
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">ID do Chat/Canal</label>
              <input
                type="text"
                value={config.telegram.chatId}
                onChange={(e) => setConfig({
                  ...config,
                  telegram: { ...config.telegram, chatId: e.target.value }
                })}
                placeholder="-1001234567890"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1">
                Use o botão "Descobrir IDs" na página do Telegram
              </p>
            </div>
          </div>
          
          <div className="mt-4 flex gap-3">
            <button
              onClick={testTelegramConnection}
              disabled={!config.telegram.botToken || !config.telegram.chatId}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-colors"
            >
              🔍 Testar Conexão
            </button>
          </div>
        </div>

        {/* Configurações da Shopee */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-green-400">🛒 Configurações da Shopee</h2>
          <div>
            <label className="block text-sm font-medium mb-2">ID de Afiliado</label>
            <input
              type="text"
              value={config.shopee.affiliateId}
              onChange={(e) => setConfig({
                ...config,
                shopee: { ...config.shopee, affiliateId: e.target.value }
              })}
              placeholder="123456789"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1">
              Seu ID de afiliado da Shopee Brasil
            </p>
          </div>
        </div>

        {/* Configurações do WhatsApp */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-green-500">📞 Configurações do WhatsApp Evolution API</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">API Key</label>
              <input
                type="password"
                value={config.whatsapp.apiKey}
                onChange={(e) => setConfig({
                  ...config,
                  whatsapp: { ...config.whatsapp, apiKey: e.target.value }
                })}
                placeholder="Sua chave da API do WhatsApp"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Nome da Instância</label>
              <input
                type="text"
                value={config.whatsapp.instanceName}
                onChange={(e) => setConfig({
                  ...config,
                  whatsapp: { ...config.whatsapp, instanceName: e.target.value }
                })}
                placeholder="Nao-responda"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">URL da API</label>
            <input
              type="url"
              value={config.whatsapp.apiUrl}
              onChange={(e) => setConfig({
                ...config,
                whatsapp: { ...config.whatsapp, apiUrl: e.target.value }
              })}
              placeholder="https://evolution.iau2.com.br/"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Canal do WhatsApp</label>
            <input
              type="url"
              value={config.whatsapp.channelUrl}
              onChange={(e) => setConfig({
                ...config,
                whatsapp: { ...config.whatsapp, channelUrl: e.target.value }
              })}
              placeholder="https://whatsapp.com/channel/0029Vb6aZAsGOj9phEbZG72W"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1">
              URL do canal onde serão enviadas as mensagens de produtos
            </p>
          </div>
          
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                setConfig({
                  ...config,
                  whatsapp: {
                    ...config.whatsapp,
                    apiKey: 'CDD9D2DDA942-4237-BBF9-6D0E4C36B026',
                    instanceName: 'Nao-responda',
                    apiUrl: 'https://evolution.iau2.com.br/',
                    channelUrl: 'https://whatsapp.com/channel/0029Vb6aZAsGOj9phEbZG72W'
                  }
                });
                setMessage('✅ Configurações do WhatsApp pré-preenchidas! Clique em "Salvar Configurações".');
                setMessageType('success');
              }}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              🔧 Pré-preencher
            </button>
            
            <button
              onClick={testWhatsAppConnection}
              disabled={!config.whatsapp.apiKey || !config.whatsapp.instanceName || !config.whatsapp.apiUrl || !config.whatsapp.channelUrl}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-colors"
            >
              🔍 Testar Conexão
            </button>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-4">
          <button
            onClick={saveConfig}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed px-6 py-3 rounded-lg transition-colors font-semibold"
          >
            {isSaving ? '💾 Salvando...' : '💾 Salvar Configurações'}
          </button>
          
          <button
            onClick={() => {
              configService.clearAllConfigs();
              setConfig(configService.getSystemConfig());
              setMessage('🗑️ Todas as configurações foram limpas.');
              setMessageType('success');
            }}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition-colors font-semibold"
          >
            🗑️ Limpar Tudo
          </button>
        </div>

        {/* Mensagens de Feedback */}
        {message && (
          <div className={`mt-6 p-4 rounded-lg ${
            messageType === 'success' ? 'bg-green-600' : 'bg-red-600'
          } text-white`}>
            {message}
          </div>
        )}

        {/* Informações de Status */}
        <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-400">📊 Status das Integrações</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Telegram Bot</span>
              <span className={`px-2 py-1 rounded text-xs ${
                config.telegram.isConfigured ? 'bg-green-600' : 'bg-red-600'
              }`}>
                {config.telegram.isConfigured ? '✅ Ativo' : '❌ Inativo'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Shopee Afiliado</span>
              <span className={`px-2 py-1 rounded text-xs ${
                config.shopee.isConfigured ? 'bg-green-600' : 'bg-red-600'
              }`}>
                {config.shopee.isConfigured ? '✅ Ativo' : '❌ Inativo'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span>WhatsApp API</span>
              <span className={`px-2 py-1 rounded text-xs ${
                config.whatsapp.isConfigured ? 'bg-green-600' : 'bg-red-600'
              }`}>
                {config.whatsapp.isConfigured ? '✅ Ativo' : '❌ Inativo'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Sistema Completo</span>
              <span className={`px-2 py-1 rounded text-xs ${
                configService.isFullyConfigured() ? 'bg-green-600' : 'bg-yellow-600'
              }`}>
                {configService.isFullyConfigured() ? '✅ Pronto' : '⚠️ Configuração Incompleta'}
              </span>
            </div>
          </div>
          
          <p className="text-xs text-gray-400 mt-4">
            Última atualização: {new Date(config.lastUpdated).toLocaleString('pt-BR')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SystemConfig;

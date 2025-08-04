import React, { useState, useEffect } from 'react';
import { configService, ApiConfig } from '../services/configService';
import { apiValidationService, ValidationResult } from '../services/apiValidationService';
import { notificationService } from '../services/notificationService';

type AdminTab = 'apis' | 'supabase' | 'users' | 'ai';

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`w-full text-left px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
            active 
            ? 'bg-brand-primary text-white' 
            : 'text-dark-text-secondary hover:bg-slate-700/50 hover:text-dark-text-primary'
        }`}
    >
        {children}
    </button>
);

const FormField: React.FC<{ 
  label: string; 
  id: string; 
  type?: string; 
  placeholder?: string; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; 
  description?: string; 
  isSecret?: boolean; 
  rows?: number 
}> = ({ label, id, type = 'text', placeholder, value, onChange, description, isSecret = false, rows }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-dark-text-secondary mb-2">
            {label}
        </label>
        {rows ? (
             <textarea
                id={id}
                rows={rows}
                value={value}
                onChange={onChange}
                className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200"
                placeholder={placeholder}
            />
        ) : (
            <input
                type={isSecret ? 'password' : type}
                id={id}
                value={value}
                onChange={onChange}
                className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200"
                placeholder={placeholder}
            />
        )}
        {description && <p className="text-xs text-dark-text-secondary mt-2">{description}</p>}
    </div>
);

export const AdminPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('apis');
    const [config, setConfig] = useState<ApiConfig>({
        gemini: { apiKey: '', temperature: 0.7, systemPrompt: '' },
        telegram: { botToken: '', webhookUrl: '' },
        whatsapp: { apiKey: '', phoneNumber: '' },
        shopee: { affiliateId: '', apiKey: '' }
    });
    const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
    const [isValidating, setIsValidating] = useState<{ [key: string]: boolean }>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        try {
            const loadedConfig = configService.getAll();
            setConfig(loadedConfig);
        } catch (error) {
            console.error('Erro ao carregar configurações:', error);
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        
        if (id === 'geminiApiKey') {
            setConfig(prev => ({ ...prev, gemini: { ...prev.gemini, apiKey: value } }));
        } else if (id === 'geminiTemperature') {
            setConfig(prev => ({ ...prev, gemini: { ...prev.gemini, temperature: parseFloat(value) } }));
        } else if (id === 'geminiSystemPrompt') {
            setConfig(prev => ({ ...prev, gemini: { ...prev.gemini, systemPrompt: value } }));
        } else if (id === 'telegramBotToken') {
            setConfig(prev => ({ ...prev, telegram: { ...prev.telegram, botToken: value } }));
        } else if (id === 'whatsappApiKey') {
            setConfig(prev => ({ ...prev, whatsapp: { ...prev.whatsapp, apiKey: value } }));
        } else if (id === 'shopeeAffiliateId') {
            setConfig(prev => ({ ...prev, shopee: { ...prev.shopee, affiliateId: value } }));
        }
    };

    const handleSaveConfig = async () => {
        setIsSaving(true);
        try {
            await configService.save(config);
            notificationService.success(
                'Configurações Salvas',
                'Todas as configurações foram salvas com sucesso!'
            );
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Erro desconhecido ao salvar configurações';
            notificationService.error(
                'Erro ao Salvar',
                message
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleTestConnection = async (service: string) => {
        setIsValidating(prev => ({ ...prev, [service]: true }));
        
        try {
            let result: ValidationResult;
            
            switch (service) {
                case 'gemini':
                    result = await apiValidationService.testGemini(config.gemini.apiKey);
                    break;
                case 'telegram':
                    result = await apiValidationService.testTelegram(config.telegram.botToken);
                    break;
                case 'whatsapp':
                    result = await apiValidationService.testWhatsApp(config.whatsapp.apiKey);
                    break;
                case 'shopee':
                    result = await apiValidationService.testShopee(config.shopee.affiliateId, config.shopee.apiKey);
                    break;
                default:
                    throw new Error('Serviço não reconhecido');
            }

            setValidationResults(prev => {
                const filtered = prev.filter(r => r.service !== result.service);
                return [...filtered, result];
            });

            if (result.status === 'success') {
                notificationService.success('Conexão Testada', result.message);
            } else if (result.status === 'warning') {
                notificationService.warning('Aviso de Conexão', result.message);
            } else {
                notificationService.error('Erro de Conexão', result.message);
            }

        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Erro desconhecido';
            notificationService.error(
                'Erro no Teste',
                `Erro ao testar ${service}: ${message}`
            );
        } finally {
            setIsValidating(prev => ({ ...prev, [service]: false }));
        }
    };

    const getValidationStatus = (service: string) => {
        const result = validationResults.find(r => r.service.toLowerCase().includes(service.toLowerCase()));
        return result?.status || null;
    };

    const getStatusIndicator = (service: string) => {
        const status = getValidationStatus(service);
        const isValidatingService = isValidating[service];

        if (isValidatingService) {
            return <span className="text-yellow-400">🔄 Testando...</span>;
        }

        switch (status) {
            case 'success':
                return <span className="text-green-400">✅ Conectado</span>;
            case 'warning':
                return <span className="text-yellow-400">⚠️ Aviso</span>;
            case 'error':
                return <span className="text-red-400">❌ Erro</span>;
            default:
                return <span className="text-gray-400">⚪ Não testado</span>;
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'apis':
                return (
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-semibold">Configuração de APIs</h3>
                            <p className="text-dark-text-secondary mt-1">Gerencie as chaves de API para integrações externas.</p>
                        </div>

                        {/* Gemini AI */}
                        <div className="bg-slate-800/30 border border-dark-border rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-medium text-dark-text-primary">Google Gemini AI</h4>
                                <div className="flex items-center gap-3">
                                    {getStatusIndicator('gemini')}
                                    <button
                                        onClick={() => handleTestConnection('gemini')}
                                        disabled={!config.gemini.apiKey || isValidating.gemini}
                                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Testar
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <FormField 
                                    label="API Key do Gemini"
                                    id="geminiApiKey"
                                    isSecret
                                    placeholder="Cole sua chave de API do Google Gemini aqui"
                                    value={config.gemini.apiKey}
                                    onChange={handleInputChange}
                                    description="Obtenha sua chave em: https://makersuite.google.com/app/apikey"
                                />
                                <div>
                                    <label htmlFor="geminiTemperature" className="block text-sm font-medium text-dark-text-secondary mb-2">
                                        Criatividade (Temperatura): <span className="font-bold text-dark-text-primary">{config.gemini.temperature}</span>
                                    </label>
                                    <input 
                                        type="range" 
                                        id="geminiTemperature" 
                                        min="0" 
                                        max="1" 
                                        step="0.1" 
                                        value={config.gemini.temperature} 
                                        onChange={handleInputChange}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-primary" 
                                    />
                                    <div className="flex justify-between text-xs text-dark-text-secondary mt-1">
                                        <span>Mais Preciso</span>
                                        <span>Mais Criativo</span>
                                    </div>
                                </div>
                                <FormField 
                                    label="Prompt do Sistema"
                                    id="geminiSystemPrompt"
                                    rows={3}
                                    placeholder="Instrução padrão para o modelo de IA..."
                                    value={config.gemini.systemPrompt}
                                    onChange={handleInputChange}
                                    description="Esta instrução será usada como base para todas as gerações de conteúdo."
                                />
                            </div>
                        </div>

                        {/* Telegram */}
                        <div className="bg-slate-800/30 border border-dark-border rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-medium text-dark-text-primary">Telegram Bot</h4>
                                <div className="flex items-center gap-3">
                                    {getStatusIndicator('telegram')}
                                    <button
                                        onClick={() => handleTestConnection('telegram')}
                                        disabled={!config.telegram.botToken || isValidating.telegram}
                                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Testar
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <FormField 
                                    label="Token do Bot"
                                    id="telegramBotToken"
                                    isSecret
                                    placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                                    value={config.telegram.botToken}
                                    onChange={handleInputChange}
                                    description="Obtenha o token conversando com @BotFather no Telegram"
                                />
                            </div>
                        </div>

                        {/* WhatsApp */}
                        <div className="bg-slate-800/30 border border-dark-border rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-medium text-dark-text-primary">WhatsApp API</h4>
                                <div className="flex items-center gap-3">
                                    {getStatusIndicator('whatsapp')}
                                    <button
                                        onClick={() => handleTestConnection('whatsapp')}
                                        disabled={!config.whatsapp.apiKey || isValidating.whatsapp}
                                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Testar
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <FormField 
                                    label="API Key do WhatsApp"
                                    id="whatsappApiKey"
                                    isSecret
                                    placeholder="Cole sua chave de API aqui"
                                    value={config.whatsapp.apiKey}
                                    onChange={handleInputChange}
                                    description="Chave de API do seu provedor de WhatsApp Business"
                                />
                            </div>
                        </div>

                        {/* Shopee */}
                        <div className="bg-slate-800/30 border border-dark-border rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-medium text-dark-text-primary">Shopee Afiliados</h4>
                                <div className="flex items-center gap-3">
                                    {getStatusIndicator('shopee')}
                                    <button
                                        onClick={() => handleTestConnection('shopee')}
                                        disabled={(!config.shopee.affiliateId && !config.shopee.apiKey) || isValidating.shopee}
                                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Testar
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <FormField 
                                    label="ID de Afiliado"
                                    id="shopeeAffiliateId"
                                    placeholder="123456789"
                                    value={config.shopee.affiliateId || ''}
                                    onChange={handleInputChange}
                                    description="Seu ID de afiliado do Shopee"
                                />
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Em Desenvolvimento</h3>
                        <p className="text-dark-text-secondary">Esta seção está sendo desenvolvida.</p>
                    </div>
                );
        }
    };

    return (
        <>
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-dark-text-primary mb-2">Painel Administrativo</h1>
                <p className="text-md text-dark-text-secondary">Gerencie as integrações e configurações da sua plataforma ACI.</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
                {/* Desktop Tabs */}
                <div className="md:w-1/4 lg:w-1/5">
                    <div className="flex flex-row md:flex-col gap-2 bg-dark-card border border-dark-border p-3 rounded-xl">
                        <TabButton active={activeTab === 'apis'} onClick={() => setActiveTab('apis')}>APIs</TabButton>
                        <TabButton active={activeTab === 'supabase'} onClick={() => setActiveTab('supabase')}>Supabase</TabButton>
                        <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')}>Usuários</TabButton>
                        <TabButton active={activeTab === 'ai'} onClick={() => setActiveTab('ai')}>IA</TabButton>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-dark-card border border-dark-border p-6 md:p-8 rounded-xl">
                    {renderContent()}
                    <div className="mt-8 pt-6 border-t border-dark-border">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={handleSaveConfig}
                                disabled={isSaving}
                                className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                            <button
                                onClick={async () => {
                                    setIsValidating({ gemini: true, telegram: true, whatsapp: true, shopee: true });
                                    try {
                                        const results = await apiValidationService.testAll(config);
                                        setValidationResults(results);
                                        
                                        const successCount = results.filter(r => r.status === 'success').length;
                                        const totalCount = results.length;
                                        
                                        if (successCount === totalCount) {
                                            notificationService.success(
                                                'Todas as APIs Testadas',
                                                `${successCount}/${totalCount} APIs funcionando corretamente`
                                            );
                                        } else {
                                            notificationService.warning(
                                                'Teste Concluído',
                                                `${successCount}/${totalCount} APIs funcionando. Verifique os detalhes.`
                                            );
                                        }
                                    } catch (error: unknown) {
                                        const message = error instanceof Error ? error.message : 'Erro desconhecido';
                                        notificationService.error('Erro no Teste', message);
                                    } finally {
                                        setIsValidating({});
                                    }
                                }}
                                disabled={Object.values(isValidating).some(Boolean)}
                                className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {Object.values(isValidating).some(Boolean) ? 'Testando...' : 'Testar Todas as APIs'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
import React, { useState, useEffect } from 'react';

interface ApiConfig {
    whatsappApiKey: string;
    telegramBotToken: string;
    geminiApiKey: string;
}

export const AdminPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('apis');
    const [config, setConfig] = useState<ApiConfig>({
        whatsappApiKey: '',
        telegramBotToken: '',
        geminiApiKey: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    // Carregar configurações do localStorage
    useEffect(() => {
        // Carregar da variável de ambiente se disponível
        const envApiKey = process.env.API_KEY || '';

        const savedConfig = localStorage.getItem('aci_api_config');
        if (savedConfig) {
            try {
                const parsed = JSON.parse(savedConfig);
                setConfig({
                    ...parsed,
                    geminiApiKey: parsed.geminiApiKey || envApiKey
                });
            } catch (e) {
                console.error('Erro ao carregar configurações:', e);
                setConfig(prev => ({ ...prev, geminiApiKey: envApiKey }));
            }
        } else {
            setConfig(prev => ({ ...prev, geminiApiKey: envApiKey }));
        }
    }, []);

    // Salvar configurações
    const handleSave = async () => {
        setIsSaving(true);
        try {
            localStorage.setItem('aci_api_config', JSON.stringify(config));

            // Simular delay de salvamento
            await new Promise(resolve => setTimeout(resolve, 1000));

            alert('Configurações salvas com sucesso!');
        } catch {
            alert('Erro ao salvar configurações');
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (field: keyof ApiConfig, value: string) => {
        setConfig(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="min-h-screen bg-dark-bg text-dark-text-primary">
            {/* Header */}
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
                <p className="text-dark-text-secondary">
                    Gerencie as integrações e configurações da sua plataforma ACI.
                </p>
            </div>

            <div className="flex px-8 gap-8">
                {/* Sidebar com Tabs */}
                <div className="w-80">
                    <div className="bg-dark-card border border-dark-border rounded-lg p-4">
                        <div className="space-y-2">
                            <button
                                onClick={() => setActiveTab('apis')}
                                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'apis'
                                    ? 'bg-brand-primary text-white'
                                    : 'text-dark-text-secondary hover:bg-slate-700/50 hover:text-dark-text-primary'
                                    }`}
                            >
                                APIs
                            </button>
                            <button
                                onClick={() => setActiveTab('supabase')}
                                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'supabase'
                                    ? 'bg-brand-primary text-white'
                                    : 'text-dark-text-secondary hover:bg-slate-700/50 hover:text-dark-text-primary'
                                    }`}
                            >
                                Supabase
                            </button>
                            <button
                                onClick={() => setActiveTab('usuarios')}
                                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'usuarios'
                                    ? 'bg-brand-primary text-white'
                                    : 'text-dark-text-secondary hover:bg-slate-700/50 hover:text-dark-text-primary'
                                    }`}
                            >
                                Usuários
                            </button>
                            <button
                                onClick={() => setActiveTab('ia')}
                                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'ia'
                                    ? 'bg-brand-primary text-white'
                                    : 'text-dark-text-secondary hover:bg-slate-700/50 hover:text-dark-text-primary'
                                    }`}
                            >
                                IA
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    <div className="bg-dark-card border border-dark-border rounded-lg p-8">
                        {activeTab === 'apis' && (
                            <div>
                                <h2 className="text-2xl font-semibold mb-2">Configuração de APIs</h2>
                                <p className="text-dark-text-secondary mb-8">
                                    Gerencie as chaves de API para integrações externas.
                                </p>

                                <div className="space-y-6">
                                    {/* WhatsApp API */}
                                    <div>
                                        <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                                            API Key do WhatsApp
                                        </label>
                                        <input
                                            type="password"
                                            value={config.whatsappApiKey}
                                            onChange={(e) => handleInputChange('whatsappApiKey', e.target.value)}
                                            placeholder="Cole sua chave de API aqui"
                                            className="w-full bg-slate-800 border border-dark-border rounded-lg p-4 text-dark-text-primary placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200"
                                        />
                                    </div>

                                    {/* Telegram Bot Token */}
                                    <div>
                                        <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                                            Token do Bot do Telegram
                                        </label>
                                        <input
                                            type="password"
                                            value={config.telegramBotToken}
                                            onChange={(e) => handleInputChange('telegramBotToken', e.target.value)}
                                            placeholder="Cole seu token do bot aqui"
                                            className="w-full bg-slate-800 border border-dark-border rounded-lg p-4 text-dark-text-primary placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200"
                                        />
                                    </div>

                                    {/* Gemini API */}
                                    <div>
                                        <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                                            API Key do Google Gemini
                                        </label>
                                        <input
                                            type="password"
                                            value={config.geminiApiKey}
                                            onChange={(e) => handleInputChange('geminiApiKey', e.target.value)}
                                            placeholder="Cole sua chave do Gemini aqui"
                                            className="w-full bg-slate-800 border border-dark-border rounded-lg p-4 text-dark-text-primary placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200"
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-4 flex gap-4">
                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                                        </button>

                                        <button
                                            onClick={() => {
                                                const hasConfigs = config.geminiApiKey || config.telegramBotToken || config.whatsappApiKey;
                                                if (hasConfigs) {
                                                    alert('APIs configuradas! Agora você pode usar as funcionalidades da plataforma.');
                                                } else {
                                                    alert('Configure pelo menos uma API para começar a usar a plataforma.');
                                                }
                                            }}
                                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                                        >
                                            Testar Configurações
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'supabase' && (
                            <div>
                                <h2 className="text-2xl font-semibold mb-2">Configuração do Supabase</h2>
                                <p className="text-dark-text-secondary mb-8">
                                    Configure sua conexão com o Supabase.
                                </p>
                                <div className="text-center py-12">
                                    <p className="text-dark-text-secondary">Em desenvolvimento...</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'usuarios' && (
                            <div>
                                <h2 className="text-2xl font-semibold mb-2">Gestão de Usuários</h2>
                                <p className="text-dark-text-secondary mb-8">
                                    Gerencie os usuários da plataforma.
                                </p>
                                <div className="text-center py-12">
                                    <p className="text-dark-text-secondary">Em desenvolvimento...</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'ia' && (
                            <div>
                                <h2 className="text-2xl font-semibold mb-2">Configurações de IA</h2>
                                <p className="text-dark-text-secondary mb-8">
                                    Configure os parâmetros da inteligência artificial.
                                </p>
                                <div className="text-center py-12">
                                    <p className="text-dark-text-secondary">Em desenvolvimento...</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
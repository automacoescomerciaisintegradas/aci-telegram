import { generateShopeeOfferMessageFromApi } from '@/services/geminiService';
import { getShopeeProductDetailsFromUrl } from '@/services/geminiService';
import React, { useState, useEffect } from 'react';

interface Product {
    title: string;
    price: string;
    image_url: string;
    product_url: string;
}

interface TelegramConfig {
    botToken: string;
    chatId: string;
    affiliateId: string;
}

interface OfferMessage {
    text: string;
    product: Product;
}

export const TelegramShopeePage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [config, setConfig] = useState<TelegramConfig>({
        botToken: '',
        chatId: '',
        affiliateId: ''
    });
    const [productUrl, setProductUrl] = useState('');
    const [product, setProduct] = useState<Product | null>(null);
    const [offerMessage, setOfferMessage] = useState<OfferMessage | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSending, setIsSending] = useState(false);

    // Carregar configurações salvas
    useEffect(() => {
        const savedConfig = localStorage.getItem('aci_api_config');
        if (savedConfig) {
            try {
                const parsed = JSON.parse(savedConfig);
                setConfig(prev => ({
                    ...prev,
                    botToken: parsed.telegramBotToken || ''
                }));
            } catch (error) {
                console.error('Erro ao carregar configurações:', error);
            }
        }
    }, []);

    // Passo 2: Buscar detalhes do produto
    const searchProduct = async () => {
        if (!productUrl.trim()) {
            setError('Por favor, insira a URL do produto');
            return;
        }

        if (!productUrl.includes('shopee.com.br')) {
            setError('Por favor, insira uma URL válida da Shopee Brasil');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const productDetails = await getShopeeProductDetailsFromUrl(productUrl);

            if (productDetails.error) {
                setError(productDetails.error);
                return;
            }

            setProduct(productDetails);
            setCurrentStep(3);
        } catch (err: any) {
            setError('Erro ao buscar produto: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Passo 3: Gerar texto da oferta
    const generateOfferText = async () => {
        if (!product) return;

        setIsLoading(true);
        setError('');

        try {
            const generatedText = await generateShopeeOfferMessageFromApi(product);

            setOfferMessage({
                text: generatedText,
                product: product
            });
            setCurrentStep(4);
        } catch (err: any) {
            setError('Erro ao gerar texto da oferta: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Passo 5: Enviar para o Telegram
    const sendToTelegram = async () => {
        if (!offerMessage || !config.botToken || !config.chatId) {
            setError('Configurações incompletas');
            return;
        }

        setIsSending(true);
        setError('');

        try {
            // Gerar link de afiliado se tiver ID
            let affiliateLink = offerMessage.product.product_url;
            if (config.affiliateId) {
                // Adicionar parâmetro de afiliado à URL
                const url = new URL(affiliateLink);
                url.searchParams.set('af_id', config.affiliateId);
                affiliateLink = url.toString();
            }

            // Preparar dados para envio
            const telegramApiUrl = `https://api.telegram.org/bot${config.botToken}/sendPhoto`;

            const payload = {
                chat_id: config.chatId,
                photo: offerMessage.product.image_url,
                caption: offerMessage.text,
                reply_markup: {
                    inline_keyboard: [[
                        {
                            text: "🛒 Comprar Agora",
                            url: affiliateLink
                        }
                    ]]
                }
            };

            const response = await fetch(telegramApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.ok) {
                alert('✅ Oferta enviada com sucesso para o Telegram!');

                // Reset para nova oferta
                setCurrentStep(1);
                setProductUrl('');
                setProduct(null);
                setOfferMessage(null);
            } else {
                throw new Error(result.description || 'Erro desconhecido do Telegram');
            }
        } catch (err: any) {
            setError('Erro ao enviar para o Telegram: ' + err.message);
        } finally {
            setIsSending(false);
        }
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold mb-4">Passo 1: Configurações</h3>
                <p className="text-dark-text-secondary mb-6">
                    Configure as informações necessárias para enviar ofertas ao Telegram.
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                        Token do Bot do Telegram
                    </label>
                    <input
                        type="password"
                        value={config.botToken}
                        onChange={(e) => setConfig(prev => ({ ...prev, botToken: e.target.value }))}
                        placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                        className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    />
                    <p className="text-xs text-dark-text-secondary mt-1">
                        Obtenha com @BotFather no Telegram
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                        ID do Chat/Canal
                    </label>
                    <input
                        type="text"
                        value={config.chatId}
                        onChange={(e) => setConfig(prev => ({ ...prev, chatId: e.target.value }))}
                        placeholder="-1001234567890 ou @meucanal"
                        className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    />
                    <p className="text-xs text-dark-text-secondary mt-1">
                        ID numérico ou username do canal
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                        ID de Afiliado Shopee
                    </label>
                    <input
                        type="text"
                        value={config.affiliateId}
                        onChange={(e) => setConfig(prev => ({ ...prev, affiliateId: e.target.value }))}
                        placeholder="123456789"
                        className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    />
                    <p className="text-xs text-dark-text-secondary mt-1">
                        Seu ID de afiliado da Shopee
                    </p>
                </div>
            </div>

            <button
                onClick={() => setCurrentStep(2)}
                disabled={!config.botToken || !config.chatId || !config.affiliateId}
                className="bg-brand-primary hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Próximo Passo →
            </button>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold mb-4">Passo 2: URL do Produto</h3>
                <p className="text-dark-text-secondary mb-6">
                    Cole a URL do produto da Shopee que você deseja promover.
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                    URL do Produto Shopee
                </label>
                <input
                    type="url"
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                    placeholder="https://shopee.com.br/produto-exemplo"
                    className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                />
            </div>

            {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">
                    {error}
                </div>
            )}

            <div className="flex gap-4">
                <button
                    onClick={() => setCurrentStep(1)}
                    className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                    ← Voltar
                </button>
                <button
                    onClick={searchProduct}
                    disabled={isLoading || !productUrl.trim()}
                    className="bg-brand-primary hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Buscando...
                        </>
                    ) : (
                        'Buscar Produto →'
                    )}
                </button>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold mb-4">Passo 3: Detalhes do Produto</h3>
                <p className="text-dark-text-secondary mb-6">
                    Produto encontrado! Vamos gerar o texto da oferta.
                </p>
            </div>

            {product && (
                <div className="bg-slate-800/50 border border-dark-border rounded-lg p-6">
                    <div className="flex gap-6">
                        <img
                            src={product.image_url}
                            alt={product.title}
                            className="w-32 h-32 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                            <h4 className="text-lg font-semibold text-dark-text-primary mb-2">
                                {product.title}
                            </h4>
                            <p className="text-2xl font-bold text-green-400 mb-4">
                                {product.price}
                            </p>
                            <p className="text-sm text-dark-text-secondary">
                                URL: {product.product_url}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">
                    {error}
                </div>
            )}

            <div className="flex gap-4">
                <button
                    onClick={() => setCurrentStep(2)}
                    className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                    ← Voltar
                </button>
                <button
                    onClick={generateOfferText}
                    disabled={isLoading}
                    className="bg-brand-primary hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Gerando Texto...
                        </>
                    ) : (
                        'Gerar Texto da Oferta →'
                    )}
                </button>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold mb-4">Passo 4: Preview da Mensagem</h3>
                <p className="text-dark-text-secondary mb-6">
                    Veja como sua oferta aparecerá no Telegram antes de enviar.
                </p>
            </div>

            {offerMessage && (
                <div className="bg-slate-800/50 border border-dark-border rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-4">Preview do Telegram:</h4>

                    {/* Simulação da interface do Telegram */}
                    <div className="bg-slate-900 rounded-lg p-4 max-w-md">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">B</span>
                            </div>
                            <span className="text-sm font-medium text-dark-text-primary">Seu Bot</span>
                        </div>

                        <img
                            src={offerMessage.product.image_url}
                            alt={offerMessage.product.title}
                            className="w-full max-w-xs rounded-lg mb-3"
                        />

                        <div className="text-sm text-dark-text-primary whitespace-pre-line mb-4">
                            {offerMessage.text}
                        </div>

                        <button className="bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-medium">
                            🛒 Comprar Agora
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-slate-800/50 border border-dark-border rounded-lg p-4">
                <h5 className="font-semibold mb-2">Texto da Mensagem:</h5>
                <textarea
                    value={offerMessage?.text || ''}
                    onChange={(e) => setOfferMessage(prev => prev ? { ...prev, text: e.target.value } : null)}
                    rows={8}
                    className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary text-sm"
                />
                <p className="text-xs text-dark-text-secondary mt-2">
                    Você pode editar o texto antes de enviar
                </p>
            </div>

            {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">
                    {error}
                </div>
            )}

            <div className="flex gap-4">
                <button
                    onClick={() => setCurrentStep(3)}
                    className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                    ← Voltar
                </button>
                <button
                    onClick={sendToTelegram}
                    disabled={isSending}
                    className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isSending ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Enviando...
                        </>
                    ) : (
                        '📤 Enviar Oferta'
                    )}
                </button>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-dark-text-primary mb-2">
                    Telegram - Ofertas Shopee
                </h1>
                <p className="text-dark-text-secondary">
                    Crie e envie ofertas automáticas da Shopee para seus canais do Telegram.
                </p>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {[1, 2, 3, 4].map((step) => (
                        <div key={step} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= step
                                ? 'bg-brand-primary text-white'
                                : 'bg-slate-700 text-dark-text-secondary'
                                }`}>
                                {step}
                            </div>
                            {step < 4 && (
                                <div className={`w-16 h-1 mx-2 ${currentStep > step ? 'bg-brand-primary' : 'bg-slate-700'
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-dark-text-secondary">
                    <span>Configurar</span>
                    <span>URL Produto</span>
                    <span>Gerar Texto</span>
                    <span>Enviar</span>
                </div>
            </div>

            {/* Content */}
            <div className="bg-dark-card border border-dark-border rounded-lg p-8">
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}
            </div>
        </div>
    );
};
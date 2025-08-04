import React, { useState, useCallback } from 'react';
import { getShopeeProductDetailsFromUrl, generateShopeeOfferMessageFromApi, Product, generateShopeeLinkFromApi } from '../services/geminiService';
import { SearchIcon, MagicWandIcon, SpinnerIcon, AlertTriangleIcon, TelegramIcon } from './Icons';
import ShopeeLinkShortener from './ShopeeLinkShortener';
import { notificationService } from '../services/notificationService';

export const TelegramShopeePage: React.FC = () => {
    const [botToken, setBotToken] = useState('');
    const [chatId, setChatId] = useState('');
    const [affiliateId, setAffiliateId] = useState('');
    const [productUrl, setProductUrl] = useState('');
    const [productDetails, setProductDetails] = useState<Product | null>(null);
    const [offerMessage, setOfferMessage] = useState('');

    const [isLoadingProduct, setIsLoadingProduct] = useState(false);
    const [isLoadingMessage, setIsLoadingMessage] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFetchProduct = useCallback(async () => {
        if (!productUrl.trim()) {
            setError("Por favor, insira o link do produto Shopee.");
            return;
        }
        setIsLoadingProduct(true);
        setError(null);
        setProductDetails(null);
        setOfferMessage('');
        try {
            const result = await getShopeeProductDetailsFromUrl(productUrl);
            if (result.error) {
                setError(result.error);
                setProductDetails(null);
                notificationService.error(
                    'Erro ao Buscar Produto',
                    result.error
                );
            } else {
                setProductDetails(result);
                notificationService.success(
                    'Produto Encontrado!',
                    `${result.title} - ${result.price}`
                );
            }
        } catch (err) {
            console.error(err);
            const errorMsg = "Ocorreu um erro ao buscar os detalhes do produto. Verifique o link e tente novamente.";
            setError(errorMsg);
            setProductDetails(null);
            notificationService.error(
                'Erro de Conexão',
                errorMsg
            );
        } finally {
            setIsLoadingProduct(false);
        }
    }, [productUrl]);

    const handleGenerateMessage = useCallback(async () => {
        if (!productDetails) return;
        setIsLoadingMessage(true);
        setError(null);
        try {
            const generated = await generateShopeeOfferMessageFromApi(productDetails);
            setOfferMessage(generated);
            notificationService.success(
                'Mensagem Gerada!',
                'Mensagem promocional criada com IA'
            );
        } catch (err) {
            console.error(err);
            const errorMsg = "Ocorreu um erro ao gerar a mensagem com IA.";
            setError(errorMsg);
            notificationService.error(
                'Erro na IA',
                errorMsg
            );
        } finally {
            setIsLoadingMessage(false);
        }
    }, [productDetails]);
    
    const handleSendOffer = useCallback(async () => {
        if (!botToken || !chatId || !offerMessage || !productDetails) {
            setError("Preencha todos os campos, busque um produto e gere uma mensagem antes de enviar.");
            return;
        }
        setIsSending(true);
        setError(null);
        try {
            const affiliateLink = await generateShopeeLinkFromApi(productDetails.product_url, affiliateId);

            // Use sendPhoto to send an image with a caption and button
            const payload = {
                chat_id: chatId,
                photo: productDetails.image_url,
                caption: offerMessage,
                parse_mode: 'HTML', // Optional: Allows for basic HTML formatting in the caption
                reply_markup: {
                    inline_keyboard: [[{ text: "Comprar Agora 🛒", url: affiliateLink }]]
                }
            };

            const response = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (!result.ok) {
                throw new Error(result.description || 'Erro desconhecido retornado pela API do Telegram.');
            }

            notificationService.success(
                '🚀 Oferta Enviada!',
                `Mensagem enviada com sucesso para o Telegram!`,
                {
                    priority: 'high'
                }
            );

        } catch (err) {
            console.error("Error sending Telegram message:", err);
            const errorMessage = err instanceof Error ? err.message : String(err);
            const fullError = `Falha ao enviar oferta: ${errorMessage}`;
            setError(fullError);
            notificationService.error(
                'Erro no Envio',
                fullError,
                {
                    priority: 'high'
                }
            );
        } finally {
            setIsSending(false);
        }
    }, [botToken, chatId, affiliateId, offerMessage, productDetails]);

    const renderProductDetails = () => (
        productDetails && (
            <div className="mt-6 space-y-4">
                <hr className="border-dark-border" />
                <h2 className="text-lg font-semibold">Detalhes do Produto Encontrado</h2>
                <div className="bg-slate-800 p-4 rounded-lg border border-dark-border flex items-start gap-4">
                    <img src={productDetails.image_url} alt={productDetails.title} className="w-24 h-24 object-cover rounded-md bg-slate-700" />
                    <div className="flex-1">
                        <p className="font-semibold text-dark-text-primary line-clamp-2">{productDetails.title}</p>
                        <p className="text-purple-400 font-bold text-lg mt-1">{productDetails.price}</p>
                    </div>
                </div>
                <button onClick={handleGenerateMessage} disabled={isLoadingMessage} className="w-full flex items-center justify-center gap-2 bg-brand-secondary text-white font-bold py-2.5 px-4 rounded-lg hover:bg-brand-secondary/90 disabled:opacity-50">
                    {isLoadingMessage ? <SpinnerIcon /> : <MagicWandIcon className="h-5 w-5"/>}
                    <span>{isLoadingMessage ? 'Gerando Mensagem...' : 'Gerar Mensagem da Oferta com IA'}</span>
                </button>
            </div>
        )
    );

    const renderMessageComposer = () => (
        productDetails && (
            <div className="mt-6">
                <hr className="border-dark-border" />
                <div className="mt-6">
                    <label htmlFor="offerMessage" className="block text-sm font-medium text-dark-text-secondary mb-2">Mensagem Final</label>
                    <textarea id="offerMessage" rows={8} value={offerMessage} onChange={e => setOfferMessage(e.target.value)} className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary placeholder-gray-500 focus:ring-2 focus:ring-brand-primary"></textarea>
                </div>
            </div>
        )
    );

    return (
        <>
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-dark-text-primary mb-2">Telegram - Ofertas Shopee</h1>
                <p className="text-md text-dark-text-secondary">Envie ofertas de produtos específicos da Shopee para seus canais do Telegram.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Controls Column */}
                <div className="bg-dark-card rounded-xl shadow-2xl shadow-black/20 border border-dark-border p-6 md:p-8 space-y-6">
                    <div className="bg-yellow-900/40 border border-yellow-700 text-yellow-300 p-4 rounded-lg flex items-start gap-3">
                        <AlertTriangleIcon />
                        <div>
                            <h3 className="font-bold">Aviso de Segurança</h3>
                            <p className="text-sm">Atenção: Inserir seu Token do Bot aqui expõe sua chave no navegador. Para produção, é altamente recomendável usar um backend. Use por sua conta e risco.</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="botToken" className="block text-sm font-medium text-dark-text-secondary mb-2">Token do Bot</label>
                            <input type="password" id="botToken" value={botToken} onChange={e => setBotToken(e.target.value)} className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary placeholder-gray-500 focus:ring-2 focus:ring-brand-primary" placeholder="•••••••••••••••••••••••••" />
                        </div>
                        <div>
                            <label htmlFor="chatId" className="block text-sm font-medium text-dark-text-secondary mb-2">ID do Chat/Canal</label>
                            <input type="text" id="chatId" value={chatId} onChange={e => setChatId(e.target.value)} className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary placeholder-gray-500 focus:ring-2 focus:ring-brand-primary" placeholder="@seu_canal ou -100123456789" />
                        </div>
                        <div>
                            <label htmlFor="affiliateId" className="block text-sm font-medium text-dark-text-secondary mb-2">ID de Afiliado Shopee <span className="text-xs">(Opcional)</span></label>
                            <input type="text" id="affiliateId" value={affiliateId} onChange={e => setAffiliateId(e.target.value)} className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary placeholder-gray-500 focus:ring-2 focus:ring-brand-primary" placeholder="Seu ID para gerar o link de afiliado" />
                        </div>
                    </div>
                    <hr className="border-dark-border" />
                    <div>
                        <label htmlFor="productUrl" className="block text-sm font-medium text-dark-text-secondary mb-2">Link do Produto Shopee</label>
                        <div className="flex gap-2">
                           <textarea id="productUrl" rows={2} value={productUrl} onChange={e => setProductUrl(e.target.value)} className="flex-grow bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary placeholder-gray-500 focus:ring-2 focus:ring-brand-primary" placeholder="Cole o link do produto aqui..."></textarea>
                           <button onClick={handleFetchProduct} disabled={isLoadingProduct} className="flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-2.5 px-4 rounded-lg hover:bg-brand-primary/90 disabled:opacity-50">
                                {isLoadingProduct ? <SpinnerIcon /> : <SearchIcon className="h-5 w-5"/>}
                           </button>
                        </div>
                    </div>

                    {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                    
                    {isLoadingProduct && <div className="text-center text-dark-text-secondary">Buscando produto...</div>}

                    {renderProductDetails()}
                    {renderMessageComposer()}

                    <hr className="border-dark-border" />
                    <ShopeeLinkShortener />
                </div>

                {/* Preview Column */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-dark-text-primary">Pré-visualização</h2>
                    <div className="bg-[#0E1621] p-2 rounded-xl border border-dark-border h-full min-h-[500px] flex flex-col">
                        <div className="flex-grow p-4 overflow-y-auto">
                            <div className="flex justify-end">
                                <div className="bg-[#2B5278] text-white rounded-l-xl rounded-t-xl p-1 max-w-sm flex flex-col">
                                    {productDetails?.image_url && (
                                        <img src={productDetails.image_url} alt="Preview" className="rounded-t-lg w-full h-auto object-cover" />
                                    )}
                                    <div className="p-3">
                                      <p className="whitespace-pre-wrap break-words">{offerMessage || (productDetails ? "Clique em 'Gerar Mensagem'..." : "Aguardando detalhes do produto...")}</p>
                                      <div className="text-right text-xs text-gray-300 mt-2">10:30 PM</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-auto p-2">
                            <a href={productDetails?.product_url} target="_blank" rel="noopener noreferrer" className={`block w-full text-center bg-[#182533] text-blue-400 rounded-md py-3 font-semibold hover:bg-opacity-80 transition-opacity ${!productDetails && 'hidden'}`}>
                                Comprar Agora 🛒
                            </a>
                            <button
                                onClick={handleSendOffer}
                                disabled={isSending || !offerMessage || !productDetails || !botToken || !chatId}
                                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed mt-4 transition-colors"
                                title={!offerMessage ? "Gere uma mensagem primeiro" : "Enviar oferta para o Telegram"}
                            >
                                {isSending ? <SpinnerIcon /> : <TelegramIcon className="h-5 w-5" />}
                                <span>{isSending ? 'Enviando...' : 'Enviar Oferta'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
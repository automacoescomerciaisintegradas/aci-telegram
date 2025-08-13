import React, { useState, useCallback, useEffect } from 'react';
import { getShopeeProductDetailsFromUrl, generateShopeeOfferMessageFromApi, Product, generateShopeeLinkFromApi } from '../services/geminiService';
import { SearchIcon, MagicWandIcon, SpinnerIcon, AlertTriangleIcon, TelegramIcon } from './Icons';
import { notificationService } from '../services/notificationService';
import { shopeeAffiliateService } from '../services/shopeeAffiliateService';

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
    const [isTesting, setIsTesting] = useState(false);
    const [foundChats, setFoundChats] = useState<any[]>([]);
    const [showChatList, setShowChatList] = useState(false);

    // Persistir configurações básicas no localStorage
    useEffect(() => {
        try {
            const raw = localStorage.getItem('aci_api_config') || '{}';
            const cfg = JSON.parse(raw);
            setBotToken(cfg.telegramBotToken || '');
            setChatId(cfg.lastChatId || '');
            setAffiliateId(cfg.telegramAffiliateId || '');
        } catch {}
    }, []);

    useEffect(() => {
        const raw = localStorage.getItem('aci_api_config') || '{}';
        let cfg: any = {};
        try { cfg = JSON.parse(raw); } catch { cfg = {}; }
        cfg.telegramBotToken = botToken;
        cfg.telegramAffiliateId = affiliateId;
        cfg.lastChatId = chatId;
        localStorage.setItem('aci_api_config', JSON.stringify(cfg));
    }, [botToken, affiliateId, chatId]);

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
            let affiliateLink = '';
            try {
                affiliateLink = await generateShopeeLinkFromApi(productDetails.product_url, affiliateId);
            } catch {
                // Fallback local sem IA
                try {
                    affiliateLink = shopeeAffiliateService.generateAffiliateLink(productDetails.product_url, affiliateId);
                } catch {
                    const url = new URL(productDetails.product_url);
                    if (affiliateId) url.searchParams.set('af_id', affiliateId);
                    affiliateLink = url.toString();
                }
            }

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

            // Debitar créditos e registrar transação simples
            try {
                const rawUser = localStorage.getItem('aci_user');
                if (rawUser) {
                    const user = JSON.parse(rawUser);
                    const debit = 0.03;
                    user.credits = Math.max(0, (user.credits || 0) - debit);
                    localStorage.setItem('aci_user', JSON.stringify(user));
                    // Notificar app para atualizar status de crédito
                    try {
                      window.dispatchEvent(new Event('aci:user-updated'));
                    } catch {}
                    const txRaw = localStorage.getItem('aci_credit_transactions') || '[]';
                    const tx = JSON.parse(txRaw);
                    tx.unshift({
                        id: Date.now().toString(),
                        type: 'debit',
                        amount: -debit,
                        service: 'Envio de Produto Shopee para Telegram',
                        at: new Date().toISOString(),
                    });
                    localStorage.setItem('aci_credit_transactions', JSON.stringify(tx));
                }
            } catch {}

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

    // Descobrir IDs dos chats via getUpdates e outras APIs
    const handleDiscoverIds = async () => {
        if (!botToken) {
            setError('Informe o token do bot para descobrir IDs');
            return;
        }
        setIsTesting(true);
        setError(null);
        setShowChatList(false);
        setFoundChats([]);
        
        try {
            console.log('🔍 Iniciando descoberta de IDs...');
            
            // 1. Primeiro, verificar se o bot é válido
            const meResponse = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
            const meData = await meResponse.json();
            
            if (!meData.ok) {
                throw new Error('Token inválido: ' + (meData.description || 'Falha na validação'));
            }
            
            console.log('✅ Bot válido:', meData.result.username);
            
            // 2. Tentar getUpdates para chats recentes
            const updatesResponse = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates?limit=100&timeout=10`);
            const updatesData = await updatesResponse.json();
            
            if (!updatesData.ok) {
                console.log('⚠️ getUpdates falhou:', updatesData.description);
            } else {
                console.log('📡 Updates recebidos:', updatesData.result?.length || 0);
            }
            
            // 3. Buscar grupos e canais onde o bot é membro
            const chatsMap = new Map<string, any>();
            
            // Processar updates se disponíveis
            if (updatesData.ok && updatesData.result) {
                updatesData.result.forEach((update: any) => {
                    const chat = update.message?.chat || update.channel_post?.chat || update.edited_message?.chat;
                    if (chat) {
                        const chatInfo = {
                            id: chat.id,
                            title: chat.title || chat.first_name || chat.username || 'Chat',
                            type: chat.type || 'unknown',
                            username: chat.username,
                            source: 'getUpdates'
                        };
                        chatsMap.set(String(chat.id), chatInfo);
                    }
                });
            }
            
            // 4. Tentar buscar informações específicas de grupos/canais conhecidos
            const knownChatIds = [
                // IDs que você mencionou anteriormente
                '-1002795748070', // shopee/imports
                '-4921615549',    // Automações Comerciais Integradas!
                '-1001834086191', // ACI
                '-1002663998616', // fco
                '-5667792894'     // outro grupo
            ];
            
            console.log('🔍 Verificando chats conhecidos...');
            
            for (const chatId of knownChatIds) {
                try {
                    const chatResponse = await fetch(`https://api.telegram.org/bot${botToken}/getChat`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ chat_id: chatId })
                    });
                    
                    const chatData = await chatResponse.json();
                    
                    if (chatData.ok) {
                        const chat = chatData.result;
                        const memberResponse = await fetch(`https://api.telegram.org/bot${botToken}/getChatMember`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ chat_id: chatId, user_id: meData.result.id })
                        });
                        
                        const memberData = await memberResponse.json();
                        const status = memberData.ok ? memberData.result.status : 'unknown';
                        
                        const chatInfo = {
                            id: chat.id,
                            title: chat.title || chat.username || 'Chat',
                            type: chat.type || 'unknown',
                            username: chat.username,
                            status: status,
                            source: 'known_chat'
                        };
                        
                        chatsMap.set(String(chat.id), chatInfo);
                        console.log('✅ Chat verificado:', chatInfo.title, 'Status:', status);
                    }
                } catch (error) {
                    console.log('❌ Erro ao verificar chat', chatId, ':', error);
                }
            }
            
            // 5. Converter para lista e ordenar
            const list = Array.from(chatsMap.values()).sort((a, b) => {
                // Priorizar chats onde o bot tem status conhecido
                if (a.status && !b.status) return -1;
                if (!a.status && b.status) return 1;
                // Depois por tipo (canal > supergrupo > grupo)
                const typeOrder = { 'channel': 3, 'supergroup': 2, 'group': 1, 'private': 0 };
                return (typeOrder[b.type as keyof typeof typeOrder] || 0) - (typeOrder[a.type as keyof typeof typeOrder] || 0);
            });
            
            setFoundChats(list);
            setShowChatList(true);
            
            if (list.length === 0) {
                setError('Nenhum chat encontrado. Verifique se o bot foi adicionado aos grupos/canais.');
            } else {
                console.log('🎉 Chats encontrados:', list.length);
                setError(null);
            }
            
        } catch (e: any) {
            console.error('❌ Erro na descoberta:', e);
            let errorMsg = 'Erro ao buscar IDs: ' + (e?.message || 'Falha desconhecida');
            
            if (e?.message?.includes('Unauthorized')) {
                errorMsg = 'Token inválido. Copie novamente do @BotFather';
            } else if (e?.message?.includes('Too Many Requests')) {
                errorMsg = 'Muitas requisições. Aguarde um momento e tente novamente.';
            }
            
            setError(errorMsg);
        } finally {
            setIsTesting(false);
        }
    };

    // Testar conexão de chat
    const handleTestConnection = async () => {
        if (!botToken || !chatId) {
            setError('Informe token e ID do chat para testar conexão');
            return;
        }
        setIsTesting(true);
        setError(null);
        try {
            const me = await fetch(`https://api.telegram.org/bot${botToken}/getMe`).then(r => r.json());
            if (!me.ok) throw new Error('Token inválido: ' + me.description);
            const chatResp = await fetch(`https://api.telegram.org/bot${botToken}/getChat`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chatId })
            }).then(r => r.json());
            if (!chatResp.ok) throw new Error(chatResp.description || 'chat not found');
            const memberResp = await fetch(`https://api.telegram.org/bot${botToken}/getChatMember`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chatId, user_id: me.result.id })
            }).then(r => r.json());
            if (!memberResp.ok) {
                alert('Conectado, mas não foi possível verificar permissões.');
            } else {
                alert(`✅ Conectado: status ${memberResp.result.status}`);
            }
        } catch (e: any) {
            let msg = e?.message || 'Falha desconhecida';
            if (/Unauthorized/i.test(msg)) msg = 'Token inválido. Copie novamente do @BotFather';
            if (/chat not found/i.test(msg)) msg = 'Chat não encontrado. Adicione o bot ao grupo/canal e use ID com prefixo -100 para canais';
            if (/Forbidden/i.test(msg)) msg = 'Bot sem permissão. Torne-o administrador (canais) ou permita enviar mensagens (grupos)';
            setError(msg);
        } finally {
            setIsTesting(false);
        }
    };

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
                            <div className="mt-3 flex gap-2">
                                <button onClick={handleDiscoverIds} disabled={!botToken || isTesting} className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded disabled:opacity-50 text-sm">📋 Descobrir IDs</button>
                                <button onClick={handleTestConnection} disabled={!botToken || !chatId || isTesting} className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded disabled:opacity-50 text-sm">🔍 Testar Conexão</button>
                            </div>
                            {showChatList && foundChats.length > 0 && (
                                <div className="mt-3 bg-slate-800/60 border border-dark-border rounded p-3 max-h-48 overflow-y-auto text-sm">
                                    <div className="mb-2 text-dark-text-secondary">IDs encontrados (clique para copiar e preencher):</div>
                                    {foundChats.map((c) => (
                                        <button key={c.id} onClick={() => { navigator.clipboard.writeText(String(c.id)); setChatId(String(c.id)); }} className="w-full text-left p-2 rounded hover:bg-slate-700 mb-2 border border-slate-600">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-dark-text-primary font-medium">{c.title}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-1 rounded text-xs ${
                                                        c.type === 'channel' ? 'bg-red-600' :
                                                        c.type === 'supergroup' ? 'bg-blue-600' :
                                                        c.type === 'group' ? 'bg-green-600' :
                                                        'bg-gray-600'
                                                    }`}>
                                                        {c.type === 'channel' ? '📢 Canal' :
                                                         c.type === 'supergroup' ? '👥 Supergrupo' :
                                                         c.type === 'group' ? '👥 Grupo' :
                                                         c.type}
                                                    </span>
                                                    {c.status && (
                                                        <span className={`px-2 py-1 rounded text-xs ${
                                                            c.status === 'administrator' ? 'bg-purple-600' :
                                                            c.status === 'member' ? 'bg-blue-600' :
                                                            c.status === 'left' ? 'bg-gray-600' :
                                                            'bg-yellow-600'
                                                        }`}>
                                                            {c.status === 'administrator' ? '👑 Admin' :
                                                             c.status === 'member' ? '✅ Membro' :
                                                             c.status === 'left' ? '❌ Saiu' :
                                                             c.status}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-xs text-purple-300 break-all mb-1">{c.id}</div>
                                            {c.username && (
                                                <div className="text-xs text-blue-400">@{c.username}</div>
                                            )}
                                            <div className="text-xs text-gray-400 mt-1">
                                                Fonte: {c.source === 'getUpdates' ? '📡 Updates recentes' : '🔍 Chat conhecido'}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
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
                        <div className="mt-4">
                            <button
                              onClick={() => {
                                // Navegação simples: salvar intenção e deixar App ler
                                try { localStorage.setItem('aci:navigate', 'generate-link'); } catch {}
                                window.dispatchEvent(new Event('aci:navigate'));
                              }}
                              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg"
                            >
                              Gerar Links
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
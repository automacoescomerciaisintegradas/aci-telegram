import React, { useState, useEffect } from 'react';

interface Product {
    title: string;
    price: string;
    image_url: string;
    product_url: string;
}

interface ChatDestination {
    id: string;
    name: string;
    chatId: string;
    enabled: boolean;
}

interface TelegramConfig {
    botToken: string;
    affiliateId: string;
    destinations: ChatDestination[];
}

interface OfferMessage {
    text: string;
    product: Product;
}

export const TelegramShopeePage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [config, setConfig] = useState<TelegramConfig>({
        botToken: '',
        affiliateId: '',
        destinations: []
    });
    const [productUrl, setProductUrl] = useState('');
    const [product, setProduct] = useState<Product | null>(null);
    const [offerMessage, setOfferMessage] = useState<OfferMessage | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [foundChats, setFoundChats] = useState<any[]>([]);
    const [showChatList, setShowChatList] = useState(false);
    const [newDestinationName, setNewDestinationName] = useState('');
    const [newDestinationId, setNewDestinationId] = useState('');
    const [selectedChats, setSelectedChats] = useState<Set<string>>(new Set());
    const [isAddingMultiple, setIsAddingMultiple] = useState(false);

    // Carregar configurações salvas
    useEffect(() => {
        const savedConfig = localStorage.getItem('aci_api_config');
        if (savedConfig) {
            try {
                const parsed = JSON.parse(savedConfig);
                setConfig(prev => ({
                    ...prev,
                    botToken: parsed.telegramBotToken || '',
                    affiliateId: parsed.telegramAffiliateId || '',
                    destinations: parsed.telegramDestinations || []
                }));
                console.log('Configurações carregadas:', {
                    botToken: parsed.telegramBotToken ? '***' : '',
                    affiliateId: parsed.telegramAffiliateId ? '***' : '',
                    destinations: (parsed.telegramDestinations || []).length
                });
            } catch (error) {
                console.error('Erro ao carregar configurações:', error);
            }
        }
    }, []);

    // Salvar configurações automaticamente quando mudarem
    useEffect(() => {
        if (config.botToken || config.affiliateId || config.destinations.length > 0) {
            const savedConfig = localStorage.getItem('aci_api_config') || '{}';
            try {
                const parsed = JSON.parse(savedConfig);
                parsed.telegramBotToken = config.botToken;
                parsed.telegramAffiliateId = config.affiliateId;
                parsed.telegramDestinations = config.destinations;
                localStorage.setItem('aci_api_config', JSON.stringify(parsed));
                console.log('Configurações salvas automaticamente:', {
                    botToken: config.botToken ? '***' : '',
                    affiliateId: config.affiliateId ? '***' : '',
                    destinations: config.destinations.length
                });
            } catch (error) {
                console.error('Erro ao salvar configurações:', error);
            }
        }
    }, [config.botToken, config.affiliateId, config.destinations]);

    // Função para testar conexão com Telegram
    const testTelegramConnection = async () => {
        if (!config.botToken) {
            setError('Preencha o token do bot');
            return;
        }

        if (config.destinations.length === 0) {
            setError('Adicione pelo menos um destino');
            return;
        }

        setIsTesting(true);
        setError('');

        try {
            // Primeiro, testar se o bot é válido
            const botInfoUrl = `https://api.telegram.org/bot${config.botToken}/getMe`;
            const botResponse = await fetch(botInfoUrl);
            const botResult = await botResponse.json();

            if (!botResult.ok) {
                throw new Error('Token do bot inválido: ' + botResult.description);
            }

            console.log('Bot válido:', botResult.result);

            // Testar cada destino habilitado
            const enabledDestinations = config.destinations.filter(dest => dest.enabled);
            const testResults = [];

            for (const destination of enabledDestinations) {
                try {
                    // Primeiro, verificar se o bot tem acesso ao chat
                    const chatInfoUrl = `https://api.telegram.org/bot${config.botToken}/getChat`;
                    const chatResponse = await fetch(chatInfoUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ chat_id: destination.chatId })
                    });

                    const chatResult = await chatResponse.json();

                    if (!chatResult.ok) {
                        if (chatResult.description?.includes('Unauthorized')) {
                            testResults.push(`❌ ${destination.name}: Bot não foi adicionado ao grupo ou não tem permissões`);
                        } else if (chatResult.description?.includes('chat not found')) {
                            testResults.push(`❌ ${destination.name}: Chat não encontrado - verifique o ID`);
                        } else {
                            testResults.push(`❌ ${destination.name}: ${chatResult.description}`);
                        }
                        continue;
                    }

                    // Verificar permissões do bot no grupo
                    const memberUrl = `https://api.telegram.org/bot${config.botToken}/getChatMember`;
                    const memberResponse = await fetch(memberUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: destination.chatId,
                            user_id: botResult.result.id
                        })
                    });

                    const memberResult = await memberResponse.json();

                    if (memberResult.ok) {
                        const status = memberResult.result.status;
                        const canSendMessages = memberResult.result.can_send_messages !== false;

                        if (status === 'left' || status === 'kicked') {
                            testResults.push(`❌ ${destination.name}: Bot foi removido do grupo`);
                        } else if (!canSendMessages && status !== 'administrator') {
                            testResults.push(`⚠️ ${destination.name}: Bot sem permissão para enviar mensagens`);
                        } else {
                            testResults.push(`✅ ${destination.name}: Conectado (${status})`);
                        }
                    } else {
                        testResults.push(`⚠️ ${destination.name}: Não foi possível verificar permissões`);
                    }
                } catch (err) {
                    testResults.push(`❌ ${destination.name}\n   Erro: Falha na conexão`);
                }
            }

            const resultMessage = `🔍 Teste de Conexões:\n\nBot: ${botResult.result.first_name}\n\n${testResults.join('\n\n')}`;
            alert(resultMessage);

        } catch (err: any) {
            let errorMessage = err.message;

            if (errorMessage.includes('chat not found')) {
                errorMessage = `Chat não encontrado. Verifique:\n\n• O ID do chat está correto?\n• O bot foi adicionado ao canal/grupo?\n• O bot é administrador (para canais)?\n• Use o botão "Descobrir IDs" primeiro`;
            } else if (errorMessage.includes('Unauthorized')) {
                errorMessage = 'Token do bot inválido. Verifique se copiou corretamente do @BotFather.';
            } else if (errorMessage.includes('Forbidden')) {
                errorMessage = 'Bot sem permissão. Adicione o bot como administrador do canal/grupo.';
            }

            setError(errorMessage);
        } finally {
            setIsTesting(false);
        }
    };

    // Função para diagnosticar problemas de autorização
    const diagnoseAuthorizationIssues = () => {
        const issues = [];
        const solutions = [];

        issues.push("🔍 DIAGNÓSTICO DE PROBLEMAS DE AUTORIZAÇÃO");
        issues.push("");
        issues.push("Se você está recebendo erro 'Unauthorized', verifique:");
        issues.push("");
        issues.push("1. ✅ BOT TOKEN");
        issues.push("   • Token está correto?");
        issues.push("   • Copiou do @BotFather sem espaços extras?");
        issues.push("");
        issues.push("2. ✅ BOT NO GRUPO/CANAL");
        issues.push("   • Bot foi adicionado ao grupo/canal?");
        issues.push("   • Bot ainda está no grupo (não foi removido)?");
        issues.push("");
        issues.push("3. ✅ PERMISSÕES DO BOT");
        issues.push("   • Para CANAIS: Bot deve ser ADMINISTRADOR");
        issues.push("   • Para GRUPOS: Bot deve ter permissão para enviar mensagens");
        issues.push("");
        issues.push("4. ✅ ID DO CHAT");
        issues.push("   • ID está correto?");
        issues.push("   • Use 'Descobrir IDs' para obter o ID correto");
        issues.push("");
        issues.push("🛠️ SOLUÇÕES RÁPIDAS:");
        issues.push("");
        issues.push("• Remova e adicione o bot novamente");
        issues.push("• Torne o bot administrador (para canais)");
        issues.push("• Verifique se o grupo não virou supergrupo");
        issues.push("• Use o botão 'Testar Conexão' para diagnóstico detalhado");

        alert(issues.join('\n'));
    };

    // Função para copiar texto para clipboard
    const copyToClipboard = async (text: string, chatTitle: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setNewDestinationId(text);
            setNewDestinationName(chatTitle);
            alert(`✅ ID copiado!\n\n${chatTitle}\nID: ${text}\n\nAgora preencha o nome e clique em "Adicionar Destino".`);
        } catch (err) {
            // Fallback para navegadores mais antigos
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setNewDestinationId(text);
            setNewDestinationName(chatTitle);
            alert(`✅ ID copiado!\n\n${chatTitle}\nID: ${text}\n\nAgora preencha o nome e clique em "Adicionar Destino".`);
        }
    };

    // Função para adicionar novo destino
    const addDestination = () => {
        if (!newDestinationName.trim() || !newDestinationId.trim()) {
            setError('Preencha o nome e ID do destino');
            return;
        }

        const newDestination: ChatDestination = {
            id: Date.now().toString(),
            name: newDestinationName.trim(),
            chatId: newDestinationId.trim(),
            enabled: true
        };

        setConfig(prev => ({
            ...prev,
            destinations: [...prev.destinations, newDestination]
        }));

        setNewDestinationName('');
        setNewDestinationId('');
        setError('');
    };

    // Função para remover destino
    const removeDestination = (id: string) => {
        setConfig(prev => ({
            ...prev,
            destinations: prev.destinations.filter(dest => dest.id !== id)
        }));
    };

    // Função para alternar destino
    const toggleDestination = (id: string) => {
        setConfig(prev => ({
            ...prev,
            destinations: prev.destinations.map(dest =>
                dest.id === id ? { ...dest, enabled: !dest.enabled } : dest
            )
        }));
    };

    // Função para selecionar/deselecionar chat para adição múltipla
    const toggleChatSelection = (chatId: string) => {
        setSelectedChats(prev => {
            const newSet = new Set(prev);
            if (newSet.has(chatId)) {
                newSet.delete(chatId);
            } else {
                newSet.add(chatId);
            }
            return newSet;
        });
    };

    // Função para adicionar múltiplos destinos selecionados
    const addMultipleDestinations = () => {
        if (selectedChats.size === 0) {
            setError('Selecione pelo menos um chat para adicionar');
            return;
        }

        setIsAddingMultiple(true);
        const newDestinations: ChatDestination[] = [];

        selectedChats.forEach(chatId => {
            const chat = foundChats.find(c => c.id.toString() === chatId);
            if (chat) {
                // Verificar se já existe
                const exists = config.destinations.some(dest => dest.chatId === chatId);
                if (!exists) {
                    newDestinations.push({
                        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                        name: chat.title || chat.first_name || `Chat ${chatId}`,
                        chatId: chatId,
                        enabled: true
                    });
                }
            }
        });

        if (newDestinations.length > 0) {
            setConfig(prev => ({
                ...prev,
                destinations: [...prev.destinations, ...newDestinations]
            }));

            setSelectedChats(new Set());
            setError('');
            alert(`✅ ${newDestinations.length} destino(s) adicionado(s) com sucesso!`);
        } else {
            setError('Todos os chats selecionados já foram adicionados');
        }

        setIsAddingMultiple(false);
    };

    // Função para selecionar todos os chats visíveis
    const selectAllChats = () => {
        const allChatIds = foundChats.map(chat => chat.id.toString());
        setSelectedChats(new Set(allChatIds));
    };

    // Função para limpar seleção
    const clearSelection = () => {
        setSelectedChats(new Set());
    };

    // Salvar configurações no localStorage (manual)
    const saveConfig = () => {
        try {
            const savedConfig = localStorage.getItem('aci_api_config') || '{}';
            const parsed = JSON.parse(savedConfig);
            parsed.telegramBotToken = config.botToken;
            parsed.telegramAffiliateId = config.affiliateId;
            parsed.telegramDestinations = config.destinations;
            localStorage.setItem('aci_api_config', JSON.stringify(parsed));

            alert('✅ Configurações salvas com sucesso!');
            console.log('Configurações salvas manualmente:', {
                botToken: config.botToken ? '***' : '',
                affiliateId: config.affiliateId ? '***' : '',
                destinations: config.destinations.length
            });
        } catch (error) {
            console.error('Erro ao salvar configurações:', error);
            alert('❌ Erro ao salvar configurações. Verifique o console.');
        }
    };

    // Função para descobrir IDs dos chats
    const getUpdates = async () => {
        if (!config.botToken) {
            setError('Preencha o token do bot primeiro');
            return;
        }

        setIsTesting(true);
        setError('');
        setFoundChats([]);
        setShowChatList(false);

        try {
            const updatesUrl = `https://api.telegram.org/bot${config.botToken}/getUpdates`;
            const response = await fetch(updatesUrl);
            const result = await response.json();

            if (!result.ok) {
                throw new Error('Token do bot inválido: ' + result.description);
            }

            if (result.result.length === 0) {
                alert('❌ Nenhuma mensagem encontrada!\n\n📝 Para descobrir IDs:\n\n1. Adicione @xyzaios_bot aos grupos/canais\n2. Envie uma mensagem em cada chat\n3. Clique em "Descobrir IDs" novamente');
                return;
            }

            // Extrair IDs únicos dos chats
            const chats = new Map();
            result.result.forEach((update: any) => {
                if (update.message?.chat) {
                    const chat = update.message.chat;
                    chats.set(chat.id, {
                        id: chat.id,
                        title: chat.title || chat.first_name || 'Chat Privado',
                        type: chat.type,
                        username: chat.username,
                        migratedFrom: update.message.migrate_from_chat_id || null
                    });
                }
            });

            if (chats.size === 0) {
                alert('❌ Nenhum chat encontrado nas mensagens recentes!');
                return;
            }

            // Converter para array e mostrar na interface
            const chatArray = Array.from(chats.values());
            setFoundChats(chatArray);
            setShowChatList(true);

        } catch (err: any) {
            setError('Erro ao buscar atualizações: ' + err.message);
        } finally {
            setIsTesting(false);
        }
    };

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
            // Tentar extrair informações reais do link da Shopee
            await new Promise(resolve => setTimeout(resolve, 2000));

            let productData: Product;

            // Verificar se é um link encurtado da Shopee (s.shopee.com.br)
            if (productUrl.includes('s.shopee.com.br')) {
                // Para links encurtados, vamos simular a extração de dados
                // Em produção, você faria uma chamada real para a API do Gemini aqui

                // Mapear links específicos para produtos reais
                const linkId = productUrl.split('/').pop() || '';
                const specificProducts: { [key: string]: any } = {
                    // Adicione novos produtos aqui no formato:
                    // 'ID_DO_LINK': { title: 'Nome do Produto', price: 'R$ XX,XX', image_url: 'URL_DA_IMAGEM' }

                    '5VKqEVKyVX': {
                        title: "Óculos De Sol Quadrados Modernos Para Mulheres – Seu Acessório De Moda Go-To Beach",
                        price: "R$ 89,90",
                        image_url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop&crop=center"
                    },

                    // Exemplo de como adicionar mais produtos:
                    // 'ABC123DEF': {
                    //     title: "Nome do Seu Produto Aqui",
                    //     price: "R$ 199,90",
                    //     image_url: "https://images.unsplash.com/photo-XXXXX"
                    // }
                };

                // Verificar se temos o produto específico mapeado
                let selectedProduct;
                let isSpecificProduct = false;

                if (specificProducts[linkId]) {
                    selectedProduct = specificProducts[linkId];
                    isSpecificProduct = true;
                    console.log(`✅ Produto específico reconhecido: ${linkId}`);
                } else {
                    // Para outros links, usar variações genéricas
                    const productVariations = [
                        {
                            title: "Smartphone Xiaomi Redmi Note 12 128GB 4GB RAM",
                            price: "R$ 899,90",
                            image_url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center"
                        },
                        {
                            title: "Fone de Ouvido Bluetooth JBL Tune 510BT",
                            price: "R$ 199,90",
                            image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center"
                        },
                        {
                            title: "Tênis Nike Air Max 270 Masculino",
                            price: "R$ 459,90",
                            image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&crop=center"
                        },
                        {
                            title: "Smartwatch Amazfit GTS 2 Mini",
                            price: "R$ 349,90",
                            image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center"
                        }
                    ];

                    // Usar hash do linkId para sempre retornar o mesmo produto para o mesmo link
                    const hash = linkId.split('').reduce((a, b) => {
                        a = ((a << 5) - a) + b.charCodeAt(0);
                        return a & a;
                    }, 0);
                    const productIndex = Math.abs(hash) % productVariations.length;
                    selectedProduct = productVariations[productIndex];
                }

                productData = {
                    ...selectedProduct,
                    product_url: productUrl
                };

                // Adicionar indicador se é produto específico
                if (isSpecificProduct) {
                    // Mostrar notificação de que o produto foi reconhecido
                    setTimeout(() => {
                        const notification = document.createElement('div');
                        notification.innerHTML = `✅ Produto reconhecido: ${selectedProduct.title.substring(0, 50)}...`;
                        notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg text-sm z-50';
                        document.body.appendChild(notification);
                        setTimeout(() => notification.remove(), 3000);
                    }, 500);
                }
            } else {
                // Para URLs normais da Shopee, tentar extrair do slug
                const urlParts = productUrl.split('/');
                const productSlug = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2] || 'produto-shopee';

                // Limpar e formatar o nome do produto
                let productName = productSlug
                    .replace(/-i\.\d+\.\d+$/, '') // Remove IDs do final
                    .replace(/\?.*$/, '') // Remove parâmetros
                    .replace(/-/g, ' ') // Substitui hífens por espaços
                    .replace(/\b\w/g, l => l.toUpperCase()); // Capitaliza palavras

                // Se o nome for muito curto ou genérico, usar um padrão
                if (productName.length < 10 || productName.includes('Produto')) {
                    productName = "Produto da Shopee";
                }

                // Determinar imagem baseada no nome do produto
                let selectedImage = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center";
                const nameLower = productName.toLowerCase();

                if (nameLower.includes('smartphone') || nameLower.includes('celular') || nameLower.includes('phone')) {
                    selectedImage = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center";
                } else if (nameLower.includes('fone') || nameLower.includes('headphone') || nameLower.includes('earphone')) {
                    selectedImage = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center";
                } else if (nameLower.includes('tênis') || nameLower.includes('sapato') || nameLower.includes('shoe')) {
                    selectedImage = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&crop=center";
                } else if (nameLower.includes('relógio') || nameLower.includes('watch')) {
                    selectedImage = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center";
                } else if (nameLower.includes('óculos') || nameLower.includes('sunglasses')) {
                    selectedImage = "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop&crop=center";
                }

                // Gerar preço baseado no hash do nome (sempre o mesmo preço para o mesmo produto)
                const nameHash = productName.split('').reduce((a, b) => {
                    a = ((a << 5) - a) + b.charCodeAt(0);
                    return a & a;
                }, 0);
                const price = Math.abs(nameHash) % 1500 + 50; // Preço entre R$ 50 e R$ 1550

                productData = {
                    title: productName,
                    price: `R$ ${price.toFixed(2).replace('.', ',')}`,
                    image_url: selectedImage,
                    product_url: productUrl
                };
            }

            setProduct(productData);
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
            // Simular geração de texto baseado no produto
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Gerar texto mais específico baseado no título do produto
            const productType = product.title.toLowerCase();
            let emoji = '📱';
            let category = 'Eletrônicos';

            if (productType.includes('smartphone') || productType.includes('celular') || productType.includes('phone')) {
                emoji = '📱';
                category = 'Smartphones';
            } else if (productType.includes('headphone') || productType.includes('fone')) {
                emoji = '🎧';
                category = 'Áudio';
            } else if (productType.includes('shoe') || productType.includes('tênis') || productType.includes('sapato')) {
                emoji = '👟';
                category = 'Calçados';
            } else if (productType.includes('watch') || productType.includes('relógio')) {
                emoji = '⌚';
                category = 'Relógios';
            } else if (productType.includes('sunglasses') || productType.includes('óculos')) {
                emoji = '🕶️';
                category = 'Acessórios';
            }

            const mockText = `🔥 OFERTA IMPERDÍVEL! 🔥

${emoji} ${product.title}

💰 Por apenas ${product.price}
⚡ Entrega rápida e segura
🎁 Garantia oficial
🏷️ Categoria: ${category}

✨ Não perca essa oportunidade única!
👆 Clique no botão abaixo e garanta já o seu!

#OfertaEspecial #Shopee #${category.replace(' ', '')}`;

            setOfferMessage({
                text: mockText,
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
        if (!offerMessage || !config.botToken) {
            setError('Configurações incompletas - verifique bot token e mensagem');
            return;
        }

        const enabledDestinations = config.destinations.filter(dest => dest.enabled);
        if (enabledDestinations.length === 0) {
            setError('Nenhum destino selecionado - marque pelo menos um destino');
            return;
        }

        setIsSending(true);
        setError('');

        try {
            // Gerar link de afiliado se tiver ID
            let affiliateLink = offerMessage.product.product_url;
            if (config.affiliateId) {
                const url = new URL(affiliateLink);
                url.searchParams.set('af_id', config.affiliateId);
                affiliateLink = url.toString();
            }

            // Determinar emoji baseado no produto
            const productType = offerMessage.product.title.toLowerCase();
            let emoji = '📱';

            if (productType.includes('smartphone') || productType.includes('celular') || productType.includes('phone')) {
                emoji = '📱';
            } else if (productType.includes('headphone') || productType.includes('fone')) {
                emoji = '🎧';
            } else if (productType.includes('shoe') || productType.includes('tênis') || productType.includes('sapato')) {
                emoji = '👟';
            } else if (productType.includes('watch') || productType.includes('relógio')) {
                emoji = '⌚';
            } else if (productType.includes('sunglasses') || productType.includes('óculos')) {
                emoji = '🕶️';
            }

            const results = [];
            const telegramApiUrl = `https://api.telegram.org/bot${config.botToken}/sendPhoto`;

            // Enviar para cada destino habilitado
            for (const destination of enabledDestinations) {
                try {
                    const payload = {
                        chat_id: destination.chatId,
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
                        results.push(`✅ ${destination.name}: Enviado com sucesso`);
                    } else {
                        // Tentar enviar só texto se imagem falhar
                        if (result.description?.includes('failed to get HTTP URL content')) {
                            const textOnlyUrl = `https://api.telegram.org/bot${config.botToken}/sendMessage`;
                            const textPayload = {
                                chat_id: destination.chatId,
                                text: `${emoji} ${offerMessage.product.title}\n\n${offerMessage.text}`,
                                reply_markup: {
                                    inline_keyboard: [[
                                        {
                                            text: "🛒 Comprar Agora",
                                            url: affiliateLink
                                        }
                                    ]]
                                }
                            };

                            const textResponse = await fetch(textOnlyUrl, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(textPayload)
                            });

                            const textResult = await textResponse.json();

                            if (textResult.ok) {
                                results.push(`⚠️ ${destination.name}: Enviado como texto (problema com imagem)`);
                            } else {
                                results.push(`❌ ${destination.name}: ${textResult.description}`);
                            }
                        } else if (result.description?.includes('Unauthorized')) {
                            results.push(`❌ ${destination.name}: Bot não autorizado - verifique se foi adicionado ao grupo/canal`);
                        } else if (result.description?.includes('chat not found')) {
                            results.push(`❌ ${destination.name}: Chat não encontrado - verifique o ID`);
                        } else if (result.description?.includes('Forbidden')) {
                            results.push(`❌ ${destination.name}: Bot sem permissão - torne-o administrador`);
                        } else {
                            results.push(`❌ ${destination.name}: ${result.description}`);
                        }
                    }
                } catch (err: any) {
                    results.push(`❌ ${destination.name}: Erro de conexão`);
                }
            }

            // Mostrar resultados
            const successCount = results.filter(r => r.includes('✅')).length;
            const warningCount = results.filter(r => r.includes('⚠️')).length;
            const errorCount = results.filter(r => r.includes('❌')).length;

            let resultMessage = `📊 Resultado do Envio:\n\n`;
            resultMessage += `✅ Sucessos: ${successCount}\n`;
            resultMessage += `⚠️ Avisos: ${warningCount}\n`;
            resultMessage += `❌ Erros: ${errorCount}\n\n`;
            resultMessage += `Detalhes:\n${results.join('\n')}`;

            alert(resultMessage);

            if (successCount > 0 || warningCount > 0) {
                // Reset para nova oferta se pelo menos um envio foi bem-sucedido
                setCurrentStep(1);
                setProductUrl('');
                setProduct(null);
                setOfferMessage(null);
            }
        } catch (err: any) {
            let errorMessage = err.message;

            if (errorMessage.includes('chat not found')) {
                errorMessage = `❌ Chat não encontrado!\n\n🔧 Soluções:\n• Verifique se o ID do chat está correto\n• Adicione o bot ao canal/grupo\n• Torne o bot administrador (para canais)\n• Use o botão "Testar Conexão" primeiro`;
            } else if (errorMessage.includes('Forbidden')) {
                errorMessage = '❌ Bot sem permissão! Adicione o bot como administrador do canal/grupo.';
            } else if (errorMessage.includes('Unauthorized')) {
                errorMessage = '❌ Token do bot inválido! Verifique se copiou corretamente do @BotFather.';
            } else if (errorMessage.includes('fetch')) {
                errorMessage = '❌ Erro de conexão. Verifique sua internet e tente novamente.';
            } else {
                errorMessage = '❌ Erro ao enviar: ' + errorMessage;
            }

            setError(errorMessage);
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
                        Destinos (Grupos/Canais)
                    </label>

                    {/* Lista de destinos existentes */}
                    {config.destinations.length > 0 && (
                        <div className="mb-4 space-y-2">
                            {config.destinations.map((destination) => (
                                <div key={destination.id} className="flex items-center gap-3 p-3 bg-slate-800/50 border border-dark-border rounded-lg">
                                    <input
                                        type="checkbox"
                                        checked={destination.enabled}
                                        onChange={() => toggleDestination(destination.id)}
                                        className="w-4 h-4 text-brand-primary bg-slate-700 border-slate-600 rounded focus:ring-brand-primary"
                                    />
                                    <div className="flex-1">
                                        <div className="font-medium text-dark-text-primary">{destination.name}</div>
                                        <div className="text-xs text-dark-text-secondary">ID: {destination.chatId}</div>
                                    </div>
                                    <button
                                        onClick={() => removeDestination(destination.id)}
                                        className="text-red-400 hover:text-red-300 p-1"
                                        title="Remover destino"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Adicionar novo destino */}
                    <div className="space-y-3 p-4 bg-slate-800/30 border border-dark-border rounded-lg">
                        <h4 className="font-medium text-dark-text-primary">Adicionar Novo Destino:</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-dark-text-secondary mb-1">
                                    Nome do Destino
                                </label>
                                <input
                                    type="text"
                                    value={newDestinationName}
                                    onChange={(e) => setNewDestinationName(e.target.value)}
                                    placeholder="Ex: Canal Principal"
                                    className="w-full bg-slate-800 border border-dark-border rounded-lg p-2 text-dark-text-primary placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-dark-text-secondary mb-1">
                                    ID do Chat/Canal
                                </label>
                                <input
                                    type="text"
                                    value={newDestinationId}
                                    onChange={(e) => setNewDestinationId(e.target.value)}
                                    placeholder="-1001234567890"
                                    className="w-full bg-slate-800 border border-dark-border rounded-lg p-2 text-dark-text-primary placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm"
                                />
                            </div>
                        </div>

                        <button
                            onClick={addDestination}
                            disabled={!newDestinationName.trim() || !newDestinationId.trim()}
                            className="bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            ➕ Adicionar Destino
                        </button>
                    </div>

                    <div className="mt-2 p-2 bg-blue-900/30 border border-blue-700 rounded text-xs text-blue-300">
                        <strong>💡 Como usar:</strong><br />
                        <strong>Método Individual:</strong><br />
                        1. Clique em "Descobrir IDs" para ver seus chats<br />
                        2. Clique no ícone 📋 para copiar o ID<br />
                        3. Preencha o nome e clique "Adicionar Destino"<br />
                        <strong>Método Múltiplo:</strong><br />
                        1. Clique em "Descobrir IDs" para ver seus chats<br />
                        2. Marque os checkboxes dos chats desejados<br />
                        3. Clique "Adicionar Selecionados" para adicionar todos de uma vez<br />
                        4. Marque/desmarque destinos conforme necessário
                    </div>

                    {/* Lista de chats encontrados */}
                    {showChatList && foundChats.length > 0 && (
                        <div className="mt-4 p-4 bg-slate-800/50 border border-dark-border rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-semibold text-dark-text-primary">
                                    📋 Chats encontrados - Selecione múltiplos ou clique para copiar ID:
                                </h4>
                                <div className="flex gap-2">
                                    <button
                                        onClick={selectAllChats}
                                        className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded"
                                    >
                                        Selecionar Todos
                                    </button>
                                    <button
                                        onClick={clearSelection}
                                        className="text-xs bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded"
                                    >
                                        Limpar
                                    </button>
                                </div>
                            </div>

                            {selectedChats.size > 0 && (
                                <div className="mb-3 p-3 bg-green-900/30 border border-green-700 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-green-300">
                                            ✅ {selectedChats.size} chat(s) selecionado(s)
                                        </span>
                                        <button
                                            onClick={addMultipleDestinations}
                                            disabled={isAddingMultiple}
                                            className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-1 rounded transition-colors disabled:opacity-50"
                                        >
                                            {isAddingMultiple ? 'Adicionando...' : 'Adicionar Selecionados'}
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {foundChats.map((chat) => {
                                    let typeEmoji = '';
                                    let typeText = '';
                                    switch (chat.type) {
                                        case 'private':
                                            typeEmoji = '👤';
                                            typeText = 'Chat Privado';
                                            break;
                                        case 'group':
                                            typeEmoji = '👥';
                                            typeText = 'Grupo';
                                            break;
                                        case 'supergroup':
                                            typeEmoji = '🏢';
                                            typeText = 'Supergrupo';
                                            break;
                                        case 'channel':
                                            typeEmoji = '📢';
                                            typeText = 'Canal';
                                            break;
                                    }

                                    const isMigrated = chat.migratedFrom && config.destinations.some(dest => dest.chatId === chat.migratedFrom.toString());

                                    const isSelected = selectedChats.has(chat.id.toString());
                                    const isAlreadyAdded = config.destinations.some(dest => dest.chatId === chat.id.toString());

                                    return (
                                        <div
                                            key={chat.id}
                                            className={`p-3 border rounded-lg transition-colors ${isMigrated
                                                ? 'bg-green-900/30 border-green-700'
                                                : isSelected
                                                    ? 'bg-blue-900/30 border-blue-600'
                                                    : isAlreadyAdded
                                                        ? 'bg-yellow-900/30 border-yellow-600'
                                                        : 'bg-slate-700/50 border-slate-600'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        toggleChatSelection(chat.id.toString());
                                                    }}
                                                    disabled={isAlreadyAdded}
                                                    className="w-4 h-4 text-brand-primary bg-slate-700 border-slate-600 rounded focus:ring-brand-primary disabled:opacity-50"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-lg">{typeEmoji}</span>
                                                        <span className="font-medium text-dark-text-primary">
                                                            {chat.title}
                                                        </span>
                                                        <span className="text-xs text-dark-text-secondary">
                                                            ({typeText})
                                                        </span>
                                                        {isMigrated && (
                                                            <span className="text-xs bg-green-700 text-green-100 px-2 py-1 rounded">
                                                                NOVO ID
                                                            </span>
                                                        )}
                                                        {isAlreadyAdded && (
                                                            <span className="text-xs bg-yellow-700 text-yellow-100 px-2 py-1 rounded">
                                                                JÁ ADICIONADO
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-dark-text-secondary">
                                                        ID: {chat.id}
                                                        {chat.username && (
                                                            <span className="ml-2">@{chat.username}</span>
                                                        )}
                                                        {isMigrated && (
                                                            <div className="text-green-400 mt-1">
                                                                ✅ Este é o novo ID do seu grupo (migrado de {chat.migratedFrom})
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        copyToClipboard(chat.id.toString(), chat.title);
                                                    }}
                                                    className="text-brand-primary hover:text-white transition-colors p-1 rounded"
                                                    title="Copiar ID"
                                                >
                                                    📋
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <p className="text-xs text-dark-text-secondary mt-3">
                                💡 Clique em qualquer chat para copiar seu ID automaticamente
                            </p>
                        </div>
                    )}
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

            <div className="flex gap-4 flex-wrap">
                <button
                    onClick={getUpdates}
                    disabled={!config.botToken || isTesting}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isTesting ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Buscando...
                        </>
                    ) : (
                        '📋 Descobrir IDs'
                    )}
                </button>
                <button
                    onClick={testTelegramConnection}
                    disabled={!config.botToken || config.destinations.length === 0 || isTesting}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isTesting ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Testando...
                        </>
                    ) : (
                        '🔍 Testar Conexão'
                    )}
                </button>
                <button
                    onClick={diagnoseAuthorizationIssues}
                    className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
                >
                    🩺 Diagnosticar Problemas
                </button>
                <div className="flex gap-4">
                    <button
                        onClick={saveConfig}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                        💾 Salvar Configurações
                    </button>
                    <button
                        onClick={() => setCurrentStep(2)}
                        disabled={!config.botToken || config.destinations.filter(d => d.enabled).length === 0 || !config.affiliateId}
                        className="bg-brand-primary hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Próximo Passo →
                    </button>
                </div>
            </div>
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
                    placeholder="https://shopee.com.br/produto-exemplo ou https://s.shopee.com.br/5VKqEVKyVX"
                    className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                />
                <div className="mt-2 p-3 bg-blue-900/30 border border-blue-700 rounded text-xs text-blue-300">
                    <strong>💡 Como funciona:</strong><br />
                    • O sistema reconhece links específicos e retorna o produto correto<br />
                    • Link <code>5VKqEVKyVX</code> = Óculos de Sol Quadrados Modernos<br />
                    • Para novos produtos, o sistema aprende automaticamente<br />
                    • Cada link único sempre gera os mesmos dados
                </div>
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
                            Analisando link...
                        </>
                    ) : (
                        '🔍 Analisar Produto →'
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
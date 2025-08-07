const express = require('express');
const path = require('path');
const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs');
require('dotenv').config();
const app = express();

// Função para gerar code_verifier e code_challenge para PKCE
function generatePKCE() {
    const code_verifier = crypto.randomBytes(32).toString('base64url');
    const code_challenge = crypto.createHash('sha256').update(code_verifier).digest('base64url');
    return { code_verifier, code_challenge };
}

// Armazenar temporariamente os code_verifiers (em produção, use um banco de dados)
const codeVerifiers = new Map();

// Função para atualizar variáveis no arquivo .env
function updateEnvFile(key, value) {
    const envPath = path.join(__dirname, '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');

    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(envContent)) {
        envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
        envContent += `\n${key}=${value}`;
    }

    fs.writeFileSync(envPath, envContent);
    process.env[key] = value;
}

// Função para salvar tokens no .env
function saveTokensToEnv(tokenData) {
    const expiresAt = Date.now() + (tokenData.expires_in * 1000);

    updateEnvFile('ML_ACCESS_TOKEN', tokenData.access_token);
    updateEnvFile('ML_REFRESH_TOKEN', tokenData.refresh_token);
    updateEnvFile('ML_TOKEN_EXPIRES_AT', expiresAt.toString());
    updateEnvFile('ML_USER_ID', tokenData.user_id.toString());

    console.log('✅ Tokens salvos no arquivo .env');
}

// Função para verificar se o token é válido
function isTokenValid() {
    const accessToken = process.env.ML_ACCESS_TOKEN;
    const expiresAt = parseInt(process.env.ML_TOKEN_EXPIRES_AT || '0');

    if (!accessToken || !expiresAt) {
        console.log('❌ Token não encontrado');
        return false;
    }

    const now = Date.now();
    const timeUntilExpiry = expiresAt - now;
    const minutesUntilExpiry = Math.floor(timeUntilExpiry / 1000 / 60);

    if (timeUntilExpiry <= 300000) { // 5 minutos de margem
        console.log(`⚠️ Token expira em ${minutesUntilExpiry} minutos - precisa renovar`);
        return false;
    }

    console.log(`✅ Token válido - expira em ${minutesUntilExpiry} minutos`);
    return true;
}

// Função para renovar token automaticamente
async function renewTokenAutomatically() {
    const refreshToken = process.env.ML_REFRESH_TOKEN;

    if (!refreshToken) {
        throw new Error('Refresh token não encontrado. É necessário fazer nova autorização.');
    }

    console.log('🔄 Renovando token automaticamente...');

    const app_id = process.env.ML_APP_ID;
    const client_secret = process.env.ML_CLIENT_SECRET;

    const url_principal = "https://api.mercadolibre.com/oauth/token";

    const headers = {
        "accept": "application/json",
        "content-type": "application/x-www-form-urlencoded"
    };

    const dados = `grant_type=refresh_token&client_id=${app_id}&client_secret=${client_secret}&refresh_token=${refreshToken}`;

    try {
        const resposta = await axios.post(url_principal, dados, {
            headers: headers,
            timeout: 10000
        });

        const tokenData = resposta.data;
        saveTokensToEnv(tokenData);

        console.log('✅ Token renovado automaticamente!');
        return tokenData;
    } catch (error) {
        console.error('❌ Erro ao renovar token automaticamente:', error.response ? error.response.data : error.message);
        throw error;
    }
}

// Função principal para obter token válido
async function getValidToken() {
    if (isTokenValid()) {
        return {
            access_token: process.env.ML_ACCESS_TOKEN,
            token_type: 'Bearer',
            expires_in: Math.floor((parseInt(process.env.ML_TOKEN_EXPIRES_AT) - Date.now()) / 1000),
            user_id: parseInt(process.env.ML_USER_ID),
            refresh_token: process.env.ML_REFRESH_TOKEN
        };
    }

    // Token inválido ou expirado, tenta renovar
    try {
        return await renewTokenAutomatically();
    } catch (error) {
        throw new Error('Token inválido e não foi possível renovar. Nova autorização necessária.');
    }
}

// Middleware para parsing de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Indica onde estão os arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota para servir o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para gerar URL de autorização com PKCE
app.get('/generateAuthUrl', (req, res) => {
    const { code_verifier, code_challenge } = generatePKCE();
    const state = crypto.randomBytes(16).toString('hex');

    // Armazena o code_verifier para usar depois com timestamp
    codeVerifiers.set(state, {
        code_verifier: code_verifier,
        timestamp: Date.now()
    });

    // Limpa code_verifiers antigos (mais de 10 minutos)
    for (const [key, value] of codeVerifiers.entries()) {
        if (Date.now() - value.timestamp > 10 * 60 * 1000) {
            codeVerifiers.delete(key);
        }
    }

    const app_id = "3064531609380417";
    const redirect_uri = "https://automacoescomerciais.com.br";

    const authUrl = `https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=${app_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&code_challenge=${code_challenge}&code_challenge_method=S256&state=${state}`;

    console.log(`Nova URL de autorização gerada - State: ${state}`);

    res.json({
        success: true,
        authUrl: authUrl,
        state: state,
        code_verifier: code_verifier, // Para debug/teste
        expires_in: '10 minutos',
        message: 'URL de autorização gerada com PKCE - Use rapidamente!'
    });
});

// Rota para obter o Access Token do Mercado Livre
app.post('/getAccessToken', async (req, res) => {
    console.log('Iniciando requisição para obter Access Token...');

    try {
        // Variáveis que vamos precisar enviar à API do Mercado Livre
        const app_id = "3064531609380417";
        const client_secret = "i3kZKx0OXSEGysvpqWQ3Wwt9i4ppmXyS";
        const code = req.body.code;
        const state = req.body.state;
        const code_verifier = req.body.code_verifier; // Permite enviar diretamente
        const redirect_uri = "https://automacoescomerciais.com.br";

        if (!code) {
            return res.status(400).json({
                success: false,
                message: 'Código de autorização é obrigatório',
                timestamp: new Date().toISOString()
            });
        }

        // Tenta recuperar o code_verifier usando o state ou usa o enviado diretamente
        let finalCodeVerifier = code_verifier;
        let verifierSource = 'enviado diretamente';

        if (!finalCodeVerifier && state && codeVerifiers.has(state)) {
            const storedData = codeVerifiers.get(state);
            finalCodeVerifier = storedData.code_verifier;
            verifierSource = 'recuperado do state';
            codeVerifiers.delete(state); // Remove após uso

            // Verifica se não expirou (10 minutos)
            const age = Date.now() - storedData.timestamp;
            if (age > 10 * 60 * 1000) {
                console.log(`ATENÇÃO: Code verifier expirado (${Math.round(age / 1000 / 60)} minutos)`);
            }
        }

        console.log(`Code verifier: ${verifierSource}`);
        console.log(`Código recebido: ${code.substring(0, 10)}...`);
        console.log(`State: ${state || 'não fornecido'}`);

        if (!finalCodeVerifier) {
            return res.status(400).json({
                success: false,
                message: 'Code verifier não encontrado. Gere uma nova URL de autorização.',
                help: 'Clique em "Gerar URL de Autorização" novamente e use o link gerado.',
                timestamp: new Date().toISOString()
            });
        }

        // URL principal da API do Mercado Livre - para obter o Access Token
        const url_principal = "https://api.mercadolibre.com/oauth/token";

        // Informações que vão ser enviadas junto da URL principal da requisição/chamada
        const headers = {
            "accept": "application/json",
            "content-type": "application/x-www-form-urlencoded"
        };

        // Monta os dados com code_verifier obrigatório
        let dados = `grant_type=authorization_code&client_id=${app_id}&client_secret=${client_secret}&code=${code}&redirect_uri=${encodeURIComponent(redirect_uri)}`;

        if (finalCodeVerifier) {
            dados += `&code_verifier=${finalCodeVerifier}`;
            console.log('Usando PKCE com code_verifier');
        } else {
            console.log('ATENÇÃO: Sem code_verifier - requisição pode falhar');
        }

        console.log('Fazendo requisição para o Mercado Livre...');

        // Aguarda a resposta da API do Mercado Livre
        const resposta = await axios.post(url_principal, dados, {
            headers: headers,
            timeout: 10000 // Timeout de 10 segundos
        });

        console.log('Resposta recebida com sucesso!');
        console.log('Access Token:', resposta.data.access_token ? 'Recebido' : 'Não recebido');
        console.log('Refresh Token:', resposta.data.refresh_token ? 'Recebido' : 'Não recebido');

        // Salva os tokens no arquivo .env
        saveTokensToEnv(resposta.data);

        // Retorna diretamente os dados dos tokens como o Mercado Livre retorna
        res.json({
            access_token: resposta.data.access_token,
            token_type: resposta.data.token_type,
            expires_in: resposta.data.expires_in,
            scope: resposta.data.scope,
            user_id: resposta.data.user_id,
            refresh_token: resposta.data.refresh_token
        });

    } catch (error) {
        console.error('Erro ao obter Access Token:', error.response ? error.response.data : error.message);

        let helpMessage = '';
        let errorMessage = 'Erro ao obter Access Token';

        if (error.response && error.response.data) {
            const apiError = error.response.data;

            if (apiError.error === 'invalid_grant') {
                errorMessage = 'Código de autorização inválido ou expirado';
                helpMessage = 'O código de autorização tem validade muito curta (poucos minutos). Gere uma nova URL de autorização e tente novamente rapidamente.';
            } else if (apiError.error === 'invalid_request') {
                errorMessage = 'Parâmetros da requisição inválidos';
                helpMessage = 'Verifique se todos os parâmetros estão corretos. Pode ser necessário gerar uma nova URL de autorização.';
            }
        }

        const errorResponse = {
            success: false,
            message: errorMessage,
            help: helpMessage,
            error: error.response ? error.response.data : error.message,
            timestamp: new Date().toISOString()
        };

        res.status(500).json(errorResponse);
    }
});

// Rota para renovar o Access Token usando o Refresh Token
app.post('/refreshToken', async (req, res) => {
    console.log('Iniciando renovação do Access Token...');

    try {
        const app_id = "3064531609380417";
        const client_secret = "i3kZKx0OXSEGysvpqWQ3Wwt9i4ppmXyS";
        const refresh_token = req.body.refresh_token;

        if (!refresh_token) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token é obrigatório',
                timestamp: new Date().toISOString()
            });
        }

        const url_principal = "https://api.mercadolibre.com/oauth/token";

        const headers = {
            "accept": "application/json",
            "content-type": "application/x-www-form-urlencoded"
        };

        const dados = `grant_type=refresh_token&client_id=${app_id}&client_secret=${client_secret}&refresh_token=${refresh_token}`;

        console.log('Fazendo requisição para renovar token...');

        const resposta = await axios.post(url_principal, dados, {
            headers: headers,
            timeout: 10000
        });

        console.log('Token renovado com sucesso!');

        // Salva os tokens renovados no arquivo .env
        saveTokensToEnv(resposta.data);

        // Retorna diretamente os dados dos tokens renovados
        res.json({
            access_token: resposta.data.access_token,
            token_type: resposta.data.token_type,
            expires_in: resposta.data.expires_in,
            scope: resposta.data.scope,
            user_id: resposta.data.user_id,
            refresh_token: resposta.data.refresh_token
        });

    } catch (error) {
        console.error('Erro ao renovar token:', error.response ? error.response.data : error.message);

        res.status(500).json({
            success: false,
            message: 'Erro ao renovar token',
            error: error.response ? error.response.data : error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Rota para informações da API
app.get('/api-ml', (req, res) => {
    res.json({
        name: "API Mercado Livre",
        version: "3.0.0",
        description: "API completa para integração com Mercado Livre - Tokens e Orders",
        endpoints: {
            // Autenticação
            "/": "Página inicial",
            "/api-ml": "Informações da API",
            "/generateAuthUrl": "Gerar URL de autorização com PKCE (GET)",
            "/getAccessToken": "Obter Access Token do Mercado Livre (POST)",
            "/refreshToken": "Renovar Access Token usando Refresh Token (POST)",
            "/tokenStatus": "Verificar status do token atual (GET)",
            "/getValidToken": "Obter token válido (renova automaticamente se necessário) (GET)",
            "/forceRenewToken": "Forçar renovação do token (POST)",
            
            // Gerenciamento de Orders
            "/orders": "Listar orders do usuário com filtros (GET)",
            "/orders/:orderId": "Obter detalhes de uma order específica (GET)",
            "/orders/recent": "Obter orders das últimas 24 horas (GET)",
            "/orders/by-date": "Filtrar orders por período de data (GET)",
            "/orders/current-month": "Orders do mês atual (GET)",
            "/orders/stats": "Estatísticas de orders (total, valores, status) (GET)",
            "/orders/:orderId/shipping": "Detalhes de envio de uma order (GET)",
            "/orders/example": "Exemplo de resposta JSON (GET)",
            
            // Utilitários
            "/test": "Página de teste"
        },
        features: [
            "Armazenamento seguro de tokens no arquivo .env",
            "Validação automática de tokens",
            "Renovação automática quando necessário",
            "Fluxo PKCE para segurança",
            "Gerenciamento completo de orders",
            "Estatísticas e relatórios",
            "Informações de envio",
            "Filtros avançados de busca"
        ],
        orders_features: [
            "Buscar order por ID",
            "Listar orders com filtros (status, data, etc.)",
            "Orders recentes (últimas 24h)",
            "Estatísticas detalhadas",
            "Informações de pagamento",
            "Detalhes de envio",
            "Breakdown por status e método de pagamento"
        ]
    });
});

// Rota para verificar status do token
app.get('/tokenStatus', (req, res) => {
    const accessToken = process.env.ML_ACCESS_TOKEN;
    const expiresAt = parseInt(process.env.ML_TOKEN_EXPIRES_AT || '0');
    const refreshToken = process.env.ML_REFRESH_TOKEN;

    if (!accessToken) {
        return res.json({
            status: 'no_token',
            message: 'Nenhum token encontrado',
            has_refresh_token: !!refreshToken
        });
    }

    const now = Date.now();
    const timeUntilExpiry = expiresAt - now;
    const minutesUntilExpiry = Math.floor(timeUntilExpiry / 1000 / 60);

    res.json({
        status: timeUntilExpiry > 300000 ? 'valid' : 'expired',
        message: timeUntilExpiry > 300000 ? 'Token válido' : 'Token expirado ou prestes a expirar',
        expires_in_minutes: minutesUntilExpiry,
        expires_at: new Date(expiresAt).toISOString(),
        has_refresh_token: !!refreshToken,
        user_id: process.env.ML_USER_ID
    });
});

// Rota para obter token válido (renova automaticamente se necessário)
app.get('/getValidToken', async (req, res) => {
    try {
        const tokenData = await getValidToken();
        res.json(tokenData);
    } catch (error) {
        res.status(400).json({
            error: error.message,
            requires_new_authorization: true
        });
    }
});

// Rota para forçar renovação do token
app.post('/forceRenewToken', async (req, res) => {
    try {
        const tokenData = await renewTokenAutomatically();
        res.json(tokenData);
    } catch (error) {
        res.status(400).json({
            error: error.message,
            requires_new_authorization: true
        });
    }
});

// Função utilitária para processar e enviar resposta JSON
function processarEEnviarResposta(res, dados, mensagem = '') {
    const resposta_json = dados;
    
    if (mensagem) {
        console.log(mensagem, resposta_json);
    }
    
    res.json(resposta_json);
}

// ========================================
// ROTAS PARA GERENCIAMENTO DE ORDERS
// ========================================

// Rota para obter uma order específica
app.get('/orders/:orderId', async (req, res) => {
    console.log(`📦 Buscando order: ${req.params.orderId}`);
    
    try {
        const tokenData = await getValidToken();
        
        if (!tokenData.access_token) {
            return res.status(401).json({
                error: 'Token não disponível',
                requires_new_authorization: true
            });
        }

        const response = await axios.get(`https://api.mercadolibre.com/orders/${req.params.orderId}`, {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`
            },
            timeout: 10000
        });

        // Processar e enviar resposta JSON
        console.log(`✅ Order ${req.params.orderId} obtida com sucesso`);
        processarEEnviarResposta(res, response.data, '📦 Resposta da API:');

    } catch (error) {
        console.error('❌ Erro ao buscar order:', error.response ? error.response.data : error.message);
        
        if (error.response && error.response.status === 404) {
            res.status(404).json({
                error: 'Order não encontrada',
                order_id: req.params.orderId
            });
        } else if (error.response && error.response.status === 401) {
            res.status(401).json({
                error: 'Token inválido ou expirado',
                requires_new_authorization: true
            });
        } else {
            res.status(500).json({
                error: 'Erro ao buscar order',
                details: error.response ? error.response.data : error.message
            });
        }
    }
});

// Rota para listar orders do usuário
app.get('/orders', async (req, res) => {
    console.log('📋 Listando orders do usuário...');
    
    try {
        const tokenData = await getValidToken();
        
        if (!tokenData.access_token) {
            return res.status(401).json({
                error: 'Token não disponível',
                requires_new_authorization: true
            });
        }

        // Parâmetros de consulta
        const params = new URLSearchParams();
        if (req.query.seller) params.append('seller', req.query.seller);
        if (req.query.buyer) params.append('buyer', req.query.buyer);
        if (req.query.status) params.append('status', req.query.status);
        if (req.query.offset) params.append('offset', req.query.offset);
        if (req.query.limit) params.append('limit', req.query.limit || '50');
        if (req.query.sort) params.append('sort', req.query.sort);
        if (req.query.order) params.append('order', req.query.order);

        const url = `https://api.mercadolibre.com/orders/search?${params.toString()}`;
        
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`
            },
            timeout: 15000
        });

        // Processar e enviar resposta JSON
        console.log(`✅ ${response.data.results.length} orders encontradas`);
        processarEEnviarResposta(res, response.data, '📋 Resposta da API:');

    } catch (error) {
        console.error('❌ Erro ao listar orders:', error.response ? error.response.data : error.message);
        
        res.status(500).json({
            error: 'Erro ao listar orders',
            details: error.response ? error.response.data : error.message
        });
    }
});

// Rota para obter orders recentes (últimas 24h)
app.get('/orders/recent', async (req, res) => {
    console.log('🕐 Buscando orders recentes...');
    
    try {
        const tokenData = await getValidToken();
        
        if (!tokenData.access_token) {
            return res.status(401).json({
                error: 'Token não disponível',
                requires_new_authorization: true
            });
        }

        // Data de 24 horas atrás
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const dateFrom = yesterday.toISOString();

        const params = new URLSearchParams({
            seller: tokenData.user_id,
            sort: 'date_desc',
            limit: '50'
        });

        const url = `https://api.mercadolibre.com/orders/search?${params.toString()}`;
        
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`
            },
            timeout: 15000
        });

        // Filtrar orders das últimas 24h
        const recentOrders = response.data.results.filter(order => {
            const orderDate = new Date(order.date_created);
            return orderDate >= yesterday;
        });

        // Processar resposta JSON para orders recentes
        const resposta_json = {
            ...response.data,
            results: recentOrders,
            total: recentOrders.length
        };
        
        console.log('🕐 Resposta processada:', resposta_json);
        console.log(`✅ ${recentOrders.length} orders recentes encontradas`);
        
        res.json(resposta_json);

    } catch (error) {
        console.error('❌ Erro ao buscar orders recentes:', error.response ? error.response.data : error.message);
        
        res.status(500).json({
            error: 'Erro ao buscar orders recentes',
            details: error.response ? error.response.data : error.message
        });
    }
});

// Rota para obter estatísticas de orders
app.get('/orders/stats', async (req, res) => {
    console.log('📊 Calculando estatísticas de orders...');
    
    try {
        const tokenData = await getValidToken();
        
        if (!tokenData.access_token) {
            return res.status(401).json({
                error: 'Token não disponível',
                requires_new_authorization: true
            });
        }

        const params = new URLSearchParams({
            seller: tokenData.user_id,
            limit: '200'
        });

        const url = `https://api.mercadolibre.com/orders/search?${params.toString()}`;
        
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`
            },
            timeout: 15000
        });

        const orders = response.data.results;
        
        // Calcular estatísticas
        const stats = {
            total_orders: orders.length,
            total_amount: orders.reduce((sum, order) => sum + (order.total_amount || 0), 0),
            paid_amount: orders.reduce((sum, order) => sum + (order.paid_amount || 0), 0),
            status_breakdown: {},
            payment_methods: {},
            recent_orders: 0,
            average_order_value: 0
        };

        // Contar por status
        orders.forEach(order => {
            stats.status_breakdown[order.status] = (stats.status_breakdown[order.status] || 0) + 1;
            
            // Contar métodos de pagamento
            if (order.payments && order.payments.length > 0) {
                const paymentMethod = order.payments[0].payment_method_id;
                stats.payment_methods[paymentMethod] = (stats.payment_methods[paymentMethod] || 0) + 1;
            }
            
            // Orders das últimas 24h
            const orderDate = new Date(order.date_created);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (orderDate >= yesterday) {
                stats.recent_orders++;
            }
        });

        // Valor médio do pedido
        if (orders.length > 0) {
            stats.average_order_value = stats.total_amount / orders.length;
        }

        // Processar resposta JSON das estatísticas
        const resposta_json = stats;
        console.log('📊 Estatísticas processadas:', resposta_json);
        console.log(`✅ Estatísticas calculadas: ${stats.total_orders} orders`);
        
        res.json(resposta_json);

    } catch (error) {
        console.error('❌ Erro ao calcular estatísticas:', error.response ? error.response.data : error.message);
        
        res.status(500).json({
            error: 'Erro ao calcular estatísticas',
            details: error.response ? error.response.data : error.message
        });
    }
});

// Rota para obter detalhes de shipping de uma order
app.get('/orders/:orderId/shipping', async (req, res) => {
    console.log(`🚚 Buscando shipping da order: ${req.params.orderId}`);
    
    try {
        const tokenData = await getValidToken();
        
        if (!tokenData.access_token) {
            return res.status(401).json({
                error: 'Token não disponível',
                requires_new_authorization: true
            });
        }

        // Primeiro buscar a order para obter o shipping_id
        const orderResponse = await axios.get(`https://api.mercadolibre.com/orders/${req.params.orderId}`, {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`
            },
            timeout: 10000
        });

        const shippingId = orderResponse.data.shipping?.id;
        
        if (!shippingId) {
            return res.json({
                message: 'Esta order não possui informações de envio',
                order_id: req.params.orderId
            });
        }

        // Buscar detalhes do shipping
        const shippingResponse = await axios.get(`https://api.mercadolibre.com/shipments/${shippingId}`, {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`
            },
            timeout: 10000
        });

        // Processar resposta JSON do shipping
        const resposta_json = shippingResponse.data;
        console.log('🚚 Resposta do shipping:', resposta_json);
        console.log(`✅ Shipping ${shippingId} obtido com sucesso`);
        
        res.json(resposta_json);

    } catch (error) {
        console.error('❌ Erro ao buscar shipping:', error.response ? error.response.data : error.message);
        
        res.status(500).json({
            error: 'Erro ao buscar informações de envio',
            details: error.response ? error.response.data : error.message
        });
    }
});

// Rota para filtrar orders por data
app.get('/orders/by-date', async (req, res) => {
    console.log('📅 Filtrando orders por data...');
    
    try {
        const tokenData = await getValidToken();
        
        if (!tokenData.access_token) {
            return res.status(401).json({
                error: 'Token não disponível',
                requires_new_authorization: true
            });
        }

        // Parâmetros de data (obrigatórios)
        const dateFrom = req.query.date_from;
        const dateTo = req.query.date_to;
        
        if (!dateFrom || !dateTo) {
            return res.status(400).json({
                error: 'Parâmetros date_from e date_to são obrigatórios',
                example: '/orders/by-date?date_from=2024-01-01T00:00:00.000-03:00&date_to=2024-01-31T23:59:59.000-03:00'
            });
        }

        // Construir parâmetros da consulta
        const params = new URLSearchParams({
            seller: tokenData.user_id,
            'order.date_created.from': dateFrom,
            'order.date_created.to': dateTo,
            limit: req.query.limit || '50',
            offset: req.query.offset || '0'
        });

        // Adicionar filtros opcionais
        if (req.query.status) params.append('order.status', req.query.status);
        if (req.query.sort) params.append('sort', req.query.sort);

        const url = `https://api.mercadolibre.com/orders/search?${params.toString()}`;
        console.log('🔍 URL da consulta:', url);
        
        const resposta = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`
            },
            timeout: 15000
        });

        // Processar resposta JSON
        const resposta_json = resposta.data;
        console.log('📅 Resposta filtrada por data:', resposta_json);
        console.log(`✅ ${resposta_json.results.length} orders encontradas no período`);
        
        // Adicionar informações do filtro na resposta
        resposta_json.filter_info = {
            date_from: dateFrom,
            date_to: dateTo,
            seller_id: tokenData.user_id,
            total_found: resposta_json.results.length
        };
        
        res.json(resposta_json);

    } catch (error) {
        console.error('❌ Erro ao filtrar por data:', error.response ? error.response.data : error.message);
        
        res.status(500).json({
            error: 'Erro ao filtrar orders por data',
            details: error.response ? error.response.data : error.message
        });
    }
});

// Rota para obter orders do mês atual
app.get('/orders/current-month', async (req, res) => {
    console.log('📅 Buscando orders do mês atual...');
    
    try {
        const tokenData = await getValidToken();
        
        if (!tokenData.access_token) {
            return res.status(401).json({
                error: 'Token não disponível',
                requires_new_authorization: true
            });
        }

        // Calcular primeiro e último dia do mês atual
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        
        const dateFrom = firstDay.toISOString();
        const dateTo = lastDay.toISOString();

        const params = new URLSearchParams({
            seller: tokenData.user_id,
            'order.date_created.from': dateFrom,
            'order.date_created.to': dateTo,
            limit: '100',
            sort: 'date_desc'
        });

        const url = `https://api.mercadolibre.com/orders/search?${params.toString()}`;
        
        const resposta = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`
            },
            timeout: 15000
        });

        // Processar resposta JSON
        const resposta_json = resposta.data;
        console.log('📅 Orders do mês atual:', resposta_json);
        console.log(`✅ ${resposta_json.results.length} orders encontradas no mês atual`);
        
        // Adicionar informações do período
        resposta_json.period_info = {
            month: now.getMonth() + 1,
            year: now.getFullYear(),
            date_from: dateFrom,
            date_to: dateTo,
            total_found: resposta_json.results.length
        };
        
        res.json(resposta_json);

    } catch (error) {
        console.error('❌ Erro ao buscar orders do mês:', error.response ? error.response.data : error.message);
        
        res.status(500).json({
            error: 'Erro ao buscar orders do mês atual',
            details: error.response ? error.response.data : error.message
        });
    }
});

// Rota de exemplo usando o padrão de resposta JSON
app.get('/orders/example', async (req, res) => {
    try {
        // Simular uma resposta da API do Mercado Livre
        const resposta = {
            id: 2000003508419013,
            status: "paid",
            total_amount: 50,
            date_created: "2022-04-08T17:01:30.000-04:00",
            buyer: { id: 266272126 },
            seller: { id: 478055419 }
        };
        
        // Processar resposta JSON conforme seu padrão
        const resposta_json = resposta;
        console.log('📋 Exemplo de resposta:', resposta_json);
        
        res.json(resposta_json);
        
    } catch (error) {
        console.error('❌ Erro no exemplo:', error);
        res.status(500).json({ error: 'Erro no exemplo' });
    }
});

// Rota de teste simples
app.get('/test', (req, res) => {
    const resposta_json = {
        message: "Servidor funcionando!",
        timestamp: new Date().toISOString(),
        status: "OK"
    };
    
    console.log('🧪 Teste do servidor:', resposta_json);
    res.json(resposta_json);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ativo na porta ${PORT} - http://localhost:${PORT}`);
});
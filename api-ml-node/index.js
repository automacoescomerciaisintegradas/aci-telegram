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
        version: "2.0.0",
        description: "API para integração com Mercado Livre com gerenciamento automático de tokens",
        endpoints: {
            "/": "Página inicial",
            "/api-ml": "Informações da API",
            "/generateAuthUrl": "Gerar URL de autorização com PKCE (GET)",
            "/getAccessToken": "Obter Access Token do Mercado Livre (POST)",
            "/refreshToken": "Renovar Access Token usando Refresh Token (POST)",
            "/tokenStatus": "Verificar status do token atual (GET)",
            "/getValidToken": "Obter token válido (renova automaticamente se necessário) (GET)",
            "/forceRenewToken": "Forçar renovação do token (POST)",
            "/test": "Página de teste"
        },
        features: [
            "Armazenamento seguro de tokens no arquivo .env",
            "Validação automática de tokens",
            "Renovação automática quando necessário",
            "Fluxo PKCE para segurança"
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

// Rota de teste simples
app.get('/test', (req, res) => {
    res.json({
        message: "Servidor funcionando!",
        timestamp: new Date().toISOString(),
        status: "OK"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ativo na porta ${PORT} - http://localhost:${PORT}`);
});
# 📚 Exemplos de Uso da API

## 🔧 Configuração Básica

### JavaScript/Node.js
```javascript
const API_BASE = 'http://localhost:3000';

// Função auxiliar para fazer requisições
async function apiRequest(endpoint, options = {}) {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    return await response.json();
}
```

### Python
```python
import requests

API_BASE = 'http://localhost:3000'

def api_request(endpoint, method='GET', data=None):
    url = f"{API_BASE}{endpoint}"
    if method == 'GET':
        response = requests.get(url)
    else:
        response = requests.post(url, json=data)
    return response.json()
```

### cURL
```bash
# Definir URL base
API_BASE="http://localhost:3000"
```

## 🚀 Exemplos Práticos

### 1. Verificar Status do Token

#### JavaScript
```javascript
async function checkTokenStatus() {
    try {
        const status = await apiRequest('/tokenStatus');
        console.log('Status do token:', status.status);
        console.log('Expira em:', status.expires_in_minutes, 'minutos');
        
        if (status.status === 'expired') {
            console.log('⚠️ Token expirado - será renovado automaticamente');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

checkTokenStatus();
```

#### Python
```python
def check_token_status():
    status = api_request('/tokenStatus')
    print(f"Status do token: {status['status']}")
    print(f"Expira em: {status['expires_in_minutes']} minutos")
    
    if status['status'] == 'expired':
        print("⚠️ Token expirado - será renovado automaticamente")

check_token_status()
```

#### cURL
```bash
curl -X GET "$API_BASE/tokenStatus" | jq '.'
```

### 2. Obter Token Válido (Recomendado)

#### JavaScript
```javascript
async function getValidToken() {
    try {
        const tokenData = await apiRequest('/getValidToken');
        
        if (tokenData.access_token) {
            console.log('✅ Token válido obtido');
            console.log('Expira em:', tokenData.expires_in, 'segundos');
            return tokenData.access_token;
        } else {
            console.log('❌ Nova autorização necessária');
            return null;
        }
    } catch (error) {
        console.error('Erro ao obter token:', error);
        return null;
    }
}

// Usar o token
const token = await getValidToken();
if (token) {
    // Fazer chamadas para API do Mercado Livre
    console.log('Token pronto para uso:', token.substring(0, 20) + '...');
}
```

#### Python
```python
def get_valid_token():
    token_data = api_request('/getValidToken')
    
    if 'access_token' in token_data:
        print("✅ Token válido obtido")
        print(f"Expira em: {token_data['expires_in']} segundos")
        return token_data['access_token']
    else:
        print("❌ Nova autorização necessária")
        return None

# Usar o token
token = get_valid_token()
if token:
    print(f"Token pronto para uso: {token[:20]}...")
```

#### cURL
```bash
TOKEN=$(curl -s -X GET "$API_BASE/getValidToken" | jq -r '.access_token')
echo "Token obtido: ${TOKEN:0:20}..."
```

### 3. Usar Token com API do Mercado Livre

#### JavaScript
```javascript
async function getUserInfo() {
    const token = await getValidToken();
    
    if (!token) {
        console.log('Token não disponível');
        return;
    }
    
    try {
        const response = await fetch('https://api.mercadolibre.com/users/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const userData = await response.json();
        console.log('Dados do usuário:', userData);
    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
    }
}

getUserInfo();
```

#### Python
```python
import requests

def get_user_info():
    token = get_valid_token()
    
    if not token:
        print("Token não disponível")
        return
    
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get('https://api.mercadolibre.com/users/me', headers=headers)
    
    if response.status_code == 200:
        user_data = response.json()
        print("Dados do usuário:", user_data)
    else:
        print("Erro ao buscar dados do usuário:", response.status_code)

get_user_info()
```

#### cURL
```bash
# Obter token e usar com API do ML
TOKEN=$(curl -s -X GET "$API_BASE/getValidToken" | jq -r '.access_token')
curl -H "Authorization: Bearer $TOKEN" https://api.mercadolibre.com/users/me
```

### 4. Renovar Token Manualmente

#### JavaScript
```javascript
async function forceTokenRenewal() {
    try {
        const newToken = await apiRequest('/forceRenewToken', {
            method: 'POST'
        });
        
        if (newToken.access_token) {
            console.log('✅ Token renovado com sucesso');
            console.log('Novo token expira em:', newToken.expires_in, 'segundos');
        } else {
            console.log('❌ Erro na renovação:', newToken.error);
        }
    } catch (error) {
        console.error('Erro ao renovar token:', error);
    }
}

forceTokenRenewal();
```

#### Python
```python
def force_token_renewal():
    new_token = api_request('/forceRenewToken', method='POST')
    
    if 'access_token' in new_token:
        print("✅ Token renovado com sucesso")
        print(f"Novo token expira em: {new_token['expires_in']} segundos")
    else:
        print(f"❌ Erro na renovação: {new_token.get('error', 'Erro desconhecido')}")

force_token_renewal()
```

#### cURL
```bash
curl -X POST "$API_BASE/forceRenewToken" | jq '.'
```

## 🔄 Exemplo de Aplicação Completa

### Sistema de Monitoramento de Tokens

#### JavaScript
```javascript
class MercadoLivreTokenManager {
    constructor(apiBase = 'http://localhost:3000') {
        this.apiBase = apiBase;
        this.currentToken = null;
    }
    
    async getToken() {
        try {
            const response = await fetch(`${this.apiBase}/getValidToken`);
            const tokenData = await response.json();
            
            if (tokenData.access_token) {
                this.currentToken = tokenData.access_token;
                return this.currentToken;
            }
            
            throw new Error('Token não disponível');
        } catch (error) {
            console.error('Erro ao obter token:', error);
            return null;
        }
    }
    
    async makeMLRequest(endpoint, options = {}) {
        const token = await this.getToken();
        
        if (!token) {
            throw new Error('Token não disponível');
        }
        
        const response = await fetch(`https://api.mercadolibre.com${endpoint}`, {
            ...options,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        return await response.json();
    }
    
    async getUserInfo() {
        return await this.makeMLRequest('/users/me');
    }
    
    async getItems() {
        return await this.makeMLRequest('/users/me/items/search');
    }
}

// Uso
const mlManager = new MercadoLivreTokenManager();

// Obter informações do usuário
mlManager.getUserInfo().then(user => {
    console.log('Usuário:', user.nickname);
});

// Obter itens
mlManager.getItems().then(items => {
    console.log('Total de itens:', items.paging.total);
});
```

### Monitoramento Contínuo

#### JavaScript
```javascript
async function monitorTokens() {
    setInterval(async () => {
        try {
            const status = await apiRequest('/tokenStatus');
            const now = new Date().toLocaleTimeString();
            
            console.log(`[${now}] Token status: ${status.status}`);
            console.log(`[${now}] Expira em: ${status.expires_in_minutes} minutos`);
            
            if (status.expires_in_minutes < 10) {
                console.log(`[${now}] ⚠️ Token expirando em breve!`);
            }
        } catch (error) {
            console.error('Erro no monitoramento:', error);
        }
    }, 60000); // Verifica a cada minuto
}

monitorTokens();
```

## 🛠️ Utilitários

### Função para Testar Conectividade

#### JavaScript
```javascript
async function testConnection() {
    try {
        const response = await apiRequest('/test');
        console.log('✅ Servidor conectado:', response.message);
        return true;
    } catch (error) {
        console.log('❌ Servidor desconectado:', error.message);
        return false;
    }
}
```

### Função para Obter Informações da API

#### JavaScript
```javascript
async function getAPIInfo() {
    try {
        const info = await apiRequest('/api-ml');
        console.log('📋 Informações da API:');
        console.log('Nome:', info.name);
        console.log('Versão:', info.version);
        console.log('Endpoints disponíveis:');
        Object.entries(info.endpoints).forEach(([endpoint, description]) => {
            console.log(`  ${endpoint}: ${description}`);
        });
    } catch (error) {
        console.error('Erro ao obter informações:', error);
    }
}
```

## 🚨 Tratamento de Erros

### Exemplo Robusto com Retry

#### JavaScript
```javascript
async function robustTokenRequest(maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const token = await apiRequest('/getValidToken');
            
            if (token.access_token) {
                return token.access_token;
            }
            
            if (token.requires_new_authorization) {
                throw new Error('Nova autorização necessária');
            }
            
        } catch (error) {
            console.log(`Tentativa ${attempt}/${maxRetries} falhou:`, error.message);
            
            if (attempt === maxRetries) {
                throw error;
            }
            
            // Aguarda antes de tentar novamente
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
    }
}
```

Estes exemplos cobrem os principais casos de uso do sistema de gerenciamento de tokens. Use-os como base para suas integrações!
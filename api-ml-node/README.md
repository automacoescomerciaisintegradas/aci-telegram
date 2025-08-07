# API Mercado Livre - Gerenciamento Automático de Tokens

![GitHub](https://img.shields.io/github/license/seuusuario/api-mercado-livre-tokens)
![GitHub package.json version](https://img.shields.io/github/package-json/v/seuusuario/api-mercado-livre-tokens)
![GitHub last commit](https://img.shields.io/github/last-commit/seuusuario/api-mercado-livre-tokens)
![Node.js](https://img.shields.io/badge/node.js-%3E%3D14.0.0-brightgreen)
![Express.js](https://img.shields.io/badge/express.js-4.18.0-blue)

Sistema completo para integração com a API do Mercado Livre, incluindo gerenciamento automático de tokens OAuth2 com fluxo PKCE (Proof Key for Code Exchange).

## ⭐ Se este projeto te ajudou, deixe uma estrela!

[![GitHub stars](https://img.shields.io/github/stars/seuusuario/api-mercado-livre-tokens?style=social)](https://github.com/seuusuario/api-mercado-livre-tokens/stargazers)

## 🚀 Funcionalidades

- ✅ **Fluxo PKCE**: Implementação segura do OAuth2
- ✅ **Gerenciamento Automático**: Validação e renovação automática de tokens
- ✅ **Armazenamento Seguro**: Dados sensíveis protegidos no arquivo `.env`
- ✅ **Interface Web**: Dashboard para gerenciar tokens
- ✅ **API RESTful**: Endpoints para integração com outras aplicações

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- NPM ou Yarn
- Aplicação registrada no Mercado Livre Developers

## 🛠️ Instalação

1. **Clone o repositório:**
```bash
git clone <seu-repositorio>
cd api-ml-node
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
Crie um arquivo `.env` na raiz do projeto:
```env
# Configurações do Mercado Livre
ML_APP_ID=SEU_APP_ID_AQUI
ML_CLIENT_SECRET=SUA_CHAVE_SECRETA_AQUI
ML_REDIRECT_URI=https://www.seudominio.com.br

# Tokens (serão atualizados automaticamente)
ML_ACCESS_TOKEN=
ML_REFRESH_TOKEN=
ML_TOKEN_EXPIRES_AT=
ML_USER_ID=
```

4. **Inicie o servidor:**
```bash
npm start
# ou
node index.js
```

O servidor estará disponível em `http://localhost:3000`

## 🔧 Configuração Inicial

### 1. Registrar Aplicação no Mercado Livre

1. Acesse [Mercado Livre Developers](https://developers.mercadolivre.com.br/)
2. Crie uma nova aplicação
3. Configure a URI de redirecionamento: `https://www.seudominio.com.br`
4. Anote o **App ID** e **Client Secret**

### 2. Primeira Autorização

1. Acesse `http://localhost:3000/`
2. Clique em "Gerar URL de Autorização"
3. Autorize a aplicação no Mercado Livre
4. Cole o código de autorização (TG-xxxxxxx)
5. Clique em "Obter Tokens"

Os tokens serão salvos automaticamente no arquivo `.env`.

## 📚 API Endpoints

### Autorização

#### `GET /generateAuthUrl`
Gera URL de autorização com PKCE.

**Resposta:**
```json
{
  "success": true,
  "authUrl": "https://auth.mercadolivre.com.br/authorization?...",
  "state": "abc123...",
  "code_verifier": "xyz789...",
  "message": "URL de autorização gerada com PKCE"
}
```

#### `POST /getAccessToken`
Obtém tokens usando código de autorização.

**Body:**
```json
{
  "code": "TG-xxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxx",
  "state": "abc123...",
  "code_verifier": "xyz789..."
}
```

**Resposta:**
```json
{
  "access_token": "APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxx",
  "token_type": "Bearer",
  "expires_in": 21600,
  "scope": "offline_access read write",
  "user_id": 12345678,
  "refresh_token": "TG-xxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxx"
}
```

### Gerenciamento de Tokens

#### `GET /tokenStatus`
Verifica status do token atual.

**Resposta:**
```json
{
  "status": "valid",
  "message": "Token válido",
  "expires_in_minutes": 320,
  "expires_at": "2025-08-07T23:30:00.000Z",
  "has_refresh_token": true,
  "user_id": "12345678"
}
```

#### `GET /getValidToken`
Obtém token válido (renova automaticamente se necessário).

**Resposta:**
```json
{
  "access_token": "APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxx",
  "token_type": "Bearer",
  "expires_in": 19200,
  "user_id": 12345678,
  "refresh_token": "TG-xxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxx"
}
```

#### `POST /refreshToken`
Renova token usando refresh_token.

**Body:**
```json
{
  "refresh_token": "TG-xxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxx"
}
```

#### `POST /forceRenewToken`
Força renovação do token armazenado.

### Utilitários

#### `GET /api-ml`
Informações da API e endpoints disponíveis.

#### `GET /test`
Teste de conectividade do servidor.

## 🔄 Fluxo Automático de Tokens

O sistema implementa um fluxo inteligente de gerenciamento:

```
┌─────────────────┐
│ Requisição para │
│ /getValidToken  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐    SIM    ┌─────────────────┐
│ Token é válido? │ ────────► │ Retorna token   │
│ (>5min restante)│           │ atual           │
└─────────┬───────┘           └─────────────────┘
          │ NÃO
          ▼
┌─────────────────┐    SIM    ┌─────────────────┐
│ Tem refresh     │ ────────► │ Renova token    │
│ token?          │           │ automaticamente │
└─────────┬───────┘           └─────────┬───────┘
          │ NÃO                         │
          ▼                             ▼
┌─────────────────┐           ┌─────────────────┐
│ Erro: Nova      │           │ Salva no .env e │
│ autorização     │           │ retorna novo    │
│ necessária      │           │ token           │
└─────────────────┘           └─────────────────┘
```

## 🔐 Segurança

### Arquivo .env
Todos os dados sensíveis são armazenados no arquivo `.env`:
- App ID e Client Secret
- Access Token e Refresh Token
- Timestamps de expiração

### .gitignore
O arquivo `.env` está incluído no `.gitignore` para evitar commit acidental de dados sensíveis.

### PKCE (Proof Key for Code Exchange)
Implementação do padrão PKCE para maior segurança na autorização OAuth2.

## 🖥️ Interface Web

Acesse `http://localhost:3000/` para usar a interface web que inclui:

- **Geração de URL de Autorização**: Com PKCE automático
- **Obtenção de Tokens**: Interface amigável para autorização
- **Gerenciamento Automático**: Verificação e renovação de tokens
- **Status em Tempo Real**: Monitoramento do estado dos tokens

## 📝 Exemplos de Uso

### Uso Básico (Recomendado)
```javascript
// Sempre obter token válido (renova automaticamente se necessário)
const response = await fetch('http://localhost:3000/getValidToken');
const tokenData = await response.json();

if (tokenData.access_token) {
    // Use o token para chamadas à API do Mercado Livre
    const apiResponse = await fetch('https://api.mercadolibre.com/users/me', {
        headers: {
            'Authorization': `Bearer ${tokenData.access_token}`
        }
    });
}
```

### Verificação de Status
```javascript
const response = await fetch('http://localhost:3000/tokenStatus');
const status = await response.json();

console.log(`Token status: ${status.status}`);
console.log(`Expira em: ${status.expires_in_minutes} minutos`);
```

### Renovação Forçada
```javascript
const response = await fetch('http://localhost:3000/forceRenewToken', {
    method: 'POST'
});
const newToken = await response.json();
```

## 🚨 Tratamento de Erros

### Token Expirado sem Refresh Token
```json
{
  "error": "Token inválido e não foi possível renovar. Nova autorização necessária.",
  "requires_new_authorization": true
}
```

### Refresh Token Inválido
```json
{
  "error": "Refresh token não encontrado. É necessário fazer nova autorização.",
  "requires_new_authorization": true
}
```

## 🔧 Configurações Avançadas

### Timeout de Requisições
Por padrão, as requisições têm timeout de 10 segundos. Para alterar:

```javascript
// No arquivo index.js
const resposta = await axios.post(url_principal, dados, {
    headers: headers,
    timeout: 15000 // 15 segundos
});
```

### Margem de Segurança
O sistema renova tokens com 5 minutos de antecedência. Para alterar:

```javascript
// No arquivo index.js, função isTokenValid()
if (timeUntilExpiry <= 300000) { // 5 minutos = 300000ms
    // Altere para o valor desejado em milissegundos
}
```

## 📊 Monitoramento

### Logs do Sistema
O sistema gera logs detalhados:
- ✅ Token válido - expira em X minutos
- ⚠️ Token expira em X minutos - precisa renovar
- 🔄 Renovando token automaticamente...
- ❌ Token não encontrado

### Status Codes
- `200`: Sucesso
- `400`: Erro de validação ou token inválido
- `500`: Erro interno do servidor

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request



## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Contato

Desenvolvido por **Automações Comerciais** - Especialistas em integrações Mercado Livre

Para suporte: [CONTACT.md](CONTACT.md) | [contato@automacoescomerciais.com.br](mailto:contato@automacoescomerciais.com.br)

## 🆘 Suporte

Para suporte e dúvidas:
1. Verifique a documentação oficial do [Mercado Livre Developers](https://developers.mercadolivre.com.br/)
2. Consulte os logs do sistema
3. Teste os endpoints individualmente
4. Crie uma [Issue no GitHub](https://github.com/seuusuario/api-mercado-livre-tokens/issues)
5. Consulte [CONTACT.md](CONTACT.md) para mais opções de contato

## 📈 Roadmap

- [ ] Implementar cache em memória para tokens
- [ ] Adicionar webhook para notificações
- [ ] Criar SDK para diferentes linguagens
- [ ] Implementar rate limiting
- [ ] Adicionar métricas e analytics
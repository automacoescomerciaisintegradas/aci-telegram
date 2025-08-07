# 🚀 Guia de Configuração Rápida

## Passo 1: Configuração no Mercado Livre Developers

1. **Acesse**: https://developers.mercadolivre.com.br/
2. **Faça login** com sua conta do Mercado Livre
3. **Crie uma nova aplicação**:
   - Nome: `Sua Aplicação`
   - Descrição: `Sistema de integração`
   - URI de redirecionamento: `https://www.seudominio.com.br`
4. **Anote os dados**:
   - **App ID**: `1234567890123456` (exemplo)
   - **Client Secret**: `AbCdEf123456789` (exemplo)

## Passo 2: Configuração do Projeto

1. **Copie o arquivo de exemplo**:
```bash
cp .env.example .env
```

2. **Edite o arquivo `.env`**:
```env
ML_APP_ID=1234567890123456
ML_CLIENT_SECRET=AbCdEf123456789
ML_REDIRECT_URI=https://www.seudominio.com.br
```

## Passo 3: Primeira Execução

1. **Instale dependências**:
```bash
npm install
```

2. **Inicie o servidor**:
```bash
npm start
```

3. **Acesse**: http://localhost:3000

## Passo 4: Autorização Inicial

1. **Clique em**: "Gerar URL de Autorização"
2. **Autorize** no Mercado Livre
3. **Copie o código** da URL (TG-xxxxxxx)
4. **Cole e clique**: "Obter Tokens"

## ✅ Pronto!

Seu sistema está configurado e os tokens serão gerenciados automaticamente.

## 🔧 Scripts Úteis

```bash
# Verificar status do token
npm run status

# Obter token válido
npm run token

# Testar servidor
npm run test

# Desenvolvimento com auto-reload
npm run dev
```

## 🆘 Problemas Comuns

### Erro: "App ID inválido"
- Verifique se o App ID está correto no arquivo `.env`
- Confirme se a aplicação está ativa no Mercado Livre Developers

### Erro: "URI de redirecionamento inválida"
- Verifique se a URI no `.env` é exatamente igual à configurada no Mercado Livre
- Certifique-se de usar HTTPS (exceto localhost)

### Erro: "Token expirado"
- Use `GET /getValidToken` - ele renova automaticamente
- Se não funcionar, faça nova autorização

### Erro: "Refresh token inválido"
- Faça nova autorização completa
- Verifique se não alterou manualmente o arquivo `.env`
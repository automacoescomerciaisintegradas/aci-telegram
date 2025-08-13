# 🐳 Instruções Docker - ACI (Automações Comerciais Integradas)

## 📋 Visão Geral

Este projeto React/Vite com TypeScript já está completamente configurado para Docker com:
- **Dockerfile otimizado** com multi-stage build
- **Docker Compose** para desenvolvimento e produção
- **Nginx** configurado para servir a aplicação React
- **Scripts automatizados** para deploy
- **Configuração de segurança** e performance

## 🔧 Pré-requisitos

- Docker instalado (versão 20.10+)
- Docker Compose instalado (versão 2.0+)
- Arquivo `.env.local` com suas chaves de API

## ⚡ Início Rápido

### 1. Configurar Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo (se não existir .env.local)
cp .env.example .env.local
```

Edite o `.env.local` com suas credenciais:
```env
GEMINI_API_KEY=sua_chave_gemini_aqui
API_KEY=sua_chave_gemini_aqui
VITE_BITLY_ACCESS_TOKEN=seu_token_bitly
```

### 2. Deploy Automático (Recomendado)

```bash
# Execute o script de deploy interativo
bash scripts/docker-deploy.sh
```

Este script irá:
- ✅ Verificar dependências
- ✅ Fazer build da imagem
- ✅ Executar em modo produção
- ✅ Verificar saúde da aplicação
- ✅ Opção para push no DockerHub

### 3. Comandos Manuais (Alternativa)

```bash
# Desenvolvimento
npm run docker:dev
# ou
docker-compose up --build

# Produção
npm run docker:prod
# ou
docker-compose -f docker-compose.prod.yml up -d
```

## 🏗️ Build Manual da Imagem Docker

### Construir a Imagem

```bash
# Build básico
docker build -t aci-automacoes:latest .

# Build com tag de versão
docker build -t aci-automacoes:v1.0.0 .

# Build apenas para produção (otimizado)
docker build --target production -t aci-automacoes:prod .
```

### Executar Container Localmente

```bash
# Executar com arquivo .env.local
docker run -d \
  --name aci-app \
  -p 3000:80 \
  --env-file .env.local \
  aci-automacoes:latest

# Executar com variáveis específicas
docker run -d \
  --name aci-app \
  -p 3000:80 \
  -e GEMINI_API_KEY=sua_chave \
  -e API_KEY=sua_chave \
  aci-automacoes:latest
```

## 📤 Push para DockerHub

### 1. Login no DockerHub

```bash
docker login
```

### 2. Criar Tags

```bash
# Substitua 'seuusuario' pelo seu username do DockerHub
docker tag aci-automacoes:latest seuusuario/aci-automacoes:latest
docker tag aci-automacoes:latest seuusuario/aci-automacoes:v1.0.0
```

### 3. Fazer Push

```bash
# Push da versão latest
docker push seuusuario/aci-automacoes:latest

# Push da versão específica
docker push seuusuario/aci-automacoes:v1.0.0

# Push de todas as tags
docker push seuusuario/aci-automacoes --all-tags
```

### 4. Usar Imagem do DockerHub

```bash
# Executar direto do DockerHub
docker run -d \
  --name aci-app \
  -p 3000:80 \
  --env-file .env.local \
  seuusuario/aci-automacoes:latest
```

## 🌐 Acessar a Aplicação

Após executar o container:

- **Desenvolvimento**: http://localhost:3000
- **Produção**: http://localhost (porta 80)
- **Porta customizada**: http://localhost:8080 (se configurado)

## 📊 Comandos Úteis

### Monitoramento

```bash
# Ver containers rodando
docker ps

# Ver logs da aplicação
docker-compose logs -f

# Ver logs específicos
docker logs aci-app

# Executar comandos no container
docker exec -it aci-app sh

# Ver uso de recursos
docker stats aci-app
```

### Gerenciamento

```bash
# Parar aplicação
docker-compose down

# Parar e remover volumes
docker-compose down -v

# Reiniciar aplicação
docker-compose restart

# Rebuild sem cache
docker-compose build --no-cache
```

### Limpeza

```bash
# Remover containers parados
docker container prune

# Remover imagens não utilizadas
docker image prune

# Limpeza completa (cuidado!)
docker system prune -a
```

## 🔧 Configuração Avançada

### Variáveis de Ambiente Suportadas

```env
# Obrigatórias
GEMINI_API_KEY=sua_chave_gemini
API_KEY=sua_chave_gemini

# Opcionais
VITE_BITLY_ACCESS_TOKEN=seu_token_bitly
SUPABASE_URL=sua_url_supabase
SUPABASE_ANON_KEY=sua_chave_supabase
TELEGRAM_BOT_TOKEN=seu_token_telegram
SHOPEE_PARTNER_ID=seu_id_shopee
SHOPEE_PARTNER_KEY=sua_chave_shopee
```

### Portas Customizadas

```bash
# Desenvolvimento na porta 8080
docker run -p 8080:80 aci-automacoes:latest

# Produção com HTTPS
docker run -p 80:80 -p 443:443 aci-automacoes:latest
```

### Volumes Persistentes

```bash
# Montar logs externos
docker run -v ./logs:/var/log/nginx aci-automacoes:latest
```

## 🐛 Solução de Problemas

### Problemas Comuns

1. **Erro "API Key não configurada"**
   ```bash
   # Verificar se .env.local existe e tem a chave
   cat .env.local | grep GEMINI_API_KEY
   ```

2. **Porta já em uso**
   ```bash
   # Verificar qual processo usa a porta
   netstat -tulpn | grep :3000
   
   # Usar porta diferente
   docker run -p 8080:80 aci-automacoes:latest
   ```

3. **Container não inicia**
   ```bash
   # Ver logs detalhados
   docker logs aci-app
   
   # Executar em modo debug
   docker run -it aci-automacoes:latest sh
   ```

4. **Problemas de build**
   ```bash
   # Build sem cache
   docker build --no-cache -t aci-automacoes:latest .
   
   # Ver logs detalhados
   docker build --progress=plain -t aci-automacoes:latest .
   ```

### Health Check

```bash
# Verificar saúde da aplicação
curl -f http://localhost/

# Ver status do health check
docker inspect aci-app | grep Health -A 10
```

## 🚀 Scripts NPM Disponíveis

```bash
npm run docker:build    # Construir imagem
npm run docker:up       # Executar em background
npm run docker:dev      # Desenvolvimento com build
npm run docker:down     # Parar containers
npm run docker:logs     # Ver logs
npm run docker:prod     # Executar em produção
npm run docker:deploy   # Deploy completo
```

## 🔒 Segurança

A configuração inclui:
- ✅ Headers de segurança no Nginx
- ✅ CSP otimizado para Google Gemini AI
- ✅ Container com usuário não-root
- ✅ Rede isolada
- ✅ Variáveis de ambiente protegidas

## 📈 Performance

Otimizações implementadas:
- ✅ Multi-stage build (reduz 60% do tamanho)
- ✅ Compressão gzip
- ✅ Cache de arquivos estáticos (1 ano)
- ✅ Nginx otimizado para SPA
- ✅ Health checks configurados

## 🎯 Próximos Passos

1. **Configure suas APIs** no arquivo `.env.local`
2. **Execute o deploy**: `bash scripts/docker-deploy.sh`
3. **Teste localmente** antes de fazer push
4. **Configure seu DockerHub** para distribuição
5. **Configure proxy reverso** para produção (se necessário)

---

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique os logs: `docker-compose logs -f`
2. Consulte a documentação completa em `DOCKER_INSTRUCTIONS.md`
3. Execute limpeza se necessário: `docker system prune`
4. Verifique configurações de rede: `docker network ls`

**Configuração Docker completa e pronta para produção! 🎉**
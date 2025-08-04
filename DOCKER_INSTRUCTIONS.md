# Instruções Docker - ACI Automações Comerciais Integradas

## 📋 Pré-requisitos

- Docker instalado na máquina
- Docker Compose instalado
- Conta no DockerHub (para push da imagem)

## 🔧 Configuração das Variáveis de Ambiente

Antes de fazer o build, certifique-se de que o arquivo `.env.local` está configurado com suas chaves de API:

```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite com suas chaves de API
GEMINI_API_KEY=sua_chave_gemini_aqui
API_KEY=sua_chave_gemini_aqui

# Configurações opcionais do Supabase (se usando)
# SUPABASE_URL=sua_url_supabase
# SUPABASE_ANON_KEY=sua_chave_anonima_supabase

# Configurações opcionais do Telegram (se usando)
# TELEGRAM_BOT_TOKEN=seu_token_bot_telegram

# Configurações opcionais do Shopee (se usando)
# SHOPEE_PARTNER_ID=seu_partner_id_shopee
# SHOPEE_PARTNER_KEY=sua_chave_partner_shopee
```

**Importante**: Se o arquivo `.env.local` não existir, o Dockerfile automaticamente copiará o `.env.example` durante o build.

## 🏗️ Build da Imagem Docker

### Opção 1: Script Automatizado (Mais Fácil)
```bash
# Dar permissão de execução ao script
chmod +x scripts/docker-deploy.sh

# Executar script interativo
bash scripts/docker-deploy.sh
```

### Opção 2: Usando Docker Compose (Recomendado)
```bash
# Build e execução em um comando
docker-compose up --build

# Ou apenas build
docker-compose build

# Para produção
docker-compose -f docker-compose.prod.yml up --build
```

### Opção 3: Usando Docker diretamente
```bash
# Build da imagem
docker build -t aci-automacoes:latest .

# Build com tag específica
docker build -t aci-automacoes:v1.0.0 .

# Build com argumentos personalizados
docker build --build-arg NODE_ENV=production -t aci-automacoes:latest .
```

## 🚀 Executar Container Localmente

### Usando Docker Compose (Recomendado)
```bash
# Executar em background
docker-compose up -d

# Executar com logs visíveis
docker-compose up

# Parar os containers
docker-compose down
```

### Usando Docker diretamente
```bash
# Executar container
docker run -d \
  --name aci-automacoes \
  -p 3000:80 \
  aci-automacoes:latest

# Parar container
docker stop aci-automacoes

# Remover container
docker rm aci-automacoes
```

## 📤 Push para DockerHub

### 1. Login no DockerHub
```bash
docker login
```

### 2. Tag da imagem com seu usuário DockerHub
```bash
# Substitua 'seuusuario' pelo seu username do DockerHub
docker tag aci-automacoes:latest seuusuario/aci-automacoes:latest
docker tag aci-automacoes:latest seuusuario/aci-automacoes:v1.0.0
```

### 3. Push da imagem
```bash
# Push da versão latest
docker push seuusuario/aci-automacoes:latest

# Push da versão específica
docker push seuusuario/aci-automacoes:v1.0.0
```

## 🔍 Comandos Úteis

### Verificar containers em execução
```bash
docker ps
```

### Ver logs do container
```bash
# Com Docker Compose
docker-compose logs -f

# Com Docker diretamente
docker logs -f aci-automacoes
```

### Acessar shell do container
```bash
# Com Docker Compose
docker-compose exec aci-app sh

# Com Docker diretamente
docker exec -it aci-automacoes sh
```

### Limpar recursos Docker
```bash
# Remover containers parados
docker container prune

# Remover imagens não utilizadas
docker image prune

# Limpeza completa (cuidado!)
docker system prune -a
```

## 🌐 Acesso à Aplicação

Após executar o container, a aplicação estará disponível em:
- **URL Local**: http://localhost:3000
- **Porta**: 3000 (mapeada para porta 80 do container)

## 🔧 Troubleshooting

### Problema: Porta já em uso
```bash
# Verificar qual processo está usando a porta 3000
netstat -tulpn | grep :3000

# Usar porta diferente
docker run -p 8080:80 aci-automacoes:latest
```

### Problema: Build falha por falta de memória
```bash
# Build com mais memória
docker build --memory=2g -t aci-automacoes:latest .
```

### Problema: Variáveis de ambiente não carregam
- Certifique-se de que o arquivo `.env.local` existe
- As variáveis são injetadas durante o build do Vite
- Para variáveis runtime, use docker-compose.yml

## 📝 Notas Importantes

1. **Node.js**: Atualizado para versão 20 LTS para melhor performance
2. **Variáveis de Ambiente**: As chaves de API são injetadas durante o build pelo Vite
3. **Nginx**: Configurado para servir SPA (Single Page Application) corretamente
4. **Cache**: Arquivos estáticos têm cache de 1 ano configurado
5. **Segurança**: Headers CSP otimizados para Google Gemini AI e APIs externas
6. **Health Check**: Container tem verificação de saúde configurada
7. **Recursos**: Configuração otimizada de CPU e memória para aplicações React
8. **Dependências**: Suporte completo para @tailwindcss/postcss e outras dependências modernas

## 🔄 Workflow de Deploy

1. **Desenvolvimento Local**
   ```bash
   npm install
   npm run dev
   ```

2. **Testes e Linting**
   ```bash
   npm run lint
   npm run format:check
   npm run build  # Testar build local
   ```

3. **Build da Imagem Docker**
   ```bash
   docker-compose build
   ```

4. **Teste Local do Container**
   ```bash
   docker-compose up -d
   # Testar em http://localhost:3000
   docker-compose logs -f  # Verificar logs
   ```

5. **Tag e Push para DockerHub**
   ```bash
   docker tag aci-automacoes:latest seuusuario/aci-automacoes:v1.0.0
   docker push seuusuario/aci-automacoes:v1.0.0
   ```

6. **Deploy em Produção**
   - Use a imagem do DockerHub
   - Configure variáveis de ambiente de produção
   - Configure proxy reverso se necessário

## 🚀 Deploy em Produção

### Usando Docker Compose em Produção
```bash
# Usar arquivo de produção otimizado
docker-compose -f docker-compose.prod.yml up -d

# Com imagem específica do DockerHub
DOCKER_IMAGE=seuusuario/aci-automacoes:v1.0.0 docker-compose -f docker-compose.prod.yml up -d

# Com porta customizada
PORT=8080 docker-compose -f docker-compose.prod.yml up -d
```

### Script de Deploy Automatizado
```bash
# Deploy completo com uma linha
bash scripts/docker-deploy.sh
# Escolha opção 4 para build + push automático
```

### Usando com Proxy Reverso (Nginx)
```nginx
server {
    listen 80;
    server_name seudominio.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Deploy com SSL (Let's Encrypt)
```nginx
server {
    listen 443 ssl http2;
    server_name seudominio.com;
    
    ssl_certificate /etc/letsencrypt/live/seudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seudominio.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}

server {
    listen 80;
    server_name seudominio.com;
    return 301 https://$server_name$request_uri;
}
```
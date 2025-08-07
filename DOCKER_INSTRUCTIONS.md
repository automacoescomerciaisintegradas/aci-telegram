# 🐳 Instruções Docker - ACI (Automações Comerciais Integradas)

## 📋 Pré-requisitos

- Docker instalado (versão 20.10 ou superior)
- Docker Compose instalado (versão 2.0 ou superior)
- Arquivo `.env.local` configurado com suas chaves de API

## 🔧 Configuração Inicial

### 1. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env.local` e configure suas chaves:

```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas credenciais:

```env
# Google Gemini AI API Key (OBRIGATÓRIO)
GEMINI_API_KEY=sua_chave_gemini_aqui
API_KEY=sua_chave_gemini_aqui

# Outras configurações opcionais...
```

## 🚀 Comandos Docker

### Desenvolvimento Local

```bash
# Construir e executar em modo desenvolvimento
npm run docker:dev

# Ou usando docker-compose diretamente
docker-compose up --build

# Executar em background
docker-compose up -d

# Ver logs em tempo real
docker-compose logs -f

# Parar os containers
docker-compose down
```

### Produção

```bash
# Executar em modo produção
npm run docker:prod

# Ou usando docker-compose diretamente
docker-compose -f docker-compose.prod.yml up -d

# Deploy completo (usando script)
npm run docker:deploy
```

## 🏗️ Build Manual da Imagem

### 1. Construir a Imagem Docker

```bash
# Build básico
docker build -t aci-automacoes:latest .

# Build com tag específica
docker build -t aci-automacoes:v1.0.0 .

# Build para produção (multi-stage)
docker build --target production -t aci-automacoes:prod .
```

### 2. Executar Container Localmente

```bash
# Executar com variáveis de ambiente
docker run -d \
  --name aci-app \
  -p 3000:80 \
  --env-file .env.local \
  aci-automacoes:latest

# Executar com porta personalizada
docker run -d \
  --name aci-app \
  -p 8080:80 \
  --env-file .env.local \
  aci-automacoes:latest

# Executar em modo interativo (para debug)
docker run -it \
  --name aci-app-debug \
  -p 3000:80 \
  --env-file .env.local \
  aci-automacoes:latest sh
```

## 📤 Push para DockerHub

### 1. Fazer Login no DockerHub

```bash
docker login
```

### 2. Criar Tags para o DockerHub

```bash
# Substituir 'seuusuario' pelo seu username do DockerHub
docker tag aci-automacoes:latest seuusuario/aci-automacoes:latest
docker tag aci-automacoes:latest seuusuario/aci-automacoes:v1.0.0
```

### 3. Fazer Push das Imagens

```bash
# Push da versão latest
docker push seuusuario/aci-automacoes:latest

# Push da versão específica
docker push seuusuario/aci-automacoes:v1.0.0

# Push de todas as tags
docker push seuusuario/aci-automacoes --all-tags
```

## 🔍 Comandos Úteis

### Monitoramento

```bash
# Ver containers em execução
docker ps

# Ver logs do container
docker logs aci-app

# Ver logs em tempo real
docker logs -f aci-app

# Executar comandos dentro do container
docker exec -it aci-app sh

# Ver uso de recursos
docker stats aci-app
```

### Limpeza

```bash
# Parar e remover container
docker stop aci-app && docker rm aci-app

# Remover imagem
docker rmi aci-automacoes:latest

# Limpeza geral (cuidado!)
docker system prune -a

# Remover volumes não utilizados
docker volume prune
```

## 🌐 Acessar a Aplicação

Após executar o container, acesse:

- **Desenvolvimento**: http://localhost:3000
- **Produção**: http://localhost (porta 80)
- **Health Check**: http://localhost:3000/health

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de API Key**:
   - Verifique se o arquivo `.env.local` existe
   - Confirme se a `GEMINI_API_KEY` está configurada corretamente

2. **Porta já em uso**:
   ```bash
   # Verificar qual processo está usando a porta
   netstat -tulpn | grep :3000
   
   # Usar porta diferente
   docker run -p 8080:80 aci-automacoes:latest
   ```

3. **Container não inicia**:
   ```bash
   # Ver logs detalhados
   docker logs aci-app
   
   # Executar em modo interativo
   docker run -it aci-automacoes:latest sh
   ```

4. **Problemas de build**:
   ```bash
   # Build sem cache
   docker build --no-cache -t aci-automacoes:latest .
   
   # Ver logs detalhados do build
   docker build --progress=plain -t aci-automacoes:latest .
   ```

## 📊 Otimizações de Produção

### Multi-stage Build
O Dockerfile usa multi-stage build para:
- Reduzir tamanho da imagem final
- Separar dependências de desenvolvimento das de produção
- Otimizar camadas do Docker

### Nginx Otimizado
- Compressão GZIP habilitada
- Cache de arquivos estáticos
- Configurações de segurança
- Health check endpoint

### Variáveis de Ambiente
- Suporte a substituição em runtime
- Configuração flexível para diferentes ambientes
- Segurança aprimorada

## 🔒 Segurança

- Headers de segurança configurados no Nginx
- CSP (Content Security Policy) otimizado para React/Vite
- Variáveis de ambiente protegidas
- Health checks para monitoramento

## 📝 Scripts Disponíveis

```json
{
  "docker:build": "docker-compose build",
  "docker:up": "docker-compose up -d",
  "docker:dev": "docker-compose up --build",
  "docker:down": "docker-compose down",
  "docker:logs": "docker-compose logs -f",
  "docker:prod": "docker-compose -f docker-compose.prod.yml up -d",
  "docker:deploy": "bash scripts/docker-deploy.sh"
}
```

---

## 🆘 Suporte

Se encontrar problemas, verifique:
1. Logs do container: `docker logs aci-app`
2. Status do container: `docker ps -a`
3. Configurações de rede: `docker network ls`
4. Variáveis de ambiente: `docker exec aci-app env`

Para mais informações, consulte a documentação oficial do Docker: https://docs.docker.com/
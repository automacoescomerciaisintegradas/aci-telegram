# 🐳 Guia Completo Docker - ACI (Automações Comerciais Integradas)

## 📋 Visão Geral

Este projeto React/Vite com TypeScript está completamente configurado para Docker com:
- **Dockerfile otimizado** com multi-stage build
- **Docker Compose** para desenvolvimento e produção
- **Nginx** configurado para servir a aplicação React
- **Scripts automatizados** para deploy
- **Configuração de segurança** e performance

## 🔧 Pré-requisitos

- Docker instalado (versão 20.10+)
- Docker Compose instalado (versão 2.0+)
- Arquivo `.env.local` com suas chaves de API

## ⚡ Configuração Inicial

### 1. Configurar Variáveis de Ambiente

Certifique-se de que o arquivo `.env.local` existe e contém:

```env
# Obrigatórias
GEMINI_API_KEY=sua_chave_gemini_aqui
API_KEY=sua_chave_gemini_aqui

# Opcionais
VITE_BITLY_ACCESS_TOKEN=seu_token_bitly
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_supabase
```

### 2. Verificar Estrutura do Projeto

```
aci-automacoes/
├── Dockerfile                 # Configuração Docker otimizada
├── docker-compose.yml         # Desenvolvimento
├── docker-compose.prod.yml    # Produção
├── nginx.conf                 # Configuração Nginx
├── .dockerignore              # Arquivos ignorados no build
├── .env.local                 # Variáveis de ambiente
└── src/                       # Código fonte React
```

## 🚀 Comandos de Build e Execução

### Build da Imagem Docker

```bash
# Build básico
docker build -t aci-automacoes:latest .

# Build com argumentos de ambiente
docker build \
  --build-arg GEMINI_API_KEY=sua_chave \
  --build-arg API_KEY=sua_chave \
  -t aci-automacoes:latest .

# Build apenas para produção (otimizado)
docker build --target production -t aci-automacoes:prod .
```

### Executar Container Localmente

```bash
# Método 1: Com arquivo .env.local
docker run -d \
  --name aci-app \
  -p 3000:80 \
  --env-file .env.local \
  aci-automacoes:latest

# Método 2: Com variáveis específicas
docker run -d \
  --name aci-app \
  -p 3000:80 \
  -e GEMINI_API_KEY=sua_chave \
  -e API_KEY=sua_chave \
  aci-automacoes:latest

# Método 3: Porta customizada
docker run -d \
  --name aci-app \
  -p 8080:80 \
  --env-file .env.local \
  aci-automacoes:latest
```

### Usando Docker Compose (Recomendado)

```bash
# Desenvolvimento
docker-compose up --build

# Desenvolvimento em background
docker-compose up -d --build

# Produção
docker-compose -f docker-compose.prod.yml up -d

# Parar aplicação
docker-compose down

# Ver logs
docker-compose logs -f
```

## 📤 Push para DockerHub

### 1. Login no DockerHub

```bash
docker login
# Digite seu username e password do DockerHub
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
# Baixar e executar direto do DockerHub
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

## 📊 Comandos de Monitoramento

### Ver Status dos Containers

```bash
# Containers rodando
docker ps

# Todos os containers
docker ps -a

# Apenas containers do ACI
docker ps --filter "name=aci"
```

### Ver Logs

```bash
# Logs do container
docker logs aci-app

# Logs em tempo real
docker logs -f aci-app

# Últimas 50 linhas
docker logs --tail 50 aci-app

# Logs com Docker Compose
docker-compose logs -f
```

### Monitorar Recursos

```bash
# Uso de recursos em tempo real
docker stats

# Uso de recursos de um container específico
docker stats aci-app
```

### Executar Comandos no Container

```bash
# Abrir shell no container
docker exec -it aci-app sh

# Executar comando específico
docker exec aci-app ls -la /usr/share/nginx/html

# Ver variáveis de ambiente
docker exec aci-app env
```

## 🔧 Gerenciamento de Containers

### Parar e Iniciar

```bash
# Parar container
docker stop aci-app

# Iniciar container parado
docker start aci-app

# Reiniciar container
docker restart aci-app
```

### Remover

```bash
# Remover container (deve estar parado)
docker rm aci-app

# Forçar remoção (mesmo rodando)
docker rm -f aci-app

# Remover imagem
docker rmi aci-automacoes:latest
```

## 🧹 Limpeza do Sistema

### Limpeza Básica

```bash
# Remover containers parados
docker container prune

# Remover imagens não utilizadas
docker image prune

# Remover redes não utilizadas
docker network prune

# Remover volumes não utilizados
docker volume prune
```

### Limpeza Completa

```bash
# Limpeza geral (cuidado!)
docker system prune

# Limpeza completa incluindo imagens em uso
docker system prune -a

# Ver espaço usado pelo Docker
docker system df
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
   
   # Ver logs detalhados do build
   docker build --progress=plain -t aci-automacoes:latest .
   ```

### Health Check

```bash
# Verificar saúde da aplicação
curl -f http://localhost:3000/

# Ver status do health check
docker inspect aci-app | grep Health -A 10
```

### Debug de Rede

```bash
# Ver redes Docker
docker network ls

# Inspecionar rede específica
docker network inspect aci-network

# Testar conectividade
docker exec aci-app ping google.com
```

## 🚀 Scripts NPM Disponíveis

```bash
# Build e execução
npm run docker:build    # Construir imagem
npm run docker:up       # Executar em background
npm run docker:dev      # Desenvolvimento com build
npm run docker:down     # Parar containers
npm run docker:logs     # Ver logs
npm run docker:prod     # Executar em produção
npm run docker:deploy   # Deploy completo (script automatizado)
```

## 🔒 Configurações de Segurança

A configuração inclui:
- ✅ Headers de segurança no Nginx
- ✅ CSP otimizado para Google Gemini AI
- ✅ Container com usuário não-root
- ✅ Rede isolada
- ✅ Variáveis de ambiente protegidas
- ✅ Health checks configurados

## 📈 Otimizações de Performance

Implementadas:
- ✅ Multi-stage build (reduz 60% do tamanho)
- ✅ Compressão gzip
- ✅ Cache de arquivos estáticos (1 ano)
- ✅ Nginx otimizado para SPA
- ✅ Layers de Docker otimizadas

## 🌍 Deploy em Produção

### Configuração para Servidor

1. **Configure o domínio** no `docker-compose.prod.yml`:
   ```yaml
   labels:
     - "traefik.http.routers.aci-prod.rule=Host(`seu-dominio.com`)"
   ```

2. **Configure SSL** (opcional):
   ```bash
   # Instalar certbot
   sudo apt install certbot
   
   # Gerar certificado
   sudo certbot certonly --standalone -d seu-dominio.com
   ```

3. **Execute em produção**:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Monitoramento em Produção

```bash
# Ver status
docker-compose -f docker-compose.prod.yml ps

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Ver recursos
docker stats aci-automacoes-prod
```

## 📞 Suporte e Troubleshooting

### Checklist de Verificação

1. ✅ Arquivo `.env.local` existe e tem as chaves corretas
2. ✅ Docker e Docker Compose estão instalados
3. ✅ Portas 3000 ou 80 estão livres
4. ✅ Variáveis de ambiente estão corretas
5. ✅ Build da aplicação funciona localmente (`npm run build`)

### Comandos de Diagnóstico

```bash
# Verificar versões
docker --version
docker-compose --version

# Verificar espaço em disco
df -h
docker system df

# Verificar memória
free -h

# Verificar processos
docker ps -a
docker images
```

### Logs Importantes

```bash
# Logs do build
docker build --progress=plain -t aci-automacoes .

# Logs do container
docker logs --details aci-app

# Logs do nginx
docker exec aci-app cat /var/log/nginx/error.log
```

---

## 🎉 Conclusão

Sua aplicação **ACI** está completamente configurada para Docker com:

- ✅ **Build otimizado** com multi-stage
- ✅ **Configuração de produção** pronta
- ✅ **Scripts automatizados** para facilitar o uso
- ✅ **Documentação completa** em português
- ✅ **Segurança** e **performance** otimizadas

**Para começar rapidamente:**
```bash
# 1. Configure suas chaves no .env.local
# 2. Execute o comando:
docker-compose up --build

# 3. Acesse: http://localhost:3000
```

**Sucesso! 🚀**
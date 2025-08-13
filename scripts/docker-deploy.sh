#!/bin/bash

# Script de Deploy Docker para ACI (Automações Comerciais Integradas)
# Autor: ACI Team
# Versão: 1.0.0

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
APP_NAME="aci-automacoes"
DOCKER_IMAGE="$APP_NAME"
VERSION=$(date +%Y%m%d-%H%M%S)

echo -e "${BLUE}🚀 Iniciando deploy do ACI - Automações Comerciais Integradas${NC}"
echo -e "${BLUE}================================================${NC}"

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker não está rodando. Inicie o Docker e tente novamente.${NC}"
    exit 1
fi

# Verificar se arquivo .env.local existe
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env.local não encontrado. Copiando de .env.example...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo -e "${YELLOW}📝 Configure suas chaves de API no arquivo .env.local antes de continuar.${NC}"
        read -p "Pressione Enter após configurar o arquivo .env.local..."
    else
        echo -e "${RED}❌ Arquivo .env.example não encontrado. Crie o arquivo .env.local manualmente.${NC}"
        exit 1
    fi
fi

# Parar containers existentes
echo -e "${YELLOW}🛑 Parando containers existentes...${NC}"
docker-compose down 2>/dev/null || true

# Limpar imagens antigas (opcional)
read -p "Deseja remover imagens antigas? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🧹 Removendo imagens antigas...${NC}"
    docker image prune -f
fi

# Build da nova imagem
echo -e "${BLUE}🏗️  Construindo nova imagem...${NC}"
docker build -t $DOCKER_IMAGE:latest -t $DOCKER_IMAGE:$VERSION .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build concluído com sucesso!${NC}"
else
    echo -e "${RED}❌ Erro no build da imagem.${NC}"
    exit 1
fi

# Executar em modo produção
echo -e "${BLUE}🚀 Iniciando aplicação em modo produção...${NC}"
docker-compose -f docker-compose.prod.yml up -d

# Aguardar inicialização
echo -e "${YELLOW}⏳ Aguardando inicialização da aplicação...${NC}"
sleep 10

# Verificar se a aplicação está rodando
if docker ps | grep -q $APP_NAME; then
    echo -e "${GREEN}✅ Aplicação iniciada com sucesso!${NC}"
    
    # Health check
    echo -e "${BLUE}🔍 Verificando saúde da aplicação...${NC}"
    if curl -f http://localhost/ > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Health check passou!${NC}"
    else
        echo -e "${YELLOW}⚠️  Health check falhou, mas a aplicação pode estar iniciando...${NC}"
        echo -e "${YELLOW}⏳ Aguardando mais 10 segundos...${NC}"
        sleep 10
        if curl -f http://localhost/ > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Health check passou na segunda tentativa!${NC}"
        else
            echo -e "${YELLOW}⚠️  Aplicação pode estar ainda inicializando. Verifique os logs.${NC}"
        fi
    fi
    
    echo -e "${GREEN}🎉 Deploy concluído com sucesso!${NC}"
    echo -e "${BLUE}📱 Acesse a aplicação em: http://localhost${NC}"
    echo -e "${BLUE}📊 Logs: docker-compose -f docker-compose.prod.yml logs -f${NC}"
    
else
    echo -e "${RED}❌ Erro ao iniciar a aplicação.${NC}"
    echo -e "${YELLOW}📋 Verificando logs...${NC}"
    docker-compose -f docker-compose.prod.yml logs --tail=20
    exit 1
fi

# Mostrar status dos containers
echo -e "${BLUE}📊 Status dos containers:${NC}"
docker ps --filter "name=$APP_NAME"

# Opção para fazer push para DockerHub
echo
read -p "Deseja fazer push da imagem para o DockerHub? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Digite seu username do DockerHub: " DOCKER_USERNAME
    if [ ! -z "$DOCKER_USERNAME" ]; then
        echo -e "${BLUE}📤 Fazendo push para DockerHub...${NC}"
        docker tag $DOCKER_IMAGE:latest $DOCKER_USERNAME/$DOCKER_IMAGE:latest
        docker tag $DOCKER_IMAGE:latest $DOCKER_USERNAME/$DOCKER_IMAGE:$VERSION
        
        docker push $DOCKER_USERNAME/$DOCKER_IMAGE:latest
        docker push $DOCKER_USERNAME/$DOCKER_IMAGE:$VERSION
        
        echo -e "${GREEN}✅ Push concluído!${NC}"
        echo -e "${BLUE}🐳 Imagem disponível em: $DOCKER_USERNAME/$DOCKER_IMAGE:latest${NC}"
    fi
fi

echo -e "${GREEN}🎊 Deploy finalizado!${NC}"
#!/bin/bash

# Script de Deploy Docker para ACI - Automações Comerciais Integradas
# Execute: bash scripts/docker-deploy.sh

set -e

echo "🚀 Script de Deploy Docker - ACI Automações"
echo "============================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    log_error "Docker não está instalado!"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose não está instalado!"
    exit 1
fi

log_success "Docker e Docker Compose encontrados"

# Verificar se .env.local existe
if [ ! -f ".env.local" ]; then
    log_warning ".env.local não encontrado, copiando .env.example"
    cp .env.example .env.local
    log_info "Edite o arquivo .env.local com suas chaves de API antes de continuar"
    read -p "Pressione Enter após configurar as variáveis de ambiente..."
fi

# Menu de opções
echo ""
echo "Escolha uma opção:"
echo "1. Build e executar localmente"
echo "2. Build para produção"
echo "3. Push para DockerHub"
echo "4. Deploy completo (build + push)"
echo "5. Parar containers"
echo "6. Limpar recursos Docker"

read -p "Digite sua escolha (1-6): " choice

case $choice in
    1)
        log_info "Fazendo build e executando localmente..."
        docker-compose down 2>/dev/null || true
        docker-compose up --build -d
        log_success "Aplicação rodando em http://localhost:3000"
        log_info "Para ver logs: docker-compose logs -f"
        ;;
    2)
        log_info "Fazendo build para produção..."
        docker-compose build
        log_success "Build concluído!"
        ;;
    3)
        read -p "Digite seu usuário do DockerHub: " dockerhub_user
        read -p "Digite a versão (ex: v1.0.0): " version
        
        log_info "Fazendo tag da imagem..."
        docker tag aci-automacoes:latest $dockerhub_user/aci-automacoes:latest
        docker tag aci-automacoes:latest $dockerhub_user/aci-automacoes:$version
        
        log_info "Fazendo push para DockerHub..."
        docker push $dockerhub_user/aci-automacoes:latest
        docker push $dockerhub_user/aci-automacoes:$version
        
        log_success "Push concluído!"
        log_info "Imagem disponível em: $dockerhub_user/aci-automacoes:$version"
        ;;
    4)
        read -p "Digite seu usuário do DockerHub: " dockerhub_user
        read -p "Digite a versão (ex: v1.0.0): " version
        
        log_info "Fazendo build..."
        docker-compose build
        
        log_info "Fazendo tag da imagem..."
        docker tag aci-automacoes:latest $dockerhub_user/aci-automacoes:latest
        docker tag aci-automacoes:latest $dockerhub_user/aci-automacoes:$version
        
        log_info "Fazendo push para DockerHub..."
        docker push $dockerhub_user/aci-automacoes:latest
        docker push $dockerhub_user/aci-automacoes:$version
        
        log_success "Deploy completo concluído!"
        log_info "Imagem disponível em: $dockerhub_user/aci-automacoes:$version"
        ;;
    5)
        log_info "Parando containers..."
        docker-compose down
        log_success "Containers parados"
        ;;
    6)
        log_warning "Isso irá remover containers, imagens e volumes não utilizados"
        read -p "Tem certeza? (y/N): " confirm
        if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
            docker-compose down
            docker system prune -f
            docker volume prune -f
            log_success "Limpeza concluída"
        else
            log_info "Operação cancelada"
        fi
        ;;
    *)
        log_error "Opção inválida"
        exit 1
        ;;
esac

echo ""
log_success "Script concluído!"
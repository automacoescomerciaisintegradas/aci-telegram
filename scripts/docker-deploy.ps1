# Script de Deploy Docker para ACI (PowerShell)
# Autor: ACI Team
# Versão: 1.0.0

param(
    [switch]$Production,
    [switch]$Push,
    [string]$DockerUsername
)

# Configurações
$AppName = "aci-automacoes"
$DockerImage = $AppName
$Version = Get-Date -Format "yyyyMMdd-HHmmss"

Write-Host "🚀 Iniciando deploy do ACI - Automações Comerciais Integradas" -ForegroundColor Blue
Write-Host "================================================" -ForegroundColor Blue

# Verificar se Docker está rodando
try {
    docker info | Out-Null
    Write-Host "✅ Docker está rodando" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker não está rodando. Inicie o Docker e tente novamente." -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Verificar se arquivo .env.local existe
if (-not (Test-Path ".env.local")) {
    Write-Host "⚠️  Arquivo .env.local não encontrado." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env.local"
        Write-Host "📝 Configure suas chaves de API no arquivo .env.local antes de continuar." -ForegroundColor Yellow
        Read-Host "Pressione Enter após configurar o arquivo .env.local"
    } else {
        Write-Host "❌ Arquivo .env.example não encontrado. Crie o arquivo .env.local manualmente." -ForegroundColor Red
        Read-Host "Pressione Enter para sair"
        exit 1
    }
}

# Parar containers existentes
Write-Host "🛑 Parando containers existentes..." -ForegroundColor Yellow
try {
    docker-compose down 2>$null
} catch {
    # Ignorar erros se não houver containers rodando
}

# Limpar imagens antigas (opcional)
$cleanImages = Read-Host "Deseja remover imagens antigas? (y/N)"
if ($cleanImages -eq "y" -or $cleanImages -eq "Y") {
    Write-Host "🧹 Removendo imagens antigas..." -ForegroundColor Yellow
    docker image prune -f
}

# Build da nova imagem
Write-Host "🏗️  Construindo nova imagem..." -ForegroundColor Blue
$buildResult = docker build -t "${DockerImage}:latest" -t "${DockerImage}:${Version}" .

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build concluído com sucesso!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro no build da imagem." -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Executar aplicação
if ($Production) {
    Write-Host "🚀 Iniciando aplicação em modo produção..." -ForegroundColor Blue
    docker-compose -f docker-compose.prod.yml up -d
    $port = "80"
} else {
    Write-Host "🚀 Iniciando aplicação em modo desenvolvimento..." -ForegroundColor Blue
    docker-compose up -d
    $port = "3000"
}

# Aguardar inicialização
Write-Host "⏳ Aguardando inicialização da aplicação..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Verificar se a aplicação está rodando
$containers = docker ps --filter "name=$AppName" --format "table {{.Names}}"
if ($containers -match $AppName) {
    Write-Host "✅ Aplicação iniciada com sucesso!" -ForegroundColor Green
    
    # Health check
    Write-Host "🔍 Verificando saúde da aplicação..." -ForegroundColor Blue
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$port/" -TimeoutSec 5 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Health check passou!" -ForegroundColor Green
        }
    } catch {
        Write-Host "⚠️  Health check falhou, mas a aplicação pode estar iniciando..." -ForegroundColor Yellow
        Write-Host "⏳ Aguardando mais 10 segundos..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:$port/" -TimeoutSec 5 -UseBasicParsing
            if ($response.StatusCode -eq 200) {
                Write-Host "✅ Health check passou na segunda tentativa!" -ForegroundColor Green
            }
        } catch {
            Write-Host "⚠️  Aplicação pode estar ainda inicializando. Verifique os logs." -ForegroundColor Yellow
        }
    }
    
    Write-Host "🎉 Deploy concluído com sucesso!" -ForegroundColor Green
    Write-Host "📱 Acesse a aplicação em: http://localhost:$port" -ForegroundColor Blue
    
    if ($Production) {
        Write-Host "📊 Logs: docker-compose -f docker-compose.prod.yml logs -f" -ForegroundColor Blue
    } else {
        Write-Host "📊 Logs: docker-compose logs -f" -ForegroundColor Blue
    }
    
} else {
    Write-Host "❌ Erro ao iniciar a aplicação." -ForegroundColor Red
    Write-Host "📋 Verificando logs..." -ForegroundColor Yellow
    if ($Production) {
        docker-compose -f docker-compose.prod.yml logs --tail=20
    } else {
        docker-compose logs --tail=20
    }
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Mostrar status dos containers
Write-Host "📊 Status dos containers:" -ForegroundColor Blue
docker ps --filter "name=$AppName"

# Opção para fazer push para DockerHub
if ($Push -or -not $DockerUsername) {
    if (-not $DockerUsername) {
        $DockerUsername = Read-Host "Digite seu username do DockerHub (ou Enter para pular)"
    }
    
    if ($DockerUsername) {
        Write-Host "📤 Fazendo push para DockerHub..." -ForegroundColor Blue
        docker tag "${DockerImage}:latest" "${DockerUsername}/${DockerImage}:latest"
        docker tag "${DockerImage}:latest" "${DockerUsername}/${DockerImage}:${Version}"
        
        docker push "${DockerUsername}/${DockerImage}:latest"
        docker push "${DockerUsername}/${DockerImage}:${Version}"
        
        Write-Host "✅ Push concluído!" -ForegroundColor Green
        Write-Host "🐳 Imagem disponível em: ${DockerUsername}/${DockerImage}:latest" -ForegroundColor Blue
    }
}

Write-Host "🎊 Deploy finalizado!" -ForegroundColor Green
Read-Host "Pressione Enter para sair"
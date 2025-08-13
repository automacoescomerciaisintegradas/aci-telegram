@echo off
REM Script de Deploy Docker para ACI (Windows)
REM Autor: ACI Team
REM Versão: 1.0.0

echo.
echo 🚀 Iniciando deploy do ACI - Automações Comerciais Integradas
echo ================================================

REM Verificar se Docker está rodando
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker não está rodando. Inicie o Docker e tente novamente.
    pause
    exit /b 1
)

REM Verificar se arquivo .env.local existe
if not exist ".env.local" (
    echo ⚠️  Arquivo .env.local não encontrado.
    if exist ".env.example" (
        copy ".env.example" ".env.local"
        echo 📝 Configure suas chaves de API no arquivo .env.local antes de continuar.
        pause
    ) else (
        echo ❌ Arquivo .env.example não encontrado. Crie o arquivo .env.local manualmente.
        pause
        exit /b 1
    )
)

REM Parar containers existentes
echo 🛑 Parando containers existentes...
docker-compose down 2>nul

REM Build da nova imagem
echo 🏗️  Construindo nova imagem...
docker build -t aci-automacoes:latest .

if errorlevel 1 (
    echo ❌ Erro no build da imagem.
    pause
    exit /b 1
)

echo ✅ Build concluído com sucesso!

REM Executar em modo desenvolvimento
echo 🚀 Iniciando aplicação...
docker-compose up -d

REM Aguardar inicialização
echo ⏳ Aguardando inicialização da aplicação...
timeout /t 10 /nobreak >nul

REM Verificar se a aplicação está rodando
docker ps | findstr "aci" >nul
if errorlevel 1 (
    echo ❌ Erro ao iniciar a aplicação.
    echo 📋 Verificando logs...
    docker-compose logs --tail=20
    pause
    exit /b 1
)

echo ✅ Aplicação iniciada com sucesso!
echo 🎉 Deploy concluído!
echo.
echo 📱 Acesse a aplicação em: http://localhost:3000
echo 📊 Para ver logs: docker-compose logs -f
echo.

REM Mostrar status dos containers
echo 📊 Status dos containers:
docker ps --filter "name=aci"

echo.
set /p push="Deseja fazer push da imagem para o DockerHub? (y/N): "
if /i "%push%"=="y" (
    set /p username="Digite seu username do DockerHub: "
    if not "!username!"=="" (
        echo 📤 Fazendo push para DockerHub...
        docker tag aci-automacoes:latest !username!/aci-automacoes:latest
        docker push !username!/aci-automacoes:latest
        echo ✅ Push concluído!
        echo 🐳 Imagem disponível em: !username!/aci-automacoes:latest
    )
)

echo.
echo 🎊 Deploy finalizado!
pause
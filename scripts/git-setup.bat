@echo off
echo 🚀 Configurando Git para o projeto ACI...

REM Verificar se Git está instalado
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git não encontrado! Instale o Git primeiro:
    echo    https://git-scm.com/download/win
    pause
    exit /b 1
)

echo ✅ Git encontrado!

REM Solicitar informações do usuário
set /p userName="Digite seu nome para o Git: "
set /p userEmail="Digite seu email para o Git: "
set /p repoUrl="Digite a URL do seu repositório GitHub: "

REM Configurar Git
echo ⚙️ Configurando usuário Git...
git config --global user.name "%userName%"
git config --global user.email "%userEmail%"

REM Inicializar repositório se não existir
if not exist ".git" (
    echo 📁 Inicializando repositório Git...
    git init
    git branch -M main
)

REM Adicionar remote se fornecido
if not "%repoUrl%"=="" (
    echo 🔗 Adicionando repositório remoto...
    git remote remove origin 2>nul
    git remote add origin %repoUrl%
)

REM Primeiro commit
echo 📝 Fazendo commit inicial...
git add .
git commit -m "feat: projeto ACI - sistema de automações comerciais - Sistema de autenticação funcionando - Dashboard com sidebar completa - Integração Telegram + Shopee - Painel administrativo - Credenciais de teste: admin@aci.com/admin123"

REM Push se remote configurado
if not "%repoUrl%"=="" (
    echo 🚀 Fazendo push para GitHub...
    git push -u origin main
    if %errorlevel% equ 0 (
        echo ✅ Push realizado com sucesso!
    ) else (
        echo ⚠️ Erro no push. Verifique se o repositório existe no GitHub.
    )
)

echo 🎉 Configuração concluída!
echo Use 'scripts\git-commit.bat' para commits futuros.
pause
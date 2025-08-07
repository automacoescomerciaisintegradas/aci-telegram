@echo off
echo 🚀 Script para Deploy no GitHub (Windows)

echo 🔍 Verificando se Git está instalado...
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git não está instalado ou não está no PATH
    echo Instale o Git: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo ✅ Git encontrado

echo 📦 Inicializando repositório Git...
git init

echo 📝 Adicionando arquivos...
git add .

echo 💾 Fazendo commit inicial...
git commit -m "🎉 Initial commit: Sistema completo de gerenciamento de tokens ML"

echo 🌐 Configurando branch main...
git branch -M main

echo.
echo ✅ Repositório pronto para o GitHub!
echo.
echo 🔗 Próximos passos:
echo 1. Crie um repositório no GitHub: https://github.com/new
echo 2. Nome sugerido: api-mercado-livre-tokens
echo 3. Execute: git remote add origin https://github.com/SEU_USUARIO/api-mercado-livre-tokens.git
echo 4. Execute: git push -u origin main
echo.
echo 📖 Consulte GITHUB_SETUP.md para instruções detalhadas
echo.
pause
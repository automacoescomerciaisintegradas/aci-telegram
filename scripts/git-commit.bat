@echo off
echo 📝 Script de Commit Automático - Projeto ACI

REM Verificar se Git está configurado
git status >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Repositório Git não encontrado! Execute git-setup.bat primeiro.
    pause
    exit /b 1
)

REM Mostrar status atual
echo 📊 Status atual do repositório:
git status --short

REM Solicitar tipo de commit
echo.
echo 💬 Tipos de commit disponíveis:
echo   1. feat: nova funcionalidade
echo   2. fix: correção de bug
echo   3. docs: documentação
echo   4. style: formatação/estilo
echo   5. refactor: refatoração
echo   6. test: testes
echo   7. chore: manutenção

set /p commitType="Escolha o tipo (1-7): "

REM Definir prefixo baseado na escolha
if "%commitType%"=="1" set prefix=feat
if "%commitType%"=="2" set prefix=fix
if "%commitType%"=="3" set prefix=docs
if "%commitType%"=="4" set prefix=style
if "%commitType%"=="5" set prefix=refactor
if "%commitType%"=="6" set prefix=test
if "%commitType%"=="7" set prefix=chore
if "%commitType%"=="" set prefix=feat

set /p description="Digite a descrição do commit: "

REM Adicionar arquivos
echo ➕ Adicionando arquivos...
git add .

REM Verificar se há mudanças
git diff --cached --quiet
if %errorlevel% neq 0 (
    echo 📁 Arquivos que serão commitados:
    git diff --cached --name-only
    
    REM Fazer commit
    echo.
    echo 💾 Fazendo commit...
    git commit -m "%prefix%: %description%"
    
    if %errorlevel% equ 0 (
        echo ✅ Commit realizado com sucesso!
        
        REM Push
        echo 🚀 Fazendo push...
        git push
        
        if %errorlevel% equ 0 (
            echo ✅ Push realizado com sucesso!
        ) else (
            echo ⚠️ Erro no push. Verifique a conexão e permissões.
        )
    ) else (
        echo ❌ Erro no commit!
    )
) else (
    echo ℹ️ Nenhuma mudança para commit.
)

echo.
echo 📊 Status final:
git status --short
pause
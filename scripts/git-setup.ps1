# Script para configuração inicial do Git
# Execute: powershell -ExecutionPolicy Bypass -File scripts/git-setup.ps1

Write-Host "🚀 Configurando Git para o projeto ACI..." -ForegroundColor Green

# Verificar se Git está instalado
try {
    $gitVersion = git --version
    Write-Host "✅ Git encontrado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git não encontrado! Instale o Git primeiro:" -ForegroundColor Red
    Write-Host "   https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Solicitar informações do usuário
$userName = Read-Host "Digite seu nome para o Git"
$userEmail = Read-Host "Digite seu email para o Git"
$repoUrl = Read-Host "Digite a URL do seu repositório GitHub (ex: https://github.com/usuario/repo.git)"

# Configurar Git
Write-Host "⚙️ Configurando usuário Git..." -ForegroundColor Blue
git config --global user.name "$userName"
git config --global user.email "$userEmail"

# Inicializar repositório se não existir
if (-not (Test-Path ".git")) {
    Write-Host "📁 Inicializando repositório Git..." -ForegroundColor Blue
    git init
    git branch -M main
}

# Adicionar remote se fornecido
if ($repoUrl) {
    Write-Host "🔗 Adicionando repositório remoto..." -ForegroundColor Blue
    try {
        git remote remove origin 2>$null
    } catch {}
    git remote add origin $repoUrl
}

# Primeiro commit
Write-Host "📝 Fazendo commit inicial..." -ForegroundColor Blue
git add .
git commit -m "feat: projeto ACI - sistema de automações comerciais

- Sistema de autenticação funcionando
- Dashboard com sidebar completa
- Integração Telegram + Shopee
- Painel administrativo
- Credenciais de teste: admin@aci.com/admin123"

# Push se remote configurado
if ($repoUrl) {
    Write-Host "🚀 Fazendo push para GitHub..." -ForegroundColor Blue
    try {
        git push -u origin main
        Write-Host "✅ Push realizado com sucesso!" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ Erro no push. Verifique se o repositório existe no GitHub." -ForegroundColor Yellow
    }
}

Write-Host "🎉 Configuração concluída!" -ForegroundColor Green
Write-Host "Use 'scripts/git-commit.ps1' para commits futuros." -ForegroundColor Cyan
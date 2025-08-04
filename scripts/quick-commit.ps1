# Script para commit rápido com mensagem pré-definida
# Execute: powershell -ExecutionPolicy Bypass -File scripts/quick-commit.ps1

param(
    [string]$Type = "update",
    [string]$Message = ""
)

$timestamp = Get-Date -Format "dd/MM/yyyy HH:mm"

# Mensagens pré-definidas baseadas no tipo
$predefinedMessages = @{
    "update" = "chore: atualização geral do projeto ACI"
    "fix" = "fix: correções e melhorias no sistema"
    "feature" = "feat: novas funcionalidades implementadas"
    "auth" = "fix: melhorias no sistema de autenticação"
    "ui" = "style: melhorias na interface do usuário"
    "api" = "feat: melhorias nas integrações de API"
    "docs" = "docs: atualização da documentação"
}

if (-not $Message) {
    if ($predefinedMessages.ContainsKey($Type)) {
        $Message = $predefinedMessages[$Type]
    } else {
        $Message = "chore: $Type"
    }
}

$fullMessage = "$Message`n`n- Atualizado em: $timestamp`n- Projeto: ACI - Automações Comerciais Integradas"

Write-Host "🚀 Commit Rápido - $Type" -ForegroundColor Green
Write-Host "📝 Mensagem: $Message" -ForegroundColor Blue

# Adicionar e commitar
git add .
git commit -m "$fullMessage"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit realizado!" -ForegroundColor Green
    
    # Push automático
    git push
    if ($LASTEXITCODE -eq 0) {
        Write-Host "🚀 Push realizado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Erro no push" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Erro no commit" -ForegroundColor Red
}
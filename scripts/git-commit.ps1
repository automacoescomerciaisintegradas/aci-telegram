# Script para commit e push automático
# Execute: powershell -ExecutionPolicy Bypass -File scripts/git-commit.ps1

param(
    [string]$Message = "",
    [switch]$Push = $true
)

Write-Host "📝 Script de Commit Automático - Projeto ACI" -ForegroundColor Green

# Verificar se Git está configurado
try {
    git status | Out-Null
} catch {
    Write-Host "❌ Repositório Git não encontrado! Execute git-setup.ps1 primeiro." -ForegroundColor Red
    exit 1
}

# Mostrar status atual
Write-Host "📊 Status atual do repositório:" -ForegroundColor Blue
git status --short

# Solicitar mensagem se não fornecida
if (-not $Message) {
    Write-Host "`n💬 Tipos de commit disponíveis:" -ForegroundColor Cyan
    Write-Host "  1. feat: nova funcionalidade" -ForegroundColor White
    Write-Host "  2. fix: correção de bug" -ForegroundColor White
    Write-Host "  3. docs: documentação" -ForegroundColor White
    Write-Host "  4. style: formatação/estilo" -ForegroundColor White
    Write-Host "  5. refactor: refatoração" -ForegroundColor White
    Write-Host "  6. test: testes" -ForegroundColor White
    Write-Host "  7. chore: manutenção" -ForegroundColor White
    
    $commitType = Read-Host "`nEscolha o tipo (1-7) ou digite 'custom'"
    
    switch ($commitType) {
        "1" { $prefix = "feat" }
        "2" { $prefix = "fix" }
        "3" { $prefix = "docs" }
        "4" { $prefix = "style" }
        "5" { $prefix = "refactor" }
        "6" { $prefix = "test" }
        "7" { $prefix = "chore" }
        "custom" { $prefix = "" }
        default { $prefix = "feat" }
    }
    
    $description = Read-Host "Digite a descrição do commit"
    
    if ($prefix) {
        $Message = "${prefix}: ${description}"
    } else {
        $Message = $description
    }
}

# Adicionar arquivos
Write-Host "➕ Adicionando arquivos..." -ForegroundColor Blue
git add .

# Verificar se há mudanças
$changes = git diff --cached --name-only
if (-not $changes) {
    Write-Host "ℹ️ Nenhuma mudança para commit." -ForegroundColor Yellow
    exit 0
}

Write-Host "📁 Arquivos que serão commitados:" -ForegroundColor Blue
$changes | ForEach-Object { Write-Host "  - $_" -ForegroundColor White }

# Fazer commit
Write-Host "`n💾 Fazendo commit..." -ForegroundColor Blue
git commit -m "$Message"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit realizado com sucesso!" -ForegroundColor Green
    
    # Push se solicitado
    if ($Push) {
        Write-Host "🚀 Fazendo push..." -ForegroundColor Blue
        git push
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Push realizado com sucesso!" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Erro no push. Verifique a conexão e permissões." -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "❌ Erro no commit!" -ForegroundColor Red
}

Write-Host "`n📊 Status final:" -ForegroundColor Blue
git status --short
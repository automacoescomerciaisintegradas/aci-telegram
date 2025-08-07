#!/bin/bash

# 🚀 Script para Deploy no GitHub
# Execute: bash deploy.sh

echo "🔍 Verificando arquivos sensíveis..."

# Verificar se .env está sendo ignorado
if git ls-files --error-unmatch .env 2>/dev/null; then
    echo "❌ ERRO: Arquivo .env está sendo rastreado pelo Git!"
    echo "Execute: git rm --cached .env"
    exit 1
fi

echo "✅ Arquivos sensíveis protegidos"

echo "📦 Inicializando repositório Git..."
git init

echo "📝 Adicionando arquivos..."
git add .

echo "💾 Fazendo commit inicial..."
git commit -m "🎉 Initial commit: Sistema completo de gerenciamento de tokens ML

✨ Funcionalidades:
- Fluxo PKCE para autorização OAuth2
- Gerenciamento automático de tokens
- Validação e renovação automática
- Armazenamento seguro no .env
- Interface web intuitiva
- API RESTful completa
- Documentação completa

🔒 Segurança:
- Dados sensíveis protegidos
- .gitignore configurado
- Exemplos sem dados reais

📚 Documentação:
- README.md completo
- Guia de configuração
- Exemplos práticos
- Licença MIT"

echo "🌐 Configurando branch main..."
git branch -M main

echo "✅ Repositório pronto para o GitHub!"
echo ""
echo "🔗 Próximos passos:"
echo "1. Crie um repositório no GitHub: https://github.com/new"
echo "2. Nome sugerido: api-mercado-livre-tokens"
echo "3. Execute: git remote add origin https://github.com/SEU_USUARIO/api-mercado-livre-tokens.git"
echo "4. Execute: git push -u origin main"
echo ""
echo "📖 Consulte GITHUB_SETUP.md para instruções detalhadas"
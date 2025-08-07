# 🚀 Como Subir o Projeto para o GitHub

## Pré-requisitos

1. **Git instalado** no seu sistema
2. **Conta no GitHub** criada
3. **Git configurado** com suas credenciais

### Configurar Git (se ainda não fez)
```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"
```

## Passo 1: Inicializar Repositório Local

```bash
# Inicializar repositório Git
git init

# Adicionar todos os arquivos (exceto os do .gitignore)
git add .

# Fazer o primeiro commit
git commit -m "🎉 Initial commit: Sistema completo de gerenciamento de tokens ML"
```

## Passo 2: Criar Repositório no GitHub

1. **Acesse**: https://github.com/new
2. **Nome do repositório**: `api-mercado-livre-tokens`
3. **Descrição**: `Sistema completo para gerenciamento automático de tokens OAuth2 do Mercado Livre com fluxo PKCE`
4. **Visibilidade**: 
   - ✅ **Público** (recomendado - sem dados sensíveis)
   - ⚠️ **Privado** (se preferir)
5. **NÃO marque**: "Add a README file" (já temos)
6. **NÃO marque**: "Add .gitignore" (já temos)
7. **Marque**: "Choose a license" → MIT License
8. **Clique**: "Create repository"

## Passo 3: Conectar e Enviar

```bash
# Adicionar origem remota (substitua SEU_USUARIO pelo seu username)
git remote add origin https://github.com/SEU_USUARIO/api-mercado-livre-tokens.git

# Renomear branch para main (padrão atual do GitHub)
git branch -M main

# Enviar código para o GitHub
git push -u origin main
```

## Passo 4: Verificar Segurança

### ✅ Arquivos que DEVEM estar no GitHub:
- `README.md` - Documentação principal
- `SETUP.md` - Guia de configuração
- `EXAMPLES.md` - Exemplos de uso
- `package.json` - Configuração do projeto
- `.env.example` - Modelo de configuração
- `.gitignore` - Proteção de arquivos sensíveis
- `index.js` - Código principal
- `public/index.html` - Interface web
- `LICENSE` - Licença do projeto

### ❌ Arquivos que NÃO devem estar no GitHub:
- `.env` - **DADOS SENSÍVEIS** (protegido pelo .gitignore)
- `node_modules/` - Dependências (protegido pelo .gitignore)
- Logs e arquivos temporários

## Passo 5: Configurar GitHub Pages (Opcional)

Para hospedar a documentação:

1. **Vá para**: Settings → Pages
2. **Source**: Deploy from a branch
3. **Branch**: main
4. **Folder**: / (root)
5. **Save**

Sua documentação estará em: `https://SEU_USUARIO.github.io/api-mercado-livre-tokens`

## Comandos Úteis para Manutenção

### Adicionar mudanças
```bash
git add .
git commit -m "✨ Descrição da mudança"
git push
```

### Ver status
```bash
git status
```

### Ver histórico
```bash
git log --oneline
```

### Criar nova branch para features
```bash
git checkout -b feature/nova-funcionalidade
# Fazer mudanças...
git add .
git commit -m "✨ Nova funcionalidade"
git push -u origin feature/nova-funcionalidade
```

## 🔒 Verificação de Segurança Final

Antes de fazer push, verifique:

```bash
# Verificar se .env está sendo ignorado
git status

# Se aparecer .env na lista, PARE e adicione ao .gitignore
# Se NÃO aparecer, está seguro para continuar
```

## 🏷️ Tags e Releases

Para criar releases:

```bash
# Criar tag
git tag -a v1.0.0 -m "🎉 Primeira versão estável"

# Enviar tag
git push origin v1.0.0
```

Depois vá no GitHub → Releases → Create a new release

## 📊 Badges para README

Adicione badges ao seu README.md:

```markdown
![GitHub](https://img.shields.io/github/license/SEU_USUARIO/api-mercado-livre-tokens)
![GitHub package.json version](https://img.shields.io/github/package-json/v/SEU_USUARIO/api-mercado-livre-tokens)
![GitHub last commit](https://img.shields.io/github/last-commit/SEU_USUARIO/api-mercado-livre-tokens)
![GitHub issues](https://img.shields.io/github/issues/SEU_USUARIO/api-mercado-livre-tokens)
```

## 🤝 Configurar Colaboração

Para permitir contribuições:

1. **Settings** → **Manage access**
2. **Invite a collaborator** (se necessário)
3. **Branch protection rules** (para branch main)

## 📝 Template de Issues

Crie `.github/ISSUE_TEMPLATE/bug_report.md`:

```markdown
---
name: Bug report
about: Criar um relatório de bug
title: '[BUG] '
labels: bug
assignees: ''
---

**Descreva o bug**
Descrição clara do que está acontecendo.

**Para Reproduzir**
Passos para reproduzir:
1. Vá para '...'
2. Clique em '....'
3. Veja o erro

**Comportamento Esperado**
O que deveria acontecer.

**Screenshots**
Se aplicável, adicione screenshots.

**Ambiente:**
- OS: [e.g. Windows 10]
- Node.js: [e.g. 18.0.0]
- Versão: [e.g. 1.0.0]
```

## 🎯 Próximos Passos

Após subir para o GitHub:

1. ⭐ **Star** seu próprio projeto
2. 📝 **Criar Issues** para melhorias futuras
3. 🔄 **Configurar Actions** para CI/CD (opcional)
4. 📢 **Compartilhar** com a comunidade
5. 📊 **Monitorar** estatísticas do repositório

## 🆘 Problemas Comuns

### Erro: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/SEU_USUARIO/api-mercado-livre-tokens.git
```

### Erro: "failed to push"
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Arquivo .env apareceu no git
```bash
# PARE IMEDIATAMENTE e remova:
git rm --cached .env
git commit -m "🔒 Remove arquivo .env sensível"
git push
```

Lembre-se: **NUNCA** faça commit de dados sensíveis!
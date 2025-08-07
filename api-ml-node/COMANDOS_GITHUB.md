# 🚀 Comandos Prontos para GitHub

## Opção 1: Usando Script Automático (Windows)

```bash
# Execute o script automático
deploy.bat
```

## Opção 2: Comandos Manuais

### Passo 1: Inicializar Git
```bash
git init
git add .
git commit -m "🎉 Initial commit: Sistema completo de gerenciamento de tokens ML"
git branch -M main
```

### Passo 2: Criar Repositório no GitHub
1. Acesse: https://github.com/new
2. Nome: `api-mercado-livre-tokens`
3. Descrição: `Sistema completo para gerenciamento automático de tokens OAuth2 do Mercado Livre com fluxo PKCE`
4. Público ✅
5. Create repository

### Passo 3: Conectar e Enviar
```bash
# Substitua SEU_USUARIO pelo seu username do GitHub
git remote add origin https://github.com/SEU_USUARIO/api-mercado-livre-tokens.git
git push -u origin main
```

## ✅ Verificação de Segurança

Antes de fazer push, confirme que estes arquivos NÃO estão sendo enviados:
- `.env` (dados sensíveis)
- `node_modules/` (dependências)

Execute para verificar:
```bash
git status
```

Se `.env` aparecer na lista, execute:
```bash
git rm --cached .env
git commit -m "🔒 Remove arquivo .env sensível"
```

## 🎯 Após Subir para GitHub

1. **Atualize os badges** no README.md substituindo `seuusuario` pelo seu username
2. **Configure GitHub Pages** (opcional) em Settings → Pages
3. **Crie Issues** para melhorias futuras
4. **Compartilhe** o projeto!

## 📊 Estatísticas do Projeto

Após subir, você terá:
- ✅ **12 arquivos** de código e documentação
- ✅ **Documentação completa** (README, SETUP, EXAMPLES)
- ✅ **Segurança garantida** (.gitignore configurado)
- ✅ **Licença MIT** (código aberto)
- ✅ **Scripts de deploy** automatizados

## 🔗 Links Úteis

- **GitHub New Repo**: https://github.com/new
- **Git Documentation**: https://git-scm.com/doc
- **GitHub Guides**: https://guides.github.com/

## 🆘 Problemas Comuns

### "Git não é reconhecido"
Instale o Git: https://git-scm.com/download/win

### "Permission denied"
Configure suas credenciais:
```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"
```

### "Repository not found"
Verifique se o repositório foi criado no GitHub e se o username está correto.

## 📞 Precisa de Ajuda?

Se tiver dificuldades, entre em contato:

- 📧 **Email**: contato@automacoescomerciais.com.br
- 💬 **Telegram**: https://t.me/+9cdym9gvPQ9iOWNh
- 📱 **WhatsApp**: +55 88 92156-7214

---

**🎉 Seu projeto estará no ar em poucos minutos!**
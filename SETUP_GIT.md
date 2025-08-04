# 🚀 Setup Git Manual - Projeto ACI

## 📋 Passo a Passo Completo

### **1. Instalar Git**
1. **Acesse**: https://git-scm.com/download/win
2. **Baixe** o instalador
3. **Execute** e mantenha as configurações padrão
4. **Reinicie** o terminal/VS Code

### **2. Verificar Instalação**
```cmd
git --version
```
Deve mostrar algo como: `git version 2.x.x`

### **3. Configurar Git (Primeira vez)**
```cmd
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

### **4. Inicializar Repositório**
```cmd
git init
git branch -M main
```

### **5. Adicionar Arquivos**
```cmd
git add .
```

### **6. Primeiro Commit**
```cmd
git commit -m "feat: projeto ACI - sistema de automações comerciais integradas

- Sistema de autenticação funcionando (admin@aci.com/admin123)
- Dashboard com sidebar completa
- Integração Telegram + Shopee
- Painel administrativo operacional
- Interface responsiva com Tailwind CSS
- Todas as funcionalidades restauradas"
```

### **7. Conectar com GitHub**

**Primeiro, crie um repositório no GitHub:**
1. Vá para https://github.com
2. Clique em "New repository"
3. Nome: `aci-automacoes-comerciais`
4. Deixe público ou privado
5. **NÃO** marque "Initialize with README"
6. Clique "Create repository"

**Depois conecte:**
```cmd
git remote add origin https://github.com/SEU_USUARIO/aci-automacoes-comerciais.git
```

### **8. Push para GitHub**
```cmd
git push -u origin main
```

## 🎯 Comandos Resumidos (Copie e Cole)

**Após instalar o Git, execute estes comandos um por vez:**

```cmd
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
git init
git branch -M main
git add .
git commit -m "feat: projeto ACI completo - sistema funcionando"
git remote add origin https://github.com/SEU_USUARIO/aci-automacoes-comerciais.git
git push -u origin main
```

## 🔄 Para Commits Futuros

**Depois do setup inicial, use:**
```cmd
git add .
git commit -m "sua mensagem aqui"
git push
```

## 📱 Alternativa: GitHub Desktop

Se preferir interface gráfica:
1. **Baixe**: https://desktop.github.com/
2. **Instale** o GitHub Desktop
3. **Adicione** repositório existente
4. **Commit** e **Push** pela interface

## ⚡ Scripts Automáticos (Após instalar Git)

```cmd
REM Configuração inicial
scripts\git-setup.bat

REM Commits futuros
scripts\git-commit.bat
```

## 🆘 Problemas Comuns

**"git não é reconhecido":**
- Instale o Git: https://git-scm.com/download/win
- Reinicie o terminal

**"Permission denied":**
- Configure SSH ou use HTTPS
- Verifique permissões do repositório

**"Repository not found":**
- Crie o repositório no GitHub primeiro
- Verifique a URL do remote
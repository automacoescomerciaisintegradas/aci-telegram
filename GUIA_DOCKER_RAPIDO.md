# 🐳 Guia Rápido Docker - ACI

## ✅ Seu projeto já está 100% configurado para Docker!

### 🚀 Como usar (3 comandos):

#### 1. Verificar variáveis de ambiente
```bash
# Suas variáveis já estão configuradas no .env.local:
# ✅ REACT_APP_SUPABASE_URL
# ✅ REACT_APP_SUPABASE_ANON_KEY
```

#### 2. Deploy automático
```bash
# Windows (PowerShell)
npm run docker:deploy:ps

# Linux/macOS
bash scripts/docker-deploy.sh

# Windows (CMD)
scripts\docker-deploy.bat
```

#### 3. Acessar aplicação
- **Desenvolvimento**: http://localhost:3000
- **Produção**: http://localhost

## 📋 Comandos essenciais

```bash
# Desenvolvimento
npm run docker:dev

# Produção
npm run docker:prod

# Ver logs
docker-compose logs -f

# Parar aplicação
docker-compose down
```

## 📤 Push para DockerHub

```bash
# 1. Login
docker login

# 2. Build e tag
docker build -t aci-automacoes:latest .
docker tag aci-automacoes:latest seuusuario/aci-automacoes:latest

# 3. Push
docker push seuusuario/aci-automacoes:latest
```

## 🏗️ Arquitetura

- ✅ **Multi-stage build** (60% menor)
- ✅ **Nginx otimizado** para React/Vite
- ✅ **Supabase integrado**
- ✅ **Variáveis de ambiente** configuradas
- ✅ **Scripts automatizados**

## 🎯 Próximo passo

Execute agora:
```bash
npm run docker:deploy:ps
```

**Sucesso! 🚀**
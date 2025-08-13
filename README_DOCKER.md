# 🐳 Docker - ACI Automações Comerciais Integradas

## 🚀 Início Rápido

### 1. Configure as Variáveis de Ambiente
```bash
# Certifique-se de que o arquivo .env.local existe com suas chaves:
GEMINI_API_KEY=sua_chave_gemini_aqui
API_KEY=sua_chave_gemini_aqui
```

### 2. Execute o Deploy Automático
```bash
# Comando mais fácil - faz tudo automaticamente
bash scripts/docker-deploy.sh
```

### 3. Acesse a Aplicação
- **Desenvolvimento**: http://localhost:3000
- **Produção**: http://localhost

## 📋 Comandos Essenciais

### Desenvolvimento
```bash
npm run docker:dev          # Desenvolvimento com build
docker-compose up --build   # Alternativa manual
```

### Produção
```bash
npm run docker:prod         # Produção otimizada
bash scripts/docker-deploy.sh  # Deploy completo
```

### Monitoramento
```bash
docker-compose logs -f      # Ver logs em tempo real
docker ps                   # Ver containers rodando
docker stats                # Ver uso de recursos
```

## 📤 Push para DockerHub

### Método Automático (Recomendado)
```bash
# Execute o script e escolha a opção de push
bash scripts/docker-deploy.sh
```

### Método Manual
```bash
# 1. Login no DockerHub
docker login

# 2. Build da imagem
docker build -t aci-automacoes:latest .

# 3. Criar tag para seu usuário
docker tag aci-automacoes:latest seuusuario/aci-automacoes:latest

# 4. Fazer push
docker push seuusuario/aci-automacoes:latest
```

## 🏗️ Arquitetura

### Multi-Stage Build
- **Estágio 1**: Build da aplicação React/Vite
- **Estágio 2**: Servidor Nginx otimizado

### Benefícios
- ✅ Imagem final 60% menor
- ✅ Nginx otimizado para SPA React
- ✅ Compressão gzip habilitada
- ✅ Cache de arquivos estáticos
- ✅ Headers de segurança configurados

## 🔧 Configurações Avançadas

### Portas Customizadas
```bash
# Desenvolvimento na porta 8080
docker run -p 8080:80 --env-file .env.local aci-automacoes

# Produção com múltiplas portas
docker run -p 80:80 -p 443:443 --env-file .env.local aci-automacoes
```

### Variáveis de Ambiente
```env
# Obrigatórias
GEMINI_API_KEY=sua_chave_gemini
API_KEY=sua_chave_gemini

# Opcionais
VITE_BITLY_ACCESS_TOKEN=token_bitly
VITE_SUPABASE_URL=url_supabase
VITE_SUPABASE_ANON_KEY=chave_supabase
```

## 🐛 Solução de Problemas

### Problemas Comuns

1. **"API Key não encontrada"**
   ```bash
   # Verificar se .env.local existe
   ls -la .env.local
   cat .env.local | grep GEMINI_API_KEY
   ```

2. **"Porta já em uso"**
   ```bash
   # Verificar qual processo usa a porta
   netstat -tulpn | grep :3000
   # Usar porta diferente
   docker run -p 8080:80 aci-automacoes
   ```

3. **"Container não inicia"**
   ```bash
   # Ver logs detalhados
   docker logs aci-app
   # Executar em modo debug
   docker run -it aci-automacoes sh
   ```

## 📚 Documentação Completa

- **`GUIA_DOCKER_COMPLETO.md`** - Guia completo e detalhado
- **`INSTRUCOES_DOCKER.md`** - Instruções passo a passo
- **`COMANDOS_DOCKER.md`** - Referência de comandos

## 🎯 Próximos Passos

1. ✅ Configure suas APIs no `.env.local`
2. ✅ Execute: `bash scripts/docker-deploy.sh`
3. ✅ Teste localmente antes de publicar
4. ✅ Configure DockerHub para distribuição

**Comando para começar:**
```bash
bash scripts/docker-deploy.sh
```

**Sucesso! 🚀**
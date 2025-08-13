# 🐳 Comandos Docker - Guia Prático ACI

## 🚀 Comandos Essenciais

### Início Rápido
```bash
# Método mais fácil - Script automatizado
bash scripts/docker-deploy.sh

# Desenvolvimento rápido
npm run docker:dev

# Produção rápida
npm run docker:prod
```

### Build da Imagem
```bash
# Build básico
docker build -t aci-automacoes .

# Build com nome personalizado
docker build -t meu-aci:v1.0 .

# Build sem cache (quando há problemas)
docker build --no-cache -t aci-automacoes .

# Build apenas produção (menor)
docker build --target production -t aci-automacoes:prod .
```

### Executar Container
```bash
# Executar em desenvolvimento (porta 3000)
docker run -d --name aci-dev -p 3000:80 --env-file .env.local aci-automacoes

# Executar em produção (porta 80)
docker run -d --name aci-prod -p 80:80 --env-file .env.local aci-automacoes

# Executar com porta customizada
docker run -d --name aci-app -p 8080:80 --env-file .env.local aci-automacoes

# Executar com variáveis específicas
docker run -d --name aci-app -p 3000:80 \
  -e GEMINI_API_KEY=sua_chave \
  -e API_KEY=sua_chave \
  aci-automacoes
```

## 📊 Monitoramento

### Ver Status
```bash
# Containers rodando
docker ps

# Todos os containers (incluindo parados)
docker ps -a

# Apenas containers do ACI
docker ps --filter "name=aci"

# Uso de recursos em tempo real
docker stats

# Uso de recursos de um container específico
docker stats aci-app
```

### Logs
```bash
# Ver logs do container
docker logs aci-app

# Ver logs em tempo real
docker logs -f aci-app

# Ver últimas 50 linhas
docker logs --tail 50 aci-app

# Logs com timestamp
docker logs -t aci-app

# Logs do Docker Compose
docker-compose logs -f
```

### Executar Comandos no Container
```bash
# Abrir shell no container
docker exec -it aci-app sh

# Executar comando específico
docker exec aci-app ls -la /usr/share/nginx/html

# Ver variáveis de ambiente
docker exec aci-app env

# Ver processos rodando
docker exec aci-app ps aux
```

## 🔧 Gerenciamento

### Parar e Iniciar
```bash
# Parar container
docker stop aci-app

# Iniciar container parado
docker start aci-app

# Reiniciar container
docker restart aci-app

# Parar todos os containers
docker stop $(docker ps -q)
```

### Remover
```bash
# Remover container (deve estar parado)
docker rm aci-app

# Forçar remoção (mesmo rodando)
docker rm -f aci-app

# Remover imagem
docker rmi aci-automacoes

# Remover imagem forçadamente
docker rmi -f aci-automacoes
```

## 🐙 Docker Compose

### Comandos Básicos
```bash
# Executar em background
docker-compose up -d

# Executar com build
docker-compose up --build

# Executar produção
docker-compose -f docker-compose.prod.yml up -d

# Parar tudo
docker-compose down

# Parar e remover volumes
docker-compose down -v
```

### Gerenciamento de Serviços
```bash
# Reiniciar serviço específico
docker-compose restart aci-app

# Ver logs de serviço específico
docker-compose logs -f aci-app

# Executar comando em serviço
docker-compose exec aci-app sh

# Escalar serviço (múltiplas instâncias)
docker-compose up --scale aci-app=3
```

## 📤 DockerHub

### Login e Configuração
```bash
# Fazer login
docker login

# Login com usuário específico
docker login -u seuusuario

# Logout
docker logout
```

### Tags e Push
```bash
# Criar tag para DockerHub
docker tag aci-automacoes seuusuario/aci-automacoes:latest

# Criar tag com versão
docker tag aci-automacoes seuusuario/aci-automacoes:v1.0.0

# Push para DockerHub
docker push seuusuario/aci-automacoes:latest

# Push de todas as tags
docker push seuusuario/aci-automacoes --all-tags
```

### Pull e Uso
```bash
# Baixar imagem do DockerHub
docker pull seuusuario/aci-automacoes:latest

# Executar imagem do DockerHub
docker run -d -p 3000:80 --env-file .env.local seuusuario/aci-automacoes:latest
```

## 🧹 Limpeza

### Limpeza Básica
```bash
# Remover containers parados
docker container prune

# Remover imagens não utilizadas
docker image prune

# Remover redes não utilizadas
docker network prune

# Remover volumes não utilizados
docker volume prune
```

### Limpeza Avançada
```bash
# Limpeza geral (cuidado!)
docker system prune

# Limpeza completa incluindo imagens em uso
docker system prune -a

# Ver espaço usado pelo Docker
docker system df

# Limpeza com confirmação
docker system prune --volumes
```

## 🔍 Debug e Troubleshooting

### Investigação
```bash
# Inspecionar container
docker inspect aci-app

# Ver configuração de rede
docker network ls
docker network inspect bridge

# Ver volumes
docker volume ls
docker volume inspect volume_name

# Ver imagens
docker images

# Ver histórico da imagem
docker history aci-automacoes
```

### Health Check
```bash
# Ver status do health check
docker inspect aci-app | grep Health -A 10

# Testar health check manualmente
curl -f http://localhost:3000/

# Ver logs do health check
docker logs aci-app | grep health
```

### Problemas Comuns
```bash
# Container não inicia - ver logs
docker logs aci-app

# Porta ocupada - verificar
netstat -tulpn | grep :3000
lsof -i :3000

# Espaço em disco
df -h
docker system df

# Memória insuficiente
free -h
docker stats --no-stream
```

## 🌐 Rede e Conectividade

### Configuração de Rede
```bash
# Criar rede personalizada
docker network create aci-network

# Executar container em rede específica
docker run --network aci-network aci-automacoes

# Conectar container a rede
docker network connect aci-network aci-app

# Desconectar da rede
docker network disconnect aci-network aci-app
```

### Teste de Conectividade
```bash
# Testar conectividade entre containers
docker exec aci-app ping outro-container

# Testar conectividade externa
docker exec aci-app curl -I https://google.com

# Ver portas abertas no container
docker exec aci-app netstat -tulpn
```

## 📁 Volumes e Dados

### Gerenciamento de Volumes
```bash
# Criar volume
docker volume create aci-data

# Executar com volume
docker run -v aci-data:/data aci-automacoes

# Executar com bind mount
docker run -v $(pwd)/logs:/var/log/nginx aci-automacoes

# Listar volumes
docker volume ls

# Inspecionar volume
docker volume inspect aci-data
```

### Backup e Restore
```bash
# Backup de volume
docker run --rm -v aci-data:/data -v $(pwd):/backup alpine tar czf /backup/backup.tar.gz -C /data .

# Restore de volume
docker run --rm -v aci-data:/data -v $(pwd):/backup alpine tar xzf /backup/backup.tar.gz -C /data
```

## ⚡ Scripts Úteis

### Script de Deploy Completo
```bash
#!/bin/bash
# deploy.sh
docker-compose down
docker build -t aci-automacoes:latest .
docker-compose up -d
docker-compose logs -f
```

### Script de Limpeza
```bash
#!/bin/bash
# cleanup.sh
docker stop $(docker ps -q) 2>/dev/null || true
docker rm $(docker ps -aq) 2>/dev/null || true
docker rmi $(docker images -q) 2>/dev/null || true
docker system prune -f
```

### Script de Backup
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
docker save aci-automacoes:latest | gzip > aci-backup-$DATE.tar.gz
echo "Backup salvo como: aci-backup-$DATE.tar.gz"
```

---

## 💡 Dicas Importantes

1. **Sempre use .env.local** para variáveis sensíveis
2. **Teste localmente** antes de fazer push
3. **Use tags de versão** para controle
4. **Monitore recursos** com `docker stats`
5. **Faça backup** das imagens importantes
6. **Limpe regularmente** para economizar espaço

**Comandos Docker dominados! 🎉**
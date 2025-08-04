# Multi-stage build para otimizar o tamanho da imagem final
FROM node:20-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Instalar dependências do sistema necessárias
RUN apk add --no-cache git

# Copiar arquivos de dependências primeiro (para cache layer)
COPY package*.json ./

# Instalar todas as dependências (incluindo devDependencies para o build)
RUN npm ci --only=production=false

# Copiar código fonte
COPY . .

# Copiar arquivo de ambiente de exemplo se não existir .env.local
RUN if [ ! -f .env.local ]; then cp .env.example .env.local; fi

# Fazer build da aplicação com otimizações
RUN npm run build

# Limpar cache do npm para reduzir tamanho
RUN npm cache clean --force

# Estágio de produção com nginx
FROM nginx:alpine AS production

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar arquivos buildados do estágio anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Expor porta 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
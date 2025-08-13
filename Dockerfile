# Multi-stage build para otimizar o tamanho da imagem final
FROM node:20-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Instalar dependências do sistema necessárias
RUN apk add --no-cache git

# Copiar arquivos de dependências primeiro (para cache de layers)
COPY package*.json ./

# Instalar dependências (incluindo devDependencies para build)
RUN npm ci --only=production=false --silent && npm cache clean --force

# Copiar código fonte
COPY . .

# Definir variáveis de ambiente para build
ARG REACT_APP_SUPABASE_URL
ARG REACT_APP_SUPABASE_ANON_KEY
ARG GEMINI_API_KEY
ARG API_KEY
ENV REACT_APP_SUPABASE_URL=${REACT_APP_SUPABASE_URL}
ENV REACT_APP_SUPABASE_ANON_KEY=${REACT_APP_SUPABASE_ANON_KEY}
ENV GEMINI_API_KEY=${GEMINI_API_KEY}
ENV API_KEY=${API_KEY}

# Criar build de produção
RUN npm run build

# Estágio de produção com nginx
FROM nginx:alpine AS production

# Instalar curl para health checks
RUN apk add --no-cache curl

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar arquivos buildados do estágio anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nginx && \
    adduser -S nginx -u 1001

# Ajustar permissões
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Expor porta 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Usar usuário não-root
USER nginx

# Comando padrão
CMD ["nginx", "-g", "daemon off;"]
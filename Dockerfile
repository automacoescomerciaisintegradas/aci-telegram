# Multi-stage build para otimizar o tamanho da imagem final
FROM node:20-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production --silent

# Copiar código fonte
COPY . .

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

# Criar script para substituir variáveis de ambiente em runtime
RUN echo '#!/bin/sh' > /docker-entrypoint.d/30-envsubst-on-templates.sh && \
    echo 'set -e' >> /docker-entrypoint.d/30-envsubst-on-templates.sh && \
    echo 'if [ -n "$GEMINI_API_KEY" ]; then' >> /docker-entrypoint.d/30-envsubst-on-templates.sh && \
    echo '  find /usr/share/nginx/html -name "*.js" -exec sed -i "s|PLACEHOLDER_GEMINI_API_KEY|$GEMINI_API_KEY|g" {} \;' >> /docker-entrypoint.d/30-envsubst-on-templates.sh && \
    echo 'fi' >> /docker-entrypoint.d/30-envsubst-on-templates.sh && \
    chmod +x /docker-entrypoint.d/30-envsubst-on-templates.sh

# Expor porta 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Comando padrão (nginx já é o padrão da imagem base)
CMD ["nginx", "-g", "daemon off;"]
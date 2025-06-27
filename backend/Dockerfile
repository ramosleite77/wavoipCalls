FROM node:18-alpine

# Instalar netcat para verificar conectividade
RUN apk add --no-cache netcat-openbsd

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar todas as dependências (incluindo devDependencies para build)
RUN npm install --force

# Copiar código fonte (incluindo start.sh)
COPY . .

# Garantir que o script tenha permissões corretas
RUN chmod +x start.sh

# Compilar TypeScript
RUN npm run build

# Verificar se o script existe e tem permissões
RUN ls -la start.sh

# Expor porta
EXPOSE 3100

# Comando para iniciar a aplicação
CMD ["sh", "./start.sh"] 
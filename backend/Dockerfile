FROM node:18-alpine

# Instalar netcat para verificar conectividade
RUN apk add --no-cache netcat-openbsd

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar todas as dependências (incluindo devDependencies para build)
RUN npm ci

# Copiar código fonte
COPY . .

# Compilar TypeScript
RUN npm run build

# Tornar o script executável
RUN chmod +x start.sh

# Expor porta
EXPOSE 3100

# Comando para iniciar a aplicação
CMD ["./start.sh"] 
FROM node:18-alpine

# Instalar netcat e dos2unix para verificar conectividade e converter arquivos
RUN apk add --no-cache netcat-openbsd dos2unix

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar todas as dependências (incluindo devDependencies para build)
RUN npm install --force

# Copiar código fonte (incluindo start.sh)
COPY . .

# Converter start.sh para formato Unix e garantir permissões
RUN dos2unix start.sh && chmod +x start.sh

# Verificar arquivos antes do build
RUN echo "Arquivos antes do build:" && ls -la src/config/ && ls -la src/database/

# Verificar se TypeScript está instalado
RUN npx tsc --version

# Compilar TypeScript com mais detalhes
RUN npm run build || echo "Build falhou"

# Verificar se os arquivos foram compilados
RUN echo "Arquivos após o build:" && ls -la dist/ || echo "Diretório dist não encontrado"
RUN ls -la dist/config/ || echo "Diretório dist/config não encontrado"
RUN ls -la dist/database/ || echo "Diretório dist/database não encontrado"

# Expor porta
EXPOSE 3100

# Comando para iniciar a aplicação
CMD ["sh", "./start.sh"] 
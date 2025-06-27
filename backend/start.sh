#!/bin/sh

echo "Aguardando banco de dados estar pronto..."

# Tentar conectar várias vezes com sleep
sleep 5
nc -z postgres 5432 || sleep 5
nc -z postgres 5432 || sleep 5
nc -z postgres 5432 || sleep 5
nc -z postgres 5432 || sleep 5
nc -z postgres 5432 || sleep 5
nc -z postgres 5432 || sleep 5
nc -z postgres 5432 || sleep 5
nc -z postgres 5432 || sleep 5
nc -z postgres 5432 || sleep 5
nc -z postgres 5432 || sleep 5

echo "Banco de dados está pronto!"

# Verificar se os arquivos compilados existem
echo "Verificando arquivos compilados..."
if [ ! -d "dist" ]; then
  echo "Diretório dist não encontrado, tentando build novamente..."
  npm run build
fi

ls -la dist/ || echo "Diretório dist não encontrado"
ls -la dist/config/ || echo "Diretório dist/config não encontrado"

echo "Executando migrações..."
npx sequelize-cli db:migrate || echo "Erro nas migrações"

echo "Executando seeds..."
npx sequelize-cli db:seed:all || echo "Erro nos seeds"

echo "Iniciando aplicação..."
node dist/server.js 
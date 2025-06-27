#!/bin/sh

echo "=== Iniciando script de inicialização ==="

# Aguardar o banco de dados estar pronto
echo "Aguardando banco de dados estar pronto..."
while true; do
  if nc -z postgres 5432; then
    break
  fi
  echo "Tentando conectar ao PostgreSQL..."
  sleep 2
done
echo "Banco de dados está pronto!"

# Executar migrações
echo "Executando migrações..."
npx sequelize db:migrate || echo "Erro nas migrações, continuando..."

# Executar seeds
echo "Executando seeds..."
npx sequelize db:seed:all || echo "Nenhum seed para executar ou erro no seed"

# Iniciar a aplicação
echo "Iniciando aplicação..."
exec node dist/server.js 
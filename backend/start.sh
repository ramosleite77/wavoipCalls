#!/bin/sh

# Aguardar o banco de dados estar pronto
echo "Aguardando banco de dados estar pronto..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "Banco de dados está pronto!"

# Executar migrações
echo "Executando migrações..."
npm run migrate

# Executar seeds (se existirem)
echo "Executando seeds..."
npm run seed || echo "Nenhum seed para executar ou erro no seed"

# Iniciar a aplicação
echo "Iniciando aplicação..."
npm run start:prod 
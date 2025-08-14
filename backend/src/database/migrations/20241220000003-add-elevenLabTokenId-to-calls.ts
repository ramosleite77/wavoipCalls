import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  // Primeiro, tornar o vapiTokenId opcional
  await queryInterface.changeColumn('Calls', 'vapiTokenId', {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'VapiTokens',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  });

  // Adicionar o campo elevenLabTokenId
  await queryInterface.addColumn('Calls', 'elevenLabTokenId', {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'ElevenLabTokens',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  });
}

export async function down(queryInterface: QueryInterface) {
  // Remover o campo elevenLabTokenId
  await queryInterface.removeColumn('Calls', 'elevenLabTokenId');

  // Reverter o vapiTokenId para obrigatório
  await queryInterface.changeColumn('Calls', 'vapiTokenId', {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'VapiTokens',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  });
}

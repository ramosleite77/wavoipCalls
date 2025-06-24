import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.addColumn('Calls', 'vapiTokenId', {
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

export async function down(queryInterface: QueryInterface) {
  await queryInterface.removeColumn('Calls', 'vapiTokenId');
} 
import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.addColumn('VapiTokens', 'name', {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Token Vapi',
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.removeColumn('VapiTokens', 'name');
} 
import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.addColumn('WavoipTokens', 'name', {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Token Wavoip',
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.removeColumn('WavoipTokens', 'name');
} 
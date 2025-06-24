import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.changeColumn('CallLogs', 'option', {
    type: DataTypes.TEXT,
    allowNull: false,
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.changeColumn('CallLogs', 'option', {
    type: DataTypes.STRING,
    allowNull: false,
  });
} 
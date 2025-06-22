import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.addIndex('Users', ['email']);
  await queryInterface.addIndex('Tenants', ['email']);
  await queryInterface.addIndex('Calls', ['tenantId']);
  await queryInterface.addIndex('CallLogs', ['tenantId']);
  await queryInterface.addIndex('WavoipTokens', ['tenantId']);
  await queryInterface.addIndex('VapiTokens', ['tenantId']);
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.removeIndex('Users', ['email']);
  await queryInterface.removeIndex('Tenants', ['email']);
  await queryInterface.removeIndex('Calls', ['tenantId']);
  await queryInterface.removeIndex('CallLogs', ['tenantId']);
  await queryInterface.removeIndex('WavoipTokens', ['tenantId']);
  await queryInterface.removeIndex('VapiTokens', ['tenantId']);
} 
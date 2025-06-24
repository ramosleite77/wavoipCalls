import { QueryInterface } from 'sequelize';
import { hash } from 'bcryptjs';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    try {
      await queryInterface.sequelize.query(
        `INSERT INTO "Tenants" (name, email, "passwordHash", "createdAt", "updatedAt") VALUES
        ('Tenant 1', 'tenant1@example.com', '${await hash('tenantpassword', 8)}', NOW(), NOW())
        RETURNING id;`
      );

      const [tenant]: any = await queryInterface.sequelize.query(
        `SELECT id FROM "Tenants" WHERE email = 'tenant1@example.com';`
      );

      await queryInterface.sequelize.query(
        `INSERT INTO "Users" (name, email, "passwordHash", "tenantId", "createdAt", "updatedAt") VALUES
        ('Admin User', 'admin@example.com', '${await hash('adminpassword', 8)}', ${tenant[0].id}, NOW(), NOW());`
      );
    } catch (error) {
      console.error("Erro ao executar seed de Admin User:", (error as Error).message);
    }
  },

  down: async (queryInterface: QueryInterface) => {
    try {
      await queryInterface.bulkDelete('Users', {}, {});
      await queryInterface.bulkDelete('Tenants', {}, {});
    } catch (error) {
      console.error("Erro ao reverter seed de Admin User:", (error as Error).message);
    }
  }
}; 
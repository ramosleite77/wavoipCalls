import { QueryInterface } from 'sequelize';
import { hash } from 'bcryptjs';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    try {
      // Verificar se o tenant já existe
      const [existingTenant]: any = await queryInterface.sequelize.query(
        `SELECT id FROM "Tenants" WHERE email = 'tenant1@example.com';`
      );

      let tenantId;

      if (existingTenant.length === 0) {
        // Criar tenant se não existir
        const [newTenant]: any = await queryInterface.sequelize.query(
          `INSERT INTO "Tenants" (name, email, "passwordHash", "createdAt", "updatedAt") VALUES
          ('Tenant 1', 'tenant1@example.com', '${await hash('tenantpassword', 8)}', NOW(), NOW())
          RETURNING id;`
        );
        tenantId = newTenant[0].id;
      } else {
        tenantId = existingTenant[0].id;
      }

      // Verificar se o user já existe
      const [existingUser]: any = await queryInterface.sequelize.query(
        `SELECT id FROM "Users" WHERE email = 'admin@example.com';`
      );

      if (existingUser.length === 0) {
        // Criar user se não existir
        await queryInterface.sequelize.query(
          `INSERT INTO "Users" (name, email, "passwordHash", "tenantId", "createdAt", "updatedAt") VALUES
          ('Admin User', 'admin@example.com', '${await hash('adminpassword', 8)}', ${tenantId}, NOW(), NOW());`
        );
      }
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
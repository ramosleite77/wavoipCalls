import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  try {
    console.log('Iniciando migração para permitir NULL em vapiTokenId...');
    
    // Primeiro, verificar se a coluna existe e qual é sua configuração atual
    const tableDescription: any = await queryInterface.describeTable('Calls');
    console.log('Estrutura atual da tabela Calls:', tableDescription);
    
    if (tableDescription.vapiTokenId) {
      console.log('Coluna vapiTokenId encontrada. Configuração atual:', tableDescription.vapiTokenId);
      
      // Usar SQL direto para garantir que a alteração seja aplicada
      await queryInterface.sequelize.query(`
        ALTER TABLE "Calls" 
        ALTER COLUMN "vapiTokenId" DROP NOT NULL,
        ALTER COLUMN "vapiTokenId" DROP DEFAULT;
      `);
      
      console.log('Coluna vapiTokenId alterada com sucesso para permitir NULL');
    } else {
      console.log('Coluna vapiTokenId não encontrada na tabela Calls');
    }
    
    // Verificar se a alteração foi aplicada
    const updatedTableDescription: any = await queryInterface.describeTable('Calls');
    console.log('Estrutura atualizada da tabela Calls:', updatedTableDescription);
    
  } catch (error) {
    console.error('Erro na migração:', error);
    throw error;
  }
}

export async function down(queryInterface: QueryInterface) {
  try {
    console.log('Revertendo migração para tornar vapiTokenId NOT NULL...');
    
    // Usar SQL direto para reverter a alteração
    await queryInterface.sequelize.query(`
      ALTER TABLE "Calls" 
      ALTER COLUMN "vapiTokenId" SET NOT NULL;
    `);
    
    console.log('Coluna vapiTokenId revertida com sucesso para NOT NULL');
    
  } catch (error) {
    console.error('Erro ao reverter migração:', error);
    throw error;
  }
}

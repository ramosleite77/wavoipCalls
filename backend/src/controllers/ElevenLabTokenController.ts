import { Request, Response } from 'express';
import ElevenLabTokenService from '../services/ElevenLabTokenService';
import logger from '../utils/logger';

class ElevenLabTokenController {
  async createElevenLabToken(req: Request, res: Response) {
    logger.info('Dados recebidos para criar ElevenLabToken: ' + JSON.stringify(req.body));
    const { tenantId, ...data } = req.body;
    const token = await ElevenLabTokenService.createElevenLabToken(data, tenantId);
    res.json(token);
  }

  async getElevenLabTokenById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { tenantId } = req.query;
      
      // Validar se tenantId é um número válido
      const tenantIdNum = Number(tenantId);
      if (isNaN(tenantIdNum)) {
        return res.status(400).json({ error: 'tenantId é obrigatório e deve ser um número válido' });
      }
      
      const token = await ElevenLabTokenService.getElevenLabTokenById(Number(id), tenantIdNum);
      res.json(token);
    } catch (error) {
      logger.error('Erro ao buscar token: ' + (error instanceof Error ? error.message : String(error)));
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async updateElevenLabToken(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { tenantId, ...data } = req.body;
      
      // Validar se tenantId é um número válido
      const tenantIdNum = Number(tenantId);
      if (isNaN(tenantIdNum)) {
        return res.status(400).json({ error: 'tenantId é obrigatório e deve ser um número válido' });
      }
      
      // Verificar se o token existe antes de atualizar
      const existingToken = await ElevenLabTokenService.getElevenLabTokenById(Number(id), tenantIdNum);
      if (!existingToken) {
        return res.status(404).json({ error: 'Token não encontrado' });
      }
      
      const token = await ElevenLabTokenService.updateElevenLabToken(Number(id), data, tenantIdNum);
      res.json({ message: 'Token atualizado com sucesso', token });
    } catch (error) {
      logger.error('Erro ao atualizar token: ' + (error instanceof Error ? error.message : String(error)));
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async deleteElevenLabToken(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { tenantId } = req.query;
      
      // Validar se tenantId é um número válido
      const tenantIdNum = Number(tenantId);
      if (isNaN(tenantIdNum)) {
        return res.status(400).json({ error: 'tenantId é obrigatório e deve ser um número válido' });
      }
      
      // Verificar se o token existe antes de deletar
      const existingToken = await ElevenLabTokenService.getElevenLabTokenById(Number(id), tenantIdNum);
      if (!existingToken) {
        return res.status(404).json({ error: 'Token não encontrado' });
      }
      
      await ElevenLabTokenService.deleteElevenLabToken(Number(id), tenantIdNum);
      res.json({ message: 'Token deletado com sucesso' });
    } catch (error) {
      logger.error('Erro ao deletar token: ' + (error instanceof Error ? error.message : String(error)));
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async listAgents(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { tenantId } = req.query;
      
      // Validar se tenantId é um número válido
      const tenantIdNum = Number(tenantId);
      if (isNaN(tenantIdNum)) {
        return res.status(400).json({ error: 'tenantId é obrigatório e deve ser um número válido' });
      }
      
      const token = await ElevenLabTokenService.getElevenLabTokenById(Number(id), tenantIdNum);
      
      if (!token) {
        return res.status(404).json({ error: 'Token não encontrado. Agents não estão disponíveis.' });
      }
      
      const agents = await ElevenLabTokenService.listAgents(token.token);
      res.json(agents);
    } catch (error) {
      logger.error('Erro ao listar agents: ' + (error instanceof Error ? error.message : String(error)));
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async listPhoneNumbers(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { tenantId } = req.query;
      
      // Validar se tenantId é um número válido
      const tenantIdNum = Number(tenantId);
      if (isNaN(tenantIdNum)) {
        return res.status(400).json({ error: 'tenantId é obrigatório e deve ser um número válido' });
      }
      
      const token = await ElevenLabTokenService.getElevenLabTokenById(Number(id), tenantIdNum);
      
      if (!token) {
        return res.status(404).json({ error: 'Token não encontrado. Phone numbers não estão disponíveis.' });
      }
      
      const phoneNumbers = await ElevenLabTokenService.listPhoneNumbers(token.token);
      res.json(phoneNumbers);
    } catch (error) {
      logger.error('Erro ao listar phone numbers: ' + (error instanceof Error ? error.message : String(error)));
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async makeOutboundCall(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { tenantId, agentId, agentPhoneNumberId, toNumber, conversationInitiationClientData } = req.body;
      
      // Validar se tenantId é um número válido
      const tenantIdNum = Number(tenantId);
      if (isNaN(tenantIdNum)) {
        return res.status(400).json({ error: 'tenantId é obrigatório e deve ser um número válido' });
      }
      
      // Validar campos obrigatórios
      if (!agentId || !agentPhoneNumberId || !toNumber) {
        return res.status(400).json({ error: 'agentId, agentPhoneNumberId e toNumber são obrigatórios' });
      }
      
      const token = await ElevenLabTokenService.getElevenLabTokenById(Number(id), tenantIdNum);
      
      if (!token) {
        return res.status(404).json({ error: 'Token não encontrado. Chamada não pode ser realizada.' });
      }
      
      const callResult = await ElevenLabTokenService.makeOutboundCall(
        token.token,
        agentId,
        agentPhoneNumberId,
        toNumber,
        conversationInitiationClientData
      );
      
      res.json(callResult);
    } catch (error) {
      logger.error('Erro ao realizar chamada: ' + (error instanceof Error ? error.message : String(error)));
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async listElevenLabTokens(req: Request, res: Response) {
    const tokens = await ElevenLabTokenService.getAllElevenLabTokens();
    res.json(tokens);
  }
}

export default new ElevenLabTokenController();

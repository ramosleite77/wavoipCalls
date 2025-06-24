import { Request, Response } from 'express';
import VapiTokenService from '../services/VapiTokenService';

class VapiTokenController {
  async createVapiToken(req: Request, res: Response) {
    console.log('Dados recebidos para criar VapiToken:', req.body);
    const { tenantId, ...data } = req.body;
    const token = await VapiTokenService.createVapiToken(data, tenantId);
    res.json(token);
  }

  async getVapiTokenById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { tenantId } = req.query;
      
      // Validar se tenantId é um número válido
      const tenantIdNum = Number(tenantId);
      if (isNaN(tenantIdNum)) {
        return res.status(400).json({ error: 'tenantId é obrigatório e deve ser um número válido' });
      }
      
      const token = await VapiTokenService.getVapiTokenById(Number(id), tenantIdNum);
      res.json(token);
    } catch (error) {
      console.error('Erro ao buscar token:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async updateVapiToken(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { tenantId, ...data } = req.body;
      
      // Validar se tenantId é um número válido
      const tenantIdNum = Number(tenantId);
      if (isNaN(tenantIdNum)) {
        return res.status(400).json({ error: 'tenantId é obrigatório e deve ser um número válido' });
      }
      
      // Verificar se o token existe antes de atualizar
      const existingToken = await VapiTokenService.getVapiTokenById(Number(id), tenantIdNum);
      if (!existingToken) {
        return res.status(404).json({ error: 'Token não encontrado' });
      }
      
      const token = await VapiTokenService.updateVapiToken(Number(id), data, tenantIdNum);
      res.json({ message: 'Token atualizado com sucesso', token });
    } catch (error) {
      console.error('Erro ao atualizar token:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async deleteVapiToken(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { tenantId } = req.query;
      
      // Validar se tenantId é um número válido
      const tenantIdNum = Number(tenantId);
      if (isNaN(tenantIdNum)) {
        return res.status(400).json({ error: 'tenantId é obrigatório e deve ser um número válido' });
      }
      
      // Verificar se o token existe antes de deletar
      const existingToken = await VapiTokenService.getVapiTokenById(Number(id), tenantIdNum);
      if (!existingToken) {
        return res.status(404).json({ error: 'Token não encontrado' });
      }
      
      await VapiTokenService.deleteVapiToken(Number(id), tenantIdNum);
      res.json({ message: 'Token deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar token:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async listAssistants(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { tenantId } = req.query;
      
      // Validar se tenantId é um número válido
      const tenantIdNum = Number(tenantId);
      if (isNaN(tenantIdNum)) {
        return res.status(400).json({ error: 'tenantId é obrigatório e deve ser um número válido' });
      }
      
      const token = await VapiTokenService.getVapiTokenById(Number(id), tenantIdNum);
      
      if (!token) {
        return res.status(404).json({ error: 'Token não encontrado. Assistants não estão disponíveis.' });
      }
      
      const assistants = await VapiTokenService.listAssistants(token.token);
      res.json(assistants);
    } catch (error) {
      console.error('Erro ao listar assistants:', error);
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
      
      const token = await VapiTokenService.getVapiTokenById(Number(id), tenantIdNum);
      
      if (!token) {
        return res.status(404).json({ error: 'Token não encontrado. Phone numbers não estão disponíveis.' });
      }
      
      const phoneNumbers = await VapiTokenService.listPhoneNumbers(token.token);
      res.json(phoneNumbers);
    } catch (error) {
      console.error('Erro ao listar phone numbers:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async listVapiTokens(req: Request, res: Response) {
    const tokens = await VapiTokenService.getAllVapiTokens();
    res.json(tokens);
  }
}

export default new VapiTokenController(); 
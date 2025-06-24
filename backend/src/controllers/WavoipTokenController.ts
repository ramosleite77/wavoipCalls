import { Request, Response } from 'express';
import WavoipTokenService from '../services/WavoipTokenService';

class WavoipTokenController {
  async createWavoipToken(req: Request, res: Response) {
    try {
      const { tenantId, ...data } = req.body;
      
      // Validar se tenantId é um número válido
      const tenantIdNum = Number(tenantId);
      if (isNaN(tenantIdNum)) {
        return res.status(400).json({ error: 'tenantId é obrigatório e deve ser um número válido' });
      }
      
      const token = await WavoipTokenService.createWavoipToken(data, tenantIdNum);
      res.json({ message: 'Token criado com sucesso', token });
    } catch (error) {
      console.error('Erro ao criar token:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getWavoipTokenById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { tenantId } = req.query;
      
      // Validar se tenantId é um número válido
      const tenantIdNum = Number(tenantId);
      if (isNaN(tenantIdNum)) {
        return res.status(400).json({ error: 'tenantId é obrigatório e deve ser um número válido' });
      }
      
      const token = await WavoipTokenService.getWavoipTokenById(Number(id), tenantIdNum);
      if (!token) {
        return res.status(404).json({ error: 'Token não encontrado' });
      }
      res.json(token);
    } catch (error) {
      console.error('Erro ao buscar token:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async updateWavoipToken(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { tenantId, ...data } = req.body;
      
      // Validar se tenantId é um número válido
      const tenantIdNum = Number(tenantId);
      if (isNaN(tenantIdNum)) {
        return res.status(400).json({ error: 'tenantId é obrigatório e deve ser um número válido' });
      }
      
      // Verificar se o token existe antes de atualizar
      const existingToken = await WavoipTokenService.getWavoipTokenById(Number(id), tenantIdNum);
      if (!existingToken) {
        return res.status(404).json({ error: 'Token não encontrado' });
      }
      
      const token = await WavoipTokenService.updateWavoipToken(Number(id), data, tenantIdNum);
      res.json({ message: 'Token atualizado com sucesso', token });
    } catch (error) {
      console.error('Erro ao atualizar token:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async deleteWavoipToken(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { tenantId } = req.query;
      
      // Validar se tenantId é um número válido
      const tenantIdNum = Number(tenantId);
      if (isNaN(tenantIdNum)) {
        return res.status(400).json({ error: 'tenantId é obrigatório e deve ser um número válido' });
      }
      
      // Verificar se o token existe antes de deletar
      const existingToken = await WavoipTokenService.getWavoipTokenById(Number(id), tenantIdNum);
      if (!existingToken) {
        return res.status(404).json({ error: 'Token não encontrado' });
      }
      
      await WavoipTokenService.deleteWavoipToken(Number(id), tenantIdNum);
      res.json({ message: 'Token deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar token:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async listWavoipTokens(req: Request, res: Response) {
    try {
      const tokens = await WavoipTokenService.getAllWavoipTokens();
      res.json(tokens);
    } catch (error) {
      console.error('Erro ao listar tokens:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async checkDeviceAvailability(req: Request, res: Response) {
    try {
      const { token } = req.params;

      let tokenValue: string | undefined = String(token);
      if (!tokenValue || typeof tokenValue !== 'string' || tokenValue.trim() === '') {
        return res.status(400).json({ error: 'Token é obrigatório e deve ser uma string não vazia' });
      }

      const result = await WavoipTokenService.isDeviceAvailable(tokenValue);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export default new WavoipTokenController(); 
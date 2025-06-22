import { Request, Response } from 'express';
import VapiTokenService from '../services/VapiTokenService';

class VapiTokenController {
  async createVapiToken(req: Request, res: Response) {
    const { tenantId, ...data } = req.body;
    const token = await VapiTokenService.createVapiToken(data, tenantId);
    res.json(token);
  }

  async getVapiTokenById(req: Request, res: Response) {
    const { id } = req.params;
    const { tenantId } = req.query;
    const token = await VapiTokenService.getVapiTokenById(Number(id), Number(tenantId));
    res.json(token);
  }

  async updateVapiToken(req: Request, res: Response) {
    const { id } = req.params;
    const { tenantId, ...data } = req.body;
    const token = await VapiTokenService.updateVapiToken(Number(id), data, Number(tenantId));
    res.json(token);
  }

  async deleteVapiToken(req: Request, res: Response) {
    const { id } = req.params;
    const { tenantId } = req.query;
    await VapiTokenService.deleteVapiToken(Number(id), Number(tenantId));
    res.sendStatus(204);
  }

  async listAssistants(req: Request, res: Response) {
    const { vapiToken } = req.params;
    const assistants = await VapiTokenService.listAssistants(String(vapiToken));
    res.json(assistants);
  }

  async listPhoneNumbers(req: Request, res: Response) {
    const { vapiToken } = req.params;
    const phoneNumbers = await VapiTokenService.listPhoneNumbers(String(vapiToken));
    res.json(phoneNumbers);
  }
}

export default new VapiTokenController(); 
import { Request, Response } from 'express';
import WavoipTokenService from '../services/WavoipTokenService';

class WavoipTokenController {
  async createWavoipToken(req: Request, res: Response) {
    const { tenantId, ...data } = req.body;
    const token = await WavoipTokenService.createWavoipToken(data, tenantId);
    res.json(token);
  }

  async getWavoipTokenById(req: Request, res: Response) {
    const { id } = req.params;
    const { tenantId } = req.query;
    const token = await WavoipTokenService.getWavoipTokenById(Number(id), Number(tenantId));
    res.json(token);
  }

  async updateWavoipToken(req: Request, res: Response) {
    const { id } = req.params;
    const { tenantId, ...data } = req.body;
    const token = await WavoipTokenService.updateWavoipToken(Number(id), data, Number(tenantId));
    res.json(token);
  }

  async deleteWavoipToken(req: Request, res: Response) {
    const { id } = req.params;
    const { tenantId } = req.query;
    await WavoipTokenService.deleteWavoipToken(Number(id), Number(tenantId));
    res.sendStatus(204);
  }

  async checkDeviceAvailability(req: Request, res: Response) {
    const { token } = req.query;
    const isAvailable = await WavoipTokenService.isDeviceAvailable(String(token));
    res.json({ available: isAvailable });
  }
}

export default new WavoipTokenController(); 
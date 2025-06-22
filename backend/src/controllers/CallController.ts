import { Request, Response } from 'express';
import CallService from '../services/CallService';

class CallController {
  async createCall(req: Request, res: Response) {
    const { tenantId, ...data } = req.body;
    const call = await CallService.createCall(data, tenantId);
    res.json(call);
  }

  async getCallById(req: Request, res: Response) {
    const { id } = req.params;
    const { tenantId } = req.query;
    const call = await CallService.getCallById(Number(id), Number(tenantId));
    res.json(call);
  }

  async updateCall(req: Request, res: Response) {
    const { id } = req.params;
    const { tenantId, ...data } = req.body;
    const call = await CallService.updateCall(Number(id), data, Number(tenantId));
    res.json(call);
  }

  async deleteCall(req: Request, res: Response) {
    const { id } = req.params;
    const { tenantId } = req.query;
    await CallService.deleteCall(Number(id), Number(tenantId));
    res.sendStatus(204);
  }
}

export default new CallController(); 
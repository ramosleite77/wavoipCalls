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

  async listCalls(req: Request, res: Response) {
    const { tenantId, limit, offset } = req.query;
    const calls = await CallService.listCalls(
      Number(tenantId),
      limit ? Number(limit) : 20,
      offset ? Number(offset) : 0
    );
    res.json(calls);
  }

  async executeTestCall(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { tenantId } = req.query;
      const result = await CallService.executeTestCall(Number(id), Number(tenantId));
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }
}

export default new CallController(); 
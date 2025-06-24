import { Request, Response } from 'express';
import CallLogService from '../services/CallLogService';

class CallLogController {
  async createCallLog(req: Request, res: Response) {
    const { tenantId, ...data } = req.body;
    const callLog = await CallLogService.createCallLog(data, tenantId);
    res.json(callLog);
  }

  async getCallLogById(req: Request, res: Response) {
    const { id } = req.params;
    const { tenantId } = req.query;
    const callLog = await CallLogService.getCallLogById(Number(id), Number(tenantId));
    res.json(callLog);
  }

  async updateCallLog(req: Request, res: Response) {
    const { id } = req.params;
    const { tenantId, ...data } = req.body;
    const callLog = await CallLogService.updateCallLog(Number(id), data, Number(tenantId));
    res.json(callLog);
  }

  async deleteCallLog(req: Request, res: Response) {
    const { id } = req.params;
    const { tenantId } = req.query;
    await CallLogService.deleteCallLog(Number(id), Number(tenantId));
    res.sendStatus(204);
  }

  async listCallLogs(req: Request, res: Response) {
    const { tenantId } = req.query;
    const logs = await CallLogService.listCallLogs(Number(tenantId));
    res.json(logs);
  }
}

export default new CallLogController(); 
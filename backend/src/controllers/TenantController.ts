import { Request, Response } from 'express';
import TenantService from '../services/TenantService';

class TenantController {
  async createTenant(req: Request, res: Response) {
    const data = req.body;
    const tenant = await TenantService.createTenant(data);
    res.json(tenant);
  }

  async getTenantById(req: Request, res: Response) {
    const { id } = req.params;
    const tenant = await TenantService.getTenantById(Number(id));
    res.json(tenant);
  }

  async updateTenant(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body;
    const tenant = await TenantService.updateTenant(Number(id), data);
    res.json(tenant);
  }

  async deleteTenant(req: Request, res: Response) {
    const { id } = req.params;
    await TenantService.deleteTenant(Number(id));
    res.sendStatus(204);
  }
}

export default new TenantController(); 
import { Request, Response } from 'express';
import UserService from '../services/UserService';

class UserController {
  async createUser(req: Request, res: Response) {
    const { tenantId, ...data } = req.body;
    const user = await UserService.createUser(data, tenantId);
    res.json(user);
  }

  async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    const { tenantId } = req.query;
    const user = await UserService.getUserById(Number(id), Number(tenantId));
    res.json(user);
  }

  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const { tenantId, ...data } = req.body;
    const user = await UserService.updateUser(Number(id), data, Number(tenantId));
    res.json(user);
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    const { tenantId } = req.query;
    await UserService.deleteUser(Number(id), Number(tenantId));
    res.sendStatus(204);
  }
}

export default new UserController(); 
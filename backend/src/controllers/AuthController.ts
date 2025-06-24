import { Request, Response, NextFunction } from 'express';
import UserService from '../services/UserService';

class AuthController {
  async validateToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) {
        res.status(400).json({ valid: false, message: 'Token não fornecido' });
        return;
      }
      const result = await UserService.verifyToken(token);
      if (result.valid) {
        res.status(200).json({ valid: true });
      } else {
        res.status(401).json({ valid: false, message: 'Token inválido' });
      }
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController(); 
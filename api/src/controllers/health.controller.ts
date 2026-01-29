import { Request, Response } from 'express';
import { HealthService } from '../services/health.service';

class HealthController {
  getHealth(req: Request, res: Response): void {
    HealthService.handleHealthService(req, res);
  }
}

export default new HealthController();

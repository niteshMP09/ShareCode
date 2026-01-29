import { Request, Response } from 'express';

export class HealthService {
  static handleHealthService = (_req: Request, res: Response) => {
    res.send('The api is working !');
  };
}

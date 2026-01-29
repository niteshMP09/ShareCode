import express from 'express';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';
import healthRouter from './routes/health.route';

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Request logger middleware
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Health check route
app.get('/', healthRouter);

// ❌ Error handler (always last)
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack || err.message);
  res.status(500).json({ message: 'Something went wrong' });
});

export default app;

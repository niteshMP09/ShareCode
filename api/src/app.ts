import express from 'express';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';
import healthRouter from './routes/health.route';
import snippetRouter from './routes/snippet.route';

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);
app.use(express.json({ limit: '1mb' }));

// Request logger middleware
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.get('/', healthRouter);
app.use('/api/snippets', snippetRouter);

// Error handler (always last)
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack || err.message);
  res.status(500).json({ message: 'Something went wrong' });
});

export default app;

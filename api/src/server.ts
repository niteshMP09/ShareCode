import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { setupSocket } from './socket';

const PORT = process.env.PORT || 8000;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
});

setupSocket(io);

httpServer.listen(PORT, () => {
  console.log(`🟢 Server running at ${PORT}`);
});

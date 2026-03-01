import { Server, Socket } from 'socket.io';
import { SnippetService } from '../services/snippet.service';

interface ContentChangePayload {
  snippetId: string;
  content: string;
}

export function setupSocket(io: Server): void {
  io.on('connection', (socket: Socket) => {
    console.log(`[ws] connected: ${socket.id}`);

    socket.on('join', (snippetId: string) => {
      socket.join(snippetId);
      console.log(`[ws] ${socket.id} joined room: ${snippetId}`);
    });

    socket.on('content:change', ({ snippetId, content }: ContentChangePayload) => {
      SnippetService.update(snippetId, { content });
      socket.to(snippetId).emit('content:update', { content });
    });

    socket.on('disconnect', () => {
      console.log(`[ws] disconnected: ${socket.id}`);
    });
  });
}

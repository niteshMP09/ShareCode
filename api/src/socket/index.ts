import { Server, Socket } from 'socket.io';
import { SnippetService } from '../services/snippet.service';

interface ContentChangePayload {
  snippetId: string;
  content: string;
  title?: string;
}

export function setupSocket(io: Server): void {
  io.on('connection', (socket: Socket) => {
    console.log(`[ws] connected: ${socket.id}`);

    socket.on('join', (snippetId: string) => {
      socket.join(snippetId);
      console.log(`[ws] ${socket.id} joined room: ${snippetId}`);
    });

    socket.on('content:change', ({ snippetId, content, title }: ContentChangePayload) => {
      // Persist so late-joiners / reloads see latest content
      SnippetService.update(snippetId, { content, title });
      // Broadcast to everyone else in the same room
      socket.to(snippetId).emit('content:update', { content, title });
    });

    socket.on('disconnect', () => {
      console.log(`[ws] disconnected: ${socket.id}`);
    });
  });
}

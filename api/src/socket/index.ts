import { Server, Socket } from 'socket.io';
import { SnippetService } from '../services/snippet.service';

interface JoinPayload {
  snippetId: string;
  name: string;
}

interface ContentChangePayload {
  snippetId: string;
  content: string;
}

// roomId -> Map<socketId, displayName>
const rooms = new Map<string, Map<string, string>>();

function broadcastUsers(io: Server, roomId: string) {
  const users = Array.from(rooms.get(roomId)?.values() ?? []);
  io.to(roomId).emit('users:update', users);
}

export function setupSocket(io: Server): void {
  io.on('connection', (socket: Socket) => {
    console.log(`[ws] connected: ${socket.id}`);

    socket.on('join', ({ snippetId, name }: JoinPayload) => {
      socket.join(snippetId);
      if (!rooms.has(snippetId)) rooms.set(snippetId, new Map());
      rooms.get(snippetId)!.set(socket.id, name);
      broadcastUsers(io, snippetId);
      console.log(`[ws] "${name}" joined room: ${snippetId}`);
    });

    socket.on('content:change', ({ snippetId, content }: ContentChangePayload) => {
      SnippetService.update(snippetId, { content });
      socket.to(snippetId).emit('content:update', { content });
    });

    socket.on('disconnect', () => {
      rooms.forEach((users, roomId) => {
        if (users.has(socket.id)) {
          users.delete(socket.id);
          broadcastUsers(io, roomId);
        }
      });
      console.log(`[ws] disconnected: ${socket.id}`);
    });
  });
}

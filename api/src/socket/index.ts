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

interface TypingPayload {
  snippetId: string;
}

// roomId -> Map<socketId, displayName>
const rooms = new Map<string, Map<string, string>>();

// roomId -> Set<socketId> currently typing
const typingMap = new Map<string, Set<string>>();

function broadcastUsers(io: Server, roomId: string) {
  const users = Array.from(rooms.get(roomId)?.values() ?? []);
  io.to(roomId).emit('users:update', users);
}

function broadcastTyping(roomId: string, excludeSocket: Socket) {
  const names = Array.from(typingMap.get(roomId) ?? [])
    .map((sid) => rooms.get(roomId)?.get(sid))
    .filter((n): n is string => !!n);
  excludeSocket.to(roomId).emit('typing:update', names);
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

    socket.on('typing:start', ({ snippetId }: TypingPayload) => {
      if (!typingMap.has(snippetId)) typingMap.set(snippetId, new Set());
      typingMap.get(snippetId)!.add(socket.id);
      broadcastTyping(snippetId, socket);
    });

    socket.on('typing:stop', ({ snippetId }: TypingPayload) => {
      typingMap.get(snippetId)?.delete(socket.id);
      broadcastTyping(snippetId, socket);
    });

    socket.on('disconnect', () => {
      rooms.forEach((users, roomId) => {
        if (users.has(socket.id)) {
          users.delete(socket.id);
          broadcastUsers(io, roomId);
          typingMap.get(roomId)?.delete(socket.id);
          broadcastTyping(roomId, socket);
        }
      });
      console.log(`[ws] disconnected: ${socket.id}`);
    });
  });
}

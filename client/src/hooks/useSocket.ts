import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface UpdatePayload {
  content: string;
}

export function useSocket(
  snippetId: string | undefined,
  name: string,
  onRemoteUpdate: (data: UpdatePayload) => void,
  onUsersUpdate: (users: string[]) => void
) {
  const socketRef = useRef<Socket | null>(null);
  const onUpdateRef = useRef(onRemoteUpdate);
  const onUsersRef = useRef(onUsersUpdate);
  onUpdateRef.current = onRemoteUpdate;
  onUsersRef.current = onUsersUpdate;

  useEffect(() => {
    if (!snippetId || !name) return;

    const socket = io({ transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.emit('join', { snippetId, name });
    socket.on('content:update', (data: UpdatePayload) => onUpdateRef.current(data));
    socket.on('users:update', (users: string[]) => onUsersRef.current(users));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [snippetId, name]);

  const emitChange = useCallback(
    (content: string) => {
      if (!snippetId || !socketRef.current) return;
      socketRef.current.emit('content:change', { snippetId, content });
    },
    [snippetId]
  );

  return { emitChange };
}

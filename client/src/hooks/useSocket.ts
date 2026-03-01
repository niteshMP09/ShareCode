import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface UpdatePayload {
  content: string;
  title?: string;
}

export function useSocket(
  snippetId: string | undefined,
  onRemoteUpdate: (data: UpdatePayload) => void
) {
  const socketRef = useRef<Socket | null>(null);
  const onUpdateRef = useRef(onRemoteUpdate);
  onUpdateRef.current = onRemoteUpdate;

  useEffect(() => {
    if (!snippetId) return;

    // Connects to same origin — proxied to backend via Vite in dev
    const socket = io({ transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.emit('join', snippetId);
    socket.on('content:update', (data: UpdatePayload) => onUpdateRef.current(data));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [snippetId]);

  const emitChange = useCallback(
    (content: string, title?: string) => {
      if (!snippetId || !socketRef.current) return;
      socketRef.current.emit('content:change', { snippetId, content, title });
    },
    [snippetId]
  );

  return { emitChange };
}

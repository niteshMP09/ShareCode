/* eslint-disable react-hooks/refs */
import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface UpdatePayload {
  content: string;
}

export function useSocket(
  snippetId: string | undefined,
  name: string,
  onRemoteUpdate: (data: UpdatePayload) => void,
  onUsersUpdate: (users: string[]) => void,
  onTypingUpdate: (typingUsers: string[]) => void
) {
  const socketRef = useRef<Socket | null>(null);
  const onUpdateRef = useRef(onRemoteUpdate);
  const onUsersRef = useRef(onUsersUpdate);
  const onTypingRef = useRef(onTypingUpdate);
  onUpdateRef.current = onRemoteUpdate;
  onUsersRef.current = onUsersUpdate;
  onTypingRef.current = onTypingUpdate;

  useEffect(() => {
    if (!snippetId || !name) return;

    // determine the socket server URL from env; fall back to current origin
    const serverUrl = import.meta.env.VITE_API_BASE_URL || '';
    const socket = io(serverUrl, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect_error', (err) => {
      console.error('[ws] connection error', err);
    });

    socket.emit('join', { snippetId, name });
    socket.on('content:update', (data: UpdatePayload) => onUpdateRef.current(data));
    socket.on('users:update', (users: string[]) => onUsersRef.current(users));
    socket.on('typing:update', (users: string[]) => onTypingRef.current(users));

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

  const emitTypingStart = useCallback(() => {
    if (!snippetId || !socketRef.current) return;
    socketRef.current.emit('typing:start', { snippetId });
  }, [snippetId]);

  const emitTypingStop = useCallback(() => {
    if (!snippetId || !socketRef.current) return;
    socketRef.current.emit('typing:stop', { snippetId });
  }, [snippetId]);

  return { emitChange, emitTypingStart, emitTypingStop };
}

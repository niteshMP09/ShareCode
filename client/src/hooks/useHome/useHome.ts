import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { snippetService } from '@/services/snippetService';
import { generateId } from '@/utils/generateId';
import { HomeMode } from '@/types/home';

export function useHome() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<HomeMode>(HomeMode.Create);

  const [createName, setCreateName] = useState('');
  const [roomId, setRoomId] = useState(generateId);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  const [joinName, setJoinName] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState('');

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!createName.trim()) {
      setCreateError('Enter your name.');
      return;
    }
    if (!roomId.trim()) {
      setCreateError('Enter a room ID.');
      return;
    }
    setCreateLoading(true);
    setCreateError('');
    try {
      const snippet = await snippetService.createSnippet({ id: roomId.trim() });
      navigate(`/s/${snippet.id}`, { state: { name: createName.trim() } });
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create room.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleJoin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!joinName.trim()) {
      setJoinError('Enter your name.');
      return;
    }
    if (!joinRoomId.trim()) {
      setJoinError('Enter a room ID.');
      return;
    }
    setJoinLoading(true);
    setJoinError('');
    try {
      await snippetService.getSnippet(joinRoomId.trim());
      navigate(`/s/${joinRoomId.trim()}`, { state: { name: joinName.trim() } });
    } catch {
      setJoinError('Room not found. Check the ID and try again.');
    } finally {
      setJoinLoading(false);
    }
  };

  return {
    mode,
    setMode,
    createName,
    setCreateName,
    roomId,
    setRoomId,
    createLoading,
    createError,
    joinName,
    setJoinName,
    joinRoomId,
    setJoinRoomId,
    joinLoading,
    joinError,
    handleCreate,
    handleJoin,
  };
}

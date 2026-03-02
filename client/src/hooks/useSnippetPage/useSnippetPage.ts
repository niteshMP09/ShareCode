import { useEffect, useRef, useCallback, useState } from 'react';
import type { FormEvent } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import type { Snippet } from '@/types/snippet';
import { snippetService } from '@/services';
import { useSocket } from '@/hooks/useSocket';

export function useSnippetPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { name?: string } | null;

  const [name, setName] = useState(state?.name ?? '');
  const [nameInput, setNameInput] = useState('');
  const [showPrompt, setShowPrompt] = useState(!state?.name);

  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [content, setContent] = useState('');
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const isTypingRef = useRef(false);
  const typingStopRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const emitTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const { emitChange, emitTypingStart, emitTypingStop } = useSocket(
    id,
    name,
    ({ content: rc }) => {
      if (!isTypingRef.current) setContent(rc);
    },
    (users) => setConnectedUsers(users),
    (users) => setTypingUsers(users)
  );

  useEffect(() => {
    if (!id) return;
    snippetService
      .getSnippet(id)
      .then((s) => {
        setSnippet(s);
        setContent(s.content);
      })
      .catch(() => setError('Room not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleNameSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    setName(nameInput.trim());
    setShowPrompt(false);
  };

  const handleContentChange = useCallback(
    (value: string) => {
      setContent(value);

      if (!isTypingRef.current) {
        isTypingRef.current = true;
        emitTypingStart();
      }
      clearTimeout(typingStopRef.current);
      typingStopRef.current = setTimeout(() => {
        isTypingRef.current = false;
        emitTypingStop();
      }, 1500);

      clearTimeout(emitTimeoutRef.current);
      emitTimeoutRef.current = setTimeout(() => {
        emitChange(value);
      }, 250);
    },
    [emitChange, emitTypingStart, emitTypingStop]
  );

  const goHome = () => navigate('/');

  return {
    showPrompt,
    nameInput,
    setNameInput,
    handleNameSubmit,
    loading,
    error,
    snippet,
    content,
    handleContentChange,
    connectedUsers,
    typingUsers,
    goHome,
  };
}

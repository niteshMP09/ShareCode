import { useEffect, useRef, useCallback, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import type { Snippet } from '@/types/snippet';
import { LoadingState, EmptyState, NamePrompt } from '@/components';
import { useSocket } from '@/hooks';
import { snippetService } from '@/services';
import { typingText } from '@/utils/typingText';

export function SnippetPage() {
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

  // ── Real-time ────────────────────────────────────────────────────────────
  const { emitChange, emitTypingStart, emitTypingStop } = useSocket(
    id,
    name,
    ({ content: rc }) => {
      if (!isTypingRef.current) setContent(rc);
    },
    (users) => setConnectedUsers(users),
    (users) => setTypingUsers(users)
  );

  // ── Load ─────────────────────────────────────────────────────────────────
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

  // ── Name prompt submit ────────────────────────────────────────────────────
  const handleNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    setName(nameInput.trim());
    setShowPrompt(false);
  };

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleContentChange = useCallback(
    (value: string) => {
      setContent(value);

      // Typing indicator
      if (!isTypingRef.current) {
        isTypingRef.current = true;
        emitTypingStart();
      }
      clearTimeout(typingStopRef.current);
      typingStopRef.current = setTimeout(() => {
        isTypingRef.current = false;
        emitTypingStop();
      }, 1500);

      // Debounced content emit
      clearTimeout(emitTimeoutRef.current);
      emitTimeoutRef.current = setTimeout(() => {
        emitChange(value);
      }, 250);
    },
    [emitChange, emitTypingStart, emitTypingStop]
  );

  if (showPrompt) {
    return (
      <NamePrompt
        name={nameInput}
        onNameChange={setNameInput}
        onSubmit={handleNameSubmit}
      />
    );
  }


  if (loading) {
    return <LoadingState />;
  }

  if (error || !snippet) {
    return (
      <EmptyState
        message={error || 'Room not found.'}
        actionLabel="Go Home"
        onAction={() => navigate('/')}
      />
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] bg-white">
      <textarea
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
        placeholder="Start typing…"
        className="flex-1 w-full px-8 py-5 text-gray-700 text-base leading-relaxed placeholder-gray-300 outline-none resize-none"
      />
      <div className="flex items-center justify-between px-8 py-3 border-t border-gray-100 bg-gray-50 min-h-12">
        <span className="text-xs text-gray-400 italic">
          {typingText(typingUsers)}
        </span>
        {connectedUsers.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
            <span className="text-xs text-gray-500">{connectedUsers.join(', ')}</span>
          </div>
        )}
      </div>
    </div>
  );
}

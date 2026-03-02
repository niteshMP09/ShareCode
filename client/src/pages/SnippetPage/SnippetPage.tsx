import { useEffect, useRef, useCallback, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import type { Snippet } from '@/types/snippet';
import { Button } from '@/components';
import { useSocket } from '@/hooks';
import { snippetService } from '@/services';

function typingText(users: string[]): string {
  if (users.length === 0) return '';
  if (users.length === 1) return `${users[0]} is typing…`;
  if (users.length === 2) return `${users[0]} and ${users[1]} are typing…`;
  return `${users[0]}, ${users[1]} and others are typing…`;
}

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

  // ── Name prompt ───────────────────────────────────────────────────────────
  if (showPrompt) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Join Room</h2>
          <p className="text-gray-500 text-sm mb-6">Enter your name to start collaborating.</p>
          <form onSubmit={handleNameSubmit} className="space-y-4">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your name"
              autoFocus
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
            <Button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
            >
              Join
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // ── Loading / error ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-56px)] bg-white">
        <span className="text-gray-400 text-sm">Loading…</span>
      </div>
    );
  }

  if (error || !snippet) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-56px)] bg-white gap-4">
        <p className="text-gray-500">{error || 'Room not found.'}</p>
        <Button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors"
        >
          Go Home
        </Button>
      </div>
    );
  }

  // ── Editor ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-[calc(100vh-56px)] bg-white">
      <textarea
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
        placeholder="Start typing…"
        className="flex-1 w-full px-8 py-5 text-gray-700 text-base leading-relaxed placeholder-gray-300 outline-none resize-none"
      />

      {/* Status bar */}
      <div className="flex items-center justify-between px-8 py-3 border-t border-gray-100 bg-gray-50 min-h-[48px]">
        {/* Who is typing */}
        <span className="text-xs text-gray-400 italic">
          {typingText(typingUsers)}
        </span>

        {/* Connected users */}
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

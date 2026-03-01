import { useEffect, useRef, useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import type { Snippet } from '../types/snippet';

export function SnippetPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Prevent remote updates from disrupting the cursor while typing
  const isTypingRef = useRef(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const emitTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // ── Real-time ────────────────────────────────────────────────────────────
  const { emitChange } = useSocket(id, ({ content: rc, title: rt }) => {
    if (!isTypingRef.current) {
      setContent(rc);
      if (rt !== undefined) setTitle(rt);
    }
  });

  // ── Load ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .getSnippet(id)
      .then((s) => {
        setSnippet(s);
        setTitle(s.title);
        setContent(s.content);
      })
      .catch(() => setError('Text not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const scheduleEmit = useCallback(
    (nextContent: string, nextTitle: string) => {
      clearTimeout(emitTimeoutRef.current);
      emitTimeoutRef.current = setTimeout(() => {
        emitChange(nextContent, nextTitle);
      }, 250);
    },
    [emitChange]
  );

  const handleContentChange = useCallback(
    (value: string) => {
      setContent(value);
      isTypingRef.current = true;
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        isTypingRef.current = false;
      }, 1000);
      scheduleEmit(value, title);
    },
    [scheduleEmit, title]
  );

  const handleTitleChange = useCallback(
    (value: string) => {
      setTitle(value);
      scheduleEmit(content, value);
    },
    [scheduleEmit, content]
  );

  const handleCopyText = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDuplicate = () => {
    navigate('/', { state: { initialContent: content, initialTitle: `Copy of ${title}` } });
  };

  // ── Render ───────────────────────────────────────────────────────────────
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
        <p className="text-gray-500">{error || 'Text not found.'}</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors"
        >
          Create New
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] bg-white">
      {/* Title */}
      <div className="px-8 pt-6 pb-3 border-b border-gray-100 flex items-center gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Untitled"
          className="flex-1 text-2xl font-semibold text-gray-800 placeholder-gray-300 outline-none min-w-0"
        />
        <span className="text-xs text-gray-400 shrink-0">
          {new Date(snippet.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>

      {/* Content — always editable */}
      <textarea
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
        placeholder="Start typing…"
        className="flex-1 w-full px-8 py-5 text-gray-700 text-base leading-relaxed placeholder-gray-300 outline-none resize-none"
      />

      {/* Action bar */}
      <div className="flex items-center gap-2 px-8 py-3 border-t border-gray-100 bg-gray-50">
        <button
          onClick={handleCopyText}
          className="px-4 py-1.5 text-sm text-gray-600 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
        >
          {copied ? 'Copied!' : 'Copy text'}
        </button>
        <button
          onClick={handleCopyLink}
          className="px-4 py-1.5 text-sm text-gray-600 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
        >
          {copiedLink ? 'Copied!' : 'Copy link'}
        </button>
        <button
          onClick={handleDuplicate}
          className="px-4 py-1.5 text-sm text-gray-600 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
        >
          Duplicate
        </button>
      </div>
    </div>
  );
}

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

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);

  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Track whether local user is actively typing to avoid cursor disruption
  const isTypingRef = useRef(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Debounce timer for emitting changes
  const emitTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // ── Real-time ──────────────────────────────────────────────────────────────
  const { emitChange } = useSocket(id, ({ content, title }) => {
    // Always update the view (non-edit) state
    setSnippet((prev) =>
      prev
        ? { ...prev, content, ...(title !== undefined && { title }) }
        : prev
    );
    // Only update edit fields if local user isn't currently typing
    if (!isTypingRef.current) {
      setEditContent(content);
      if (title !== undefined) setEditTitle(title);
    }
  });

  // ── Load snippet ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .getSnippet(id)
      .then((s) => {
        setSnippet(s);
        setEditTitle(s.title);
        setEditContent(s.content);
      })
      .catch(() => setError('Text not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleContentChange = useCallback(
    (value: string) => {
      setEditContent(value);

      // Mark typing active for 1 s so remote updates don't overwrite cursor
      isTypingRef.current = true;
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        isTypingRef.current = false;
      }, 1000);

      // Debounce emit by 250 ms
      clearTimeout(emitTimeoutRef.current);
      emitTimeoutRef.current = setTimeout(() => {
        emitChange(value, editTitle);
      }, 250);
    },
    [emitChange, editTitle]
  );

  const handleTitleChange = useCallback(
    (value: string) => {
      setEditTitle(value);
      clearTimeout(emitTimeoutRef.current);
      emitTimeoutRef.current = setTimeout(() => {
        emitChange(editContent, value);
      }, 250);
    },
    [emitChange, editContent]
  );

  const handleCopyText = () => {
    if (!snippet) return;
    navigator.clipboard.writeText(snippet.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleFork = () => {
    if (!snippet) return;
    navigate('/', {
      state: {
        initialContent: snippet.content,
        initialTitle: `Copy of ${snippet.title}`,
      },
    });
  };

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      const updated = await api.updateSnippet(id, {
        title: editTitle,
        content: editContent,
      });
      setSnippet(updated);
      setIsEditing(false);
    } catch {
      // keep editing state open on failure
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (!snippet) return;
    setEditTitle(snippet.title);
    setEditContent(snippet.content);
    setIsEditing(false);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
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
      {/* Title area */}
      <div className="px-8 pt-6 pb-3 border-b border-gray-100">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full text-2xl font-semibold text-gray-800 outline-none"
          />
        ) : (
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              {snippet.title || 'Untitled'}
            </h1>
            <span className="text-xs text-gray-400 mt-1.5 shrink-0">
              {new Date(snippet.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isEditing ? (
          <textarea
            value={editContent}
            onChange={(e) => handleContentChange(e.target.value)}
            className="w-full h-full px-8 py-5 text-gray-700 text-base leading-relaxed outline-none resize-none"
            autoFocus
          />
        ) : (
          <div className="px-8 py-5 text-gray-700 text-base leading-relaxed whitespace-pre-wrap wrap-break-word">
            {snippet.content}
          </div>
        )}
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between px-8 py-3 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2">
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
            onClick={handleFork}
            className="px-4 py-1.5 text-sm text-gray-600 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
          >
            Duplicate
          </button>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-1.5 text-sm text-gray-600 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-5 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

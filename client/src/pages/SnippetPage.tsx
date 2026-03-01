import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
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
            onChange={(e) => setEditTitle(e.target.value)}
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
            onChange={(e) => setEditContent(e.target.value)}
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

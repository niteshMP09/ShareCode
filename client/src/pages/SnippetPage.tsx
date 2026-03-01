import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Editor } from '../components/Editor';
import { LanguageSelector } from '../components/LanguageSelector';
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
  const [editLanguage, setEditLanguage] = useState('');
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
        setEditLanguage(s.language);
      })
      .catch(() => setError('Snippet not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCopyCode = () => {
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
        initialLanguage: snippet.language,
        initialTitle: `Fork of ${snippet.title}`,
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
        language: editLanguage,
      });
      setSnippet(updated);
      setIsEditing(false);
    } catch {
      // noop — keep editing state open
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (!snippet) return;
    setEditTitle(snippet.title);
    setEditContent(snippet.content);
    setEditLanguage(snippet.language);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-56px)] bg-[#1e1e2e]">
        <span className="text-gray-500 text-sm">Loading…</span>
      </div>
    );
  }

  if (error || !snippet) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-56px)] bg-[#1e1e2e] gap-4">
        <p className="text-red-400">{error || 'Snippet not found.'}</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
        >
          Create New Snippet
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] bg-[#1e1e2e]">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#181825] border-b border-[#313244] overflow-x-auto">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="flex-1 bg-transparent text-white outline-none text-sm min-w-0"
          />
        ) : (
          <span className="flex-1 text-white text-sm font-medium truncate min-w-0">
            {snippet.title}
          </span>
        )}

        {isEditing ? (
          <LanguageSelector value={editLanguage} onChange={setEditLanguage} />
        ) : (
          <span className="px-2 py-0.5 bg-[#313244] text-gray-400 text-xs rounded shrink-0">
            {snippet.language}
          </span>
        )}

        <span className="text-gray-600 text-xs hidden sm:block shrink-0">
          {new Date(snippet.createdAt).toLocaleDateString()}
        </span>

        <button
          onClick={handleCopyCode}
          className="px-3 py-1.5 bg-[#313244] hover:bg-[#45475a] text-gray-200 text-xs rounded-md transition-colors shrink-0"
        >
          {copied ? 'Copied!' : 'Copy code'}
        </button>

        <button
          onClick={handleCopyLink}
          className="px-3 py-1.5 bg-[#313244] hover:bg-[#45475a] text-gray-200 text-xs rounded-md transition-colors shrink-0"
        >
          {copiedLink ? 'Copied!' : 'Copy link'}
        </button>

        <button
          onClick={handleFork}
          className="px-3 py-1.5 bg-[#313244] hover:bg-[#45475a] text-gray-200 text-xs rounded-md transition-colors shrink-0"
        >
          Fork
        </button>

        {isEditing ? (
          <>
            <button
              onClick={handleCancelEdit}
              className="px-3 py-1.5 bg-[#313244] hover:bg-[#45475a] text-gray-200 text-xs rounded-md transition-colors shrink-0"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-medium rounded-md transition-colors shrink-0"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors shrink-0"
          >
            Edit
          </button>
        )}
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          value={isEditing ? editContent : snippet.content}
          onChange={setEditContent}
          language={isEditing ? editLanguage : snippet.language}
          readOnly={!isEditing}
        />
      </div>
    </div>
  );
}

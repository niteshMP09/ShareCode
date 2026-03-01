import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';

interface LocationState {
  initialContent?: string;
  initialTitle?: string;
}

function wordCount(text: string) {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
}

export function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [title, setTitle] = useState(state?.initialTitle ?? '');
  const [content, setContent] = useState(state?.initialContent ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleShare = async () => {
    if (!content.trim()) {
      setError('Write something before sharing.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const snippet = await api.createSnippet({ title, content, language: 'plaintext' });
      navigate(`/s/${snippet.id}`);
    } catch {
      setError('Failed to share. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const words = wordCount(content);
  const chars = content.length;

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] bg-white">
      {/* Title input */}
      <div className="px-8 pt-6 pb-3 border-b border-gray-100">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (optional)"
          className="w-full text-2xl font-semibold text-gray-800 placeholder-gray-300 outline-none"
        />
      </div>

      {/* Textarea */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing or paste your text here…"
        className="flex-1 w-full px-8 py-5 text-gray-700 text-base leading-relaxed placeholder-gray-300 outline-none resize-none"
        autoFocus
      />

      {/* Footer bar */}
      <div className="flex items-center justify-between px-8 py-3 border-t border-gray-100 bg-gray-50">
        <span className="text-xs text-gray-400">
          {words} {words === 1 ? 'word' : 'words'} · {chars} {chars === 1 ? 'char' : 'chars'}
        </span>
        <div className="flex items-center gap-3">
          {error && <span className="text-red-500 text-xs">{error}</span>}
          <button
            onClick={handleShare}
            disabled={loading}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {loading ? 'Sharing…' : 'Share'}
          </button>
        </div>
      </div>
    </div>
  );
}

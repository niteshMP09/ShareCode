import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';

interface LocationState {
  initialContent?: string;
}

function wordCount(text: string) {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
}

export function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

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
      const snippet = await api.createSnippet({ content });
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
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing or paste your text here…"
        className="flex-1 w-full px-8 py-5 text-gray-700 text-base leading-relaxed placeholder-gray-300 outline-none resize-none"
        autoFocus
      />

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

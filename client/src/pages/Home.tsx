import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { Editor } from '../components/Editor';
import { LanguageSelector } from '../components/LanguageSelector';

interface LocationState {
  initialContent?: string;
  initialLanguage?: string;
  initialTitle?: string;
}

export function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [title, setTitle] = useState(state?.initialTitle ?? '');
  const [content, setContent] = useState(state?.initialContent ?? '');
  const [language, setLanguage] = useState(state?.initialLanguage ?? 'javascript');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleShare = async () => {
    if (!content.trim()) {
      setError('Add some code before sharing.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const snippet = await api.createSnippet({ title, content, language });
      navigate(`/s/${snippet.id}`);
    } catch {
      setError('Failed to share. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] bg-[#1e1e2e]">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-[#181825] border-b border-[#313244]">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled snippet"
          className="flex-1 bg-transparent text-white placeholder-gray-600 outline-none text-sm min-w-0"
        />
        <LanguageSelector value={language} onChange={setLanguage} />
        {error && <span className="text-red-400 text-xs shrink-0">{error}</span>}
        <button
          onClick={handleShare}
          disabled={loading}
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-md transition-colors shrink-0"
        >
          {loading ? 'Sharing…' : 'Share'}
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor value={content} onChange={setContent} language={language} />
      </div>
    </div>
  );
}

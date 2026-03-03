import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components';
import { useNavbar } from '@/context';

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

export function Navbar() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const [copied, setCopied] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);
  const { snippetContent } = useNavbar();

  const lines = snippetContent !== null ? snippetContent.split('\n').length : 0;
  const chars = snippetContent !== null ? snippetContent.length : 0;

  const handleCopy = async () => {
    if (snippetContent === null) return;
    await navigator.clipboard.writeText(snippetContent);
    setCopiedContent(true);
    setTimeout(() => setCopiedContent(false), 2000);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: 'ShareCode', url });
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <nav className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 select-none">
          <span className="text-indigo-600 font-bold text-xl">✦</span>
          <span className="text-gray-900 font-semibold text-lg tracking-tight">ShareCode</span>
        </Link>
        {!isHome && snippetContent !== null && (
          <span className="text-xs text-gray-400">{lines} lines · {chars} chars</span>
        )}
      </div>
      {!isHome && (
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
            >
              <CopyIcon />
              {copiedContent ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <div className="relative">
            <Button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
            >
              <ShareIcon />
              {copied ? 'Copied!' : 'Share'}
            </Button>
          </div>
          <Link
            to="/"
            className="flex items-center gap-1 px-4 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
          >
            + New
          </Link>
        </div>
      )}
    </nav>
  );
}

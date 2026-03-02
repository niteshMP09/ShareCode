import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components';

export function Navbar() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const [copied, setCopied] = useState(false);

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
      <Link to="/" className="flex items-center gap-2 select-none">
        <span className="text-indigo-600 font-bold text-xl">✦</span>
        <span className="text-gray-900 font-semibold text-lg tracking-tight">ShareCode</span>
      </Link>
      {!isHome && (
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button
              type="button"
              onClick={handleShare}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
            >
              Share
            </Button>
            {copied && (
              <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 rounded-md bg-indigo-600 px-3 py-1 text-[11px] text-white shadow min-w-[110px] text-center">
                Link copied
              </span>
            )}
          </div>
          <Link
            to="/"
            className="px-4 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
          >
            + New
          </Link>
        </div>
      )}
    </nav>
  );
}

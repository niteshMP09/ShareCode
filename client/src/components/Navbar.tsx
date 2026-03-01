import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
      <Link to="/" className="flex items-center gap-2 select-none">
        <span className="text-indigo-600 font-bold text-xl">✦</span>
        <span className="text-gray-900 font-semibold text-lg tracking-tight">TextShare</span>
      </Link>
      <Link
        to="/"
        className="px-4 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
      >
        + New
      </Link>
    </nav>
  );
}

import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="h-14 bg-[#181825] border-b border-[#313244] px-4 flex items-center justify-between shrink-0">
      <Link to="/" className="flex items-center gap-2 select-none">
        <span className="text-blue-400 font-bold text-xl">&lt;/&gt;</span>
        <span className="text-white font-semibold text-lg tracking-tight">CodeShare</span>
      </Link>
      <Link
        to="/"
        className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium"
      >
        + New
      </Link>
    </nav>
  );
}

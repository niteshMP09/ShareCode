import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { snippetService } from '@/services/snippetService';
import { Button } from '@/components';

function generateId() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function Home() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'create' | 'join'>('create');

  // Create form state
  const [createName, setCreateName] = useState('');
  const [roomId, setRoomId] = useState(generateId);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  // Join form state
  const [joinName, setJoinName] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState('');

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!createName.trim()) { setCreateError('Enter your name.'); return; }
    if (!roomId.trim()) { setCreateError('Enter a room ID.'); return; }
    setCreateLoading(true);
    setCreateError('');
    try {
      const snippet = await snippetService.createSnippet({ id: roomId.trim() });
      navigate(`/s/${snippet.id}`, { state: { name: createName.trim() } });
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create room.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleJoin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!joinName.trim()) { setJoinError('Enter your name.'); return; }
    if (!joinRoomId.trim()) { setJoinError('Enter a room ID.'); return; }
    setJoinLoading(true);
    setJoinError('');
    try {
      await snippetService.getSnippet(joinRoomId.trim());
      navigate(`/s/${joinRoomId.trim()}`, { state: { name: joinName.trim() } });
    } catch {
      setJoinError('Room not found. Check the ID and try again.');
    } finally {
      setJoinLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Get started</h2>
          <p className="text-gray-500 text-sm mt-1">Create a room or join an existing one</p>
        </div>

        {/* Tab toggle */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
          <Button
            onClick={() => setMode('create')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              mode === 'create'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Create a Room
          </Button>
          <Button
            onClick={() => setMode('join')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              mode === 'join'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Join a Room
          </Button>
        </div>

        {mode === 'create' ? (
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Your name
              </label>
              <input
                type="text"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="e.g. Alice"
                autoFocus
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Room ID
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                  placeholder="e.g. BLUE42"
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-mono outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
                <Button
                  type="button"
                  onClick={() => setRoomId(generateId())}
                  className="px-3 py-2 text-xs text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition whitespace-nowrap"
                >
                  Generate
                </Button>
              </div>
            </div>
            {createError && <p className="text-red-500 text-xs">{createError}</p>}
            <Button
              type="submit"
              disabled={createLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors"
            >
              {createLoading ? 'Creating…' : 'Create Room'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Your name
              </label>
              <input
                type="text"
                value={joinName}
                onChange={(e) => setJoinName(e.target.value)}
                placeholder="e.g. Bob"
                autoFocus
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Room ID
              </label>
              <input
                type="text"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())}
                placeholder="e.g. BLUE42"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-mono outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
            {joinError && <p className="text-red-500 text-xs">{joinError}</p>}
            <Button
              type="submit"
              disabled={joinLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors"
            >
              {joinLoading ? 'Joining…' : 'Join Room'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

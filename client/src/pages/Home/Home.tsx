import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { snippetService } from '@/services/snippetService';
import { CreateRoom, JoinRoom, TabToggle } from '@/components';
import { generateId } from '@/utils/generateId';
import { HomeMode } from '@/types/home';

export function Home() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<HomeMode>(HomeMode.Create);

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
        <TabToggle
          value={mode}
          onChange={setMode}
          className="mb-6"
          options={[
            { label: 'Create a Room', value: HomeMode.Create },
            { label: 'Join a Room', value: HomeMode.Join },
          ]}
        />
        {mode === HomeMode.Create ? (
          <CreateRoom
            name={createName}
            roomId={roomId}
            loading={createLoading}
            error={createError}
            onNameChange={setCreateName}
            onRoomIdChange={(value) => setRoomId(value.toUpperCase())}
            onGenerateId={() => setRoomId(generateId())}
            onSubmit={handleCreate}
          />
        ) : (
          <JoinRoom
            name={joinName}
            roomId={joinRoomId}
            loading={joinLoading}
            error={joinError}
            onNameChange={setJoinName}
            onRoomIdChange={(value) => setJoinRoomId(value.toUpperCase())}
            onSubmit={handleJoin}
          />
        )}
      </div>
    </div>
  );
}

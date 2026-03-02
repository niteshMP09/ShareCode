import type { FormEvent } from 'react';
import { Button } from '@/components/Button';

type JoinRoomProps = {
  name: string;
  roomId: string;
  loading: boolean;
  error: string;
  onNameChange: (value: string) => void;
  onRoomIdChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export function JoinRoom({
  name,
  roomId,
  loading,
  error,
  onNameChange,
  onRoomIdChange,
  onSubmit,
}: JoinRoomProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Your name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
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
          value={roomId}
          onChange={(e) => onRoomIdChange(e.target.value.toUpperCase())}
          placeholder="e.g. BLUE42"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-mono outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        />
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <Button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors"
      >
        {loading ? 'Joining…' : 'Join Room'}
      </Button>
    </form>
  );
}

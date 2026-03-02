import type { FormEvent } from 'react';
import { Button } from '@/components/Button';

type CreateRoomProps = {
  name: string;
  roomId: string;
  loading: boolean;
  error: string;
  onNameChange: (value: string) => void;
  onRoomIdChange: (value: string) => void;
  onGenerateId: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export function CreateRoom({
  name,
  roomId,
  loading,
  error,
  onNameChange,
  onRoomIdChange,
  onGenerateId,
  onSubmit,
}: CreateRoomProps) {
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
            onChange={(e) => onRoomIdChange(e.target.value.toUpperCase())}
            placeholder="e.g. BLUE42"
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-mono outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
          <Button
            type="button"
            onClick={onGenerateId}
            className="px-3 py-2 text-xs text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition whitespace-nowrap"
          >
            Generate
          </Button>
        </div>
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <Button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors"
      >
        {loading ? 'Creating…' : 'Create Room'}
      </Button>
    </form>
  );
}

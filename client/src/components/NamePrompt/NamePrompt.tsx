import type { FormEvent } from 'react';
import { Button } from '@/components/Button';

type NamePromptProps = {
  title?: string;
  description?: string;
  name: string;
  onNameChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  submitLabel?: string;
};

export function NamePrompt({
  title = 'Join Room',
  description = 'Enter your name to start collaborating.',
  name,
  onNameChange,
  onSubmit,
  submitLabel = 'Join',
}: NamePromptProps) {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-1">{title}</h2>
        <p className="text-gray-500 text-sm mb-6">{description}</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Your name"
            autoFocus
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
          <Button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
          >
            {submitLabel}
          </Button>
        </form>
      </div>
    </div>
  );
}

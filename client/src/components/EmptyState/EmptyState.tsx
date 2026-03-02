import { Button } from '@/components/Button';

type EmptyStateProps = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export function EmptyState({
  message,
  actionLabel = 'Go Home',
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center h-[calc(100vh-56px)] bg-white gap-4 ${className}`}>
      <p className="text-gray-500">{message}</p>
      {onAction && (
        <Button
          onClick={onAction}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

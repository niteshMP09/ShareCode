type LoadingStateProps = {
  message?: string;
  className?: string;
};

export function LoadingState({
  message = 'Loading…',
  className = '',
}: LoadingStateProps) {
  return (
    <div className={`flex items-center justify-center h-[calc(100vh-56px)] bg-white ${className}`}>
      <span className="text-gray-400 text-sm">{message}</span>
    </div>
  );
}

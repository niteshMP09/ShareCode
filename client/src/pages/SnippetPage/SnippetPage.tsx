import { LoadingState, EmptyState, NamePrompt } from '@/components';
import { useSnippetPage } from '@/hooks';
import { typingText } from '@/utils/typingText';

export function SnippetPage() {
  const {
    showPrompt,
    nameInput,
    setNameInput,
    handleNameSubmit,
    loading,
    error,
    snippet,
    content,
    handleContentChange,
    connectedUsers,
    typingUsers,
    goHome,
  } = useSnippetPage();

  if (showPrompt) {
    return (
      <NamePrompt
        name={nameInput}
        onNameChange={setNameInput}
        onSubmit={handleNameSubmit}
      />
    );
  }


  if (loading) {
    return <LoadingState />;
  }

  if (error || !snippet) {
    return (
      <EmptyState
        message={error || 'Room not found.'}
        actionLabel="Go Home"
        onAction={goHome}
      />
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] bg-white">
      <textarea
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
        placeholder="Start typing…"
        className="flex-1 w-full px-8 py-5 text-gray-700 text-base leading-relaxed placeholder-gray-300 outline-none resize-none"
      />
      <div className="flex items-center justify-between px-8 py-3 border-t border-gray-100 bg-gray-50 min-h-12">
        <span className="text-xs text-gray-400 italic">
          {typingText(typingUsers)}
        </span>
        {connectedUsers.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
            <span className="text-xs text-gray-500">{connectedUsers.join(', ')}</span>
          </div>
        )}
      </div>
    </div>
  );
}

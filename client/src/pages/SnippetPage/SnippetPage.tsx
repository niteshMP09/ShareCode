import { useEffect, useRef } from 'react';
import { LoadingState, EmptyState, NamePrompt } from '@/components';
import { useSnippetPage } from '@/hooks';
import { typingText } from '@/utils/typingText';
import { useNavbar } from '@/context';

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

  const { setSnippetContent } = useNavbar();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSnippetContent(content);
    return () => setSnippetContent(null);
  }, [content, setSnippetContent]);

  const handleScroll = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const lineCount = Math.max(content.split('\n').length, 20);

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
      <div className="flex flex-1 overflow-hidden text-sm font-mono">
        <div
          ref={lineNumbersRef}
          className="select-none overflow-hidden text-right text-gray-400 py-5 pr-4 pl-6 leading-relaxed"
          style={{ minWidth: '3.5rem' }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1}>{i + 1}</div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          onScroll={handleScroll}
          placeholder="Start typing…"
          spellCheck={false}
          className="flex-1 py-5 pl-2 pr-8 text-gray-700 leading-relaxed placeholder-gray-300 outline-none resize-none bg-white"
        />
      </div>
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

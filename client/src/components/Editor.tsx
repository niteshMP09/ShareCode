import MonacoEditor from '@monaco-editor/react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  readOnly?: boolean;
}

export function Editor({ value, onChange, language, readOnly = false }: EditorProps) {
  return (
    <MonacoEditor
      height="100%"
      language={language}
      value={value}
      theme="vs-dark"
      onChange={(val) => onChange(val ?? '')}
      loading={
        <div className="flex items-center justify-center h-full bg-[#1e1e2e] text-gray-500 text-sm">
          Loading editor…
        </div>
      }
      options={{
        readOnly,
        minimap: { enabled: false },
        fontSize: 14,
        lineHeight: 22,
        padding: { top: 16, bottom: 16 },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        automaticLayout: true,
        tabSize: 2,
        renderWhitespace: 'selection',
        cursorBlinking: 'smooth',
        smoothScrolling: true,
        contextmenu: true,
        folding: true,
        lineNumbersMinChars: 3,
      }}
    />
  );
}

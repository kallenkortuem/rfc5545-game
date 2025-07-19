"use client";

import { useRef, useEffect } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  theme?: string;
  readOnly?: boolean;
}

export default function CodeEditor({ 
  value, 
  onChange, 
  language = 'text',
  theme = 'dark',
  readOnly = false 
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  // Handle tab key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      
      // Set cursor position after tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  // Simple syntax highlighting for iCalendar
  const getHighlightedLines = () => {
    return value.split('\n').map((line, index) => {
      const trimmedLine = line.trim();
      let className = 'text-slate-300';
      
      if (trimmedLine.startsWith('BEGIN:') || trimmedLine.startsWith('END:')) {
        className = 'text-blue-400 font-semibold';
      } else if (trimmedLine.includes(':')) {
        const [property] = trimmedLine.split(':');
        if (['VERSION', 'PRODID', 'UID', 'DTSTAMP', 'DTSTART', 'DTEND', 'SUMMARY', 'DESCRIPTION', 'LOCATION', 'RRULE'].includes(property)) {
          className = 'text-green-400';
        }
      }
      
      return { text: line, className, lineNumber: index + 1 };
    });
  };

  const highlightedLines = getHighlightedLines();

  return (
    <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-xs text-slate-500 font-mono">iCalendar Editor</span>
      </div>
      
      <div className="relative">
        <div className="flex">
          {/* Line numbers */}
          <div className="select-none px-3 py-4 text-right bg-slate-950/50 border-r border-slate-800">
            {highlightedLines.map(({ lineNumber }) => (
              <div key={lineNumber} className="text-xs text-slate-600 font-mono leading-6">
                {lineNumber}
              </div>
            ))}
          </div>
          
          {/* Code display overlay (for syntax highlighting) */}
          <div className="absolute left-12 top-4 right-4 pointer-events-none">
            <pre className="font-mono text-sm">
              {highlightedLines.map(({ text, className, lineNumber }) => (
                <div key={lineNumber} className={`leading-6 ${className}`}>
                  {text || ' '}
                </div>
              ))}
            </pre>
          </div>
          
          {/* Actual textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            readOnly={readOnly}
            className="flex-1 px-4 py-4 bg-transparent text-transparent caret-white font-mono text-sm leading-6 resize-none outline-none overflow-hidden"
            style={{ 
              minHeight: '400px',
              caretColor: 'white',
              WebkitTextFillColor: 'transparent'
            }}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
      </div>
    </div>
  );
}
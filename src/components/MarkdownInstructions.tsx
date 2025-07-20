"use client";

import { useMemo } from 'react';

interface MarkdownInstructionsProps {
  content: string;
}

export default function MarkdownInstructions({ content }: MarkdownInstructionsProps) {
  const html = useMemo(() => {
    // Simple markdown parser for common patterns
    let parsed = content;

    // Headers
    parsed = parsed.replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-blue-400 mt-4 mb-2">$1</h3>');
    parsed = parsed.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-white mb-3">$1</h2>');
    parsed = parsed.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-white mb-4">$1</h1>');

    // Code blocks
    parsed = parsed.replace(/```[\s\S]*?```/g, (match) => {
      const code = match.slice(3, -3).trim();
      return `<pre class="bg-slate-900 border border-slate-700 rounded-lg p-3 my-3 overflow-x-auto"><code class="text-green-400 font-mono text-sm">${code}</code></pre>`;
    });

    // Inline code
    parsed = parsed.replace(/`([^`]+)`/g, '<code class="bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded font-mono text-sm">$1</code>');

    // Bold
    parsed = parsed.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');

    // Lists
    parsed = parsed.replace(/^- (.+)$/gm, '<li class="flex items-start gap-2 text-slate-300"><span class="text-green-400 mt-1">▸</span><span>$1</span></li>');
    parsed = parsed.replace(/^\d+\. (.+)$/gm, '<li class="flex items-start gap-2 text-slate-300 ml-4"><span class="text-blue-400 font-semibold">$&</span></li>');

    // Wrap lists
    parsed = parsed.replace(/(<li.*<\/li>\n?)+/g, (match) => {
      if (match.includes('text-blue-400 font-semibold')) {
        return `<ol class="space-y-1 my-3">${match}</ol>`;
      }
      return `<ul class="space-y-1 my-3">${match}</ul>`;
    });

    // Paragraphs
    parsed = parsed.split('\n\n').map(paragraph => {
      if (paragraph.trim() && !paragraph.includes('<') && !paragraph.startsWith('#')) {
        return `<p class="text-slate-300 leading-relaxed mb-3">${paragraph}</p>`;
      }
      return paragraph;
    }).join('\n');

    // Emojis in text get special treatment
    parsed = parsed.replace(/([\u{1F300}-\u{1F9FF}])/gu, '<span class="text-2xl inline-block align-middle">$1</span>');

    return parsed;
  }, [content]);

  return (
    <div 
      className="prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}